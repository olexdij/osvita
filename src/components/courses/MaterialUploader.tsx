import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCourseMaterials } from '@/hooks/use-course-materials';
import { FileText, Upload, X, Loader2, Download } from 'lucide-react';
import { formatBytes } from '@/lib/utils';

interface MaterialUploaderProps {
  courseId: string;
}

export function MaterialUploader({ courseId }: MaterialUploaderProps) {
  const {
    materials,
    isUploading,
    uploadMaterial,
    deleteMaterial,
    loadMaterials
  } = useCourseMaterials(courseId);

  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await uploadMaterial(file);
      await loadMaterials();
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const handleDelete = async (path: string) => {
    try {
      await deleteMaterial(path);
      await loadMaterials();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label
          htmlFor="file-upload"
          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-secondary/50 ${
            isUploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              <Progress value={uploadProgress} className="w-48 h-2" />
              <span className="text-sm text-muted-foreground">Uploading...</span>
            </div>
          ) : (
            <>
              <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Click to upload or drag and drop
              </span>
              <span className="text-xs text-muted-foreground">
                PDF, DOC, DOCX, PPT, PPTX up to 10MB
              </span>
            </>
          )}
          <Input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            disabled={isUploading}
            accept=".pdf,.doc,.docx,.ppt,.pptx"
          />
        </Label>
      </div>

      <ScrollArea className="h-[300px] w-full rounded-md border">
        <div className="p-4 space-y-2">
          {materials.map((material) => (
            <div
              key={material.path}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/50"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-sm font-medium">{material.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatBytes(material.size)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => window.open(material.url, '_blank')}
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(material.path)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          {materials.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No materials uploaded yet
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}