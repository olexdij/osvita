import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Code, Play, CheckCircle, XCircle } from 'lucide-react';

interface InteractiveExerciseProps {
  exercise: {
    id: string;
    title: string;
    description: string;
    initialCode: string;
    solution: string;
    hints: string[];
  };
  onComplete: (success: boolean) => void;
}

export function InteractiveExercise({ exercise, onComplete }: InteractiveExerciseProps) {
  const [code, setCode] = useState(exercise.initialCode);
  const [output, setOutput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);

  const runCode = () => {
    try {
      // Basic sandbox for running JavaScript code
      const result = new Function(code)();
      setOutput(String(result));
      
      // Check if solution is correct
      if (result === new Function(exercise.solution)()) {
        toast.success('Exercise completed successfully!');
        onComplete(true);
      } else {
        toast.error('Not quite right. Try again!');
      }
    } catch (error) {
      setOutput(String(error));
      toast.error('Error in code execution');
    }
  };

  const showNextHint = () => {
    if (currentHint < exercise.hints.length - 1) {
      setCurrentHint(prev => prev + 1);
    }
    setShowHint(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="w-5 h-5" />
          {exercise.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{exercise.description}</p>

        <div className="space-y-2">
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="font-mono min-h-[200px]"
            placeholder="Write your code here..."
          />

          <div className="flex gap-2">
            <Button onClick={runCode} className="flex-1">
              <Play className="w-4 h-4 mr-2" />
              Run Code
            </Button>
            <Button variant="outline" onClick={showNextHint}>
              Show Hint
            </Button>
          </div>
        </div>

        {showHint && (
          <Card className="bg-muted">
            <CardContent className="p-4">
              <p className="text-sm">{exercise.hints[currentHint]}</p>
            </CardContent>
          </Card>
        )}

        {output && (
          <Card className="bg-muted">
            <CardHeader>
              <CardTitle className="text-sm">Output</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm">{output}</pre>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}