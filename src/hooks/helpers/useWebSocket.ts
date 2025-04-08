import { useState, useEffect, useRef } from 'react';

type WebSocketStatus = 'connecting' | 'open' | 'closed' | 'error';

const useWebSocket = (url: string) => {
  const [status, setStatus] = useState<WebSocketStatus>('connecting');
  const [message, setMessage] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (url) {
      // create new socket connection
      const socket = new WebSocket(url);
      socketRef.current = socket;

      // socket events
      socket.addEventListener('open', () => {
        setStatus('open');
      });

      socket.addEventListener('message', (event) => {
        setMessage(event.data);
      });

      socket.addEventListener('error', (event) => {
        console.error('Error WebSocket:', event);
        setStatus('error');
      });

      socket.addEventListener('close', () => {
        setStatus('closed');
      });

      // clean up when destroy
      return () => {
        if (socketRef.current) {
          socketRef.current.close(1000, 'closing connection');
        }
      };
    }
  }, [url]);

  const sendMessage = (msg: string) => {
    if (socketRef.current && status === 'open') {
      socketRef.current.send(msg);
    } else {
      console.error('WebSocket not open');
    }
  };

  return {
    status,
    message,
    sendMessage,
  };
};

export default useWebSocket;
