import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TestimonialCardProps {
  content: string;
  author: string;
  role: string;
  avatar: string;
}

export function TestimonialCard({ content, author, role, avatar }: TestimonialCardProps) {
  return (
    <Card className="bg-card">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <p className="text-muted-foreground italic">&ldquo;{content}&rdquo;</p>
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={avatar} alt={author} />
              <AvatarFallback>{author[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{author}</p>
              <p className="text-sm text-muted-foreground">{role}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}