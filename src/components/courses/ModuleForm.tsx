import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Plus, X, Upload } from "lucide-react";
import { nanoid } from "nanoid";
import { AssessmentForm } from "./AssessmentForm";
import { RichTextEditor } from "@/components/editor/RichTextEditor";

export function ModuleForm({ module, onChange }) {
  const handleAddLesson = () => {
    onChange({
      ...module,
      lessons: [
        ...module.lessons,
        {
          id: nanoid(),
          title: "",
          content: "",
          videoUrl: "",
          attachments: [],
        },
      ],
    });
  };

  const handleLessonChange = (lessonIndex, field, value) => {
    const newLessons = [...module.lessons];
    newLessons[lessonIndex] = {
      ...newLessons[lessonIndex],
      [field]: value,
    };
    onChange({ ...module, lessons: newLessons });
  };

  const handleRemoveLesson = (lessonIndex) => {
    onChange({
      ...module,
      lessons: module.lessons.filter((_, index) => index !== lessonIndex),
    });
  };

  const handleAssessmentChange = (assessment) => {
    onChange({ ...module, assessment });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Module Title</Label>
        <Input
          value={module.title}
          onChange={(e) => onChange({ ...module, title: e.target.value })}
          placeholder="Enter module title"
          required
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Lessons</h4>
          <Button type="button" variant="outline" size="sm" onClick={handleAddLesson}>
            <Plus className="w-4 h-4 mr-2" />
            Add Lesson
          </Button>
        </div>

        {module.lessons.map((lesson, index) => (
          <Card key={lesson.id} className="p-4">
            <div className="flex justify-end mb-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveLesson(index)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Lesson Title</Label>
                <Input
                  value={lesson.title}
                  onChange={(e) => handleLessonChange(index, "title", e.target.value)}
                  placeholder="Enter lesson title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Content</Label>
                <RichTextEditor
                  content={lesson.content}
                  onChange={(content) => handleLessonChange(index, "content", content)}
                  placeholder="Enter lesson content..."
                />
              </div>

              <div className="space-y-2">
                <Label>Video URL</Label>
                <Input
                  type="url"
                  value={lesson.videoUrl}
                  onChange={(e) => handleLessonChange(index, "videoUrl", e.target.value)}
                  placeholder="Enter video URL"
                />
              </div>

              <div className="space-y-2">
                <Label>Attachments</Label>
                <Input
                  type="file"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    const fileUrls = files.map((file) => URL.createObjectURL(file));
                    handleLessonChange(index, "attachments", fileUrls);
                  }}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Module Assessment</h4>
        <AssessmentForm
          assessment={module.assessment}
          onChange={handleAssessmentChange}
        />
      </div>
    </div>
  );
}