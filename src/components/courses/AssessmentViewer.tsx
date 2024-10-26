import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle, XCircle, Image as ImageIcon } from "lucide-react";

interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'image-choice';
  options: string[];
  correctAnswer: string;
  points: number;
  imageUrl?: string;
}

interface AssessmentViewerProps {
  assessment: {
    title: string;
    description: string;
    passingScore: number;
    questions: Question[];
  };
  onComplete: (passed: boolean) => void;
}

export function AssessmentViewer({ assessment, onComplete }: AssessmentViewerProps) {
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = assessment.questions[currentQuestionIndex];
  const totalQuestions = assessment.questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const handleAnswer = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const calculateScore = () => {
    const totalPoints = assessment.questions.reduce((sum, q) => sum + q.points, 0);
    const earnedPoints = assessment.questions.reduce((sum, q) => {
      return sum + (answers[q.id] === q.correctAnswer ? q.points : 0);
    }, 0);
    return Math.round((earnedPoints / totalPoints) * 100);
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      const finalScore = calculateScore();
      setScore(finalScore);
      setShowResults(true);
      const passed = finalScore >= assessment.passingScore;
      onComplete(passed);

      toast({
        title: passed ? "Assessment Completed!" : "Assessment Failed",
        description: `You scored ${finalScore}%. ${
          passed ? "Congratulations!" : "Please try again."
        }`,
      });
    }
  };

  if (showResults) {
    const passed = score >= assessment.passingScore;
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {passed ? (
              <CheckCircle className="h-6 w-6 text-green-500" />
            ) : (
              <XCircle className="h-6 w-6 text-red-500" />
            )}
            Assessment Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{score}%</p>
            <p className="text-sm text-muted-foreground">
              Passing Score: {assessment.passingScore}%
            </p>
          </div>
          <Progress value={score} className="h-2" />
          <p className="text-center">
            {passed
              ? "Congratulations! You have passed the assessment."
              : "You did not meet the passing score. Please try again."}
          </p>
        </CardContent>
        {!passed && (
          <CardFooter>
            <Button
              onClick={() => {
                setCurrentQuestionIndex(0);
                setAnswers({});
                setShowResults(false);
              }}
              className="w-full"
            >
              Try Again
            </Button>
          </CardFooter>
        )}
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{assessment.title}</CardTitle>
        <p className="text-sm text-muted-foreground">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </p>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium">{currentQuestion.text}</h3>
          
          {currentQuestion.imageUrl && (
            <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
              <img
                src={currentQuestion.imageUrl}
                alt="Question visual"
                className="object-cover w-full h-full"
              />
            </div>
          )}

          <RadioGroup
            value={answers[currentQuestion.id]}
            onValueChange={handleAnswer}
            className="space-y-2"
          >
            {currentQuestion.options.map((option, index) => (
              <div key={`${currentQuestion.id}-option-${index}`} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${currentQuestion.id}-option-${index}`} />
                <Label htmlFor={`${currentQuestion.id}-option-${index}`}>
                  {currentQuestion.type === 'image-choice' ? (
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      <img
                        src={option}
                        alt={`Option ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                    </div>
                  ) : (
                    option
                  )}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={!answers[currentQuestion.id]}
        >
          {currentQuestionIndex === totalQuestions - 1 ? "Finish" : "Next"}
        </Button>
      </CardFooter>
    </Card>
  );
}