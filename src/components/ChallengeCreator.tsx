import React, { useState, useEffect } from 'react';
import { useWorkoutStore } from '../stores/workoutStore';
import { useAuthStore } from '../stores/authStore';
import { Target, Plus, CheckCircle2, Zap, Trash2, Users, Minus, Crown, LogOut as LeaveIcon, Globe, Lock, TrendingUp, Calendar } from 'lucide-react';
import Button from './ui/Button';
import Input from './ui/Input';
import Card from './ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
import type { Challenge, ChallengeLog } from '../types/workout';

const API_URL = import.meta.env.VITE_API_URL || 'https://workout.muazaoski.online/api';

const ChallengeCreator: React.FC = () => {
  const { user, token } = useAuthStore();
  const { challenges, addChallenge, deleteChallenge, sync } = useWorkoutStore();

  const [showCreator, setShowCreator] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetValue, setTargetValue] = useState('30');
  const [isPublic, setIsPublic] = useState(true);

  // Refresh challenges on mount
  useEffect(() => {
    sync();
  }, [sync]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !targetValue) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/challenges`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: title,
          description,
          targetValue: parseInt(targetValue),
          isPublic
        })
      });

      if (res.ok) {
        const data = await res.json();
        addChallenge({
          id: data.data.challenge.id,
          title: data.data.challenge.name,
          description: data.data.challenge.description || '',
          type: 'custom',
          targetValue: data.data.challenge.targetValue,
          currentValue: 0,
          completed: false,
          xpReward: 100,
          creatorId: user?.id,
          creatorName: user?.name,
          isPublic: data.data.challenge.isPublic,
          isCreator: true,
          isParticipant: true,
          participantsCount: 1,
          userTotal: 0,
          synced: true
        });
        setTitle('');
        setDescription('');
        setTargetValue('30');
        setShowCreator(false);
        sync();
      }
    } catch (err) {
      console.error('Failed to create challenge:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (challengeId: string) => {
    try {
      await fetch(`${API_URL}/challenges/${challengeId}/join`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      sync();
    } catch (err) {
      console.error('Failed to join:', err);
    }
  };

  const handleLeave = async (challengeId: string) => {
    try {
      await fetch(`${API_URL}/challenges/${challengeId}/leave`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      sync();
    } catch (err) {
      console.error('Failed to leave:', err);
    }
  };

  const handleLog = async (challengeId: string, value: number) => {
    try {
      await fetch(`${API_URL}/challenges/${challengeId}/log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ value })
      });
      sync();
    } catch (err) {
      console.error('Failed to log:', err);
    }
  };

  const handleDelete = async (challengeId: string) => {
    if (!confirm('Delete this challenge? This will remove it for all participants.')) return;

    try {
      await fetch(`${API_URL}/challenges/${challengeId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      deleteChallenge(challengeId);
      sync();
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const myChallenges = challenges.filter(c => c.isCreator || c.isParticipant);
  const publicChallenges = challenges.filter(c => c.isPublic && !c.isParticipant && !c.isCreator);

  return (
    <div className="space-y-8 fade-in pb-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Challenges</h2>
          <p className="text-muted-foreground mt-1">Join community goals or create your own.</p>
        </div>
      </header>

      {/* CREATE BUTTON */}
      {!showCreator ? (
        <button
          onClick={() => setShowCreator(true)}
          className="w-full py-8 border-2 border-dashed border-white/5 rounded-[2rem] flex flex-col items-center justify-center gap-3 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all group"
        >
          <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-primary group-hover:text-black">
            <Plus size={24} />
          </div>
          <span className="font-bold text-sm">Create Challenge</span>
        </button>
      ) : (
        <Card title="New Challenge" description="Create a goal for yourself or the community." className="border-primary/20">
          <form onSubmit={handleCreate} className="space-y-6 mt-4">
            <Input
              label="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. 30-Day Push-up Challenge"
              required
            />
            <Input
              label="Description (optional)"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What's the goal about?"
            />
            <Input
              label="Target (your goal number)"
              type="number"
              value={targetValue}
              onChange={e => setTargetValue(e.target.value)}
              placeholder="30"
              required
            />

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsPublic(true)}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold border transition-all flex items-center justify-center gap-2 ${isPublic
                  ? 'bg-primary border-primary text-black'
                  : 'bg-white/5 border-transparent text-muted-foreground'
                  }`}
              >
                <Globe size={16} /> Public
              </button>
              <button
                type="button"
                onClick={() => setIsPublic(false)}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold border transition-all flex items-center justify-center gap-2 ${!isPublic
                  ? 'bg-primary border-primary text-black'
                  : 'bg-white/5 border-transparent text-muted-foreground'
                  }`}
              >
                <Lock size={16} /> Private
              </button>
            </div>

            <div className="flex gap-3">
              <Button type="submit" variant="primary" fullWidth disabled={loading}>
                {loading ? 'Creating...' : 'Create Challenge'}
              </Button>
              <Button variant="ghost" onClick={() => setShowCreator(false)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {/* MY CHALLENGES */}
      {myChallenges.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-muted-foreground flex items-center gap-2">
            <Target size={18} className="text-primary" /> My Challenges
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {myChallenges.map(challenge => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                userId={user?.id}
                onLog={handleLog}
                onDelete={handleDelete}
                onLeave={handleLeave}
                onSelect={() => setSelectedChallenge(challenge)}
              />
            ))}
          </div>
        </section>
      )}

      {/* DISCOVER PUBLIC CHALLENGES */}
      {publicChallenges.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-muted-foreground flex items-center gap-2">
            <Globe size={18} className="text-primary" /> Discover
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {publicChallenges.map(challenge => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                userId={user?.id}
                onJoin={handleJoin}
                onSelect={() => setSelectedChallenge(challenge)}
              />
            ))}
          </div>
        </section>
      )}

      {/* EMPTY STATE */}
      {challenges.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Target size={48} className="mx-auto mb-4 opacity-30" />
          <p className="font-bold">No challenges yet</p>
          <p className="text-sm">Create one to get started!</p>
        </div>
      )}

      {/* CHALLENGE DETAIL MODAL */}
      <AnimatePresence>
        {selectedChallenge && (
          <ChallengeDetailModal
            challenge={selectedChallenge}
            userId={user?.id}
            token={token}
            onClose={() => setSelectedChallenge(null)}
            onLog={handleLog}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// CHALLENGE CARD COMPONENT
interface ChallengeCardProps {
  challenge: Challenge;
  userId?: string;
  onLog?: (id: string, value: number) => void;
  onDelete?: (id: string) => void;
  onJoin?: (id: string) => void;
  onLeave?: (id: string) => void;
  onSelect?: () => void;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  userId,
  onLog,
  onDelete,
  onJoin,
  onLeave,
  onSelect
}) => {
  const isCreator = challenge.creatorId === userId || challenge.isCreator;
  const isParticipant = challenge.isParticipant;
  const progress = Math.min((challenge.userTotal || 0) / challenge.targetValue * 100, 100);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-card-border rounded-2xl p-5 space-y-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0" onClick={onSelect}>
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-lg truncate">{challenge.title}</h4>
            {isCreator && (
              <Crown size={14} className="text-primary flex-shrink-0" />
            )}
            {challenge.isPublic ? (
              <Globe size={12} className="text-muted-foreground" />
            ) : (
              <Lock size={12} className="text-muted-foreground" />
            )}
          </div>
          {challenge.description && (
            <p className="text-sm text-muted-foreground truncate">{challenge.description}</p>
          )}
          <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground uppercase font-bold tracking-wider flex-wrap">
            {challenge.creatorName && (
              <span>by {challenge.creatorName}</span>
            )}
            {(challenge.participantsCount ?? 0) > 0 && (
              <span className="flex items-center gap-1">
                <Users size={10} /> {challenge.participantsCount}
              </span>
            )}
            {challenge.startDate && (
              <span>Created {new Date(challenge.startDate).toLocaleDateString()}</span>
            )}
          </div>
        </div>

        {/* XP Badge */}
        <div className="flex items-center gap-1 px-3 py-1 bg-primary/10 rounded-lg text-primary text-sm font-bold">
          <Zap size={14} /> {challenge.xpReward}
        </div>
      </div>

      {/* Progress (only for participants) */}
      {isParticipant && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-muted-foreground">Your Progress</span>
            <span className="text-primary">{challenge.userTotal || 0} / {challenge.targetValue}</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className={`h-full rounded-full ${progress >= 100 ? 'bg-primary' : 'bg-primary/60'}`}
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2">
        {isParticipant ? (
          <>
            {/* Log Buttons */}
            <button
              onClick={() => onLog?.(challenge.id, 1)}
              className="flex-1 py-3 px-4 bg-primary text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-95 transition-all"
            >
              <Plus size={18} /> Log +1
            </button>
            <button
              onClick={() => onLog?.(challenge.id, -1)}
              className="py-3 px-4 bg-white/5 text-muted-foreground font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 active:scale-95 transition-all"
            >
              <Minus size={18} />
            </button>

            {/* Leave (non-creator) or Delete (creator) */}
            {isCreator ? (
              <button
                onClick={() => onDelete?.(challenge.id)}
                className="p-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 active:scale-95 transition-all"
              >
                <Trash2 size={18} />
              </button>
            ) : (
              <button
                onClick={() => onLeave?.(challenge.id)}
                className="p-3 bg-white/5 text-muted-foreground rounded-xl hover:bg-white/10 active:scale-95 transition-all"
              >
                <LeaveIcon size={18} />
              </button>
            )}
          </>
        ) : (
          <Button variant="primary" fullWidth onClick={() => onJoin?.(challenge.id)}>
            <Users size={16} className="mr-2" /> Join Challenge
          </Button>
        )}
      </div>
    </motion.div>
  );
};

// CHALLENGE DETAIL MODAL
interface DetailModalProps {
  challenge: Challenge;
  userId?: string;
  token: string | null;
  onClose: () => void;
  onLog: (id: string, value: number) => void;
}

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  user: { id: string; name: string };
}

const ChallengeDetailModal: React.FC<DetailModalProps> = ({ challenge, userId, token, onClose, onLog }) => {
  const [logs, setLogs] = useState<ChallengeLog[]>([]);
  const [leaderboard, setLeaderboard] = useState<Array<{ userId: string; userName: string; total: number }>>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [tab, setTab] = useState<'logs' | 'leaderboard' | 'comments'>('logs');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user's logs
        const logsRes = await fetch(`${API_URL}/challenges/${challenge.id}/logs`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (logsRes.ok) {
          const data = await logsRes.json();
          setLogs(data.data.logs || []);
        }

        // Fetch leaderboard
        const lbRes = await fetch(`${API_URL}/challenges/${challenge.id}/leaderboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (lbRes.ok) {
          const data = await lbRes.json();
          setLeaderboard(data.data.leaderboard || []);
        }

        // Fetch comments
        const commentsRes = await fetch(`${API_URL}/challenges/${challenge.id}/comments`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (commentsRes.ok) {
          const data = await commentsRes.json();
          setComments(data.data.comments || []);
        }
      } catch (err) {
        console.error('Failed to fetch challenge data:', err);
      }
    };
    fetchData();
  }, [challenge.id, token]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const res = await fetch(`${API_URL}/challenges/${challenge.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content: newComment })
      });

      if (res.ok) {
        const data = await res.json();
        setComments(prev => [data.data.comment, ...prev]);
        setNewComment('');
      }
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-lg bg-card border border-card-border rounded-3xl p-6 max-h-[85vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">{challenge.title}</h2>
            <p className="text-sm text-muted-foreground">{challenge.description}</p>
            {challenge.startDate && (
              <p className="text-[10px] text-muted-foreground mt-1">
                Created {new Date(challenge.startDate).toLocaleDateString()}
              </p>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">✕</Button>
        </div>

        {/* Quick Log */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => { onLog(challenge.id, 1); setLogs(prev => [{ id: Date.now().toString(), value: 1, createdAt: new Date() }, ...prev]); }}
            className="flex-1 py-3 bg-primary text-black font-bold rounded-xl flex items-center justify-center gap-2"
          >
            <Plus size={18} /> +1
          </button>
          <button
            onClick={() => { onLog(challenge.id, -1); setLogs(prev => [{ id: Date.now().toString(), value: -1, createdAt: new Date() }, ...prev]); }}
            className="py-3 px-6 bg-white/5 text-muted-foreground font-bold rounded-xl"
          >
            <Minus size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setTab('logs')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${tab === 'logs' ? 'bg-primary text-black' : 'bg-white/5 text-muted-foreground'}`}
          >
            <Calendar size={12} className="inline mr-1" /> Logs
          </button>
          <button
            onClick={() => setTab('leaderboard')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${tab === 'leaderboard' ? 'bg-primary text-black' : 'bg-white/5 text-muted-foreground'}`}
          >
            <TrendingUp size={12} className="inline mr-1" /> Ranks
          </button>
          <button
            onClick={() => setTab('comments')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${tab === 'comments' ? 'bg-primary text-black' : 'bg-white/5 text-muted-foreground'}`}
          >
            💬 Chat
          </button>
        </div>

        {/* Content */}
        <div className="space-y-2 max-h-56 overflow-y-auto">
          {tab === 'logs' ? (
            logs.length > 0 ? (
              logs.map(log => (
                <div key={log.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <span className="text-sm text-muted-foreground">
                    {new Date(log.createdAt).toLocaleDateString()}
                  </span>
                  <span className={`font-bold ${log.value > 0 ? 'text-primary' : 'text-red-400'}`}>
                    {log.value > 0 ? '+' : ''}{log.value}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">No logs yet. Start logging!</p>
            )
          ) : tab === 'leaderboard' ? (
            leaderboard.length > 0 ? (
              leaderboard.map((entry, idx) => (
                <div key={entry.userId} className={`flex items-center justify-between p-3 rounded-xl ${entry.userId === userId ? 'bg-primary/10 border border-primary/20' : 'bg-white/5'}`}>
                  <div className="flex items-center gap-3">
                    <span className={`font-bold w-6 text-center ${idx < 3 ? 'text-primary' : 'text-muted-foreground'}`}>
                      {idx + 1}
                    </span>
                    <span className="font-medium">{entry.userName}</span>
                    {entry.userId === userId && <span className="text-[10px] text-primary">(You)</span>}
                  </div>
                  <span className="font-bold text-primary">{entry.total}</span>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">No participants yet.</p>
            )
          ) : (
            <>
              {/* Comment Input */}
              <div className="flex gap-2 mb-3">
                <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {(() => {
                    const pic = localStorage.getItem('profilePic');
                    return pic ? (
                      <img src={pic} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-black font-bold text-xs">You</span>
                    );
                  })()}
                </div>
                <input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary/50"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                />
                <button
                  onClick={handleAddComment}
                  className="px-4 py-2 bg-primary text-black font-bold rounded-xl text-sm"
                >
                  Send
                </button>
              </div>

              {/* Comments List */}
              {comments.length > 0 ? (
                comments.map(comment => (
                  <div key={comment.id} className="flex gap-3 p-3 bg-white/5 rounded-xl">
                    <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-muted-foreground">
                        {comment.user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm">{comment.user.name}</span>
                          <span className="text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-bold">Lv?</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground flex-shrink-0">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{comment.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">No comments yet. Be the first!</p>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ChallengeCreator;