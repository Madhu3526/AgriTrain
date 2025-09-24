import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/enhanced-button";
import { Home, AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="bg-gradient-farm p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <AlertTriangle className="h-12 w-12 text-white" />
        </div>
        <h1 className="mb-4 text-6xl font-bold text-white">404</h1>
        <p className="mb-6 text-xl text-white/80">Oops! This page doesn't exist in our farm</p>
        <p className="mb-8 text-white/60">The page you're looking for might have been moved or deleted.</p>
        <Link to="/">
          <Button variant="hero" size="lg">
            <Home className="h-5 w-5" />
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
