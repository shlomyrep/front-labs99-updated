// src/pages/AppDetailPage.tsx (or your chosen name and path)
import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppChat } from '../hooks/useAppChat'; // Adjust path to your useAppChat hook
import API from '../api/axios'; // Your existing API utility

// Define ChatMessage interface (or import it if you export it from useAppChat.ts)
// For this example, I'm assuming it's defined locally or imported as 'ChatMessage'
// If useAppChat.ts exports ChatMessage, you can import it:
// import { useAppChat, ChatMessage } from '../hooks/useAppChat';
interface ChatMessage {
    appId?: string; // Make appId optional if not always present in messages from WebSocket
    sender: string;
    content: string;
    type?: string; // Make type optional if not always present
    timestamp: string | number | Date; // Allow for different timestamp formats
    id?: string; // Optional stable ID for messages
}


// Tailwind class constants (you'll customize these)
const APP_CHAT_WRAPPER_CLASSES = "md:flex md:h-[calc(100vh-4rem)]"; // Example: full height minus a 4rem header
const CHAT_CONTAINER_CLASSES = "flex flex-col w-full md:w-1/2 lg:w-1/3 border-r border-gray-300 bg-white h-full";
const CHAT_MESSAGES_CLASSES = "flex-grow overflow-y-auto p-4 space-y-4 scroll-smooth";
const CHAT_MESSAGE_BASE_CLASSES = "flex max-w-[80%]";
const CHAT_MESSAGE_LEFT_CLASSES = "justify-start";
const CHAT_MESSAGE_RIGHT_CLASSES = "justify-end ml-auto";
const CHAT_BUBBLE_BASE_CLASSES = "p-3 rounded-lg shadow";
const CHAT_BUBBLE_RECEIVED_CLASSES = "bg-gray-200 text-gray-800";
const CHAT_BUBBLE_SENT_CLASSES = "bg-blue-500 text-white";
const CHAT_TIMESTAMP_CLASSES = "text-xs opacity-70 mt-1";
const CHAT_INPUT_BAR_CLASSES = "p-3 border-t border-gray-300 flex items-center gap-2 bg-gray-50";
const INPUT_CLASSES = "flex-grow p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none";
const BUTTON_CLASSES = "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50";
const IFRAME_WRAPPER_CLASSES = "flex-grow hidden md:flex items-center justify-center bg-gray-100 p-4";
const IFRAME_LOADING_CLASSES = "text-center text-gray-600";
const IFRAME_CLASSES = "w-full h-full border-none rounded-md shadow-lg bg-white";
const TYPING_INDICATOR_CLASSES = "flex justify-start py-2 px-3"; // Style as needed
const TYPING_DOTS_CLASSES = "flex space-x-1 p-2 bg-gray-200 rounded-lg shadow"; // Style as needed
const DOT_CLASSES = "w-2 h-2 bg-gray-500 rounded-full animate-bounce"; // Needs bounce animation


