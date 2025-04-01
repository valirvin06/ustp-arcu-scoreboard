
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "sonner";

// Define types
export type MedalType = 'Gold' | 'Silver' | 'Bronze' | 'Non-winner' | 'No Entry';

export interface Team {
  id: string;
  name: string;
  logo: string;
  totalPoints: number;
  medals: {
    Gold: number;
    Silver: number;
    Bronze: number;
    'Non-winner': number;
    'No Entry': number;
  };
}

export interface Event {
  id: string;
  name: string;
  category: string;
  results: {
    teamId: string;
    placement: MedalType;
    points: number;
  }[];
}

export interface Category {
  id: string;
  name: string;
}

export interface ScoreboardContextType {
  teams: Team[];
  events: Event[];
  categories: Category[];
  addTeam: (name: string, logo: string) => void;
  updateTeam: (id: string, name: string, logo: string) => void;
  removeTeam: (id: string) => void;
  addEvent: (name: string, categoryId: string) => void;
  removeEvent: (id: string) => void;
  addCategory: (name: string) => void;
  removeCategory: (id: string) => void;
  updateEventResult: (eventId: string, teamId: string, placement: MedalType) => void;
  removeEventResult: (eventId: string, teamId: string) => void;
  publishScores: () => void;
  publishedScores: {
    teams: Team[];
    events: Event[];
    lastUpdated: string | null;
  };
  teamsRanked: Team[];
}

const initialPublishedState = {
  teams: [],
  events: [],
  lastUpdated: null
};

// Helper function to calculate points based on placement
const getPointsForPlacement = (placement: MedalType): number => {
  switch (placement) {
    case 'Gold': return 10;
    case 'Silver': return 7;
    case 'Bronze': return 5;
    case 'Non-winner': return 1;
    case 'No Entry': return 0;
    default: return 0;
  }
};

// Create context
const ScoreboardContext = createContext<ScoreboardContextType | undefined>(undefined);

