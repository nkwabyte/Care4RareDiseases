'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { generateReportAction, chatWithAIAction } from '@/lib/actions/gemini';
import { Bot, User, Send, FileText, Sparkles, RefreshCw, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';

interface AIReportGeneratorProps {
    patientId: string;
    patientData?: any;
}

interface Message {
    id: string;
    role: 'user' | 'model';
    text: string;
}

export function AIReportGenerator({ patientId, patientData }: AIReportGeneratorProps) {
    const [report, setReport] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isSending, setIsSending] = useState(false);

    const handleGenerateReport = async () => {
        if (!patientId) return;

        setIsGenerating(true);
        setReport(null);
        setMessages([]);

        try {
            const result = await generateReportAction(patientId);

            if (result.success && result.report) {
                setReport(result.report);
                toast.success('Analysis complete', {
                    description: 'Genomic report generated successfully.',
                });
            } else {
                toast.error('Generation failed', {
                    description: result.error || 'Failed to generate report.',
                });
            }
        } catch (error) {
            toast.error('Error', {
                description: 'An unexpected error occurred.',
            });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            text: input
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsSending(true);

        try {
            // Prepare history for API
            const historyForApi = messages.map(m => ({
                role: m.role,
                parts: m.text
            }));

            // Pass report as context if first message
            const context = messages.length === 0 ? `Here is the generated report for context:\n${report}` : undefined;

            const result = await chatWithAIAction(historyForApi, userMsg.text, context);

            if (result.success && result.reply) {
                const aiMsg: Message = {
                    id: (Date.now() + 1).toString(),
                    role: 'model',
                    text: result.reply
                };
                setMessages(prev => [...prev, aiMsg]);
            } else {
                toast.error('Error', {
                    description: result.error || 'Failed to get response.',
                });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="flex flex-col h-full space-y-6">
            {!report ? (
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-slate-900/50 rounded-xl border border-dashed border-slate-700">
                    <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mb-6">
                        <Sparkles className="w-8 h-8 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-100 mb-2">Generate AI Analysis Using Gemini 2.5 Pro</h3>
                    <p className="text-slate-400 max-w-md mb-8">
                        Process genomic data, clinical notes, and phenotype information to generate a comprehensive diagnostic report.
                    </p>
                    <Button
                        size="lg"
                        onClick={handleGenerateReport}
                        disabled={isGenerating}
                        className="bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-900/20"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating Report...
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Generate Report
                            </>
                        )}
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full min-h-[500px]">
                    {/* Report View */}
                    <Card className="bg-slate-950/50 border-slate-800 flex flex-col h-[calc(100vh-250px)]">
                        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                            <h3 className="font-semibold text-slate-200 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-purple-400" />
                                Clinical Report
                            </h3>
                            <Button variant="ghost" size="sm" onClick={handleGenerateReport} className="text-slate-400 hover:text-white">
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Regenerate
                            </Button>
                        </div>
                        <ScrollArea className="flex-1 p-6">
                            <div className="prose prose-invert prose-purple max-w-none">
                                <ReactMarkdown>{report}</ReactMarkdown>
                            </div>
                        </ScrollArea>
                    </Card>

                    {/* Chat Interface */}
                    <Card className="bg-slate-950/50 border-slate-800 flex flex-col h-[calc(100vh-250px)]">
                        <div className="p-4 border-b border-slate-800 bg-slate-900/50">
                            <h3 className="font-semibold text-slate-200 flex items-center gap-2">
                                <Bot className="w-4 h-4 text-emerald-400" />
                                AI Assistant
                            </h3>
                        </div>

                        <ScrollArea className="flex-1 p-4">
                            <div className="space-y-4">
                                {messages.length === 0 && (
                                    <div className="text-center text-slate-500 py-10">
                                        <Bot className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                        <p>Ask questions about the report or request further clarification.</p>
                                    </div>
                                )}
                                {messages.map((msg) => (
                                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === 'user'
                                            ? 'bg-purple-600 text-white rounded-br-none'
                                            : 'bg-slate-800 text-slate-200 rounded-bl-none'
                                            }`}>
                                            <div className="prose prose-invert prose-sm">
                                                <ReactMarkdown>{msg.text}</ReactMarkdown>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {isSending && (
                                    <div className="flex justify-start">
                                        <div className="bg-slate-800 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-2">
                                            <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-100"></div>
                                            <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-200"></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>

                        <div className="p-4 bg-slate-900/30 border-t border-slate-800">
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                                className="flex gap-2"
                            >
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask a question..."
                                    className="flex-1 bg-slate-950 border-slate-700 focus:border-purple-500"
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    disabled={!input.trim() || isSending}
                                    className="bg-purple-600 hover:bg-purple-700"
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </form>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
