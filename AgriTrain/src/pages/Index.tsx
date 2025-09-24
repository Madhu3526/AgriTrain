import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import ScenarioCard from "@/components/ScenarioCard";
import VoiceAssistant from "@/components/VoiceAssistant";
import Panorama360Viewer from "@/components/Scene360Panorama";
import QuizInterface from "@/components/QuizInterface";
import AIGuide from "@/components/AIGuide";
import ActivitySummary from "@/components/ActivitySummary";
import { Button } from "@/components/ui/enhanced-button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TrendingUp, Clock, Trophy, Users, Loader2, BookOpen, Activity } from "lucide-react";
import { useScenarios } from "@/contexts/ScenarioContext";
import { useAuth } from "@/contexts/AuthContext";

// Import scenario images
import heroImage from "@/assets/hero-agriculture.jpg";
import pestImage from "@/assets/scenario-pest.jpg";
import irrigationImage from "@/assets/scenario-irrigation.jpg";
import cropsImage from "@/assets/scenario-crops.jpg";
import climateImage from "@/assets/scenario-climate.jpg";

type ViewType = "dashboard" | "training" | "quiz";

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewType>("dashboard");
  const [selectedScenario, setSelectedScenario] = useState<string>("");
  const [voiceAssistantActive, setVoiceAssistantActive] = useState(false);
  const [showAIGuide, setShowAIGuide] = useState(false);
  const [showActivitySummary, setShowActivitySummary] = useState(false);
  const [userActivities, setUserActivities] = useState<string[]>([]);
  
  const { scenarios, userProgress, isLoading, error, getScenarioProgress } = useScenarios();
  const { isAuthenticated } = useAuth();

  // Image mapping for scenarios
  const scenarioImages: { [key: string]: string } = {
    pest: pestImage,
    irrigation: irrigationImage,
    crops: cropsImage,
    climate: climateImage,
  };

  // Transform API scenarios to match component expectations
  const transformedScenarios = scenarios.map(scenario => {
    const progress = getScenarioProgress(scenario.id);
    const image = scenarioImages[scenario.scenario_type] || heroImage;
    
    return {
      id: scenario.scenario_type,
      title: scenario.title,
      description: scenario.description,
      image: image,
      duration: `${scenario.duration_minutes} min`,
      completionRate: progress?.completion_percentage || 0,
      isCompleted: progress?.is_completed || false,
    };
  });

  const handleStartTraining = (scenarioId: string) => {
    setSelectedScenario(scenarioId);
    setCurrentView("training");
  };

  const handleStartQuiz = (scenarioId: string) => {
    setSelectedScenario(scenarioId);
    setCurrentView("quiz");
  };

  const handleBackToDashboard = () => {
    setCurrentView("dashboard");
    setSelectedScenario("");
  };

  const handleQuizComplete = async (score: number) => {
    console.log("Quiz completed with score:", score);
    // Progress is automatically updated through the context
  };

  const handleVoiceCommand = () => {
    setVoiceAssistantActive(!voiceAssistantActive);
  };

  const handleActivityLog = (activity: string) => {
    const timestamp = new Date().toLocaleString();
    setUserActivities(prev => [...prev, `${activity} - ${timestamp}`]);
  };

  const handleStartTrainingWithLog = (scenarioId: string) => {
    handleActivityLog(`Started ${scenarioId} scenario training`);
    handleStartTraining(scenarioId);
  };

  const handleStartQuizWithLog = (scenarioId: string) => {
    handleActivityLog(`Started ${scenarioId} quiz`);
    handleStartQuiz(scenarioId);
  };

  if (currentView === "training") {
    return (
      <Panorama360Viewer
        scenarioType={selectedScenario}
        onBack={handleBackToDashboard}
        onQuiz={() => handleStartQuiz(selectedScenario)}
        onActivityLog={handleActivityLog}
      />
    );
  }

  if (currentView === "quiz") {
    return (
      <QuizInterface
        scenarioType={selectedScenario}
        onComplete={handleQuizComplete}
        onBack={handleBackToDashboard}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading scenarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onVoiceCommand={handleVoiceCommand} />
      
      {error && (
        <div className="container mx-auto px-4 py-4">
          <Alert>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        </div>
      )}
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="h-96 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-2xl"
              >
                <h1 className="text-5xl font-bold text-white mb-4">
                  Master Modern Agriculture with AI
                </h1>
                <p className="text-xl text-white/90 mb-8">
                  Experience immersive 360° farm scenarios and receive personalized AI guidance for sustainable farming practices.
                </p>
                <div className="flex gap-4">
                  <Button 
                    variant="hero" 
                    size="xl"
                    onClick={() => {
                      document.getElementById('training-scenarios')?.scrollIntoView({ 
                        behavior: 'smooth' 
                      });
                    }}
                  >
                    Start Learning
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="xl" 
                    className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                    onClick={() => {
                      console.log('Start Guide clicked, showAIGuide before:', showAIGuide);
                      setShowAIGuide(true);
                      handleActivityLog('Opened AI Farming Guide');
                      console.log('showAIGuide set to true');
                    }}
                  >
                    <BookOpen className="h-5 w-5 mr-2" />
                    Start Guide
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gradient-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: Users, label: "Active Farmers", value: "2,500+" },
              { icon: TrendingUp, label: "Training Sessions", value: "15,000+" },
              { icon: Trophy, label: "Success Rate", value: "92%" },
              { icon: Clock, label: "Avg. Training Time", value: "18 min" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6 text-center bg-gradient-card border-border/50 shadow-farm hover:shadow-glow transition-all duration-300">
                  <div className="bg-gradient-farm p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <stat.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Training Scenarios */}
      <section id="training-scenarios" className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Choose Your Training Scenario
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Select from our comprehensive agricultural training modules designed by experts and powered by AI.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {transformedScenarios.map((scenario, index) => (
              <ScenarioCard
                key={scenario.id}
                title={scenario.title}
                description={scenario.description}
                image={scenario.image}
                duration={scenario.duration}
                completionRate={scenario.completionRate}
                isCompleted={scenario.isCompleted}
                onStart={() => handleStartTrainingWithLog(scenario.id)}
                onQuiz={() => handleStartQuizWithLog(scenario.id)}
                index={index}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12 space-y-4"
          >
            <div className="flex justify-center gap-4">
              <Button variant="farm" size="xl" onClick={() => handleStartQuizWithLog("pest")}>
                Take Assessment Quiz
              </Button>
              <Button 
                variant="outline" 
                size="xl" 
                onClick={() => setShowActivitySummary(true)}
              >
                <Activity className="h-5 w-5 mr-2" />
                View Activity Summary
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Voice Assistant */}
      <VoiceAssistant
        isActive={voiceAssistantActive}
        onToggle={() => setVoiceAssistantActive(!voiceAssistantActive)}
      />

      {/* AI Guide */}
      <AIGuide
        isOpen={showAIGuide}
        onClose={() => setShowAIGuide(false)}
        onActivityLog={handleActivityLog}
        scenarioType="general"
      />

      {/* Activity Summary */}
      <ActivitySummary
        isOpen={showActivitySummary}
        onClose={() => setShowActivitySummary(false)}
        activities={userActivities}
      />
    </div>
  );
};

export default Index;
