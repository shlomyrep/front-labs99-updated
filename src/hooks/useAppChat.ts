import { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import API from '../api/axios'; // already includes JWT and headers

interface ChatMessage {
  appId: string;
  sender: string;
  content: string;
  type: string;
  timestamp: string;
}

export function useAppChat(appId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await API.get<ChatMessage[]>(`/apps/${appId}/messages`);

        setMessages(response.data);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    const socket = new SockJS('http://localhost:8080/ws');
    const client = new Client({
      webSocketFactory: () => socket as WebSocket,
      onConnect: () => {
        client.subscribe(`/topic/app/${appId}`, (message) => {
          console.log('Received message:', message.body);
          const body = JSON.parse(message.body);
          setMessages((prev) => [...prev, body]);
        });
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      clientRef.current?.deactivate();
    };
  }, [appId]);

  return { messages, loading };
}
