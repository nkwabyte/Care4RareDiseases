import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bold, Italic, Underline, List, ListOrdered } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';

interface ClinicalNotesProps {
  initialNotes?: string;
  onSaveNote?: (note: string) => void;
}

export function ClinicalNotes({ initialNotes = '', onSaveNote }: ClinicalNotesProps) {
  const [noteContent, setNoteContent] = useState(initialNotes);
  const [prevInitialNotes, setPrevInitialNotes] = useState(initialNotes);

  if (initialNotes !== prevInitialNotes) {
    setPrevInitialNotes(initialNotes);
    setNoteContent(initialNotes);
  }

  const hasChanges = noteContent !== initialNotes;

  const handleSave = () => {
    if (hasChanges && onSaveNote) {
      onSaveNote(noteContent);
    }
  };

  return (
    <Card className="p-5 bg-card border-border h-full flex flex-col">
      <h3 className="mb-4 text-foreground">Clinical Notes</h3>
      
      {/* Toolbar */}
      <div className="flex items-center gap-1 mb-4 pb-3 border-b border-border">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 text-body hover:text-foreground hover:bg-muted"
          title="Bold"
        >
          <Bold size={16} />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 text-body hover:text-foreground hover:bg-muted"
          title="Italic"
        >
          <Italic size={16} />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 text-body hover:text-foreground hover:bg-muted"
          title="Underline"
        >
          <Underline size={16} />
        </Button>
        
        <Separator orientation="vertical" className="h-6 mx-2" />
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 text-body hover:text-foreground hover:bg-muted"
          title="Bullet List"
        >
          <List size={16} />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 text-body hover:text-foreground hover:bg-muted"
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </Button>
      </div>
      
      {/* Text Area */}
      <div className="flex-1 mb-4">
        <Textarea 
          placeholder="Enter clinical notes here..."
          className="h-full min-h-[400px] resize-none bg-surface border-border text-foreground placeholder:text-muted-foreground"
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
        />
      </div>
      
      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          className="bg-primary hover:bg-primary-hover px-6"
          disabled={!hasChanges}
          onClick={handleSave}
        >
          Save Note
        </Button>
      </div>
    </Card>
  );
}
