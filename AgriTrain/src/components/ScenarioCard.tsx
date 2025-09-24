import { motion } from "framer-motion";
import { Button } from "@/components/ui/enhanced-button";
import { Play, Clock, Trophy } from "lucide-react";

interface ScenarioCardProps {
  title: string;
  description: string;
  image: string;
  duration: string;
  completionRate?: number;
  isCompleted?: boolean;
  onStart: () => void;
  onQuiz: () => void;
  index: number;
}

const ScenarioCard = ({
  title,
  description,
  image,
  duration,
  completionRate,
  isCompleted = false,
  onStart,
  onQuiz,
  index,
}: ScenarioCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-xl bg-gradient-card backdrop-blur-sm border border-border/50 shadow-farm hover:shadow-glow transition-all duration-500 hover:scale-105"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {isCompleted && (
          <div className="absolute top-3 right-3 bg-farm-green text-white p-2 rounded-full shadow-farm">
            <Trophy className="h-4 w-4" />
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-farm-green transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground mb-4 line-clamp-2">
          {description}
        </p>

        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{duration}</span>
          </div>
          {completionRate !== undefined && (
            <div className="flex items-center gap-1">
              <Trophy className="h-4 w-4" />
              <span>{completionRate}% Complete</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant="farm"
            size="lg"
            onClick={onStart}
            className="flex-1"
          >
            <Play className="h-5 w-5" />
            {isCompleted ? "Retake Training" : "Start Training"}
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={onQuiz}
            className="flex-1"
          >
            Take Quiz
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ScenarioCard;