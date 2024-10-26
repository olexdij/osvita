import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Brain, Target, Clock, TrendingUp } from "lucide-react";

interface LearningPredictorProps {
  learningData: {
    completionRate: number;
    studyTime: number;
    quizScores: number[];
    exerciseCompletions: number;
  };
}

export function LearningPredictor({ learningData }: LearningPredictorProps) {
  // Calculate predicted completion date based on current progress
  const calculatePredictedCompletion = () => {
    const averageProgress = learningData.completionRate / learningData.studyTime;
    const remainingProgress = 100 - learningData.completionRate;
    const predictedDays = Math.ceil(remainingProgress / (averageProgress * 24));
    
    const date = new Date();
    date.setDate(date.getDate() + predictedDays);
    return date.toLocaleDateString();
  };

  // Calculate learning effectiveness score
  const calculateEffectivenessScore = () => {
    const avgQuizScore = learningData.quizScores.reduce((a, b) => a + b, 0) / learningData.quizScores.length;
    const exerciseCompletion = (learningData.exerciseCompletions / 10) * 100; // Assuming 10 exercises total
    return Math.round((avgQuizScore + exerciseCompletion + learningData.completionRate) / 3);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          Learning Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Predicted Completion</span>
            </div>
            <p className="text-2xl font-bold">{calculatePredictedCompletion()}</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Learning Effectiveness</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Score</span>
                <span>{calculateEffectivenessScore()}%</span>
              </div>
              <Progress value={calculateEffectivenessScore()} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Recommendations</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Increase daily study time by 30 minutes
            </li>
            <li className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-primary" />
              Focus on interactive exercises for better retention
            </li>
            <li className="flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              Review challenging topics from Module 2
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}