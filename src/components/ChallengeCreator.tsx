import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkoutStore, type Challenge } from '../stores/workoutStore';
import Button from './ui/Button';
import Card from './ui/Card';
import Input from './ui/Input';
import { Plus, Target, Calendar, Trophy, X, CheckCircle } from 'lucide-react';

const ChallengeCreator: React.FC = () => {
  const { challenges, createChallenge, deleteChallenge, checkInChallenge } = useWorkoutStore();
  const [showForm, setShowForm] = useState(false);
  const [newChallenge, setNewChallenge] = useState({
    name: '',
    description: '',
    duration: 30, // days
    icon: '🎯',
    color: '#3B82F6',
  });

  const predefinedColors = [
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Green', value: '#10B981' },
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Yellow', value: '#F59E0B' },
    { name: 'Pink', value: '#EC4899' },
  ];

  const predefinedIcons = [
    '🎯', '💪', '🏃', '🧘', '🥗', '💧', '😴', '🚫', '⚡', '🔥'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newChallenge.name && newChallenge.description) {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + newChallenge.duration);

      createChallenge({
        name: newChallenge.name,
        description: newChallenge.description,
        startDate: new Date(),
        endDate,
        icon: newChallenge.icon,
        color: newChallenge.color,
        isCompleted: false,
      });

      setNewChallenge({
        name: '',
        description: '',
        duration: 30,
        icon: '🎯',
        color: '#3B82F6',
      });
      setShowForm(false);
    }
  };

  const handleCheckIn = (challengeId: string) => {
    checkInChallenge(challengeId);
  };

  const getProgress = (challenge: Challenge) => {
    if (!challenge.endDate) return 0;
    const now = new Date();
    const total = Math.floor((challenge.endDate.getTime() - challenge.startDate.getTime()) / (1000 * 60 * 60 * 24));
    const elapsed = Math.floor((now.getTime() - challenge.startDate.getTime()) / (1000 * 60 * 60 * 24));
    return Math.min((elapsed / total) * 100, 100);
  };

  const getDaysLeft = (challenge: Challenge) => {
    if (!challenge.endDate || challenge.isCompleted) return 0;
    const now = new Date();
    const diff = Math.floor((challenge.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(diff, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Target className="w-6 h-6 text-white" />
          <h2 className="text-xl font-semibold text-white">Challenges</h2>
        </div>
        <Button
          size="sm"
          onClick={() => setShowForm(!showForm)}
          icon={<Plus size={16} />}
        >
          Create Challenge
        </Button>
      </div>

      {/* Challenge Creation Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Create New Challenge</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowForm(false)}
                  >
                    <X size={20} />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Challenge name (e.g., No Sugar for 30 Days)"
                    value={newChallenge.name}
                    onChange={(e) => setNewChallenge(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />

                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      placeholder="Duration"
                      value={newChallenge.duration}
                      onChange={(e) => setNewChallenge(prev => ({ ...prev, duration: parseInt(e.target.value) || 30 }))}
                      min="1"
                      max="365"
                      className="w-24"
                    />
                    <span className="text-gray-400 text-sm">days</span>
                  </div>
                </div>

                <textarea
                  className="minimal-input w-full"
                  placeholder="Challenge description (e.g., Avoid all added sugars and sweetened drinks)"
                  rows={3}
                  value={newChallenge.description}
                  onChange={(e) => setNewChallenge(prev => ({ ...prev, description: e.target.value }))}
                  required
                />

                {/* Icon Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Choose Icon</label>
                  <div className="flex flex-wrap gap-2">
                    {predefinedIcons.map(icon => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setNewChallenge(prev => ({ ...prev, icon }))}
                        className={`w-10 h-10 rounded-lg text-xl transition-all duration-200 ${
                          newChallenge.icon === icon
                            ? 'bg-white/10 border border-white/30'
                            : 'bg-dark-secondary border border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Choose Color</label>
                  <div className="flex flex-wrap gap-2">
                    {predefinedColors.map(color => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setNewChallenge(prev => ({ ...prev, color: color.value }))}
                        className={`w-8 h-8 rounded-full transition-all duration-200 ${
                          newChallenge.color === color.value
                            ? 'ring-2 ring-white ring-offset-2 ring-offset-dark-secondary'
                            : ''
                        }`}
                        style={{ backgroundColor: color.value }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button variant="ghost" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Create Challenge
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Challenges */}
      <div className="space-y-4">
        {challenges.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <div className="text-3xl mb-2 opacity-50">🎯</div>
            <p>No challenges yet. Create your first challenge to get started!</p>
          </div>
        ) : (
          challenges.map((challenge) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="border border-gray-800/50 rounded-xl p-4 hover:border-white/30 transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div
                    className="flex items-center justify-center w-12 h-12 rounded-xl text-2xl"
                    style={{ backgroundColor: challenge.color + '20', color: challenge.color }}
                  >
                    {challenge.icon}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">{challenge.name}</h3>
                    <p className="text-sm text-gray-400 mb-3">{challenge.description}</p>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-white">
                          {challenge.checkIns.length} / 30 days
                        </span>
                      </div>

                      <div className="h-2 bg-dark-tertiary rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(challenge.checkIns.length / 30) * 100}%` }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                          className="h-full transition-all duration-200"
                          style={{ backgroundColor: challenge.color }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">
                          {getDaysLeft(challenge)} days left
                        </span>
                        {challenge.isCompleted && (
                          <span className="text-green-400 flex items-center">
                            <CheckCircle size={12} className="mr-1" />
                            Completed!
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {challenge.isActive && !challenge.isCompleted && (
                    <Button
                      size="sm"
                      onClick={() => handleCheckIn(challenge.id)}
                      disabled={challenge.checkIns.some(checkIn =>
                        checkIn.toDateString() === new Date().toDateString()
                      )}
                    >
                      {challenge.checkIns.some(checkIn =>
                        checkIn.toDateString() === new Date().toDateString()
                      ) ? 'Checked In' : 'Check In'}
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteChallenge(challenge.id)}
                  >
                    <X size={16} />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChallengeCreator;