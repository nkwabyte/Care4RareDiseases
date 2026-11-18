'use client';

import { useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, AlertTriangle, CheckCircle2, X, Download } from 'lucide-react';

const REQUIRED_COLUMNS = ['Patient_ID', 'Phenotype_HPO_ID', 'Gene_Symbol'] as const;
const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPTED = ['.csv', '.tsv', '.txt'];

export type ParsedGenotypePhenotypeFile = {
    fileName: string;
    headers: string[];
    rows: string[][];
};

type ParseResult =
    | { ok: true; file: ParsedGenotypePhenotypeFile; missing: string[]; otherPatients: string[] }
    | { ok: false; error: string };

/** Minimal delimited-text parser: handles quoted fields, escaped quotes, CRLF. */
function parseDelimited(text: string, delimiter: string): string[][] {
    const rows: string[][] = [];
    let row: string[] = [];
    let field = '';
    let quoted = false;
    for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (quoted) {
            if (ch === '"' && text[i + 1] === '"') { field += '"'; i++; }
            else if (ch === '"') quoted = false;
            else field += ch;
        } else if (ch === '"') quoted = true;
        else if (ch === delimiter) { row.push(field); field = ''; }
        else if (ch === '\n' || ch === '\r') {
            if (ch === '\r' && text[i + 1] === '\n') i++;
            row.push(field); field = '';
            if (row.some((c) => c.trim() !== '')) rows.push(row);
            row = [];
        } else field += ch;
    }
    row.push(field);
    if (row.some((c) => c.trim() !== '')) rows.push(row);
    return rows;
}

async function parseFile(file: File, patientId?: string): Promise<ParseResult> {
    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (!ACCEPTED.includes(ext)) return { ok: false, error: 'Unsupported file type. Use a .csv, .tsv or .txt file.' };
    if (file.size > MAX_BYTES) return { ok: false, error: 'File is larger than 5 MB.' };

    const text = await file.text();
    const firstLine = text.slice(0, text.indexOf('\n') === -1 ? undefined : text.indexOf('\n'));
    const delimiter = ext === '.tsv' || firstLine.includes('\t') ? '\t' : ',';
    const [headers = [], ...rows] = parseDelimited(text, delimiter);
    if (headers.length === 0) return { ok: false, error: 'The file is empty.' };

    const trimmed = headers.map((h) => h.trim());
    const missing = REQUIRED_COLUMNS.filter((c) => !trimmed.includes(c));
    const idCol = trimmed.indexOf('Patient_ID');
    const otherPatients =
        idCol >= 0 && patientId
            ? [...new Set(rows.map((r) => r[idCol]?.trim()).filter((id) => id && id !== patientId))]
            : [];

    return { ok: true, file: { fileName: file.name, headers: trimmed, rows }, missing, otherPatients };
}

interface GenotypePhenotypeUploadProps {
    /** The patient this file should describe; used to flag rows for other patients. */
    patientId?: string;
    onParsed?: (file: ParsedGenotypePhenotypeFile | null) => void;
}

/**
 * Reads a genotype/phenotype table in the browser and shows a validated preview.
 * Nothing is uploaded or stored: there is no server-side ingestion yet, and the UI says so.
 */