// Create a provider component
export const ScoreboardProvider = ({ children }: { children: ReactNode }) => {
  const [teams, setTeams] = useState<Team[]>(() => {
    const saved = localStorage.getItem('teams');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.error('Error parsing stored teams data', err);
        return [];
      }
    }
    return [];
  });
  
  const [events, setEvents] = useState<Event[]>(() => {
    const saved = localStorage.getItem('events');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.error('Error parsing stored events data', err);
        return [];
      }
    }
    return [];
  });
  
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('categories');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.error('Error parsing stored categories data', err);
        return [];
      }
    }
    return [];
  });

  const [publishedScores, setPublishedScores] = useState<{
    teams: Team[];
    events: Event[];
    lastUpdated: string | null;
  }>(() => {
    const saved = localStorage.getItem('publishedScores');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.error('Error parsing stored published scores data', err);
        return initialPublishedState;
      }
    }
    return initialPublishedState;
  });

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('teams', JSON.stringify(teams));
    localStorage.setItem('events', JSON.stringify(events));
    localStorage.setItem('categories', JSON.stringify(categories));
    localStorage.setItem('publishedScores', JSON.stringify(publishedScores));
  }, [teams, events, categories, publishedScores]);

  // Calculate team rankings based on total points
  const teamsRanked = [...teams].sort((a, b) => b.totalPoints - a.totalPoints);

  // Team operations
  const addTeam = (name: string, logo: string) => {
    const newTeam: Team = {
      id: new Date().getTime().toString(),
      name,
      logo,
      totalPoints: 0,
      medals: {
        'Gold': 0,
        'Silver': 0,
        'Bronze': 0,
        'Non-winner': 0,
        'No Entry': 0
      }
    };
    setTeams([...teams, newTeam]);
    toast.success(`Team ${name} added!`);
  };

  const updateTeam = (id: string, name: string, logo: string) => {
    setTeams(teams.map(team => 
      team.id === id ? { ...team, name, logo } : team
    ));
    toast.success(`Team ${name} updated!`);
  };

  const removeTeam = (id: string) => {
    const teamToRemove = teams.find(team => team.id === id);
    if (teamToRemove) {
      setTeams(teams.filter(team => team.id !== id));
      // Also clean up any event results for this team
      setEvents(events.map(event => ({
        ...event,
        results: event.results.filter(result => result.teamId !== id)
      })));
      toast.success(`Team ${teamToRemove.name} removed`);
    }
  };

  // Event operations
  const addEvent = (name: string, categoryId: string) => {
    const newEvent: Event = {
      id: new Date().getTime().toString(),
      name,
      category: categoryId,
      results: []
    };
    setEvents([...events, newEvent]);
    toast.success(`Event ${name} added!`);
  };

  const removeEvent = (id: string) => {
    const eventToRemove = events.find(event => event.id === id);
    if (eventToRemove) {
      // Cleanup team medals and points when removing an event
      const updatedTeams = [...teams];
      
      eventToRemove.results.forEach(result => {
        const teamIndex = updatedTeams.findIndex(team => team.id === result.teamId);
        if (teamIndex !== -1) {
          // Subtract the medal count
          updatedTeams[teamIndex].medals[result.placement] -= 1;
          // Subtract the points
          updatedTeams[teamIndex].totalPoints -= result.points;
        }
      });
      
      setTeams(updatedTeams);
      setEvents(events.filter(event => event.id !== id));
      toast.success(`Event ${eventToRemove.name} removed`);
    }
  };
  
  // Category operations
  const addCategory = (name: string) => {
    const newCategory: Category = {
      id: new Date().getTime().toString(),
      name
    };
    setCategories([...categories, newCategory]);
    toast.success(`Category ${name} added!`);
  };
  
  const removeCategory = (id: string) => {
    const categoryToRemove = categories.find(category => category.id === id);
    if (categoryToRemove) {
      // Check if any events use this category
      const eventsWithCategory = events.filter(event => event.category === id);
      if (eventsWithCategory.length > 0) {
        toast.error(`Cannot remove category ${categoryToRemove.name} as it is used by events`);
        return;
      }
      
      setCategories(categories.filter(category => category.id !== id));
      toast.success(`Category ${categoryToRemove.name} removed`);
    }
  };

  // Result operations
  const updateEventResult = (eventId: string, teamId: string, placement: MedalType) => {
    const eventIndex = events.findIndex(event => event.id === eventId);
    const teamIndex = teams.findIndex(team => team.id === teamId);
    
    if (eventIndex === -1 || teamIndex === -1) {
      toast.error('Event or team not found');
      return;
    }

    const points = getPointsForPlacement(placement);
    const updatedEvents = [...events];
    const updatedTeams = [...teams];
    
    // Check if this team already has a result for this event
    const existingResultIndex = updatedEvents[eventIndex].results.findIndex(
      result => result.teamId === teamId
    );
    
    if (existingResultIndex !== -1) {
      // Update existing result
      const oldPlacement = updatedEvents[eventIndex].results[existingResultIndex].placement;
      const oldPoints = updatedEvents[eventIndex].results[existingResultIndex].points;
      
      // Subtract the old medal and points
      updatedTeams[teamIndex].medals[oldPlacement] -= 1;
      updatedTeams[teamIndex].totalPoints -= oldPoints;
      
      // Update the result
      updatedEvents[eventIndex].results[existingResultIndex] = {
        teamId,
        placement,
        points
      };
    } else {
      // Add new result
      updatedEvents[eventIndex].results.push({
        teamId,
        placement,
        points
      });
    }
    
    // Add the new medal and points
    updatedTeams[teamIndex].medals[placement] += 1;
    updatedTeams[teamIndex].totalPoints += points;
    
    setEvents(updatedEvents);
    setTeams(updatedTeams);
    toast.success(`Result updated for ${teams[teamIndex].name} in ${events[eventIndex].name}`);
  };

  const removeEventResult = (eventId: string, teamId: string) => {
    const eventIndex = events.findIndex(event => event.id === eventId);
    const teamIndex = teams.findIndex(team => team.id === teamId);
    
    if (eventIndex === -1 || teamIndex === -1) {
      toast.error('Event or team not found');
      return;
    }

    const updatedEvents = [...events];
    const existingResultIndex = updatedEvents[eventIndex].results.findIndex(
      result => result.teamId === teamId
    );
    
    if (existingResultIndex !== -1) {
      const result = updatedEvents[eventIndex].results[existingResultIndex];
      const updatedTeams = [...teams];
      
      // Subtract the medal and points
      updatedTeams[teamIndex].medals[result.placement] -= 1;
      updatedTeams[teamIndex].totalPoints -= result.points;
      
      // Remove the result
      updatedEvents[eventIndex].results.splice(existingResultIndex, 1);
      
      setEvents(updatedEvents);
      setTeams(updatedTeams);
      toast.success(`Result removed for ${teams[teamIndex].name} in ${events[eventIndex].name}`);
    }
  };

  // Publish current scores to make them visible to the public
  const publishScores = () => {
    setPublishedScores({
      teams: [...teams],
      events: [...events],
      lastUpdated: new Date().toISOString()
    });
    toast.success('Scores published!');
  };

  const contextValue: ScoreboardContextType = {
    teams,
    events,
    categories,
    teamsRanked,
    addTeam,
    updateTeam,
    removeTeam,
    addEvent,
    removeEvent,
    addCategory,
    removeCategory,
    updateEventResult,
    removeEventResult,
    publishScores,
    publishedScores
  };

  return (
    <ScoreboardContext.Provider value={contextValue}>
      {children}
    </ScoreboardContext.Provider>
  );
};

// Create a hook to use the scoreboard context
export const useScoreboard = (): ScoreboardContextType => {
  const context = useContext(ScoreboardContext);
  if (context === undefined) {
    throw new Error('useScoreboard must be used within a ScoreboardProvider');
  }
  return context;
};
