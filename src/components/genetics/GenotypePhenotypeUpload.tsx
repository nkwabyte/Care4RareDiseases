'use client';

import { useState, useRef } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Upload, FileText, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface GenotypePhenotypeUploadProps {
    onUpload?: (file: File) => void;
}

export function GenotypePhenotypeUpload({ onUpload }: GenotypePhenotypeUploadProps) {
    const [fileName, setFileName] = useState<string>('default_genotype_phenotype.csv');
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.name.endsWith('.csv') || file.name.endsWith('.tsv') || file.name.endsWith('.txt')) {
                setFileName(file.name);
                handleUploadProcess(file);
            } else {
                toast.error('Invalid file format', {
                    description: 'Please upload a CSV, TSV, or TXT file.'
                });
            }
        }
    };

    const handleUploadProcess = (file: File) => {
        setIsUploading(true);
        // Simulate upload delay
        setTimeout(() => {
            setIsUploading(false);
            toast.success('File uploaded successfully', {
                description: `${file.name} has been processed.`
            });
            if (onUpload) {
                onUpload(file);
            }
        }, 1500);
    };

    const triggerFileUpload = () => {
        fileInputRef.current?.click();
    };

    return (
        <Card className="p-5 bg-card border-border">
            <h3 className="mb-4 text-slate-100 flex items-center justify-between">
                <span>Genomic Data Upload</span>
                <span className="text-xs font-normal text-slate-400 bg-slate-800 px-2 py-1 rounded">Supported: .csv, .tsv, .txt</span>
            </h3>

            <div className="bg-[#2d1b4e]/50 border-2 border-dashed border-purple-900/40 rounded-lg p-6 flex flex-col items-center justify-center text-center transition-all hover:border-purple-500/40 hover:bg-[#2d1b4e]/70">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".csv,.tsv,.txt"
                    className="hidden"
                />

                <div className="mb-4 p-3 bg-purple-600/20 rounded-full">
                    {isUploading ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400"></div>
                    ) : (
                        <FileText className="w-8 h-8 text-purple-400" />
                    )}
                </div>

                <h4 className="text-slate-200 font-medium mb-1">
                    {fileName || 'Upload Genotype/Phenotype Data'}
                </h4>

                <p className="text-slate-400 text-sm mb-4 max-w-xs">
                    {fileName === 'default_genotype_phenotype.csv'
                        ? 'Using default Parkinson\'s disease dataset'
                        : 'Custom dataset loaded'}
                </p>

                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={triggerFileUpload}
                        disabled={isUploading}
                        className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                    >
                        <Upload className="w-4 h-4 mr-2" />
                        {fileName ? 'Change File' : 'Select File'}
                    </Button>

                    {fileName && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-slate-400 hover:text-slate-200"
                            onClick={() => {
                                window.open('/default_genotype_phenotype.csv', '_blank');
                            }}
                        >
                            View Template
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    );
}