export function GenotypePhenotypeUpload({ patientId, onParsed }: GenotypePhenotypeUploadProps) {
    const [result, setResult] = useState<ParseResult | null>(null);
    const [isReading, setIsReading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = async (file: File | undefined) => {
        if (!file) return;
        setIsReading(true);
        const parsed = await parseFile(file, patientId).catch(
            (): ParseResult => ({ ok: false, error: 'The file could not be read.' })
        );
        setIsReading(false);
        setResult(parsed);
        onParsed?.(parsed.ok ? parsed.file : null);
    };

    const clear = () => {
        setResult(null);
        onParsed?.(null);
        if (inputRef.current) inputRef.current.value = '';
    };

    const ok = result?.ok ? result : null;

    return (
        <Card className="p-5 bg-card border-border">
            <div className="mb-4 flex items-center justify-between gap-2">
                <h3 className="text-slate-100">Genotype / phenotype file</h3>
                <a
                    href="/genotype_phenotype_template.csv"
                    download
                    className="text-xs text-purple-300 hover:text-purple-200 inline-flex items-center gap-1"
                >
                    <Download className="w-3.5 h-3.5" aria-hidden /> Template
                </a>
            </div>

            <input
                ref={inputRef}
                id="genotype-file"
                type="file"
                accept={ACCEPTED.join(',')}
                className="sr-only"
                onChange={(e) => handleFile(e.target.files?.[0])}
            />

            {!result ? (
                <div
                    className="bg-surface/50 border-2 border-dashed border-purple-900/40 rounded-lg p-6 flex flex-col items-center text-center"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                        e.preventDefault();
                        handleFile(e.dataTransfer.files?.[0]);
                    }}
                >
                    <FileText className="w-8 h-8 text-purple-400 mb-3" aria-hidden />
                    <p className="text-slate-200 font-medium">No file attached</p>
                    <p className="text-muted-foreground text-sm mb-4 max-w-xs">
                        Drop a .csv/.tsv file here or choose one. Required columns: {REQUIRED_COLUMNS.join(', ')}.
                    </p>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => inputRef.current?.click()}
                        disabled={isReading}
                        className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                    >
                        <Upload className="w-4 h-4 mr-2" aria-hidden />
                        {isReading ? 'Reading…' : 'Choose file'}
                    </Button>
                </div>
            ) : (
                <div className="space-y-3" aria-live="polite">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2 min-w-0">
                            {ok && ok.missing.length === 0 && ok.otherPatients.length === 0 ? (
                                <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" aria-hidden />
                            ) : (
                                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" aria-hidden />
                            )}
                            <div className="min-w-0">
                                {ok ? (
                                    <>
                                        <p className="text-slate-100 truncate">{ok.file.fileName}</p>
                                        <p className="text-muted-foreground text-sm">
                                            {ok.file.rows.length} rows · {ok.file.headers.length} columns
                                        </p>
                                    </>
                                ) : (
                                    <p className="text-amber-300">{result.ok ? null : result.error}</p>
                                )}
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={clear} aria-label="Remove file">
                            <X className="w-4 h-4" aria-hidden />
                        </Button>
                    </div>

                    {ok && ok.missing.length > 0 && (
                        <p className="text-sm text-amber-300">Missing required column(s): {ok.missing.join(', ')}</p>
                    )}
                    {ok && ok.otherPatients.length > 0 && (
                        <p className="text-sm text-amber-300">
                            Contains rows for other patients ({ok.otherPatients.slice(0, 3).join(', ')}
                            {ok.otherPatients.length > 3 ? '…' : ''}). Check you selected the right file.
                        </p>
                    )}

                    {ok && ok.file.rows.length > 0 && (
                        <div className="overflow-x-auto rounded-md border border-border">
                            <table className="w-full text-xs">
                                <caption className="sr-only">First rows of {ok.file.fileName}</caption>
                                <thead className="bg-surface/60 text-slate-300">
                                    <tr>
                                        {ok.file.headers.map((h) => (
                                            <th key={h} scope="col" className="px-2 py-1.5 text-left font-medium whitespace-nowrap">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="text-slate-200">
                                    {ok.file.rows.slice(0, 3).map((r, i) => (
                                        <tr key={i} className="border-t border-border">
                                            {ok.file.headers.map((_, j) => (
                                                <td key={j} className="px-2 py-1.5 whitespace-nowrap">{r[j]}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <p className="text-xs text-muted-foreground">
                        Previewed in your browser only. The file is not uploaded or saved to the patient record.
                    </p>
                </div>
            )}
        </Card>
    );
}
