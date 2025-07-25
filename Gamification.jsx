
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trophy, Star, Target, Users, Award, Crown, Zap } from 'lucide-react';
import { useTranslation } from '../components/utils/translations';
import { GamificationManager } from '../components/gamification/GamificationManager';
import { User } from '@/api/entities';
import { Badge } from '@/api/entities';
import { Challenge } from '@/api/entities';
import { LoadingSpinner, SkeletonList } from '../components/common/LoadingStates';
import OptimizedImage from '../components/dd_OptimizedImage';

export default function Gamification() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [userStats, setUserStats] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [allBadges, setAllBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadGamificationData();
  }, []);

  const loadGamificationData = async () => {
    try {
      setLoading(true);
      const user = await User.me();
      
      if (user) {
        // Initialize user if needed
        await GamificationManager.initializeUser(user.id);
        
        // Load user stats
        const stats = await GamificationManager.getUserStats(user.id);
        setUserStats(stats);
        
        // Load leaderboard
        const leaderboardData = await GamificationManager.getLeaderboard();
        setLeaderboard(leaderboardData);
        
        // Load challenges and badges
        const [challenges, badges] = await Promise.all([
          Challenge.filter({ is_active: true }),
          Badge.list()
        ]);
        
        setActiveChallenges(challenges);
        setAllBadges(badges);
      }
    } catch (error) {
      console.error('Error loading gamification data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevelProgress = (points) => {
    const currentLevelMin = Math.floor(points / 100) * 100;
    const nextLevelMin = currentLevelMin + 100;
    const progress = ((points - currentLevelMin) / 100) * 100;
    return { progress, nextLevelMin };
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Trophy },
    { id: 'badges', label: 'Badges', icon: Award },
    { id: 'challenges', label: 'Challenges', icon: Target },
    { id: 'leaderboard', label: 'Leaderboard', icon: Crown }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-100 px-4 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">🏆 Achievements</h1>
          </div>
        </div>
        <div className="p-4">
          <LoadingSpinner size="lg" className="mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">🏆 Achievements</h1>
        </div>
      </div>

      {/* User Stats Overview */}
      {userStats && (
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">{userStats.points.total_points} Points</h2>
              <p className="text-red-100">Level {userStats.points.level}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl">🏆</div>
              <p className="text-sm text-red-100">{userStats.badges.length} Badges</p>
            </div>
          </div>
          
          {/* Level Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to Level {userStats.points.level + 1}</span>
              <span>{getLevelProgress(userStats.points.total_points).nextLevelMin - userStats.points.total_points} points to go</span>
            </div>
            <div className="w-full bg-red-400 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-300" 
                style={{ width: `${getLevelProgress(userStats.points.total_points).progress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-100 px-4">
        <div className="flex flex-wrap gap-1">
          {tabs.map(tab => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm ${
                activeTab === tab.id ? 'bg-red-600 text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4 max-h-[80vh] overflow-y-auto">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Weekly Stats */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                This Week
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{userStats?.points.points_this_week || 0}</div>
                  <div className="text-sm text-gray-600">Points Earned</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{userStats?.challenges.length || 0}</div>
                  <div className="text-sm text-gray-600">Challenges Active</div>
                </div>
              </div>
            </div>

            {/* Recent Badges */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-bold text-lg mb-3">Recent Badges</h3>
              {userStats?.badges.length > 0 ? (
                <div className="grid grid-cols-4 gap-3">
                  {userStats.badges.slice(0, 4).map((userBadge, index) => {
                    const badge = allBadges.find(b => b.id === userBadge.badge_id);
                    return badge ? (
                      <div key={index} className="text-center">
                        <div className="text-2xl mb-1">{badge.icon}</div>
                        <div className="text-xs text-gray-600 truncate">{badge.name}</div>
                      </div>
                    ) : null;
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No badges earned yet. Keep exploring!</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'badges' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {allBadges.map(badge => {
                const isEarned = userStats?.badges.some(ub => ub.badge_id === badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`bg-white rounded-xl p-4 shadow-sm text-center ${
                      isEarned ? 'ring-2 ring-yellow-400' : 'opacity-60'
                    }`}
                  >
                    <div className="text-3xl mb-2">{badge.icon}</div>
                    <h4 className="font-semibold text-sm mb-1">{badge.name}</h4>
                    <p className="text-xs text-gray-600 mb-2">{badge.description}</p>
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      isEarned ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {isEarned ? 'Earned!' : `${badge.threshold} ${badge.badge_type}`}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'challenges' && (
          <div className="space-y-4">
            {activeChallenges.map(challenge => {
              const userChallenge = userStats?.challenges.find(uc => uc.challenge_id === challenge.id);
              const progress = userChallenge?.progress || 0;
              const progressPercentage = Math.min((progress / challenge.target) * 100, 100);
              
              return (
                <div key={challenge.id} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">{challenge.title}</h4>
                      <p className="text-sm text-gray-600">{challenge.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-red-600">+{challenge.reward_points} pts</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress: {progress}/{challenge.target}</span>
                      <span>{userChallenge?.completed ? '✅ Complete!' : `${Math.round(progressPercentage)}%`}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`rounded-full h-2 transition-all duration-300 ${
                          userChallenge?.completed ? 'bg-green-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
            
            {activeChallenges.length === 0 && (
              <div className="bg-white rounded-xl p-8 shadow-sm text-center">
                <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="font-medium text-gray-900 mb-2">No Active Challenges</h3>
                <p className="text-gray-500">New challenges are coming soon!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-4">
                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                  <Crown className="w-5 h-5" />
                  Weekly Leaderboard
                </h3>
                <p className="text-yellow-100 text-sm">Top rescuers this week</p>
              </div>
              
              <div className="divide-y divide-gray-100">
                {leaderboard.map((user, index) => (
                  <div key={user.user_id} className="flex items-center gap-4 p-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0 ? 'bg-yellow-100 text-yellow-800' :
                      index === 1 ? 'bg-gray-100 text-gray-800' :
                      index === 2 ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-50 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{user.username}</p>
                      <p className="text-sm text-gray-500">Level {user.level}</p>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-bold text-gray-900">{user.points}</div>
                      <div className="text-xs text-gray-500">points</div>
                    </div>
                  </div>
                ))}
                
                {leaderboard.length === 0 && (
                  <div className="p-8 text-center">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Leaderboard is building up!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
