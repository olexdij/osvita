import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Plus, X, Upload, Loader2 } from "lucide-react";
import { ModuleForm } from "./ModuleForm";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { uploadCourseThumbnail } from "@/lib/supabase/storage";
import { toast } from "sonner";
import { nanoid } from "nanoid";

interface CourseFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
}

export function CourseForm({ onSubmit, initialData }: CourseFormProps) {
  const [formData, setFormData] = useState({
    id: initialData?.id || nanoid(),
    title: initialData?.title || "",
    description: initialData?.description || "",
    thumbnail: initialData?.thumbnail || "",
    modules: initialData?.modules || [],
    createdAt: initialData?.createdAt || new Date().toISOString(),
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleAddModule = () => {
    setFormData({
      ...formData,
      modules: [
        ...formData.modules,
        {
          id: nanoid(),
          title: "",
          lessons: [],
          assessment: null,
        },
      ],
    });
  };

  const handleModuleChange = (moduleIndex: number, moduleData: any) => {
    const newModules = [...formData.modules];
    newModules[moduleIndex] = moduleData;
    setFormData({ ...formData, modules: newModules });
  };

  const handleRemoveModule = (moduleIndex: number) => {
    setFormData({
      ...formData,
      modules: formData.modules.filter((_, index) => index !== moduleIndex),
    });
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setIsUploading(true);
    try {
      const publicUrl = await uploadCourseThumbnail(file);
      setFormData({ ...formData, thumbnail: publicUrl });
      toast.success('Thumbnail uploaded successfully');
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      toast.error('Failed to upload thumbnail');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Course Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter course title"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <RichTextEditor
            content={formData.description}
            onChange={(content) => setFormData({ ...formData, description: content })}
            placeholder="Enter course description..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="thumbnail">Course Thumbnail</Label>
          <div className="flex items-center gap-4">
            {formData.thumbnail && (
              <img
                src={formData.thumbnail}
                alt="Thumbnail preview"
                className="w-32 h-32 object-cover rounded-lg"
              />
            )}
            <div className="flex-1">
              <Label
                htmlFor="thumbnail-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-secondary/50"
              >
                {isUploading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Uploading...
                    </span>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Upload thumbnail image
                    </span>
                  </>
                )}
                <Input
                  id="thumbnail-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleThumbnailUpload}
                  disabled={isUploading}
                />
              </Label>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Course Modules</h3>
          <Button type="button" onClick={handleAddModule} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Module
          </Button>
        </div>

        {formData.modules.map((module, index) => (
          <Card key={module.id} className="p-4">
            <div className="flex justify-end mb-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveModule(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ModuleForm
              module={module}
              onChange={(data) => handleModuleChange(index, data)}
            />
          </Card>
        ))}
      </div>

      <div className="flex justify-end gap-4">
        <Button type="submit">
          {initialData ? "Update Course" : "Create Course"}
        </Button>
      </div>
    </form>
  );
}