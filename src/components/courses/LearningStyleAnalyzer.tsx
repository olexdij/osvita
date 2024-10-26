import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Brain, Eye, Headphones, Activity } from "lucide-react";

const questions = [
  {
    id: "1",
    text: "When learning something new, I prefer to:",
    options: [
      { value: "visual", label: "See diagrams and visual examples" },
      { value: "auditory", label: "Listen to explanations" },
      { value: "kinesthetic", label: "Try it hands-on" },
      { value: "reading", label: "Read detailed instructions" }
    ]
  },
  // Add more questions...
];

export function LearningStyleAnalyzer() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<Record<string, number> | null>(null);

  const analyzeLearningStyle = () => {
    const styles = {
      visual: 0,
      auditory: 0,
      kinesthetic: 0,
      reading: 0
    };

    Object.values(answers).forEach(answer => {
      styles[answer as keyof typeof styles]++;
    });

    const total = Object.values(styles).reduce((a, b) => a + b, 0);
    const percentages = Object.fromEntries(
      Object.entries(styles).map(([key, value]) => [
        key,
        Math.round((value / total) * 100)
      ])
    );

    setResult(percentages);
  };

  const getStyleIcon = (style: string) => {
    switch (style) {
      case "visual":
        return <Eye className="w-4 h-4" />;
      case "auditory":
        return <Headphones className="w-4 h-4" />;
      case "kinesthetic":
        return <Activity className="w-4 h-4" />;
      default:
        return <Brain className="w-4 h-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          Learning Style Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!result ? (
          <div className="space-y-6">
            {questions.map(question => (
              <div key={question.id} className="space-y-4">
                <p className="font-medium">{question.text}</p>
                <RadioGroup
                  onValueChange={(value) => 
                    setAnswers(prev => ({ ...prev, [question.id]: value }))
                  }
                  value={answers[question.id]}
                >
                  {question.options.map(option => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                      <Label htmlFor={`${question.id}-${option.value}`}>{option.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
            <Button 
              onClick={analyzeLearningStyle}
              disabled={Object.keys(answers).length !== questions.length}
              className="w-full"
            >
              Analyze My Learning Style
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4 grid-cols-2">
              {Object.entries(result).map(([style, percentage]) => (
                <Card key={style}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      {getStyleIcon(style)}
                      <span className="capitalize font-medium">{style} Learner</span>
                    </div>
                    <div className="text-2xl font-bold">{percentage}%</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Recommended Learning Strategies</h4>
              <ul className="space-y-2 text-sm">
                {result.visual > 30 && (
                  <li className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-primary" />
                    Use mind maps and diagrams
                  </li>
                )}
                {result.auditory > 30 && (
                  <li className="flex items-center gap-2">
                    <Headphones className="w-4 h-4 text-primary" />
                    Listen to video lectures and discussions
                  </li>
                )}
                {result.kinesthetic > 30 && (
                  <li className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary" />
                    Practice with hands-on exercises
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}