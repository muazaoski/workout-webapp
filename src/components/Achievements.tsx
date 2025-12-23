import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWorkoutStore, type Achievement } from '../stores/workoutStore';
import Badge from './Badge';
import LevelProgress from './LevelProgress';
import Card from './ui/Card';
import { Trophy, Filter, Grid, List, Star, Lock } from 'lucide-react';

const Achievements: React.FC = () => {
  const { achievements, userLevel, stats } = useWorkoutStore();
  const [selectedCategory, setSelectedCategory] = useState<Achievement['category'] | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories: Achievement['category'][] = ['workout', 'streak', 'strength', 'consistency', 'special'];

  const filteredAchievements = achievements.filter(achievement =>
    selectedCategory === 'all' || achievement.category === selectedCategory
  );

  const unlockedAchievements = filteredAchievements.filter(a => a.unlocked);
  const lockedAchievements = filteredAchievements.filter(a => !a.unlocked);

  const getCategoryIcon = (category: Achievement['category']) => {
    switch (category) {
      case 'workout': return '💪';
      case 'streak': return '🔥';
      case 'strength': return '🏋️';
      case 'consistency': return '📅';
      case 'special': return '⭐';
      default: return '🎯';
    }
  };

  const getProgress = (achievement: Achievement) => {
    switch (achievement.requirement.type) {
      case 'totalWorkouts':
        return Math.min((stats.totalWorkouts / achievement.requirement.value) * 100, 100);
      case 'streak':
        return Math.min((stats.streak / achievement.requirement.value) * 100, 100);
      case 'totalReps':
        return Math.min((stats.totalReps / achievement.requirement.value) * 100, 100);
      case 'totalWeight':
        return Math.min((stats.totalWeight / achievement.requirement.value) * 100, 100);
      default:
        return 0;
    }
  };

  const getCurrentValue = (achievement: Achievement) => {
    switch (achievement.requirement.type) {
      case 'totalWorkouts':
        return stats.totalWorkouts;
      case 'streak':
        return stats.streak;
      case 'totalReps':
        return stats.totalReps;
      case 'totalWeight':
        return stats.totalWeight;
      default:
        return 0;
    }
  };

  return (
    <div className="space-y-6">
      {/* Level Progress Section */}
      <LevelProgress userLevel={userLevel} />

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <div className="text-2xl font-bold text-white">{unlockedAchievements.length}</div>
          <div className="text-sm text-gray-400">Unlocked</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-white">{achievements.length}</div>
          <div className="text-sm text-gray-400">Total</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-white">{stats.totalWorkouts}</div>
          <div className="text-sm text-gray-400">Workouts</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-white">{userLevel.totalXP}</div>
          <div className="text-sm text-gray-400">Total XP</div>
        </Card>
      </div>

      {/* Achievements Section */}
      <Card>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <h2 className="text-xl font-semibold text-white">Achievements</h2>
          </div>

          <div className="flex items-center space-x-3">
            {/* View Mode Toggle */}
            <div className="flex bg-dark-tertiary rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-all duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-white text-dark-primary'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-all duration-200 ${
                  viewMode === 'list'
                    ? 'bg-white text-dark-primary'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedCategory === 'all'
                ? 'bg-white text-dark-primary'
                : 'bg-dark-tertiary text-gray-400 hover:text-white'
            }`}
          >
            All ({achievements.length})
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-white text-dark-primary'
                  : 'bg-dark-tertiary text-gray-400 hover:text-white'
              }`}
            >
              <span className="mr-2">{getCategoryIcon(category)}</span>
              {category.charAt(0).toUpperCase() + category.slice(1)} ({achievements.filter(a => a.category === category).length})
            </button>
          ))}
        </div>

        {/* Achievements Display */}
        {filteredAchievements.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <div className="text-3xl mb-2 opacity-50">🔍</div>
            <p>No achievements found for this category.</p>
          </div>
        ) : viewMode === 'grid' ? (
          // Grid View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAchievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-center p-4 rounded-xl border transition-all duration-200 ${
                  achievement.unlocked
                    ? 'bg-white/5 border-white/20'
                    : 'bg-dark-tertiary/30 border-gray-800'
                }`}
              >
                <Badge achievement={achievement} size="lg" />
                <h3 className="font-semibold text-white mt-3 mb-1">{achievement.name}</h3>
                <p className="text-sm text-gray-400 mb-3">{achievement.description}</p>

                {!achievement.unlocked && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Progress</span>
                      <span>{getCurrentValue(achievement)} / {achievement.requirement.value}</span>
                    </div>
                    <div className="h-2 bg-dark-tertiary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${getProgress(achievement)}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-white/20 to-white/40"
                      />
                    </div>
                  </div>
                )}

                {achievement.unlocked && achievement.unlockedAt && (
                  <div className="text-xs text-green-400 flex items-center justify-center">
                    <Star size={12} className="mr-1" />
                    Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          // List View
          <div className="space-y-3">
            {filteredAchievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                  achievement.unlocked
                    ? 'bg-white/5 border-white/20'
                    : 'bg-dark-tertiary/30 border-gray-800'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <Badge achievement={achievement} size="md" />
                  <div>
                    <h3 className="font-semibold text-white">{achievement.name}</h3>
                    <p className="text-sm text-gray-400">{achievement.description}</p>
                  </div>
                </div>

                <div className="text-right">
                  {achievement.unlocked ? (
                    <div className="text-green-400 text-sm flex items-center">
                      <Star size={16} className="mr-1" />
                      Unlocked
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="text-sm text-gray-400">
                        {getCurrentValue(achievement)} / {achievement.requirement.value}
                      </div>
                      <div className="w-32 h-2 bg-dark-tertiary rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${getProgress(achievement)}%` }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-white/20 to-white/40"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Achievements;