import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, UserX, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useTranslation } from '../components/utils/translations';
import { User as UserEntity } from '@/api/entities';
import { showToast } from '../components/common/ErrorBoundary';
import OptimizedImage from '../components/dd_OptimizedImage';

const BlockedUserItem = ({ user, onUnblock }) => (
  <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
    <div className="flex items-center gap-3">
      <OptimizedImage
        src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
        alt={user.name}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div>
        <h3 className="font-semibold text-gray-900">{user.name}</h3>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>
    </div>
    <Button
      variant="outline"
      size="sm"
      onClick={() => onUnblock(user.id)}
      className="text-red-600 border-red-200 hover:bg-red-50"
    >
      Unblock
    </Button>
  </div>
);

export default function BlockedUsers() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBlockedUsers();
  }, []);

  const loadBlockedUsers = async () => {
    try {
      setIsLoading(true);
      const userData = await UserEntity.me();
      const blocked = userData.blocked_users || [];
      setBlockedUsers(blocked);
    } catch (error) {
      console.error('Error loading blocked users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const unblockUser = async (userId) => {
    try {
      const userData = await UserEntity.me();
      const currentBlocked = userData.blocked_users || [];
      const updatedBlocked = currentBlocked.filter(id => id !== userId);
      
      await UserEntity.updateMyUserData({
        blocked_users: updatedBlocked
      });
      
      setBlockedUsers(prev => prev.filter(user => user.id !== userId));
      showToast(t('userUnblocked', 'User unblocked'), 'success');
    } catch (error) {
      console.error('Error unblocking user:', error);
      showToast(t('unblockError', 'Error unblocking user'), 'error');
    }
  };

  const filteredUsers = blockedUsers.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">{t('blockedUsers', 'Blocked Users')}</h1>
        </div>
      </div>

      <div className="p-4">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="search"
            placeholder={t('searchBlockedUsers', 'Search blocked users...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Blocked Users List */}
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <UserX className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? t('noMatchingBlockedUsers', 'No matching blocked users') : t('noBlockedUsers', 'No blocked users')}
            </h3>
            <p className="text-gray-500">
              {searchTerm ? t('tryDifferentSearch', 'Try a different search term') : t('noBlockedUsersDesc', 'You haven\'t blocked any users yet')}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredUsers.map((user) => (
              <BlockedUserItem key={user.id} user={user} onUnblock={unblockUser} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}