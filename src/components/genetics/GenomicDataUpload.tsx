import { Card } from '@/components/ui/card';
import { Upload } from 'lucide-react';
import { useState } from 'react';

interface GenomicDataUploadProps {
  genomicFile?: string;
}

export function GenomicDataUpload({ genomicFile }: GenomicDataUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(genomicFile || null);
  const [prevGenomicFile, setPrevGenomicFile] = useState<string | undefined>(genomicFile);

  // Update uploaded file when patient changes
  if (genomicFile !== prevGenomicFile) {
    setPrevGenomicFile(genomicFile);
    setUploadedFile(genomicFile || null);
  }

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
      <h3 className="mb-4 text-foreground">Genomic Data</h3>
      
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging 
            ? 'border-primary bg-muted' 
            : 'border-border bg-surface'
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
              isDragging ? 'bg-muted' : 'bg-muted'
            }`}>
              <Upload className={isDragging ? 'text-primary' : 'text-muted-foreground'} size={20} />
            </div>
            
            {uploadedFile ? (
              <div>
                <p className="text-foreground mb-1">File uploaded:</p>
                <p className="text-primary">{uploadedFile}</p>
                <p className="text-muted-foreground mt-2">Click or drag to replace</p>
              </div>
            ) : (
              <div>
                <p className="text-foreground mb-1">
                  Drag & drop VCF, BED, or TXT file here
                </p>
                <p className="text-muted-foreground">or click to browse</p>
              </div>
            )}
          </div>
        </label>
      </div>
      
      <div className="mt-3 text-muted-foreground">
        <p>Supported formats: VCF, BED, TXT</p>
        <p>Maximum file size: 500 MB</p>
      </div>
    </Card>
  );
}
