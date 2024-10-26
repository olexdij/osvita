import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Video, Link, Download, Search, BookOpen } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  type: 'document' | 'video' | 'link';
  url: string;
  description: string;
}

export function ResourceLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [resources] = useState<Resource[]>([
    {
      id: '1',
      title: 'Course Handbook',
      type: 'document',
      url: '#',
      description: 'Complete guide with detailed explanations and examples.'
    },
    {
      id: '2',
      title: 'Video Tutorial: Getting Started',
      type: 'video',
      url: '#',
      description: 'Step-by-step introduction to the course material.'
    },
    {
      id: '3',
      title: 'Additional Reading Materials',
      type: 'link',
      url: '#',
      description: 'Curated list of articles and research papers.'
    }
  ]);

  const filteredResources = resources.filter(resource =>
    resource.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'link':
        return <Link className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Resource Library
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="links">Links</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[400px] mt-4">
            {['all', 'documents', 'videos', 'links'].map((tab) => (
              <TabsContent key={tab} value={tab}>
                <div className="space-y-4">
                  {filteredResources
                    .filter(resource => 
                      tab === 'all' || resource.type === tab.slice(0, -1)
                    )
                    .map((resource) => (
                      <Card key={resource.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                {getIcon(resource.type)}
                                <h4 className="font-medium">{resource.title}</h4>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {resource.description}
                              </p>
                            </div>
                            <Button variant="ghost" size="icon">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            ))}
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
}