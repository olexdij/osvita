import { useRef, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from 'jspdf';

interface CertificateProps {
  course: {
    title: string;
    completionDate: string;
    studentName: string;
  };
  onDownloaded?: () => void;
}

export function Certificate({ course, onDownloaded }: CertificateProps) {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  const downloadCertificate = async () => {
    if (!certificateRef.current || !isReady) return;

    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        windowWidth: certificateRef.current.scrollWidth,
        windowHeight: certificateRef.current.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${course.title.replace(/\s+/g, '_')}_Certificate.pdf`);
      onDownloaded?.();
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const formattedDate = new Date(course.completionDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="p-4">
      <div
        ref={certificateRef}
        className="relative w-full aspect-[1.414/1] bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-lg overflow-hidden"
        style={{ minHeight: '500px' }}
      >
        {/* Holographic Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8),transparent)] animate-pulse" />
        
        {/* Rainbow Shimmer Effect */}
        <div 
          className="absolute inset-0 animate-shimmer"
          style={{
            background: 'linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.3) 50%, transparent 75%)',
            backgroundSize: '200% 200%',
            animation: 'shimmer 3s linear infinite'
          }}
        />

        {/* Prismatic Border */}
        <div className="absolute inset-4">
          <div className="absolute inset-0 border-[6px] rounded-lg"
               style={{
                 background: 'linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #8f00ff)',
                 backgroundSize: '200% 200%',
                 animation: 'shimmer 3s linear infinite',
                 opacity: 0.3
               }}
          />
        </div>

        {/* Security Pattern */}
        <div className="absolute inset-0"
             style={{
               backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)`
             }}
        />

        {/* Certificate Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
          <div className="relative space-y-6 backdrop-blur-sm bg-white/30 p-8 rounded-lg">
            {/* Header with Holographic Effect */}
            <div className="relative">
              <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                Certificate of Completion
              </h1>
              <div className="h-1 w-32 mx-auto rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
            </div>

            {/* Main Content */}
            <div className="space-y-4 my-8">
              <p className="text-lg text-gray-700">This is to certify that</p>
              <p className="text-3xl font-serif font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                {course.studentName}
              </p>
              <p className="text-lg text-gray-700">has successfully completed the course</p>
              <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 max-w-md mx-auto">
                {course.title}
              </p>
            </div>

            {/* Date */}
            <div className="mt-8">
              <p className="text-sm text-gray-600">Completed on</p>
              <p className="text-lg font-semibold text-gray-800">{formattedDate}</p>
            </div>

            {/* Signature Line */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-lg font-serif italic bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                ENUM Academy
              </p>
            </div>

            {/* Holographic Seal */}
            <div className="absolute -right-4 bottom-0 w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
              <div className="absolute inset-2 rounded-full animate-spin-slow bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              <span className="text-xs font-bold text-gray-700">ENUM</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <Button onClick={downloadCertificate} disabled={!isReady}>
          <Download className="mr-2 h-4 w-4" />
          Download Certificate
        </Button>
      </div>
    </div>
  );
}