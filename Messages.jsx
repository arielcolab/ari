import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Inbox } from 'lucide-react';
import { useTranslation } from '../components/utils/translations';
import { Message } from '@/api/entities';
import { User } from '@/api/entities';
import { Profile } from '@/api/entities';
import { createPageUrl } from '@/utils';
import OptimizedImage from '../components/dd_OptimizedImage';
import { SkeletonList, LoadingSpinner } from '../components/common/LoadingStates';

const ConversationItem = ({ conversation, onClick }) => {
  const { t } = useTranslation();
  
  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ` ${t('years', 'y')}`;
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ` ${t('months', 'mo')}`;
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ` ${t('days', 'd')}`;
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ` ${t('hours', 'h')}`;
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ` ${t('minutes', 'm')}`;
    return Math.floor(seconds) + ` ${t('seconds', 's')}`;
  };

  return (
    <div 
      className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
      onClick={onClick}
    >
      <OptimizedImage
        src={conversation.otherUser.photo}
        alt={conversation.otherUser.fullName}
        className="w-14 h-14 rounded-full object-cover"
      />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-gray-900 truncate">{conversation.otherUser.fullName}</h3>
          <p className="text-xs text-gray-500 flex-shrink-0 ml-2">{timeAgo(conversation.lastMessage.created_date)}</p>
        </div>
        <div className="flex justify-between items-center mt-1">
          <p className={`text-sm truncate ${conversation.unreadCount > 0 ? 'text-gray-900 font-bold' : 'text-gray-500'}`}>
            {conversation.lastMessage.content}
          </p>
          {conversation.unreadCount > 0 && (
            <div className="w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0 ml-2">
              {conversation.unreadCount}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function MessagesPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        const user = await User.me();
        setCurrentUser(user);
        fetchConversations(user.id);
      } catch (e) {
        setIsLoading(false);
        // Handle not logged in
      }
    };
    initialize();

    const interval = setInterval(() => {
        if(currentUser) fetchConversations(currentUser.id);
    }, 5000); // Poll for new messages every 5 seconds

    return () => clearInterval(interval);
  }, [currentUser]);

  const fetchConversations = async (userId) => {
    try {
      const allMessages = await Message.filter({ 
        $or: [{ sender_id: userId }, { receiver_id: userId }] 
      }, '-created_date', 500); // Fetch a good number of recent messages

      const conversationsMap = new Map();

      for (const message of allMessages) {
        const otherUserId = message.sender_id === userId ? message.receiver_id : message.sender_id;
        
        if (!conversationsMap.has(otherUserId)) {
          conversationsMap.set(otherUserId, {
            otherUserId: otherUserId,
            messages: [],
            unreadCount: 0,
          });
        }
        
        const conversation = conversationsMap.get(otherUserId);
        conversation.messages.push(message);
        
        if (message.receiver_id === userId && !message.is_read) {
          conversation.unreadCount++;
        }
      }

      // Fetch profile details for all other users
      const otherUserIds = Array.from(conversationsMap.keys());
      const profiles = await Profile.filter({ userId: { $in: otherUserIds } });
      const profilesMap = new Map(profiles.map(p => [p.userId, p]));

      const populatedConversations = Array.from(conversationsMap.values()).map(convo => ({
        ...convo,
        otherUser: profilesMap.get(convo.otherUserId) || { fullName: 'Unknown User', photo: '' },
        lastMessage: convo.messages[0], // Already sorted by date
      }));
      
      setConversations(populatedConversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white p-4 border-b">
          <h1 className="text-xl font-bold">{t('messages', 'Messages')}</h1>
        </div>
        <SkeletonList count={8} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 p-4 border-b border-gray-100 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold">{t('messages', 'Messages')}</h1>
      </div>

      {conversations.length === 0 ? (
        <div className="text-center py-20 px-6">
          <Inbox className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('noMessages', 'No messages yet')}</h2>
          <p className="text-gray-500">
            {t('noMessagesDesc', 'When you contact a seller, your conversations will appear here.')}
          </p>
        </div>
      ) : (
        <div>
          {conversations.map(convo => (
            <ConversationItem
              key={convo.otherUserId}
              conversation={convo}
              onClick={() => navigate(createPageUrl(`Chat?userId=${convo.otherUserId}`))}
            />
          ))}
        </div>
      )}
    </div>
  );
}