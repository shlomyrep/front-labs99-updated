import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppChat } from '../hooks/useAppChat'; // Adjust path as needed
import API from '../api/axios'; // Adjust path as needed
import './AppChat.css'; // Assuming you want to reuse this CSS

// Minimal AppProps definition if not imported from elsewhere
// Replace with your actual AppProps if it's more complex
interface User {
    name: string;
    // other user properties
}
interface AppProps {
    user?: User; // Assuming user might be optional or come from context/props
}

// Renaming the component to AppDetailPage to match its role
export default function AppDetailPage(props: AppProps) { // Accept props if needed
    const { id: appId } = useParams<{ id: string }>(); // Using 'id' from router, aliasing to 'appId'
    const { messages, loading: messagesLoading } = useAppChat(appId); // Destructure loading specifically for messages
    const [input, setInput] = useState('');
    const endRef = useRef<HTMLDivElement | null>(null); // For scrolling
    const [waitingForResponse, setWaitingForResponse] = useState(false);
    const [iframeExists, setIframeExists] = useState(false);
    const [showIframe, setShowIframe] = useState(false);

    // Scroll to bottom on new messages
    useEffect(() => {
        const container = document.querySelector('.chat-messages'); // Consider using a ref for more robust selection
        if (container) {
            requestAnimationFrame(() => {
                container.scrollTo({
                    top: container.scrollHeight,
                    behavior: 'smooth',
                });
            });
        }

        if (messages.length > 0 && messages[messages.length - 1].sender !== 'USER') {
            setWaitingForResponse(false);
        }
    }, [messages]);

    // Check if iframe HTML file exists
    useEffect(() => {
        if (!appId) return;

        const checkIframeFile = async () => {
            try {
                // Ensure your static server is running and accessible
                const res = await fetch(`http://localhost:3001/${appId}/index.html`, { method: 'HEAD' });
                setIframeExists(res.ok);
                if (!res.ok) setShowIframe(false); // Hide iframe if it becomes unavailable
            } catch (err)  {
                console.warn(`Failed to check iframe for app ${appId}:`, err);
                setIframeExists(false);
                setShowIframe(false);
            }
        };

        checkIframeFile();
        const interval = setInterval(checkIframeFile, 5000); // Check every 5 seconds
        return () => clearInterval(interval);
    }, [appId]);

    // Show iframe with delay once it exists
    useEffect(() => {
        if (iframeExists) {
            const timeout = setTimeout(() => {
                setShowIframe(true);
            }, 1000); // 1-second delay, adjust as needed
            return () => clearTimeout(timeout);
        } else {
            setShowIframe(false); // Ensure iframe is hidden if it doesn't exist
        }
    }, [iframeExists]);

    const sendMessage = async () => {
        if (!input.trim() || !appId) return;

        const messageToSend = input;
        setInput(''); // Clear input immediately
        setWaitingForResponse(true);

        try {
            await API.post(`/apps/${appId}/messages`, {
                // The request body might vary based on your API
                // Assuming 'sender' might come from props.user or a context
                sender: props.user?.name || 'USER', // Default to 'USER' if no user prop
                content: messageToSend,
                type: 'TEXT', // Or determine type dynamically
            });
            // `useAppChat` hook should update messages automatically after a successful post
        } catch (err) {
            console.error('Failed to send message:', err);
            setInput(messageToSend); // Restore input on failure
            setWaitingForResponse(false);
        }
    };

    // Optional: Fetch app name or other details if needed for the page title or header
    // const [appName, setAppName] = useState('');
    // useEffect(() => {
    //     if (appId) {
    //         API.get(`/apps/${appId}/details`).then(res => setAppName(res.data.name)).catch(console.error);
    //     }
    // }, [appId]);

    return (
        <div className="app-chat-wrapper"> {/* Main wrapper from AppChat.css */}
            {/* Optional: Add a header or back button if desired */}
            {/* <div className="p-4">
                <Link to="/" className="text-blue-500 hover:underline">← Back to Dashboard</Link>
                {appName && <h1 className="text-2xl font-bold mt-2">{appName}</h1>}
            </div> */}
            <div className="chat-container">
                <div className="chat-messages"> {/* Removed ref here, direct querySelector used */}
                    {messagesLoading && messages.length === 0 ? ( // Show loader only if messages are loading and none are present
                        <div className="loader">Loading messages...</div>
                    ) : (
                        messages.map((msg, index) => (
                            <div
                                key={msg.id || index} // Prefer a stable ID from msg if available
                                className={`chat-message chat-${msg.type?.toLowerCase() || 'text'} ${
                                    // Adjust sender comparison based on your data
                                    msg.sender === (props.user?.name || 'USER') ? 'chat-right' : 'chat-left'
                                }`}
                            >
                                <div className="chat-bubble">
                                    <div>{msg.content}</div>
                                    {msg.timestamp && (
                                        <div className="chat-timestamp">
                                            {new Date(msg.timestamp).toLocaleTimeString()}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                    {waitingForResponse && (
                        <div className="typing-indicator">
                            <div className="typing-dots">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    )}
                    <div ref={endRef}></div> {/* For auto-scrolling to the end */}
                </div>

                <div className="chat-input-bar">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) { // Send on Enter, allow Shift+Enter for newline
                                e.preventDefault();
                                sendMessage();
                            }
                        }}
                        disabled={waitingForResponse} // Disable input while waiting
                    />
                    <button onClick={sendMessage} disabled={waitingForResponse || !input.trim()}>
                        Send
                    </button>
                </div>
            </div>

            <div className="chat-iframe-wrapper">
                {!iframeExists ? ( // Show "not found" or initial loading message before iframe check completes
                     <div className="chat-iframe-loading">
                        <div className="loader-message">
                            Checking for app preview...
                        </div>
                    </div>
                ) : !showIframe ? ( // Show "on the way" message if iframe exists but not yet shown
                    <div className="chat-iframe-loading">
                        <div className="loader-message">
                            🚀 Your amazing app is on the way... Hold on!
                        </div>
                    </div>
                ) : (
                    <iframe
                        title="App Preview"
                        src={`http://localhost:3001/${appId}/index.html`}
                        className="chat-iframe visible" // Ensure 'visible' class handles display
                        frameBorder="0"
                        // Consider adding sandbox attributes for security if content is untrusted
                        // sandbox="allow-scripts allow-same-origin"
                    />
                )}
            </div>
        </div>
    );
}