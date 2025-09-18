import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Clock, User } from 'lucide-react';

interface Note {
  id: string;
  userName: string;
  timestamp: Date;
  text: string;
  queryType: string;
}

export const UltimateCustomerSupportNotepad = () => {
  const [queryType, setQueryType] = useState<string>('');
  const [currentNote, setCurrentNote] = useState<string>('');
  const [notesHistory, setNotesHistory] = useState<Note[]>([]);

  const handleAddNote = () => {
    if (!currentNote.trim() || !queryType) return;

    const newNote: Note = {
      id: Date.now().toString(),
      userName: 'Support Agent', // In a real app, this would come from auth
      timestamp: new Date(),
      text: currentNote.trim(),
      queryType
    };

    setNotesHistory([newNote, ...notesHistory]);
    setCurrentNote('');
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Ultimate Customer Support Notepad
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Query Type Section */}
        <div className="space-y-2">
          <Label htmlFor="query-type" className="text-sm font-medium">
            Query Type
          </Label>
          <Select value={queryType} onValueChange={setQueryType}>
            <SelectTrigger id="query-type" className="w-full">
              <SelectValue placeholder="Select query type" />
            </SelectTrigger>
            <SelectContent className="bg-background">
              <SelectItem value="billing">Billing</SelectItem>
              <SelectItem value="technical">Technical issue</SelectItem>
              <SelectItem value="complaint">Complaint</SelectItem>
              <SelectItem value="general">General inquiry</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Internal Note Section */}
        <div className="space-y-3">
          <Label htmlFor="internal-note" className="text-sm font-medium">
            Internal Note
          </Label>
          <Textarea
            id="internal-note"
            placeholder="Write your note here..."
            value={currentNote}
            onChange={(e) => setCurrentNote(e.target.value)}
            className="min-h-[120px] resize-none"
          />
          <Button 
            onClick={handleAddNote}
            disabled={!currentNote.trim() || !queryType}
            className="w-full sm:w-auto"
          >
            Add Note
          </Button>
        </div>

        <Separator />

        {/* Notes History Section */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Notes History</Label>
          <Card className="border-muted">
            <CardContent className="p-4">
              {notesHistory.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No notes added yet</p>
                </div>
              ) : (
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-4">
                    {notesHistory.map((note, index) => (
                      <div 
                        key={note.id}
                        className="border border-border rounded-lg p-4 bg-card/50"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="h-3 w-3" />
                            <span className="font-medium">{note.userName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{formatDateTime(note.timestamp)}</span>
                          </div>
                        </div>
                        <div className="mb-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary">
                            {note.queryType}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed">{note.text}</p>
                        {index < notesHistory.length - 1 && (
                          <div className="mt-4 border-b border-muted" />
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};