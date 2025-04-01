
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useScoreboard } from '@/context/ScoreboardContext';
import { User, Users, Medal, Calendar, Upload } from 'lucide-react';

const AdminDashboard = () => {
  const { teams, events, publishedScores } = useScoreboard();
  const navigate = useNavigate();

  const totalTeams = teams.length;
  const totalEvents = events.length;
  const totalMedalsAwarded = events.reduce((acc, event) => {
    return acc + event.results.filter(
      r => ['Gold', 'Silver', 'Bronze'].includes(r.placement)
    ).length;
  }, 0);

  const lastPublished = publishedScores.lastUpdated 
    ? new Date(publishedScores.lastUpdated).toLocaleString()
    : 'Never';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teams</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTeams}</div>
            <p className="text-xs text-muted-foreground pt-1">
              Registered participants
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEvents}</div>
            <p className="text-xs text-muted-foreground pt-1">
              Competition events
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medals Awarded</CardTitle>
            <Medal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMedalsAwarded}</div>
            <p className="text-xs text-muted-foreground pt-1">
              Gold, Silver, and Bronze
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Published</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-md font-bold">{lastPublished}</div>
            <p className="text-xs text-muted-foreground pt-1">
              Score publication time
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage the competition data</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin/teams')}
              className="flex flex-col items-center justify-center h-24"
            >
              <Users className="h-8 w-8 mb-2" />
              <span>Manage Teams</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin/events')}
              className="flex flex-col items-center justify-center h-24"
            >
              <Calendar className="h-8 w-8 mb-2" />
              <span>Manage Events</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin/scores')}
              className="flex flex-col items-center justify-center h-24"
            >
              <Medal className="h-8 w-8 mb-2" />
              <span>Update Scores</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin/publish')}
              className="flex flex-col items-center justify-center h-24"
            >
              <Upload className="h-8 w-8 mb-2" />
              <span>Publish Scores</span>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Admin Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <User className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium">Admin User</p>
                <p className="text-sm text-muted-foreground">Administrator</p>
              </div>
            </div>
            <p className="text-sm">
              As an administrator, you have full control over the scoring system. 
              Remember to publish your changes for them to be visible to the public.
            </p>
            <Button variant="outline" className="w-full" onClick={() => navigate('/scoreboard')}>
              View Public Scoreboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
