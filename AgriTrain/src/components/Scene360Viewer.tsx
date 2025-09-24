import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Text, Html } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/enhanced-button";
import { RotateCcw, ZoomIn, ZoomOut, Info, ArrowLeft } from "lucide-react";

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
      meshRef.current.rotation.y = state.clock.elapsedTime;
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.2 : 1}
      >
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial
          color={hovered ? "#ff6b35" : "#4ade80"}
          emissive={hovered ? "#ff6b35" : "#4ade80"}
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {hovered && (
        <Html distanceFactor={10}>
          <div className="bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-border/50 min-w-48 pointer-events-none">
            <h4 className="font-bold text-sm text-foreground mb-1">{title}</h4>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </Html>
      )}
    </group>
  );
};

interface FarmSceneProps {
  scenarioType: string;
}

const FarmScene = ({ scenarioType }: FarmSceneProps) => {
  const handleHotspotClick = (info: string) => {
    console.log("Hotspot clicked:", info);
    // Here you would trigger AI advisory
  };

  const getHotspots = () => {
    switch (scenarioType) {
      case "pest":
        return [
          {
            position: [2, 0, -3] as [number, number, number],
            title: "Leaf Damage",
            description: "Click to analyze pest symptoms",
            onClick: () => handleHotspotClick("Leaf damage analysis"),
          },
          {
            position: [-2, -0.5, -2] as [number, number, number],
            title: "Beneficial Insects",
            description: "Identify natural predators",
            onClick: () => handleHotspotClick("Beneficial insects info"),
          },
        ];
      case "irrigation":
        return [
          {
            position: [1, -1, -4] as [number, number, number],
            title: "Soil Moisture",
            description: "Check irrigation needs",
            onClick: () => handleHotspotClick("Soil moisture analysis"),
          },
          {
            position: [-3, 0, -1] as [number, number, number],
            title: "Sprinkler System",
            description: "Optimize water distribution",
            onClick: () => handleHotspotClick("Irrigation optimization"),
          },
        ];
      default:
        return [];
    }
  };

  return (
    <>
      {/* Farm Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Crop Rows */}
      {Array.from({ length: 5 }).map((_, i) => (
        <group key={i} position={[i * 2 - 4, -1.5, 0]}>
          {Array.from({ length: 10 }).map((_, j) => (
            <mesh key={j} position={[0, 0, j * 0.5 - 2.5]}>
              <cylinderGeometry args={[0.1, 0.1, 1]} />
              <meshStandardMaterial color="#4ade80" />
            </mesh>
          ))}
        </group>
      ))}

      {/* Interactive Hotspots */}
      {getHotspots().map((hotspot, index) => (
        <Hotspot key={index} {...hotspot} />
      ))}

      <Text
        position={[0, 3, -5]}
        fontSize={0.5}
        color="#2d5016"
        anchorX="center"
        anchorY="middle"
      >
        360° {scenarioType.charAt(0).toUpperCase() + scenarioType.slice(1)} Training
      </Text>

      <Environment preset="sunset" />
    </>
  );
};

interface Scene360ViewerProps {
  scenarioType: string;
  onBack: () => void;
  onQuiz?: () => void;
}

const Scene360Viewer = ({ scenarioType, onBack, onQuiz }: Scene360ViewerProps) => {
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([0, 0, 5]);
  const [zoomLevel, setZoomLevel] = useState(5);
  
  const handleZoomIn = () => {
    const newZoom = Math.max(2, zoomLevel - 1);
    setZoomLevel(newZoom);
    setCameraPosition([0, 0, newZoom]);
  };
  
  const handleZoomOut = () => {
    const newZoom = Math.min(10, zoomLevel + 1);
    setZoomLevel(newZoom);
    setCameraPosition([0, 0, newZoom]);
  };
  
  const handleReset = () => {
    setZoomLevel(5);
    setCameraPosition([0, 0, 5]);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative h-screen bg-gradient-sky"
    >
      {/* Controls Header */}
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
        <Button variant="ghost" onClick={onBack} className="bg-white/90 backdrop-blur-sm">
          <ArrowLeft className="h-5 w-5" />
          Back to Dashboard
        </Button>
        
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="bg-white/90 backdrop-blur-sm" onClick={handleReset}>
            <RotateCcw className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="bg-white/90 backdrop-blur-sm" onClick={handleZoomIn}>
            <ZoomIn className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="bg-white/90 backdrop-blur-sm" onClick={handleZoomOut}>
            <ZoomOut className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* 3D Scene */}
      <Canvas camera={{ position: cameraPosition, fov: 75 }}>
        <Suspense fallback={<Html center>Loading 3D Scene...</Html>}>
          <FarmScene scenarioType={scenarioType} />
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxDistance={10}
            minDistance={2}
          />
        </Suspense>
      </Canvas>

      {/* Info Panel */}
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <div className="bg-gradient-card backdrop-blur-md rounded-lg p-4 border border-border/50 shadow-glow">
          <div className="flex items-start gap-3">
            <div className="bg-accent/20 p-2 rounded-lg">
              <Info className="h-5 w-5 text-accent" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-foreground mb-1">
                Interactive {scenarioType.charAt(0).toUpperCase() + scenarioType.slice(1)} Training
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Click on the glowing hotspots to learn about different aspects of {scenarioType} management.
                Use your mouse to rotate and explore the 360° farm environment.
              </p>
              <div className="flex gap-2">
                <Button variant="farm" size="sm" onClick={() => console.log("AI Advisory for", scenarioType)}>
                  Get AI Advisory
                </Button>
                <Button variant="outline" size="sm" onClick={() => {
                  if (onQuiz) {
                    onQuiz();
                  } else {
                    console.log("Navigate to quiz for", scenarioType);
                  }
                }}>
                  Take Quiz
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Scene360Viewer;