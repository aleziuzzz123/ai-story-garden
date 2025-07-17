import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Sparkles, ArrowLeft } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      if (error.message === 'Email not confirmed') {
        toast({
          title: "Email not confirmed",
          description: "Please check your inbox and click the confirmation link to log in.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Welcome back! 🎉",
        description: "You're now logged in and ready to create amazing stories!",
      });
      navigate('/dashboard');
    }
    
    setLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>Log In - AI Story Garden</title>
        <meta name="description" content="Log in to your AI Story Garden account and continue creating magical children's stories." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-orange-300 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="inline-flex items-center text-white hover:text-yellow-300 mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>

          <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Sparkles className="h-12 w-12 text-purple-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800">Welcome Back!</CardTitle>
              <CardDescription className="text-gray-600">
                Log in to continue creating magical stories
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white border-gray-300"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-white border-gray-300"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Log In'}
                </Button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-purple-600 hover:text-purple-700 font-medium">
                    Sign up for free
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;