
import React, { useEffect, useState } from 'react';
import { useScoreboard } from '@/context/ScoreboardContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Award, Medal, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const Scoreboard = () => {
  const { publishedScores } = useScoreboard();
  const [activeTab, setActiveTab] = useState('teams');
  const [updatedRecently, setUpdatedRecently] = useState(false);
  const { teams, events, lastUpdated } = publishedScores;
  
  // Sort teams by total points in descending order
  const rankedTeams = [...teams].sort((a, b) => b.totalPoints - a.totalPoints);

  const formatLastUpdated = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  useEffect(() => {
    // Flash animation when scores are updated
    if (lastUpdated) {
      setUpdatedRecently(true);
      const timer = setTimeout(() => {
        setUpdatedRecently(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [lastUpdated]);

  return (
    <div className="container mx-auto py-8">
      <motion.div
        className={`rounded-lg p-6 mb-8 ${updatedRecently ? 'bg-green-100 dark:bg-green-900' : 'bg-muted'}`}
        animate={updatedRecently ? { scale: [1, 1.02, 1] } : {}}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Live Scoreboard</h1>
            <p className="text-muted-foreground">
              Last updated: {formatLastUpdated(lastUpdated)}
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center">
            <Badge variant="outline" className="bg-ustp-gold text-ustp px-3 py-1.5 text-sm font-semibold">
              USTP ArCu Days 2025
            </Badge>
          </div>
        </div>
      </motion.div>

      <Tabs defaultValue="teams" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
          <TabsTrigger value="teams" className="flex items-center gap-2">
            <Award className="h-4 w-4" /> Team Rankings
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Event Results
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="teams" className="space-y-4">
          {rankedTeams.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No teams have been added yet.</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {rankedTeams.map((team, index) => (
                  <motion.div
                    key={team.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`overflow-hidden ${index < 3 ? 'border-ustp-gold' : ''}`}>
                      <CardHeader className="bg-muted pb-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${index === 0 ? 'bg-secondary text-secondary-foreground' : index === 1 ? 'bg-gray-300 text-gray-700' : index === 2 ? 'bg-amber-700 text-white' : 'bg-muted-foreground text-muted'}`}>
                              <span className="font-bold">{index + 1}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {team.logo ? (
                                <img 
                                  src={team.logo} 
                                  alt={`${team.name} logo`}
                                  className="w-8 h-8 object-cover rounded-full"
                                />
                              ) : (
                                <div className="w-8 h-8 bg-primary/10 rounded-full" />
                              )}
                              <CardTitle>{team.name}</CardTitle>
                            </div>
                          </div>
                          <div className="text-2xl font-bold">{team.totalPoints} pts</div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="flex flex-wrap gap-2 justify-center">
                          <div className="flex items-center gap-1 medal-gold rounded-full px-3 py-1">
                            <Medal className="w-4 h-4" />
                            <span>{team.medals.Gold}</span>
                          </div>
                          <div className="flex items-center gap-1 medal-silver rounded-full px-3 py-1">
                            <Medal className="w-4 h-4" />
                            <span>{team.medals.Silver}</span>
                          </div>
                          <div className="flex items-center gap-1 medal-bronze rounded-full px-3 py-1">
                            <Medal className="w-4 h-4" />
                            <span>{team.medals.Bronze}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="events">
          {events.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No events have been added yet.</p>
              </CardContent>
            </Card>
          ) : (
            <ScrollArea className="h-[60vh] rounded-md border p-4">
              <div className="space-y-8 pb-8">
                {events.map((event) => (
                  <Card key={event.id}>
                    <CardHeader>
                      <CardTitle>{event.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {event.results.length === 0 ? (
                        <p className="text-center text-muted-foreground">No results recorded yet.</p>
                      ) : (
                        <div className="space-y-2">
                          {['Gold', 'Silver', 'Bronze'].map((medal) => {
                            const result = event.results.find(r => r.placement === medal);
                            if (!result) return null;
                            
                            const team = teams.find(t => t.id === result.teamId);
                            if (!team) return null;
                            
                            return (
                              <div 
                                key={`${event.id}-${medal}`} 
                                className={`flex items-center justify-between p-2 rounded ${
                                  medal === 'Gold' ? 'medal-gold' : 
                                  medal === 'Silver' ? 'medal-silver' : 'medal-bronze'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <Medal className="h-5 w-5" />
                                  <span>{medal}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {team.logo && (
                                    <img 
                                      src={team.logo} 
                                      alt={`${team.name} logo`}
                                      className="w-6 h-6 object-cover rounded-full"
                                    />
                                  )}
                                  <span>{team.name}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Scoreboard;
