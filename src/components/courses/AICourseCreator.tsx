import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { AIPromptSuggestions } from "./AIPromptSuggestions";
import { AIResponsePreview } from "./AIResponsePreview";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { generateCourseContent } from "@/lib/openai";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

export function AICourseCreator() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a course description");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedContent(null);

    try {
      const content = await generateCourseContent(prompt);
      setGeneratedContent(content);
      toast.success("Course content generated successfully!");
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to generate course content. Please try again.";
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="lg:sticky lg:top-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Course Creator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <AIPromptSuggestions onSelect={(suggestion) => {
            setPrompt(suggestion);
            setError(null);
          }} />
          
          <div className="space-y-2">
            <Textarea
              placeholder="Describe your course content, target audience, and learning objectives..."
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
                setError(null);
              }}
              className="min-h-[200px] resize-y"
            />
            <p className="text-xs text-muted-foreground">
              Tip: Be specific about the topic, difficulty level, and desired outcomes for better results
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Generation Failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button 
            onClick={handleGenerate} 
            className="w-full"
            disabled={isGenerating || !prompt.trim()}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Course Content...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Course Content
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedContent && (
        <AIResponsePreview 
          content={generatedContent}
          onEdit={setGeneratedContent}
          isGenerating={isGenerating}
        />
      )}
    </div>
  );
}