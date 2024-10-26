import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Medal, Star, Zap } from "lucide-react";

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar?: string;
  score: number;
  rank: number;
  badges: string[];
  streak: number;
}

export function Leaderboard() {
  const [period, setPeriod] = useState("week");
  const [leaderboard] = useState<LeaderboardEntry[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      score: 2840,
      rank: 1,
      badges: ["speed-learner", "perfect-score", "helper"],
      streak: 15
    },
    // Add more entries...
  ]);

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case "speed-learner":
        return <Zap className="w-3 h-3" />;
      case "perfect-score":
        return <Star className="w-3 h-3" />;
      case "helper":
        return <Medal className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="week" className="space-y-4">
          <TabsList>
            <TabsTrigger value="day">Today</TabsTrigger>
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="month">This Month</TabsTrigger>
          </TabsList>

          <TabsContent value="week" className="space-y-4">
            {leaderboard.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-4 rounded-lg bg-muted"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                    {entry.rank}
                  </div>
                  <Avatar>
                    <AvatarImage src={entry.avatar} />
                    <AvatarFallback>{entry.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{entry.name}</div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Zap className="w-3 h-3" />
                      {entry.streak} day streak
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex gap-1">
                    {entry.badges.map((badge) => (
                      <Badge key={badge} variant="secondary" className="px-2">
                        {getBadgeIcon(badge)}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-xl font-bold">{entry.score}</div>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}