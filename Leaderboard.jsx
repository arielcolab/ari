import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dd_LeaderboardWeekly as LeaderboardWeekly } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trophy } from 'lucide-react';
import { useTranslation } from '../components/utils/translations';
import OptimizedImage from '../components/dd_OptimizedImage';

const LeaderboardRow = ({ entry, rank }) => {
    const colors = ["bg-yellow-400", "bg-gray-300", "bg-yellow-600"];
    return (
        <div className="flex items-center gap-4 p-3 bg-white rounded-lg">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-white ${rank < 3 ? colors[rank] : 'bg-gray-500'}`}>
                {rank < 3 ? <Trophy className="w-5 h-5"/> : rank + 1}
            </div>
            <OptimizedImage src={`https://i.pravatar.cc/150?u=${entry.user_id}`} className="w-12 h-12 rounded-full"/>
            <div className="flex-1">
                <p className="font-semibold">{entry.user_name || `User ${entry.user_id.substring(0,6)}`}</p>
            </div>
            <p className="font-bold text-red-600">{entry.rescued_meals} {entry.rescued_meals === 1 ? 'meal' : 'meals'}</p>
        </div>
    )
}

export default function Leaderboard() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                // In a real app, we would query for the current week
                const data = await LeaderboardWeekly.list('-rescued_meals', 20);
                // Placeholder user names
                const withNames = data.map(d => ({...d, user_name: `Hero #${Math.floor(Math.random() * 1000)}`}));
                setLeaderboard(withNames);
            } catch (e) {
                console.error("Failed to load leaderboard", e);
            }
        };
        fetchLeaderboard();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white p-4 flex items-center border-b">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="w-5 h-5"/></Button>
                <h1 className="text-xl font-bold mx-auto">{t('leaderboard', 'Rescue Challenge')}</h1>
            </div>
            <div className="p-4 space-y-3">
                <div className="text-center p-4 bg-red-100/50 rounded-lg">
                    <h2 className="text-lg font-bold text-red-700">{t('weeklyChallenge', 'Weekly Challenge')}</h2>
                    <p className="text-sm text-red-600">{t('leaderboardDesc', 'See who saved the most meals this week!')}</p>
                </div>
                {leaderboard.map((entry, index) => (
                    <LeaderboardRow key={entry.id} entry={entry} rank={index} />
                ))}
            </div>
        </div>
    );
}