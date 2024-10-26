import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { Pencil, Save, X } from "lucide-react";
import { toast } from "sonner";

interface AIResponsePreviewProps {
  content: {
    title: string;
    description: string;
    modules: Array<{
      title: string;
      lessons: Array<{
        title: string;
        content: string;
      }>;
    }>;
  };
  onEdit: (content: any) => void;
  isGenerating: boolean;
}

export function AIResponsePreview({ content, onEdit, isGenerating }: AIResponsePreviewProps) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState(content);

  const handleEdit = (field: string, value: string) => {
    setEditedContent((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = (field: string) => {
    onEdit(editedContent);
    setEditingField(null);
    toast.success(`${field} updated successfully`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Generated Course Content</span>
          <div className="flex gap-2">
            {editingField && (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setEditedContent(content);
                    setEditingField(null);
                  }}
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleSave(editingField)}
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{content.title}</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditingField("title")}
              disabled={isGenerating}
            >
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </div>
          {editingField === "title" ? (
            <RichTextEditor
              content={editedContent.title}
              onChange={(value) => handleEdit("title", value)}
            />
          ) : (
            <p className="text-sm text-muted-foreground">{content.description}</p>
          )}
        </div>

        <div className="space-y-4">
          {content.modules.map((module, moduleIndex) => (
            <Card key={moduleIndex}>
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-2">{module.title}</h4>
                <div className="space-y-2">
                  {module.lessons.map((lesson, lessonIndex) => (
                    <div key={lessonIndex} className="pl-4 border-l-2 border-muted">
                      <h5 className="font-medium">{lesson.title}</h5>
                      <div
                        className="text-sm text-muted-foreground mt-1"
                        dangerouslySetInnerHTML={{ __html: lesson.content }}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}