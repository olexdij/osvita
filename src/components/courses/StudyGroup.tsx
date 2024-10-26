import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, MessageSquare, Video, Calendar } from 'lucide-react';

interface StudySession {
  id: string;
  title: string;
  date: string;
  participants: string[];
  status: 'upcoming' | 'ongoing' | 'completed';
}

export function StudyGroup() {
  const [sessions, setSessions] = useState<StudySession[]>([
    {
      id: '1',
      title: 'Group Discussion: Module 1',
      date: '2024-03-20T15:00:00Z',
      participants: ['John D.', 'Sarah M.', 'Mike R.'],
      status: 'upcoming'
    }
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Study Group
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1">
            <Video className="w-4 h-4 mr-2" />
            Join Session
          </Button>
          <Button variant="outline" className="flex-1">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule
          </Button>
          <Button variant="outline" className="flex-1">
            <MessageSquare className="w-4 h-4 mr-2" />
            Chat
          </Button>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Upcoming Sessions</h3>
          <ScrollArea className="h-[300px]">
            {sessions.map((session) => (
              <Card key={session.id} className="mb-4">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{session.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(session.date).toLocaleString()}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Join
                    </Button>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-2">Participants:</p>
                    <div className="flex -space-x-2">
                      {session.participants.map((participant, i) => (
                        <Avatar key={i} className="border-2 border-background">
                          <AvatarFallback>{participant[0]}</AvatarFallback>
                        </Avatar>
                      ))}
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full ml-2"
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Quick Chat</h3>
          <div className="flex gap-2">
            <Input placeholder="Type a message..." />
            <Button>Send</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}