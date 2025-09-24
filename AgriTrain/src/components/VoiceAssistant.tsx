import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/enhanced-button";
import { Card } from "@/components/ui/card";

interface VoiceAssistantProps {
  isActive: boolean;
  onToggle: () => void;
}

const VoiceAssistant = ({ isActive, onToggle }: VoiceAssistantProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");

  // Mock voice commands for demo
  const processVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes("start") && lowerCommand.includes("pest")) {
      setResponse("Starting pest management training. Please look around the 360° scene to identify pest symptoms.");
    } else if (lowerCommand.includes("quiz")) {
      setResponse("Loading quiz questions based on your training progress.");
    } else if (lowerCommand.includes("help")) {
      setResponse("You can say commands like 'Start pest training', 'Take quiz', or 'Go to dashboard'.");
    } else if (lowerCommand.includes("dashboard")) {
      setResponse("Returning to dashboard. You can select any training scenario.");
    } else {
      setResponse("I understand you said: " + command + ". Try saying 'help' for available commands.");
    }
  };

  const startListening = () => {
    setIsListening(true);
    // Mock transcript for demo
    setTimeout(() => {
      const mockTranscript = "Start pest training";
      setTranscript(mockTranscript);
      setIsListening(false);
      processVoiceCommand(mockTranscript);
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 3000);
    }, 2000);
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (response && !isSpeaking) {
      speak(response);
    }
  }, [response, isSpeaking]);

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Card className="p-6 bg-gradient-card backdrop-blur-md border-border/50 shadow-glow min-w-80 max-w-md">
          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="bg-gradient-farm p-2 rounded-full">
                <span className="text-white text-lg">🤖</span>
              </div>
              <h3 className="font-bold text-foreground">Voice Assistant</h3>
            </div>
            
            <div className="flex justify-center gap-2">
              <Button
                variant={isListening ? "destructive" : "farm"}
                size="voice-sm"
                onClick={isListening ? () => setIsListening(false) : startListening}
                disabled={isSpeaking}
              >
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
              
              <Button
                variant="ghost"
                size="voice-sm"
                onClick={() => setIsSpeaking(!isSpeaking)}
              >
                {isSpeaking ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {isListening && (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="text-center"
              >
                <div className="bg-accent/20 rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">🎤 Listening...</p>
                </div>
              </motion.div>
            )}

            {transcript && (
              <div className="bg-secondary/50 rounded-lg p-3">
                <p className="text-sm font-medium text-foreground">You said:</p>
                <p className="text-sm text-muted-foreground">{transcript}</p>
              </div>
            )}

            {response && (
              <div className="bg-farm-green/10 rounded-lg p-3 border border-farm-green/20">
                <p className="text-sm font-medium text-farm-green mb-1">Assistant:</p>
                <p className="text-sm text-foreground">{response}</p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground text-center">
              Say "Help" for available commands
            </p>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default VoiceAssistant;