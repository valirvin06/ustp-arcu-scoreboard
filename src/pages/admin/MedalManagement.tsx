import React, { useState } from 'react';
import { useScoreboard, MedalType } from '@/context/ScoreboardContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Medal, Trash2 } from 'lucide-react';
import { toast } from "sonner";

const MedalManagement = () => {
  const { teams, events, categories, removeEventResult } = useScoreboard();
  const [activeTab, setActiveTab] = useState<string>('Gold');
  
  // Filter events that have medal results
  const eventsWithMedals = events.filter(event => 
    event.results.some(result => ['Gold', 'Silver', 'Bronze'].includes(result.placement))
  );

  const getTeamNameById = (teamId: string) => {
    const team = teams.find(team => team.id === teamId);
    return team ? team.name : 'Unknown Team';
  };
  
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(category => category.id === categoryId);
    return category ? category.name : 'Unknown Category';
  };

  // Filter events based on selected medal tab
  const filteredEvents = eventsWithMedals.filter(event => 
    event.results.some(result => result.placement === activeTab)
  );

  const handleRemoveMedal = (eventId: string, teamId: string) => {
    removeEventResult(eventId, teamId);
  };

  const getMedalColor = (medal: string) => {
    switch (medal) {
      case 'Gold': return 'bg-secondary text-secondary-foreground';
      case 'Silver': return 'bg-gray-300 text-gray-700';
      case 'Bronze': return 'bg-amber-700 text-white';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Medal Management</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-6">
          {(['Gold', 'Silver', 'Bronze'] as MedalType[]).map((medal) => (
            <TabsTrigger 
              key={medal} 
              value={medal}
              className={`${getMedalColor(medal)}`}
            >
              <div className="flex items-center gap-2">
                <Medal className="h-4 w-4" />
                {medal}
              </div>
            </TabsTrigger>
          ))}
        </TabsList>
        
        {(['Gold', 'Silver', 'Bronze'] as MedalType[]).map((medal) => (
          <TabsContent key={medal} value={medal}>
            <Card>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${getMedalColor(medal)}`}>
                  <Medal /> {medal} Medals
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredEvents.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    No {medal} medals have been awarded yet.
                  </p>
                ) : (
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-4">
                      {filteredEvents.map((event) => {
                        const medalResults = event.results.filter(result => result.placement === medal);
                        return medalResults.map((result) => (
                          <div 
                            key={`${event.id}-${result.teamId}`}
                            className={`p-4 border rounded-lg ${getMedalColor(medal)} bg-opacity-20`}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <h3 className="font-semibold">{event.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {getCategoryName(event.category)}
                                </p>
                                <p className="mt-1">
                                  Winner: <strong>{getTeamNameById(result.teamId)}</strong>
                                </p>
                                <p className="text-sm">
                                  Points: <strong>{result.points}</strong>
                                </p>
                              </div>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Remove Medal</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to remove the {medal} medal from {getTeamNameById(result.teamId)} for {event.name}?
                                      This will update team scores.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleRemoveMedal(event.id, result.teamId)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Remove
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        ));
                      })}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default MedalManagement;
