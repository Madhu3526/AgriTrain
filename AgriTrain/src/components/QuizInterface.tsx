import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/enhanced-button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Trophy, ArrowLeft, Clock } from "lucide-react";
import { useScenarios } from "@/contexts/ScenarioContext";
import { useAuth } from "@/contexts/AuthContext";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizInterfaceProps {
  scenarioType: string;
  onComplete: (score: number) => void;
  onBack: () => void;
}

const QuizInterface = ({ scenarioType, onComplete, onBack }: QuizInterfaceProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isCompleted, setIsCompleted] = useState(false);
  const [quiz, setQuiz] = useState<any>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { submitQuizAttempt, updateProgress, getScenarioQuiz } = useScenarios();
  const { isAuthenticated, user } = useAuth();

  // Load quiz from API
  useEffect(() => {
    const loadQuiz = async () => {
      if (!isAuthenticated) {
        setError("Please log in to take the quiz");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        // Find scenario ID based on scenario type
        const scenarioIdMap: { [key: string]: number } = {
          pest: 1,
          irrigation: 2,
          crops: 3,
          climate: 4
        };
        
        const scenarioId = scenarioIdMap[scenarioType];
        if (!scenarioId) {
          throw new Error("Invalid scenario type");
        }
        
        const quizData = await getScenarioQuiz(scenarioId);
        setQuiz(quizData);
        setAnswers(new Array(quizData.questions.length).fill(-1));
        setTimeLeft(quizData.time_limit_minutes ? quizData.time_limit_minutes * 60 : 30 * quizData.questions.length); // Total time for all questions
      } catch (error) {
        console.error("Failed to load quiz:", error);
        // Don't set error for fallback - just use mock questions
        setQuiz(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuiz();
  }, [scenarioType, isAuthenticated, getScenarioQuiz]);

  // Mock quiz questions based on scenario type (fallback)
  const getQuizQuestions = (): QuizQuestion[] => {
    switch (scenarioType) {
      case "pest":
        return [
          {
            id: 1,
            question: "What is the most effective first step in integrated pest management?",
            options: [
              "Apply pesticides immediately",
              "Monitor and identify the pest",
              "Remove all affected plants",
              "Increase irrigation"
            ],
            correctAnswer: 1,
            explanation: "Proper identification of pests is crucial before taking any action, as different pests require different management strategies."
          },
          {
            id: 2,
            question: "Which of these insects is considered beneficial for natural pest control?",
            options: [
              "Aphids",
              "Ladybugs",
              "Thrips",
              "Whiteflies"
            ],
            correctAnswer: 1,
            explanation: "Ladybugs are natural predators that help control aphids and other soft-bodied pests, making them valuable allies in pest management."
          },
          {
            id: 3,
            question: "When should you apply organic pesticides for maximum effectiveness?",
            options: [
              "During the hottest part of the day",
              "Early morning or late evening",
              "Only during rain",
              "At any time"
            ],
            correctAnswer: 1,
            explanation: "Early morning or late evening applications are most effective as they avoid harming beneficial insects and reduce pesticide breakdown from UV light."
          }
        ];
      case "irrigation":
        return [
          {
            id: 1,
            question: "What is the most water-efficient irrigation method?",
            options: [
              "Flood irrigation",
              "Sprinkler irrigation",
              "Drip irrigation",
              "Furrow irrigation"
            ],
            correctAnswer: 2,
            explanation: "Drip irrigation delivers water directly to plant roots with minimal evaporation and runoff."
          },
          {
            id: 2,
            question: "When is the best time to irrigate crops?",
            options: [
              "Midday when it's hottest",
              "Early morning or evening",
              "Late at night",
              "Anytime during the day"
            ],
            correctAnswer: 1,
            explanation: "Early morning or evening irrigation reduces water loss due to evaporation and wind."
          },
          {
            id: 3,
            question: "What does ET (Evapotranspiration) measure?",
            options: [
              "Water pressure in irrigation systems",
              "Water loss from soil and plants",
              "Irrigation system efficiency",
              "Crop yield potential"
            ],
            correctAnswer: 1,
            explanation: "ET measures the combined water loss from soil evaporation and plant transpiration."
          }
        ];
      case "crops":
        return [
          {
            id: 1,
            question: "What is the most important factor when selecting crops for a new region?",
            options: [
              "Market price only",
              "Climate and soil conditions",
              "Personal preference",
              "Equipment availability"
            ],
            correctAnswer: 1,
            explanation: "Climate and soil conditions determine whether crops can grow successfully in a region."
          },
          {
            id: 2,
            question: "What is crop rotation?",
            options: [
              "Turning crops during growth",
              "Growing different crops in sequence",
              "Harvesting crops in circles",
              "Storing crops in rotation"
            ],
            correctAnswer: 1,
            explanation: "Crop rotation involves growing different crops in the same field in sequential seasons to improve soil health."
          },
          {
            id: 3,
            question: "Which factor is NOT typically considered in crop selection?",
            options: [
              "Soil pH",
              "Water availability",
              "Farmer's age",
              "Market demand"
            ],
            correctAnswer: 2,
            explanation: "While experience matters, the farmer's age itself is not a direct factor in crop selection decisions."
          }
        ];
      case "climate":
        return [
          {
            id: 1,
            question: "What is climate-smart agriculture?",
            options: [
              "Using only modern technology",
              "Farming that adapts to and mitigates climate change",
              "Growing crops indoors only",
              "Avoiding all traditional practices"
            ],
            correctAnswer: 1,
            explanation: "Climate-smart agriculture sustainably increases productivity while adapting to climate change and reducing greenhouse gas emissions."
          },
          {
            id: 2,
            question: "Which practice helps build climate resilience in farming?",
            options: [
              "Monoculture farming",
              "Diversifying crops and livestock",
              "Removing all trees from farmland",
              "Using only chemical fertilizers"
            ],
            correctAnswer: 1,
            explanation: "Diversification reduces risk and improves resilience to climate variability and extreme weather events."
          },
          {
            id: 3,
            question: "What is a key benefit of agroforestry in climate adaptation?",
            options: [
              "Reduces biodiversity",
              "Increases soil erosion",
              "Provides windbreaks and carbon sequestration",
              "Eliminates the need for irrigation"
            ],
            correctAnswer: 2,
            explanation: "Agroforestry systems provide windbreaks, sequester carbon, improve soil health, and enhance climate resilience."
          }
        ];
      default:
        return [];
    }
  };

  // Use API quiz data if available, otherwise fallback to mock data
  const questions = quiz ? quiz.questions : getQuizQuestions();
  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  // Initialize answers array for fallback questions
  useEffect(() => {
    if (!quiz && questions.length > 0 && answers.length === 0) {
      setAnswers(new Array(questions.length).fill(-1));
      setTimeLeft(30 * questions.length); // 30 seconds per question for fallback
    }
  }, [quiz, questions.length, answers.length]);

  // Update selected answer when question changes
  useEffect(() => {
    if (questions.length > 0) {
      setSelectedAnswer(answers[currentQuestionIndex] !== -1 ? answers[currentQuestionIndex] : null);
    }
  }, [currentQuestionIndex, answers, questions.length]);

  useEffect(() => {
    if (timeLeft > 0 && !showExplanation && !isCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showExplanation && !isCompleted) {
      // Auto-submit when time runs out
      handleAnswerSubmit();
    }
  }, [timeLeft, showExplanation, isCompleted]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (!showExplanation) {
      setSelectedAnswer(answerIndex);
      // Update answers array
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = answerIndex;
      setAnswers(newAnswers);
    }
  };

  const handleAnswerSubmit = () => {
    setShowExplanation(true);
  };

  const handleNextQuestion = async () => {
    // Calculate score for current question
    let currentScore = score;
    if (selectedAnswer === (currentQuestion.correct_answer ?? currentQuestion.correctAnswer)) {
      currentScore += 1;
      setScore(currentScore);
    }
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowExplanation(false);
      setTimeLeft(30);
    } else {
      // Quiz completed - submit results
      try {
        const percentage = (currentScore / questions.length) * 100;
        
        if (isAuthenticated && user) {
          const finalAnswers = [...answers];
          finalAnswers[currentQuestionIndex] = selectedAnswer ?? -1;
          
          if (quiz) {
            await submitQuizAttempt(quiz.id, finalAnswers);
          }
          
          const scenarioIdMap: { [key: string]: number } = {
            pest: 1,
            irrigation: 2,
            crops: 3,
            climate: 4
          };
          const scenarioId = scenarioIdMap[scenarioType];
          if (scenarioId) {
            await updateProgress(scenarioId, percentage);
          }
        }
        
        setIsCompleted(true);
        onComplete(currentScore);
      } catch (error) {
        console.error("Failed to submit quiz:", error);
        setError("Failed to submit quiz results");
      }
    }
  };

  const getScorePercentage = () => {
    return Math.round((score / questions.length) * 100);
  };

  if (isLoading || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-farm-green mx-auto mb-4"></div>
            <p className="text-muted-foreground">{isLoading ? 'Loading quiz...' : 'No questions available'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Error Loading Quiz</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={onBack} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen bg-gradient-hero flex items-center justify-center p-4"
      >
        <Card className="max-w-md w-full p-8 text-center bg-gradient-card backdrop-blur-md shadow-glow">
          <div className="mb-6">
            <div className="bg-gradient-farm p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <Trophy className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Quiz Completed!</h2>
            <p className="text-muted-foreground">
              {scenarioType.charAt(0).toUpperCase() + scenarioType.slice(1)} Management Quiz
            </p>
          </div>

          <div className="mb-6">
            <div className="text-4xl font-bold text-farm-green mb-2">
              {getScorePercentage()}%
            </div>
            <p className="text-muted-foreground">
              You got {score} out of {questions.length} questions correct
            </p>
          </div>

          <div className="space-y-3">
            <Button variant="farm" size="lg" className="w-full" onClick={onBack}>
              Return to Dashboard
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full"
              onClick={() => window.location.reload()}
            >
              Retake Quiz
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-sky p-4"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack} className="bg-white/90 backdrop-blur-sm">
            <ArrowLeft className="h-5 w-5" />
            Back
          </Button>
          
          <div className="flex items-center gap-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <span className={`font-mono font-bold ${timeLeft <= 10 ? 'text-destructive' : 'text-foreground'}`}>
              {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}
            </span>
          </div>

          <div className="text-sm text-muted-foreground bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="p-8 bg-gradient-card backdrop-blur-md shadow-glow">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {currentQuestion.question_text ?? currentQuestion.question}
            </h2>
          </div>

          <div className="space-y-3 mb-6">
            <AnimatePresence>
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === (currentQuestion.correct_answer ?? currentQuestion.correctAnswer);
                const showResult = showExplanation;

                return (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showExplanation}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-300 ${
                      showResult
                        ? isCorrect
                          ? 'border-farm-green bg-farm-green/10 text-farm-green'
                          : isSelected
                          ? 'border-destructive bg-destructive/10 text-destructive'
                          : 'border-border bg-background'
                        : isSelected
                        ? 'border-accent bg-accent/10'
                        : 'border-border bg-background hover:border-accent/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex-1">{option}</span>
                      {showResult && (
                        <div className="ml-3">
                          {isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-farm-green" />
                          ) : isSelected ? (
                            <XCircle className="h-5 w-5 text-destructive" />
                          ) : null}
                        </div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>

          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-farm-green/10 border border-farm-green/20 rounded-lg"
            >
              <h4 className="font-bold text-farm-green mb-2">Explanation</h4>
              <p className="text-foreground">{currentQuestion.explanation}</p>
            </motion.div>
          )}

          <div className="flex justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Score: {score}/{questions.length}</span>
            </div>
            
            {showExplanation ? (
              <Button variant="farm" onClick={handleNextQuestion}>
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Complete Quiz'}
              </Button>
            ) : selectedAnswer !== null ? (
              <Button variant="farm" onClick={handleAnswerSubmit}>
                Submit Answer
              </Button>
            ) : (
              <Button variant="outline" disabled>
                Select an Answer
              </Button>
            )}
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

export default QuizInterface;