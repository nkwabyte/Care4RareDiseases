import { Card } from './ui/card';
import { Upload } from 'lucide-react';
import { useState, useEffect } from 'react';

interface GenomicDataUploadProps {
  genomicFile?: string;
}

export function GenomicDataUpload({ genomicFile }: GenomicDataUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(genomicFile || null);

  // Update uploaded file when patient changes
  useEffect(() => {
    setUploadedFile(genomicFile || null);
  }, [genomicFile]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setUploadedFile(files[0].name);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setUploadedFile(files[0].name);
    }
  };

  return (
    <Card className="p-5 bg-card border-border">
      <h3 className="mb-4 text-slate-100">Genomic Data</h3>
      
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging 
            ? 'border-purple-500 bg-purple-900/20' 
            : 'border-purple-900/20 bg-[#2d1b4e]'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".vcf,.bed,.txt"
          onChange={handleFileSelect}
        />
        
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="flex flex-col items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isDragging ? 'bg-purple-500/20' : 'bg-purple-900/30'
            }`}>
              <Upload className={isDragging ? 'text-purple-400' : 'text-slate-400'} size={20} />
            </div>
            
            {uploadedFile ? (
              <div>
                <p className="text-slate-200 mb-1">File uploaded:</p>
                <p className="text-purple-400">{uploadedFile}</p>
                <p className="text-slate-400 mt-2">Click or drag to replace</p>
              </div>
            ) : (
              <div>
                <p className="text-slate-200 mb-1">
                  Drag & drop VCF, BED, or TXT file here
                </p>
                <p className="text-slate-400">or click to browse</p>
              </div>
            )}
          </div>
        </label>
      </div>
      
      <div className="mt-3 text-slate-400">
        <p>Supported formats: VCF, BED, TXT</p>
        <p>Maximum file size: 500 MB</p>
      </div>
    </Card>
  );
}