export default function AppDetailPage() { // Removed props: AppProps
    const { id: appIdFromParams } = useParams<{ id: string }>();

    if (!appIdFromParams) {
        return (
            <div className="p-6 text-center">
                <p>App ID not found or is loading...</p>
                <Link to="/" className="text-blue-500 hover:underline mt-4 inline-block">
                    Go to Dashboard
                </Link>
            </div>
        );
    }
    const appId: string = appIdFromParams;

    const { messages, loading: messagesLoading } = useAppChat(appId);
    const [input, setInput] = useState('');
    const endRef = useRef<HTMLDivElement | null>(null);
    const [waitingForResponse, setWaitingForResponse] = useState(false);
    const [iframeExists, setIframeExists] = useState(false);
    const [showIframe, setShowIframe] = useState(false);
    const [currentUserIdentifier, setCurrentUserIdentifier] = useState('USER'); // Placeholder for current user

    // Placeholder: In a real app, you'd get the current user's identifier (name, ID, etc.)
    // from auth context, Redux store, or props.
    useEffect(() => {
        // Example: Fetch user profile or get from a global state
        // For now, we'll stick with a default 'USER' or you can pass it if available.
        // If you had props.user.name, you'd set it here:
        // if (props.user?.name) setCurrentUserIdentifier(props.user.name);
    }, []); // Add props.user to dependency array if used

    useEffect(() => {
        if (endRef.current) {
            endRef.current.scrollIntoView({ behavior: 'smooth' });
        }
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.sender !== currentUserIdentifier) { // Use dynamic current user identifier
                setWaitingForResponse(false);
            }
        }
    }, [messages, currentUserIdentifier]);

    useEffect(() => {
        const checkIframeFile = async () => {
            try {
                const res = await fetch(`http://localhost:3001/${appId}/index.html`, { method: 'HEAD' });
                setIframeExists(res.ok);
                if (!res.ok) setShowIframe(false);
            } catch (err) {
                console.warn(`Iframe check failed for ${appId}:`, err);
                setIframeExists(false);
                setShowIframe(false);
            }
        };
        checkIframeFile();
        const interval = setInterval(checkIframeFile, 5000);
        return () => clearInterval(interval);
    }, [appId]);

    useEffect(() => {
        if (iframeExists) {
            const timeout = setTimeout(() => setShowIframe(true), 1000);
            return () => clearTimeout(timeout);
        } else {
            setShowIframe(false);
        }
    }, [iframeExists]);

    const sendMessage = async () => {
        if (!input.trim()) return;
        const messageToSend = input;
        setInput('');
        setWaitingForResponse(true);
        try {
            // Using your imported API utility
            await API.post(`/apps/${appId}/messages`, {
                // Your useAppChat has appId in ChatMessage, but API might not need it in body if it's in URL
                // sender: currentUserIdentifier, // Use dynamic current user identifier
                sender: 'USER', // For now, matching your original AppChat's hardcoded 'USER'
                content: messageToSend,
                type: 'TEXT', // Your original AppChat hardcoded this
            });
        } catch (err) {
            console.error('Failed to send message', err);
            setInput(messageToSend);
            setWaitingForResponse(false);
        }
    };

    return (
        <div className={APP_CHAT_WRAPPER_CLASSES}>
            <div className={CHAT_CONTAINER_CLASSES}>
                <div className={CHAT_MESSAGES_CLASSES}>
                    {messagesLoading && messages.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">Loading messages...</div>
                    ) : (
                        messages.map((msg: ChatMessage, index) => ( // Using ChatMessage type
                            <div
                                key={msg.id || index} // Prefer msg.id if your ChatMessage has it
                                className={`${CHAT_MESSAGE_BASE_CLASSES} ${
                                    // msg.sender === currentUserIdentifier // Use dynamic current user
                                    msg.sender === 'USER' // Matching your original AppChat's hardcoded 'USER' for sender
                                        ? CHAT_MESSAGE_RIGHT_CLASSES
                                        : CHAT_MESSAGE_LEFT_CLASSES
                                }`}
                            >
                                <div
                                    className={`${CHAT_BUBBLE_BASE_CLASSES} ${
                                        // msg.sender === currentUserIdentifier
                                        msg.sender === 'USER'
                                            ? CHAT_BUBBLE_SENT_CLASSES
                                            : CHAT_BUBBLE_RECEIVED_CLASSES
                                    }`}
                                >
                                    <div>{msg.content}</div>
                                    {msg.timestamp && (
                                        <div className={`${CHAT_TIMESTAMP_CLASSES} ${
                                            // msg.sender === currentUserIdentifier ? 'text-right' : 'text-left'
                                            msg.sender === 'USER' ? 'text-right' : 'text-left'
                                        }`}>
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                    {waitingForResponse && (
                        <div className={TYPING_INDICATOR_CLASSES}>
                            <div className={TYPING_DOTS_CLASSES}>
                                <span className={`${DOT_CLASSES} animation-delay-[0s]`}></span> {/* Adjusted for Tailwind JIT */}
                                <span className={`${DOT_CLASSES} animation-delay-[-0.16s]`}></span>
                                <span className={`${DOT_CLASSES} animation-delay-[-0.32s]`}></span>
                            </div>
                        </div>
                    )}
                    <div ref={endRef} />
                </div>
                <div className={CHAT_INPUT_BAR_CLASSES}>
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                sendMessage();
                            }
                        }}
                        disabled={waitingForResponse}
                        className={INPUT_CLASSES}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={waitingForResponse || !input.trim()}
                        className={BUTTON_CLASSES}
                    >
                        Send
                    </button>
                </div>
            </div>
            <div className={IFRAME_WRAPPER_CLASSES}>
                {!iframeExists ? (
                    <div className={IFRAME_LOADING_CLASSES}>
                        <div>Checking for app preview...</div>
                    </div>
                ) : !showIframe ? (
                    <div className={IFRAME_LOADING_CLASSES}>
                        <div>🚀 Your amazing app is on the way... Hold on!</div>
                    </div>
                ) : (
                    <iframe
                        title="App Preview"
                        src={`http://localhost:3001/${appId}/index.html`}
                        className={IFRAME_CLASSES}
                        frameBorder="0"
                    />
                )}
            </div>
        </div>
    );
}