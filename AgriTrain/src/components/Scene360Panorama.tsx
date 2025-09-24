import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/enhanced-button";
import { RotateCcw, ZoomIn, ZoomOut, Info, ArrowLeft, Play, Volume2, BookOpen } from "lucide-react";
import { useScenarios } from "@/contexts/ScenarioContext";
import { useAuth } from "@/contexts/AuthContext";
import AIGuide from "./AIGuide";

// Import panoramic images
import farmFieldPanorama from "@/assets/panorama-farm-field.jpg";
import irrigationPanorama from "@/assets/panorama-irrigation.jpg";

interface HotspotProps {
  position: [number, number, number];
  title: string;
  description: string;
  onClick: () => void;
}

const Hotspot = ({ position, title, description, onClick }: HotspotProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1;
      meshRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.5 : 1}
      >
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color={hovered ? "#ff6b35" : "#4ade80"}
          emissive={hovered ? "#ff6b35" : "#4ade80"}
          emissiveIntensity={hovered ? 0.6 : 0.4}
        />
      </mesh>
      
      {/* Pulsing ring effect */}
      <mesh scale={hovered ? 2 : 1.5}>
        <ringGeometry args={[0.12, 0.15, 16]} />
        <meshBasicMaterial 
          color="#4ade80" 
          transparent 
          opacity={hovered ? 0.8 : 0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {hovered && (
        <Html distanceFactor={8} position={[0, 0.2, 0]}>
          <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-border/50 min-w-64 pointer-events-none transform -translate-x-1/2">
            <h4 className="font-bold text-base text-foreground mb-2">{title}</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            <div className="flex items-center gap-2 mt-3 text-xs text-accent">
              <Play className="h-3 w-3" />
              <span>Click to explore</span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

interface PanoramaSphereProps {
  scenarioType: string;
}

const PanoramaSphere = ({ scenarioType }: PanoramaSphereProps) => {
  const getPanoramaImage = () => {
    switch (scenarioType) {
      case "pest":
        return farmFieldPanorama;
      case "irrigation": 
        return irrigationPanorama;
      case "crops":
        return farmFieldPanorama;
      case "climate":
        return farmFieldPanorama;
      default:
        return farmFieldPanorama;
    }
  };

  const texture = useLoader(THREE.TextureLoader, getPanoramaImage());
  texture.mapping = THREE.EquirectangularReflectionMapping;

  return (
    <mesh>
      <sphereGeometry args={[50, 64, 32]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
};

interface Panorama360ViewerProps {
  scenarioType: string;
  onBack: () => void;
  onQuiz?: () => void;
  onActivityLog?: (activity: string) => void;
}

const Panorama360Viewer = ({ scenarioType, onBack, onQuiz, onActivityLog }: Panorama360ViewerProps) => {
  const [cameraTarget, setCameraTarget] = useState(new THREE.Vector3(0, 0, 0));
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);
  const [completedHotspots, setCompletedHotspots] = useState<Set<string>>(new Set());
  const [showAIGuide, setShowAIGuide] = useState(false);
  
  const { updateProgress } = useScenarios();
  const { isAuthenticated } = useAuth();
  
  const handleHotspotComplete = async (hotspotId: string) => {
    setCompletedHotspots(prev => new Set([...prev, hotspotId]));
    
    // Update progress if user is authenticated
    if (isAuthenticated) {
      try {
        const scenarioIdMap: { [key: string]: number } = {
          pest: 1,
          irrigation: 2,
          crops: 3,
          climate: 4
        };
        
        const scenarioId = scenarioIdMap[scenarioType];
        if (scenarioId) {
          const hotspots = getHotspots();
          const progressPercentage = (completedHotspots.size + 1) / hotspots.length * 100;
          await updateProgress(scenarioId, progressPercentage);
        }
      } catch (error) {
        console.error("Failed to update progress:", error);
      }
    }
  };
  
  const getHotspots = () => {
    switch (scenarioType) {
      case "pest":
        return [
          {
            position: [-15, 2, -30] as [number, number, number],
            title: "Locust Invasion Detection",
            description: "Navigate through a virtual maize field experiencing locust invasion. Learn identification techniques and response strategies.",
            onClick: () => {
              setSelectedHotspot("pest-detection");
              setIsPlaying(true);
            },
          },
          {
            position: [20, -5, -25] as [number, number, number],
            title: "Crop Damage Assessment",
            description: "Identify early signs of pest damage and learn proper assessment techniques for effective intervention.",
            onClick: () => {
              setSelectedHotspot("damage-assessment");
              setIsPlaying(true);
            },
          },
          {
            position: [-10, 5, 35] as [number, number, number],
            title: "Beneficial Insects Habitat",
            description: "Discover natural predator zones and learn how to encourage beneficial insect populations.",
            onClick: () => {
              setSelectedHotspot("beneficial-insects");
              setIsPlaying(true);
            },
          }
        ];
      case "irrigation":
        return [
          {
            position: [25, -8, -20] as [number, number, number],
            title: "Smart Irrigation System",
            description: "Experience water-stressed crops and master precision irrigation techniques for maximum water efficiency.",
            onClick: () => {
              setSelectedHotspot("smart-irrigation");
              setIsPlaying(true);
            },
          },
          {
            position: [-30, 0, -15] as [number, number, number],
            title: "Soil Moisture Monitoring",
            description: "Learn to read soil moisture indicators and optimize irrigation scheduling.",
            onClick: () => {
              setSelectedHotspot("soil-moisture");
              setIsPlaying(true);
            },
          }
        ];
      case "crops":
        return [
          {
            position: [0, 8, -40] as [number, number, number],
            title: "Crop Selection Guidance",
            description: "Explore different crop varieties suitable for your climate and soil conditions.",
            onClick: () => {
              setSelectedHotspot("crop-selection");
              setIsPlaying(true);
            },
          }
        ];
      case "climate":
        return [
          {
            position: [-20, 10, 30] as [number, number, number],
            title: "Climate Adaptation Strategies",
            description: "Learn how to adapt farming practices to changing weather patterns and climate conditions.",
            onClick: () => {
              setSelectedHotspot("climate-adaptation");
              setIsPlaying(true);
            },
          }
        ];
      default:
        return [];
    }
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev * 1.2, 3));
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev / 1.2, 0.5));
  };
  
  const handleReset = () => {
    setZoomLevel(1);
    setCameraTarget(new THREE.Vector3(0, 0, 0));
    setSelectedHotspot(null);
    setIsPlaying(false);
  };

  const getScenarioTitle = () => {
    switch (scenarioType) {
      case "pest": return "Pest Outbreak Response";
      case "irrigation": return "Smart Irrigation in Drought";
      case "crops": return "Optimal Crop Selection";
      case "climate": return "Climate Adaptation Training";
      default: return "360° Farm Training";
    }
  };

  const getScenarioDescription = () => {
    switch (scenarioType) {
      case "pest": return "Navigate through a virtual maize field experiencing locust invasion. Learn identification techniques and response strategies.";
      case "irrigation": return "Experience water-stressed crops and master precision irrigation techniques for maximum water efficiency.";
      case "crops": return "Explore different crop varieties and learn optimal selection criteria for your farming conditions.";
      case "climate": return "Master climate adaptation strategies for sustainable farming in changing weather patterns.";
      default: return "Immersive 360° agricultural training experience";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative h-screen bg-gradient-to-b from-sky-400 to-green-400 overflow-hidden"
    >
      {/* Top Controls */}
      <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center">
        <Button 
          variant="ghost" 
          onClick={onBack} 
          className="bg-white/90 backdrop-blur-sm hover:bg-white/95 shadow-lg"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Modules
        </Button>
        
        <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
          <div className="text-sm font-medium text-foreground">
            0 / 3 completed
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="bg-white/90 backdrop-blur-sm hover:bg-white/95 shadow-lg" 
            onClick={handleReset}
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="bg-white/90 backdrop-blur-sm hover:bg-white/95 shadow-lg" 
            onClick={handleZoomIn}
          >
            <ZoomIn className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="bg-white/90 backdrop-blur-sm hover:bg-white/95 shadow-lg" 
            onClick={handleZoomOut}
          >
            <ZoomOut className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* 360° Panoramic Scene */}
      <Canvas
        camera={{ 
          position: [0, 0, 0.1],
          fov: 90,
          near: 0.1,
          far: 1000
        }}
        style={{ cursor: 'grab' }}
      >
        <Suspense fallback={<Html center><div className="text-white text-xl">Loading 360° Experience...</div></Html>}>
          <PanoramaSphere scenarioType={scenarioType} />
          
          {/* Interactive Hotspots */}
          {getHotspots().map((hotspot, index) => (
            <Hotspot key={index} {...hotspot} />
          ))}

          <OrbitControls
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            minDistance={0.1}
            maxDistance={10}
            zoomSpeed={0.5}
            rotateSpeed={0.5}
            target={cameraTarget}
          />
        </Suspense>
      </Canvas>

      {/* Bottom Info Panel */}
      <div className="absolute bottom-4 left-4 right-4 z-20">
        <div className="bg-gradient-to-r from-black/80 to-black/60 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-2xl">
          <div className="flex items-start gap-4">
            <div className="bg-accent/20 p-3 rounded-xl">
              <Info className="h-6 w-6 text-accent" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white text-xl mb-2">
                {getScenarioTitle()}
              </h3>
              <p className="text-white/90 text-sm mb-4 leading-relaxed">
                {getScenarioDescription()}
              </p>
              <div className="text-white/70 text-xs mb-4 flex items-center gap-2">
                <span>👆 Drag to look around and tap the glowing hotspots to learn</span>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="hero" 
                  size="sm" 
                  onClick={() => {
                    setShowAIGuide(true);
                    if (onActivityLog) {
                      onActivityLog(`Started ${scenarioType} AI Guide`);
                    }
                  }}
                  className="flex items-center gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  Start AI Guide
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    if (onQuiz) {
                      onQuiz();
                    }
                  }}
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                >
                  Take Assessment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hotspot Info Modal */}
      {selectedHotspot && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-4 z-30 flex items-center justify-center"
        >
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-md mx-auto">
            <h4 className="font-bold text-lg mb-3">Learning Module Active</h4>
            <p className="text-muted-foreground mb-4">
              AI guidance is now providing detailed information about {selectedHotspot.replace('-', ' ')}.
            </p>
            <Button onClick={() => setSelectedHotspot(null)} className="w-full">
              Continue Exploring
            </Button>
          </div>
        </motion.div>
      )}

      {/* AI Guide Modal */}
      <AIGuide
        isOpen={showAIGuide}
        onClose={() => setShowAIGuide(false)}
        onActivityLog={onActivityLog || (() => {})}
        scenarioType={scenarioType}
      />
    </motion.div>
  );
};

export default Panorama360Viewer;