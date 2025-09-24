import { Mic, User, Menu, LogOut, History } from "lucide-react";
import { Button } from "@/components/ui/enhanced-button";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "./AuthModal";
import UserSessions from "./UserSessions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface HeaderProps {
  onVoiceCommand: () => void;
}

const Header = ({ onVoiceCommand }: HeaderProps) => {
  const [isListening, setIsListening] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const handleVoiceClick = () => {
    setIsListening(!isListening);
    onVoiceCommand();
  };

  const handleUserClick = () => {
    if (isAuthenticated) {
      // Could open user profile or settings
      return;
    }
    setShowAuthModal(true);
  };

  return (
    <>
      <header className="bg-gradient-card backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-farm p-2 rounded-lg shadow-farm">
              <span className="text-white font-bold text-xl">🌾</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">AgriTrain AI</h1>
              <p className="text-sm text-muted-foreground">360° Farm Training</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="voice"
              size="voice-sm"
              onClick={handleVoiceClick}
              className={isListening ? "bg-accent/90 animate-pulse" : ""}
            >
              <Mic className={`h-5 w-5 ${isListening ? "text-accent-foreground" : ""}`} />
            </Button>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" title="View Login History">
                      <History className="h-5 w-5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Login Sessions</DialogTitle>
                    </DialogHeader>
                    <UserSessions />
                  </DialogContent>
                </Dialog>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem disabled>
                      <User className="mr-2 h-4 w-4" />
                      {user?.username || user?.email}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Button variant="ghost" size="icon" onClick={handleUserClick}>
                <User className="h-5 w-5" />
              </Button>
            )}
            
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
};

export default Header;