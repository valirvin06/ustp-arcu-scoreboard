
import React from 'react';
import { useScoreboard } from '@/context/ScoreboardContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Clock } from 'lucide-react';

const PublishScores = () => {
  const { publishScores, publishedScores, teams, events } = useScoreboard();
  
  const handlePublish = () => {
    publishScores();
  };
  
  const formatLastUpdated = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  // Check if there are unpublished changes
  const hasUnpublishedChanges = () => {
    // Check if published scores exist
    if (!publishedScores.teams.length && !publishedScores.events.length) {
      return teams.length > 0 || events.length > 0;
    }
    
    // Compare team counts
    if (teams.length !== publishedScores.teams.length) {
      return true;
    }
    
    // Compare event counts
    if (events.length !== publishedScores.events.length) {
      return true;
    }
    
    // Compare team total points (basic comparison to detect changes)
    const teamPointsChanged = teams.some(team => {
      const publishedTeam = publishedScores.teams.find(t => t.id === team.id);
      return !publishedTeam || publishedTeam.totalPoints !== team.totalPoints;
    });
    
    if (teamPointsChanged) {
      return true;
    }
    
    // Compare event results counts (basic comparison to detect changes)
    const eventResultsChanged = events.some(event => {
      const publishedEvent = publishedScores.events.find(e => e.id === event.id);
      return !publishedEvent || publishedEvent.results.length !== event.results.length;
    });
    
    return eventResultsChanged;
  };
  
  const unpublishedChanges = hasUnpublishedChanges();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Publish Scores</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Publish Current Scores</CardTitle>
          <CardDescription>
            Make the current scores and results visible to the public
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Last published: {formatLastUpdated(publishedScores.lastUpdated)}</span>
          </div>
          
          {unpublishedChanges && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md">
              <p className="text-yellow-600 dark:text-yellow-400 font-medium">
                You have unpublished changes
              </p>
              <p className="text-sm text-yellow-600 dark:text-yellow-400 opacity-80">
                Changes made to teams, events, or scores won't be visible to the public until you publish them.
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            <div className="p-4 border rounded-md">
              <h3 className="font-medium mb-2">Current Data</h3>
              <p>Teams: {teams.length}</p>
              <p>Events: {events.length}</p>
              <p>Results: {events.reduce((acc, event) => acc + event.results.length, 0)}</p>
            </div>
            
            <div className="p-4 border rounded-md">
              <h3 className="font-medium mb-2">Published Data</h3>
              <p>Teams: {publishedScores.teams.length}</p>
              <p>Events: {publishedScores.events.length}</p>
              <p>Results: {publishedScores.events.reduce((acc, event) => acc + event.results.length, 0)}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handlePublish} 
            className="w-full"
            disabled={!unpublishedChanges}
          >
            <Upload className="h-4 w-4 mr-2" />
            {unpublishedChanges ? 'Publish Updated Scores' : 'No Changes to Publish'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PublishScores;
