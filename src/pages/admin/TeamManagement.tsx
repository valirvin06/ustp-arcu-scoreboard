
import React, { useState } from 'react';
import { useScoreboard } from '@/context/ScoreboardContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Pencil, Trash2, Plus, Upload } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const TeamManagement = () => {
  const { teams, addTeam, updateTeam, removeTeam } = useScoreboard();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentTeam, setCurrentTeam] = useState<{ id: string, name: string, logo: string } | null>(null);
  const [teamName, setTeamName] = useState('');
  const [teamLogo, setTeamLogo] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleOpenDialog = (isEdit: boolean, team?: { id: string, name: string, logo: string }) => {
    setIsEditMode(isEdit);
    if (isEdit && team) {
      setCurrentTeam(team);
      setTeamName(team.name);
      setTeamLogo(team.logo);
      setPreviewImage(team.logo);
    } else {
      setCurrentTeam(null);
      setTeamName('');
      setTeamLogo('');
      setPreviewImage(null);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setIsEditMode(false);
    setCurrentTeam(null);
    setTeamName('');
    setTeamLogo('');
    setPreviewImage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) {
      toast.error('Team name is required');
      return;
    }

    if (isEditMode && currentTeam) {
      updateTeam(currentTeam.id, teamName, teamLogo);
    } else {
      addTeam(teamName, teamLogo);
    }
    handleCloseDialog();
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      toast.error('Image size should be less than 1MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setTeamLogo(result);
      setPreviewImage(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Team Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog(false)}>
              <Plus className="mr-2 h-4 w-4" /> Add New Team
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditMode ? 'Edit Team' : 'Add New Team'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="teamName">Team Name</Label>
                <Input
                  id="teamName"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Enter team name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="teamLogo">Team Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="border rounded-lg w-24 h-24 flex items-center justify-center overflow-hidden">
                    {previewImage ? (
                      <img src={previewImage} alt="Team Logo Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-400">No Logo</span>
                    )}
                  </div>
                  <div className="flex-grow">
                    <Label htmlFor="logoUpload" className="cursor-pointer w-full">
                      <div className="border rounded-md p-2 flex items-center justify-center gap-2">
                        <Upload className="h-4 w-4" />
                        <span>Upload Logo</span>
                      </div>
                      <Input
                        id="logoUpload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoUpload}
                      />
                    </Label>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Recommended: Square image, less than 1MB
                </p>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button type="submit">
                  {isEditMode ? 'Update Team' : 'Add Team'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {teams.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground py-8">
              No teams have been added yet. Add a team to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <Card key={team.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="flex items-center gap-2">
                    {team.logo && (
                      <img 
                        src={team.logo} 
                        alt={`${team.name} logo`}
                        className="w-8 h-8 object-cover rounded-full"
                      />
                    )}
                    <span>{team.name}</span>
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => handleOpenDialog(true, team)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="icon" variant="ghost" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the team "{team.name}" and remove all of its scores.
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => removeTeam(team.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 justify-center">
                  <div className="text-xs px-2 py-1 bg-secondary/20 rounded-md">
                    Gold: {team.medals.Gold}
                  </div>
                  <div className="text-xs px-2 py-1 bg-gray-200 rounded-md">
                    Silver: {team.medals.Silver}
                  </div>
                  <div className="text-xs px-2 py-1 bg-amber-200 rounded-md">
                    Bronze: {team.medals.Bronze}
                  </div>
                </div>
                <div className="mt-2 text-center font-medium">
                  Total Points: {team.totalPoints}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamManagement;
