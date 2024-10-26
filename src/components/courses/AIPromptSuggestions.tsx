import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Lightbulb } from "lucide-react";

interface AIPromptSuggestionsProps {
  onSelect: (prompt: string) => void;
}

const suggestions = [
  {
    title: "Web Development",
    prompt: "Create a comprehensive course on modern full-stack web development using React, Node.js, and TypeScript. Target intermediate developers who want to build production-ready applications. Include best practices, security considerations, and real-world project examples."
  },
  {
    title: "Data Science",
    prompt: "Design a practical course on data science fundamentals using Python. Cover data analysis, visualization, machine learning basics, and statistical concepts. Include hands-on projects using real datasets and industry tools like pandas and scikit-learn."
  },
  {
    title: "UX Design",
    prompt: "Create a professional UX design course covering user research, wireframing, prototyping, and usability testing. Include case studies, design principles, and practical exercises using industry-standard tools. Target beginners with basic design knowledge."
  },
  {
    title: "Digital Marketing",
    prompt: "Develop a comprehensive digital marketing course covering SEO, social media marketing, content strategy, and analytics. Include real campaign examples, ROI measurement, and current industry trends. Target marketing professionals looking to enhance their digital skills."
  },
  {
    title: "Mobile Development",
    prompt: "Create an advanced course on cross-platform mobile app development using React Native. Cover state management, native modules, performance optimization, and app deployment. Include real-world examples and best practices for both iOS and Android."
  }
];

export function AIPromptSuggestions({ onSelect }: AIPromptSuggestionsProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Lightbulb className="h-4 w-4" />
        <span>Example prompts for inspiration</span>
      </div>
      <ScrollArea className="h-[150px] rounded-md border p-2">
        <div className="space-y-2">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start text-left h-auto p-2"
                onClick={() => onSelect(suggestion.prompt)}
              >
                <div>
                  <div className="font-medium">{suggestion.title}</div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {suggestion.prompt}
                  </p>
                </div>
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}