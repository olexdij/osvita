import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, MinusCircle, Image as ImageIcon } from 'lucide-react';
import { nanoid } from 'nanoid';

interface Question {
  id: string;
  type: 'multiple-choice' | 'essay' | 'image-choice';
  text: string;
  options?: string[];
  correctAnswer?: string;
  points: number;
  imageUrl?: string;
}

interface AssessmentFormProps {
  assessment: {
    title: string;
    description: string;
    passingScore: number;
    questions: Question[];
  } | null;
  onChange: (assessment: any) => void;
}

const questionTypes = [
  { id: 'multiple-choice', label: 'Multiple Choice' },
  { id: 'essay', label: 'Essay' },
  { id: 'image-choice', label: 'Image Choice' }
];

export function AssessmentForm({ assessment, onChange }: AssessmentFormProps) {
  const [formData, setFormData] = useState({
    title: assessment?.title || '',
    description: assessment?.description || '',
    passingScore: assessment?.passingScore || 70,
    questions: assessment?.questions || [],
  });

  const handleChange = (field: string, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onChange(newData);
  };

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: nanoid(),
      type: 'multiple-choice',
      text: '',
      options: ['Option 1'],
      correctAnswer: 'Option 1',
      points: 10
    };
    handleChange('questions', [...formData.questions, newQuestion]);
  };

  const handleRemoveQuestion = (index: number) => {
    const newQuestions = formData.questions.filter((_, i) => i !== index);
    handleChange('questions', newQuestions);
  };

  const handleQuestionChange = (index: number, field: string, value: any) => {
    const newQuestions = [...formData.questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    
    if (field === 'type') {
      if (value === 'multiple-choice') {
        newQuestions[index].options = ['Option 1'];
        newQuestions[index].correctAnswer = 'Option 1';
      } else if (value === 'image-choice') {
        newQuestions[index].options = ['https://example.com/image1.jpg'];
        newQuestions[index].correctAnswer = 'https://example.com/image1.jpg';
      } else {
        delete newQuestions[index].options;
        delete newQuestions[index].correctAnswer;
      }
    }
    
    handleChange('questions', newQuestions);
  };

  const handleAddOption = (questionIndex: number) => {
    const newQuestions = [...formData.questions];
    const question = newQuestions[questionIndex];
    if (!question.options) {
      question.options = [];
    }
    const newOption = question.type === 'image-choice' 
      ? `https://example.com/image${question.options.length + 1}.jpg`
      : `Option ${question.options.length + 1}`;
    question.options.push(newOption);
    if (!question.correctAnswer) {
      question.correctAnswer = newOption;
    }
    handleChange('questions', newQuestions);
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...formData.questions];
    const question = newQuestions[questionIndex];
    if (!question.options) {
      question.options = [];
    }
    question.options[optionIndex] = value;
    
    if (question.correctAnswer === question.options[optionIndex]) {
      question.correctAnswer = value;
    }
    
    handleChange('questions', newQuestions);
  };

  const handleRemoveOption = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...formData.questions];
    const question = newQuestions[questionIndex];
    if (!question.options) return;
    
    const removedOption = question.options[optionIndex];
    question.options = question.options.filter((_, i) => i !== optionIndex);
    
    if (question.correctAnswer === removedOption && question.options.length > 0) {
      question.correctAnswer = question.options[0];
    }
    
    handleChange('questions', newQuestions);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Assessment Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Enter assessment title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Enter assessment description"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="passingScore">Passing Score (%)</Label>
          <Input
            id="passingScore"
            type="number"
            min="0"
            max="100"
            value={formData.passingScore}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (!isNaN(value) && value >= 0 && value <= 100) {
                handleChange('passingScore', value);
              }
            }}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Questions</h3>
          <Button type="button" onClick={handleAddQuestion} variant="outline" size="sm">
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Question
          </Button>
        </div>

        {formData.questions.map((question, questionIndex) => (
          <Card key={question.id} className="p-4">
            <div className="space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 space-y-2">
                  <Label>Question Type</Label>
                  <Select
                    value={question.type}
                    onValueChange={(value: 'multiple-choice' | 'essay' | 'image-choice') => 
                      handleQuestionChange(questionIndex, 'type', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select question type" />
                    </SelectTrigger>
                    <SelectContent>
                      {questionTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-32">
                  <Label>Points</Label>
                  <Input
                    type="number"
                    min="1"
                    value={question.points}
                    onChange={(e) => handleQuestionChange(questionIndex, 'points', parseInt(e.target.value) || 0)}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveQuestion(questionIndex)}
                >
                  <MinusCircle className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Question Text</Label>
                <Textarea
                  value={question.text}
                  onChange={(e) => handleQuestionChange(questionIndex, 'text', e.target.value)}
                  placeholder="Enter your question"
                />
              </div>

              {(question.type === 'multiple-choice' || question.type === 'image-choice') && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>{question.type === 'image-choice' ? 'Images' : 'Options'}</Label>
                    <Button
                      type="button"
                      onClick={() => handleAddOption(questionIndex)}
                      variant="outline"
                      size="sm"
                    >
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Add {question.type === 'image-choice' ? 'Image' : 'Option'}
                    </Button>
                  </div>

                  {question.options?.map((option, optionIndex) => (
                    <div key={`${question.id}-option-${optionIndex}`} className="flex gap-2">
                      {question.type === 'image-choice' && (
                        <div className="w-20 h-20 rounded-lg border flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                      <Input
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(questionIndex, optionIndex, e.target.value)
                        }
                        placeholder={question.type === 'image-choice' ? 'Enter image URL' : `Option ${optionIndex + 1}`}
                      />
                      {question.options!.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveOption(questionIndex, optionIndex)}
                        >
                          <MinusCircle className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}

                  <div className="space-y-2">
                    <Label>Correct Answer</Label>
                    <Select
                      value={question.correctAnswer}
                      onValueChange={(value) =>
                        handleQuestionChange(questionIndex, 'correctAnswer', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select correct answer" />
                      </SelectTrigger>
                      <SelectContent>
                        {question.options?.map((option, index) => (
                          <SelectItem key={`${question.id}-answer-${index}`} value={option}>
                            {question.type === 'image-choice' ? `Image ${index + 1}` : option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}