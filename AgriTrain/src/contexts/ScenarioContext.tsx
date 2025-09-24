import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService, Scenario, UserProgress, Quiz, QuizAttempt } from '@/services/api';
import { useAuth } from './AuthContext';

interface ScenarioContextType {
  scenarios: Scenario[];
  userProgress: UserProgress[];
  isLoading: boolean;
  error: string | null;
  refreshScenarios: () => Promise<void>;
  refreshProgress: () => Promise<void>;
  updateProgress: (scenarioId: number, completionPercentage: number) => Promise<void>;
  getScenarioProgress: (scenarioId: number) => UserProgress | undefined;
  getScenarioQuiz: (scenarioId: number) => Promise<Quiz>;
  submitQuizAttempt: (quizId: number, answers: number[]) => Promise<QuizAttempt>;
}

const ScenarioContext = createContext<ScenarioContextType | undefined>(undefined);

export const useScenarios = () => {
  const context = useContext(ScenarioContext);
  if (context === undefined) {
    throw new Error('useScenarios must be used within a ScenarioProvider');
  }
  return context;
};

interface ScenarioProviderProps {
  children: ReactNode;
}

export const ScenarioProvider: React.FC<ScenarioProviderProps> = ({ children }) => {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  const refreshScenarios = async () => {
    try {
      setError(null);
      console.log('Refreshing scenarios...');
      const scenariosData = await apiService.getScenarios();
      console.log('Scenarios loaded:', scenariosData);
      setScenarios(scenariosData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load scenarios';
      setError(errorMessage);
      console.error('Failed to load scenarios:', error);
    }
  };

  const refreshProgress = async () => {
    if (!user || !isAuthenticated) return;
    
    try {
      setError(null);
      const progressData = await apiService.getUserProgress(user.id);
      setUserProgress(progressData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load progress';
      setError(errorMessage);
      console.error('Failed to load progress:', error);
    }
  };

  const updateProgress = async (scenarioId: number, completionPercentage: number) => {
    if (!user || !isAuthenticated) return;
    
    try {
      setError(null);
      const updatedProgress = await apiService.updateUserProgress(
        user.id,
        scenarioId,
        completionPercentage
      );
      
      setUserProgress(prev => {
        const existing = prev.find(p => p.scenario_id === scenarioId);
        if (existing) {
          return prev.map(p => p.scenario_id === scenarioId ? updatedProgress : p);
        } else {
          return [...prev, updatedProgress];
        }
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update progress';
      setError(errorMessage);
      console.error('Failed to update progress:', error);
      throw error;
    }
  };

  const getScenarioProgress = (scenarioId: number): UserProgress | undefined => {
    return userProgress.find(p => p.scenario_id === scenarioId);
  };

  const getScenarioQuiz = async (scenarioId: number): Promise<Quiz> => {
    try {
      setError(null);
      return await apiService.getScenarioQuiz(scenarioId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load quiz';
      setError(errorMessage);
      console.error('Failed to load quiz:', error);
      throw error;
    }
  };

  const submitQuizAttempt = async (quizId: number, answers: number[]): Promise<QuizAttempt> => {
    if (!user || !isAuthenticated) {
      throw new Error('User must be authenticated to submit quiz');
    }
    
    try {
      setError(null);
      const attempt = await apiService.submitQuizAttempt({
        quiz_id: quizId,
        answers,
        completed_at: new Date().toISOString(),
      });
      
      // Refresh progress after quiz completion
      await refreshProgress();
      
      return attempt;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit quiz';
      setError(errorMessage);
      console.error('Failed to submit quiz:', error);
      throw error;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([
        refreshScenarios(),
        isAuthenticated ? refreshProgress() : Promise.resolve()
      ]);
      setIsLoading(false);
    };

    loadData();
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && user) {
      refreshProgress();
    }
  }, [isAuthenticated, user]);

  const value: ScenarioContextType = {
    scenarios,
    userProgress,
    isLoading,
    error,
    refreshScenarios,
    refreshProgress,
    updateProgress,
    getScenarioProgress,
    getScenarioQuiz,
    submitQuizAttempt,
  };

  return <ScenarioContext.Provider value={value}>{children}</ScenarioContext.Provider>;
};
