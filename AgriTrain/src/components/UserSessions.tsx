import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Monitor, LogOut } from 'lucide-react';
import { apiService, UserSession } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

const UserSessions: React.FC = () => {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadSessions();
    }
  }, [user]);

  const loadSessions = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const sessionsData = await apiService.getUserSessions(user.id);
      setSessions(sessionsData);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load sessions');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getSessionDuration = (loginTime: string, logoutTime?: string) => {
    const login = new Date(loginTime);
    const logout = logoutTime ? new Date(logoutTime) : new Date();
    const diffMs = logout.getTime() - login.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`;
    }
    return `${diffMinutes}m`;
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Login Sessions</CardTitle>
          <CardDescription>Please log in to view your session history</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Login Sessions</CardTitle>
          <CardDescription>Loading your session history...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Login Sessions</CardTitle>
          <CardDescription>Error loading sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">{error}</div>
          <Button onClick={loadSessions} className="mt-2">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Login Sessions
        </CardTitle>
        <CardDescription>
          Your login history and session details
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sessions.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            No sessions found
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="border rounded-lg p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant={session.is_active ? "default" : "secondary"}>
                      {session.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Session #{session.id}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Duration: {getSessionDuration(session.login_time, session.logout_time)}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      <strong>Login:</strong> {formatDate(session.login_time)}
                    </span>
                  </div>
                  
                  {session.logout_time && (
                    <div className="flex items-center gap-2">
                      <LogOut className="h-4 w-4 text-muted-foreground" />
                      <span>
                        <strong>Logout:</strong> {formatDate(session.logout_time)}
                      </span>
                    </div>
                  )}
                  
                  {session.ip_address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>
                        <strong>IP:</strong> {session.ip_address}
                      </span>
                    </div>
                  )}
                  
                  {session.user_agent && (
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">
                        <strong>Device:</strong> {session.user_agent.split(' ')[0]}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserSessions;
