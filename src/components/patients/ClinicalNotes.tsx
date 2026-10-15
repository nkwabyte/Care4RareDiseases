import { Card } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Bold, Italic, Underline, List, ListOrdered } from 'lucide-react';
import { Separator } from './ui/separator';
import { useState, useEffect } from 'react';

interface ClinicalNotesProps {
  initialNotes?: string;
  onSaveNote?: (note: string) => void;
}

export function ClinicalNotes({ initialNotes = '', onSaveNote }: ClinicalNotesProps) {
  const [noteContent, setNoteContent] = useState(initialNotes);
  const [hasChanges, setHasChanges] = useState(false);

  // Track changes
  useEffect(() => {
    setHasChanges(noteContent !== initialNotes);
  }, [noteContent, initialNotes]);

  const handleSave = () => {
    if (hasChanges && onSaveNote) {
      onSaveNote(noteContent);
      setHasChanges(false);
    }
  };

  return (
    <Card className="p-5 bg-card border-border h-full flex flex-col">
      <h3 className="mb-4 text-slate-100">Clinical Notes</h3>
      
      {/* Toolbar */}
      <div className="flex items-center gap-1 mb-4 pb-3 border-b border-purple-900/20">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 text-slate-300 hover:text-slate-100 hover:bg-purple-900/30"
          title="Bold"
        >
          <Bold size={16} />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 text-slate-300 hover:text-slate-100 hover:bg-purple-900/30"
          title="Italic"
        >
          <Italic size={16} />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 text-slate-300 hover:text-slate-100 hover:bg-purple-900/30"
          title="Underline"
        >
          <Underline size={16} />
        </Button>
        
        <Separator orientation="vertical" className="h-6 mx-2" />
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 text-slate-300 hover:text-slate-100 hover:bg-purple-900/30"
          title="Bullet List"
        >
          <List size={16} />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 text-slate-300 hover:text-slate-100 hover:bg-purple-900/30"
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </Button>
      </div>
      
      {/* Text Area */}
      <div className="flex-1 mb-4">
        <Textarea 
          placeholder="Enter clinical notes here..."
          className="h-full min-h-[400px] resize-none bg-[#2d1b4e] border-purple-900/20 text-slate-200 placeholder:text-slate-500"
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
        />
      </div>
      
      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          className="bg-purple-600 hover:bg-purple-700 px-6"
          disabled={!hasChanges}
          onClick={handleSave}
        >
          Save Note
        </Button>
      </div>
    </Card>
  );
}
