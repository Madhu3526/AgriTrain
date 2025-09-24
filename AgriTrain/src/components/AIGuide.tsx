import { useState } from "react";
import { Bot, X, ArrowRight, ArrowLeft, Leaf, Droplets, Bug, Cloud } from "lucide-react";

interface AIGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onActivityLog: (activity: string) => void;
  scenarioType?: string;
}

interface GuideStep {
  id: number;
  title: string;
  content: string;
  icon: React.ReactNode;
  tips: string[];
}

const AIGuide = ({ isOpen, onClose, onActivityLog, scenarioType = "general" }: AIGuideProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const getGuideSteps = (): GuideStep[] => {
    switch (scenarioType) {
      case "pest":
        return [
          {
            id: 1,
            title: "Pest Identification",
            content: "Learn to identify common agricultural pests and their damage patterns:",
            icon: <Bug className="h-6 w-6 text-red-500" />,
            tips: [
              "Look for chewed leaves, holes, or discoloration",
              "Check undersides of leaves for eggs or larvae",
              "Identify pest droppings or webbing",
              "Use magnifying glass for small insects",
              "Document with photos for expert consultation"
            ]
          },
          {
            id: 2,
            title: "Integrated Pest Management",
            content: "Implement sustainable pest control strategies:",
            icon: <Leaf className="h-6 w-6 text-green-500" />,
            tips: [
              "Monitor pest populations regularly",
              "Use beneficial insects as natural predators",
              "Apply organic pesticides when necessary",
              "Rotate crops to break pest cycles",
              "Maintain healthy soil for plant resistance"
            ]
          }
        ];
      case "irrigation":
        return [
          {
            id: 1,
            title: "Water Assessment",
            content: "Evaluate your water needs and soil conditions:",
            icon: <Droplets className="h-6 w-6 text-blue-500" />,
            tips: [
              "Test soil moisture levels regularly",
              "Calculate crop water requirements",
              "Check water quality and pH levels",
              "Assess drainage and water retention",
              "Monitor weather patterns for planning"
            ]
          },
          {
            id: 2,
            title: "Efficient Irrigation Systems",
            content: "Choose and optimize your irrigation methods:",
            icon: <Cloud className="h-6 w-6 text-purple-500" />,
            tips: [
              "Install drip irrigation for water efficiency",
              "Use timers for consistent watering",
              "Apply mulch to reduce evaporation",
              "Water during cooler parts of the day",
              "Maintain and clean irrigation equipment"
            ]
          }
        ];
      case "crops":
        return [
          {
            id: 1,
            title: "Crop Selection",
            content: "Choose the right crops for your conditions:",
            icon: <Leaf className="h-6 w-6 text-green-500" />,
            tips: [
              "Analyze soil type and nutrient levels",
              "Consider local climate conditions",
              "Research market demand and prices",
              "Select disease-resistant varieties",
              "Plan for seasonal growing cycles"
            ]
          },
          {
            id: 2,
            title: "Crop Management",
            content: "Optimize your crop growing practices:",
            icon: <Bug className="h-6 w-6 text-red-500" />,
            tips: [
              "Implement proper spacing for growth",
              "Practice crop rotation annually",
              "Monitor for pests and diseases",
              "Apply fertilizers at right times",
              "Harvest at optimal maturity"
            ]
          }
        ];
      case "climate":
        return [
          {
            id: 1,
            title: "Climate Assessment",
            content: "Understand your local climate patterns:",
            icon: <Cloud className="h-6 w-6 text-purple-500" />,
            tips: [
              "Track temperature and rainfall patterns",
              "Monitor seasonal weather changes",
              "Identify extreme weather risks",
              "Use weather forecasting tools",
              "Document climate impacts on crops"
            ]
          },
          {
            id: 2,
            title: "Adaptation Strategies",
            content: "Build resilience against climate change:",
            icon: <Droplets className="h-6 w-6 text-blue-500" />,
            tips: [
              "Diversify crop varieties and species",
              "Implement water conservation methods",
              "Use shade structures for protection",
              "Adjust planting schedules",
              "Build soil health for resilience"
            ]
          }
        ];
      default:
        return [
          {
            id: 1,
            title: "General Farming Guide",
            content: "Essential farming practices for success:",
            icon: <Leaf className="h-6 w-6 text-green-500" />,
            tips: [
              "Plan your farming activities",
              "Monitor crop health regularly",
              "Maintain proper irrigation",
              "Practice sustainable methods",
              "Keep detailed records"
            ]
          }
        ];
    }
  };

  const guideSteps = getGuideSteps();

  const currentGuide = guideSteps[currentStep];

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < guideSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      onActivityLog(`AI Guide: Viewed ${guideSteps[currentStep + 1].title}`);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    onActivityLog('Completed AI Guide session');
    setCurrentStep(0);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Bot className="h-8 w-8 text-green-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {scenarioType.charAt(0).toUpperCase() + scenarioType.slice(1)} AI Guide
              </h2>
              <p className="text-sm text-gray-500">Step {currentStep + 1} of {guideSteps.length}</p>
            </div>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4">
          <div className="flex gap-2">
            {guideSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded-full ${
                  index <= currentStep ? 'bg-green-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              {currentGuide.icon}
              <h3 className="text-2xl font-bold text-gray-800">{currentGuide.title}</h3>
            </div>
            <p className="text-gray-600 text-lg mb-6">{currentGuide.content}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-green-600 mb-3">Key Actions:</h4>
            <ul className="space-y-2">
              {currentGuide.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="h-2 w-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-700">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t bg-gray-50">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              currentStep === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </button>

          <div className="flex gap-3">
            {currentStep < guideSteps.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleClose}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                Complete Guide
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIGuide;