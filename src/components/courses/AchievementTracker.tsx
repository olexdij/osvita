import { Trophy, Star, Zap, Target } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface AchievementTrackerProps {
  xpPoints: number;
  completedLessons: number;
  streak: number;
}

const achievements = [
  {
    title: "Fast Learner",
    description: "Complete 5 lessons",
    icon: Zap,
    requirement: 5,
    type: 'lessons'
  },
  {
    title: "Knowledge Seeker",
    description: "Complete 10 lessons",
    icon: Target,
    requirement: 10,
    type: 'lessons'
  },
  {
    title: "XP Master",
    description: "Earn 100 XP points",
    icon: Star,
    requirement: 100,
    type: 'xp'
  },
  {
    title: "Dedicated Learner",
    description: "Maintain a 5-day learning streak",
    icon: Trophy,
    requirement: 5,
    type: 'streak'
  }
];

export function AchievementTracker({ xpPoints, completedLessons, streak }: AchievementTrackerProps) {
  const getProgress = (achievement: typeof achievements[0]) => {
    switch (achievement.type) {
      case 'lessons':
        return (completedLessons / achievement.requirement) * 100;
      case 'xp':
        return (xpPoints / achievement.requirement) * 100;
      case 'streak':
        return (streak / achievement.requirement) * 100;
      default:
        return 0;
    }
  };

  const getCurrentValue = (achievement: typeof achievements[0]) => {
    switch (achievement.type) {
      case 'lessons':
        return completedLessons;
      case 'xp':
        return xpPoints;
      case 'streak':
        return streak;
      default:
        return 0;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold">{xpPoints} XP</h3>
        <p className="text-muted-foreground">Keep learning to earn more points!</p>
      </div>

      <div className="grid gap-4">
        {achievements.map((achievement) => {
          const progress = getProgress(achievement);
          const current = getCurrentValue(achievement);
          const Icon = achievement.icon;
          const isCompleted = progress >= 100;

          return (
            <div
              key={achievement.title}
              className={`p-4 border rounded-lg ${
                isCompleted ? 'bg-primary/10 border-primary' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-full ${
                  isCompleted ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{achievement.title}</p>
                    <span className="text-sm text-muted-foreground">
                      {current}/{achievement.requirement}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {achievement.description}
                  </p>
                  <Progress value={progress} className="h-2" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}