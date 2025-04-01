import React, { useState } from 'react';
import { useScoreboard, MedalType } from '@/context/ScoreboardContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from "sonner";

const ScoreManagement = () => {
  const { teams, events, categories, updateEventResult } = useScoreboard();
  const [activeCategory, setActiveCategory] = useState<string | null>(categories[0]?.id || null);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  
  const handlePlacementChange = (teamId: string, placement: MedalType) => {
    if (!selectedEvent) {
      toast.error('Please select an event first');
      return;
    }
    
    updateEventResult(selectedEvent, teamId, placement);
  };

  const getTeamResultForEvent = (teamId: string) => {
    if (!selectedEvent) return null;
    
    const event = events.find(e => e.id === selectedEvent);
    if (!event) return null;
    
    return event.results.find(r => r.teamId === teamId) || null;
  };

  const filteredEvents = activeCategory
    ? events.filter(event => event.category === activeCategory)
    : [];
  
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Score Management</h2>

      {categories.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground py-8">
              No categories have been added yet. Please add categories and events first.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Tabs 
          value={activeCategory || ''}
          onValueChange={(value) => {
            setActiveCategory(value);
            setSelectedEvent(null);
          }}
          className="space-y-6"
        >
          <TabsList className="flex overflow-x-auto flex-nowrap">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Select Event</CardTitle>
                </CardHeader>
                <CardContent>
                  {filteredEvents.length === 0 ? (
                    <p className="text-muted-foreground">No events in this category yet.</p>
                  ) : (
                    <Select
                      value={selectedEvent || ''}
                      onValueChange={setSelectedEvent}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an event" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredEvents.map((event) => (
                          <SelectItem key={event.id} value={event.id}>
                            {event.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </CardContent>
              </Card>
              
              {selectedEvent && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Assign Results</span>
                      <Badge variant="outline">
                        {events.find(e => e.id === selectedEvent)?.name || 'Event'}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {teams.length === 0 ? (
                      <p className="text-center text-muted-foreground py-4">
                        No teams available. Please add teams first.
                      </p>
                    ) : (
                      <ScrollArea className="h-[500px]">
                        <div className="space-y-4">
                          {teams.map((team) => {
                            const result = getTeamResultForEvent(team.id);
                            return (
                              <div key={team.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center gap-3">
                                  {team.logo && (
                                    <img 
                                      src={team.logo} 
                                      alt={`${team.name} logo`}
                                      className="w-8 h-8 object-cover rounded-full"
                                    />
                                  )}
                                  <span className="font-medium">{team.name}</span>
                                </div>
                                <div className="flex gap-2">
                                  {(['Gold', 'Silver', 'Bronze', 'Non-winner', 'No Entry'] as MedalType[]).map((placement) => (
                                    <Button
                                      key={placement}
                                      size="sm"
                                      variant={result?.placement === placement ? "default" : "outline"}
                                      className={
                                        result?.placement === placement
                                          ? placement === 'Gold' 
                                            ? 'bg-secondary text-secondary-foreground'
                                            : placement === 'Silver' 
                                            ? 'bg-gray-300 text-gray-700'
                                            : placement === 'Bronze'
                                            ? 'bg-amber-700 text-white'
                                            : ''
                                          : ''
                                      }
                                      onClick={() => handlePlacementChange(team.id, placement)}
                                    >
                                      {placement}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </ScrollArea>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
};

export default ScoreManagement;
