import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Sparkles, Brain } from "lucide-react";
import { generateCourseContent } from "@/lib/openai";
import { toast } from "sonner";
import { nanoid } from "nanoid";
import { AIPromptSuggestions } from "./AIPromptSuggestions";

interface AICourseMakerProps {
  onCourseGenerated: (course: any) => void;
}

const promptTips = [
  "Specify the target audience (e.g., beginners, professionals)",
  "Mention key topics to be covered",
  "Include desired learning outcomes",
  "Suggest practical applications or projects",
  "Indicate preferred course duration or depth"
];

export function AICourseMaker({ onCourseGenerated }: AICourseMakerProps) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a course topic or description");
      return;
    }

    setIsGenerating(true);
    try {
      const courseContent = await generateCourseContent(prompt);
      
      const completeContent = {
        ...courseContent,
        id: nanoid(),
        students: 0,
        progress: 0,
        createdAt: new Date().toISOString(),
        modules: courseContent.modules.map(module => ({
          ...module,
          id: nanoid(),
          lessons: module.lessons.map(lesson => ({
            ...lesson,
            id: nanoid(),
            videoUrl: lesson.type === 'video' ? 'https://www.youtube.com/embed/demo' : undefined,
            attachments: lesson.resources?.map(resource => resource.url) || []
          }))
        }))
      };

      onCourseGenerated(completeContent);
      toast.success("Course generated successfully!");
      setPrompt("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to generate course");
      console.error("Course generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ScrollArea className="h-[80vh] w-full max-w-3xl mx-auto">
      <div className="p-4">
        <Card className="border-0 shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              AI Course Generator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <AIPromptSuggestions onSelect={setPrompt} />

            <div className="space-y-4">
              <Textarea
                placeholder="Describe your course idea in detail... (e.g., 'Create a comprehensive course on machine learning fundamentals, targeting beginners with basic Python knowledge. Include practical exercises and real-world applications.')"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={6}
                className="resize-none min-h-[150px] w-full"
              />
              
              <Card className="bg-muted border-none">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2 text-sm">Tips for better results:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {promptTips.map((tip, index) => (
                      <li key={index} className="text-xs text-muted-foreground">
                        {tip}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || !prompt.trim()}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Course...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Professional Course
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </ScrollArea>
  );
}