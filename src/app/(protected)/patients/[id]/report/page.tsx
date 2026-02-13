'use client';

import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { ArrowLeft, FileText, Bot, Send, User, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useState, useRef, useEffect } from 'react';
import { addChatMessage } from '@/lib/store/slices/patientSlice';
import { chatWithAIAction } from '@/lib/actions/gemini';
import { toast } from 'sonner';

export default function PatientReportPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { currentReport, chatHistory, selectedPatientId } = useAppSelector((state) => state.patient);
    const [input, setInput] = useState('');
    const [isSending, setIsSending] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    // Redirect if no report exists
    useEffect(() => {
        if (!currentReport) {
            router.push('/patients');
        }
    }, [currentReport, router]);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        if (scrollAreaRef.current) {
            const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }
    }, [chatHistory]);

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMsg = {
            id: Date.now().toString(),
            role: 'user' as const,
            text: input
        };

        dispatch(addChatMessage(userMsg));
        setInput('');
        setIsSending(true);

        try {
            // Prepare history for API
            const historyForApi = chatHistory.map(m => ({
                role: m.role,
                parts: m.text
            }));

            // Add current user message to context logic if needed, 
            // but chatWithAIAction takes history + new message.

            // Pass report as context if it's the first message or to keep context fresh
            // Ideally, the AI action handles context window.
            const context = `Here is the generated medical report you are discussing:\n${currentReport}`;

            const result = await chatWithAIAction(historyForApi, userMsg.text, context);

            if (result.success && result.reply) {
                const aiMsg = {
                    id: (Date.now() + 1).toString(),
                    role: 'model' as const,
                    text: result.reply
                };
                dispatch(addChatMessage(aiMsg));
            } else {
                toast.error('Error', {
                    description: result.error || 'Failed to get response.',
                });
            }
        } catch (error) {
            console.error(error);
            toast.error('Error processing message');
        } finally {
            setIsSending(false);
        }
    };

    if (!currentReport) return null;

    return (
        <div className="h-screen flex flex-col bg-[#0f0a1f] text-slate-200 overflow-hidden">
            {/* Header - Fixed Height */}
            <header className="h-16 border-b border-purple-900/20 bg-[#150d2b] flex items-center px-6 shrink-0 gap-4 z-10 relative">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.back()}
                    className="hover:bg-purple-900/20 text-slate-400 hover:text-white"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        AI Analysis Report
                    </h1>
                    <p className="text-xs text-slate-400">Patient ID: {selectedPatientId}</p>
                </div>
            </header>

            {/* Content Grid - Takes remaining height */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 min-h-0 text-slate-200">
                {/* Left: Report View - Independent Scroll */}
                <div className="border-r border-purple-900/20 flex flex-col h-full min-h-0 bg-[#130d25]">
                    <div className="p-4 border-b border-purple-900/10 bg-[#1a1233]/50 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-2 text-sm font-medium text-purple-300">
                            <FileText className="w-4 h-4" />
                            Generated Report
                        </div>
                    </div>
                    <ScrollArea className="flex-1 h-full">
                        <div className="p-10 mb-20 prose prose-invert prose-purple max-w-none">
                            <ReactMarkdown>{currentReport}</ReactMarkdown>
                        </div>
                    </ScrollArea>
                </div>

                {/* Right: Chat Interface - Independent Scroll */}
                <div className="flex flex-col h-full min-h-0 bg-[#0f0a1f]">
                    <div className="p-4 border-b border-purple-900/10 bg-[#1a1233]/50 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-2 text-sm font-medium text-emerald-300">
                            <Bot className="w-4 h-4" />
                            AI Assistant
                        </div>
                    </div>

                    <div className="flex-1 min-h-0 relative">
                        <ScrollArea className="h-full">
                            <div className="p-6 space-y-6 pb-4">
                                {chatHistory.length === 0 && (
                                    <div className="flex flex-col items-center justify-center h-64 text-slate-500 opacity-60">
                                        <Bot className="w-12 h-12 mb-4" />
                                        <p>Ask questions about the report above.</p>
                                    </div>
                                )}

                                {chatHistory.map((msg) => (
                                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[85%] rounded-2xl px-5 py-3 shadow-sm ${msg.role === 'user'
                                            ? 'bg-purple-600 text-white rounded-br-sm'
                                            : 'bg-slate-800 text-slate-200 rounded-bl-sm'
                                            }`}>
                                            <div className="prose prose-invert prose-sm">
                                                <ReactMarkdown>{msg.text}</ReactMarkdown>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {isSending && (
                                    <div className="flex justify-start">
                                        <div className="bg-slate-800 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-2">
                                            <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-100"></div>
                                            <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-200"></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </div>

                    <div className="p-4 border-t border-purple-900/20 bg-[#150d2b] shrink-0 z-10">
                        <form
                            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                            className="flex gap-2 relative"
                        >
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask a follow-up question..."
                                className="flex-1 bg-[#1e163b] border-purple-900/30 text-white focus:border-purple-500 rounded-xl pr-12 py-6"
                                disabled={isSending}
                            />
                            <Button
                                type="submit"
                                size="icon"
                                disabled={!input.trim() || isSending}
                                className="absolute right-1.5 top-1.5 h-9 w-9 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
