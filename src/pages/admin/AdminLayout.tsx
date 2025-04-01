
import React from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Users, Medal, Calendar, Upload, BarChart3 } from 'lucide-react';

const AdminLayout = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Get the current active tab based on pathname
  const getCurrentTab = () => {
    const path = location.pathname;
    if (path.includes('/admin/teams')) return '/admin/teams';
    if (path.includes('/admin/medals')) return '/admin/medals';
    if (path.includes('/admin/events')) return '/admin/events';
    if (path.includes('/admin/scores')) return '/admin/scores';
    if (path.includes('/admin/publish')) return '/admin/publish';
    return '/admin';
  };

  const currentTab = getCurrentTab();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">Admin Control Panel</h1>
      <p className="text-muted-foreground mb-8">Manage the competition scores and teams</p>
      
      <Card className="mb-8">
        <Tabs value={currentTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
            <TabsTrigger value="/admin/scores" asChild>
              <Link to="/admin/scores" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" /> 
                <span className="hidden sm:inline">Score Management</span>
                <span className="sm:hidden">Scores</span>
              </Link>
            </TabsTrigger>
            <TabsTrigger value="/admin/medals" asChild>
              <Link to="/admin/medals" className="flex items-center gap-2">
                <Medal className="h-4 w-4" /> 
                <span className="hidden sm:inline">Medal Management</span>
                <span className="sm:hidden">Medals</span>
              </Link>
            </TabsTrigger>
            <TabsTrigger value="/admin/teams" asChild>
              <Link to="/admin/teams" className="flex items-center gap-2">
                <Users className="h-4 w-4" /> 
                <span className="hidden sm:inline">Team Management</span>
                <span className="sm:hidden">Teams</span>
              </Link>
            </TabsTrigger>
            <TabsTrigger value="/admin/events" asChild>
              <Link to="/admin/events" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" /> 
                <span className="hidden sm:inline">Event Management</span>
                <span className="sm:hidden">Events</span>
              </Link>
            </TabsTrigger>
            <TabsTrigger value="/admin/publish" asChild>
              <Link to="/admin/publish" className="flex items-center gap-2">
                <Upload className="h-4 w-4" /> 
                <span className="hidden sm:inline">Publish Scores</span>
                <span className="sm:hidden">Publish</span>
              </Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </Card>
      
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
