import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Send, Phone, Paperclip } from 'lucide-react';
import { useTranslation } from '../components/utils/translations';
import { Message } from '@/api/entities';
import { User } from '@/api/entities';
import { Profile } from '@/api/entities';
import OptimizedImage from '../components/dd_OptimizedImage';
import { showToast } from '../components/common/ErrorBoundary';

export default function ChatPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const urlParams = new URLSearchParams(window.location.search);
  const otherUserId = urlParams.get('userId');
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        const user = await User.me();
        setCurrentUser(user);

        const profiles = await Profile.filter({ userId: otherUserId });
        if (profiles.length > 0) {
          setOtherUser(profiles[0]);
        } else {
          // Fallback if profile not found
          setOtherUser({ fullName: 'Seller', photo: '' });
        }
        
        fetchMessages(user.id);
        markMessagesAsRead(user.id);

      } catch (e) {
        setIsLoading(false);
        // Handle not logged in
      }
    };
    initialize();

    const interval = setInterval(() => {
      if(currentUser) {
        fetchMessages(currentUser.id);
        markMessagesAsRead(currentUser.id);
      }
    }, 2000); // Poll for new messages every 2 seconds

    return () => clearInterval(interval);
  }, [currentUser, otherUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async (userId) => {
    try {
      const fetchedMessages = await Message.filter({
        $or: [
          { sender_id: userId, receiver_id: otherUserId },
          { sender_id: otherUserId, receiver_id: userId },
        ]
      }, 'created_date', 100);
      setMessages(fetchedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const markMessagesAsRead = async (userId) => {
    try {
        const unreadMessages = await Message.filter({
            receiver_id: userId,
            sender_id: otherUserId,
            is_read: false
        });
        
        for (const msg of unreadMessages) {
            await Message.update(msg.id, { is_read: true });
        }
    } catch(e) {
        console.error("Failed to mark messages as read", e);
    }
  }

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    const messageData = {
      sender_id: currentUser.id,
      receiver_id: otherUserId,
      content: newMessage,
      is_read: false
    };

    try {
      const createdMessage = await Message.create(messageData);
      setMessages(prev => [...prev, { ...createdMessage, ...messageData }]);
      setNewMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
      showToast(t('errorSendingMessage', 'Failed to send message'), 'error');
    }
  };
  
  const handleFakeCall = () => {
      showToast(t('calling', 'Calling {{name}}...').replace('{{name}}', otherUser?.fullName || 'Seller'), 'info');
  }

  if (isLoading || !otherUser) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 p-4 border-b border-gray-100 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <OptimizedImage
          src={otherUser.photo}
          alt={otherUser.fullName}
          className="w-10 h-10 rounded-full object-cover"
        />
        <h2 className="text-lg font-bold flex-1 truncate">{otherUser.fullName}</h2>
        <Button variant="ghost" size="icon" onClick={handleFakeCall} className="rounded-full">
          <Phone className="w-5 h-5" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end gap-2 ${msg.sender_id === currentUser.id ? 'justify-end' : ''}`}
          >
            {msg.sender_id !== currentUser.id && (
              <OptimizedImage
                src={otherUser.photo}
                alt={otherUser.fullName}
                className="w-8 h-8 rounded-full object-cover self-start"
              />
            )}
            <div
              className={`max-w-xs md:max-w-md p-3 rounded-2xl ${
                msg.sender_id === currentUser.id
                  ? 'bg-red-600 text-white rounded-br-lg'
                  : 'bg-white text-gray-900 rounded-bl-lg border border-gray-100'
              }`}
            >
              <p className="whitespace-pre-wrap break-words">{msg.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="sticky bottom-0 bg-white p-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Paperclip className="w-5 h-5 text-gray-500" />
          </Button>
          <input
            type="text"
            placeholder={t('typeMessage', 'Type a message...')}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 px-4 py-2 bg-gray-100 rounded-full border border-transparent focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <Button
            size="icon"
            onClick={handleSendMessage}
            className="bg-red-600 hover:bg-red-700 rounded-full w-12 h-12"
            disabled={!newMessage.trim()}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}