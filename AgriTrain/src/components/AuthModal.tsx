import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { X, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    fullName: '',
  });
  const [error, setError] = useState<string | null>(null);

  const { login, register, error: authError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isLogin) {
        await login({
          email: formData.email,
          password: formData.password,
        });
      } else {
        await register({
          email: formData.email,
          username: formData.username,
          password: formData.password,
          full_name: formData.fullName || undefined,
        });
      }
      onClose();
      setFormData({ email: '', username: '', password: '', fullName: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setFormData({ email: '', username: '', password: '', fullName: '' });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md"
        >
          <Card className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 z-10"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>

            <CardHeader className="pb-4">
              <CardTitle className="text-2xl text-center">
                {isLogin ? 'Welcome Back' : 'Join AgriTrain'}
              </CardTitle>
              <CardDescription className="text-center">
                {isLogin 
                  ? 'Sign in to continue your agricultural training journey'
                  : 'Create an account to start your agricultural training journey'
                }
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Tabs value={isLogin ? 'login' : 'register'} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login" onClick={() => setIsLogin(true)}>
                    Login
                  </TabsTrigger>
                  <TabsTrigger value="register" onClick={() => setIsLogin(false)}>
                    Register
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-4">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Sign In
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="register" className="space-y-4">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-username">Username</Label>
                      <Input
                        id="register-username"
                        type="text"
                        placeholder="Choose a username"
                        value={formData.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-fullname">Full Name (Optional)</Label>
                      <Input
                        id="register-fullname"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Create Account
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              {(error || authError) && (
                <Alert className="mt-4">
                  <AlertDescription>
                    {error || authError}
                  </AlertDescription>
                </Alert>
              )}

              <div className="mt-4 text-center text-sm text-muted-foreground">
                {isLogin ? (
                  <>
                    Don't have an account?{' '}
                    <Button variant="link" className="p-0 h-auto" onClick={switchMode}>
                      Sign up
                    </Button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <Button variant="link" className="p-0 h-auto" onClick={switchMode}>
                      Sign in
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthModal;
