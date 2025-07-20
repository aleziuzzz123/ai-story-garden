import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Sparkles, ArrowLeft } from 'lucide-react';

const LoginPage = () => {
  const { t } = useTranslation();
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
          title: t('toast_email_not_confirmed_title'),
          description: t('toast_email_not_confirmed_desc'),
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: t('toast_login_success'),
        description: t('toast_welcome_back_desc'),
      });
      navigate('/dashboard');
    }

    setLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>{t('login_button')} - AI Story Garden</title>
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-orange-300 flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-6 text-center">
            <Link to="/" className="inline-flex items-center gap-2 text-white font-semibold hover:underline">
              <ArrowLeft className="h-4 w-4" />
              {t('login_page_back_home')}
            </Link>
          </div>

          <Card className="bg-white/90 backdrop-blur-sm border-none shadow-2xl rounded-3xl">
            <CardHeader className="text-center">
              <Sparkles className="mx-auto h-12 w-12 text-yellow-400" />
              <CardTitle className="text-3xl font-bold text-gray-800">{t('login_page_title')}</CardTitle>
              <CardDescription className="text-gray-600">{t('login_page_subtitle')}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t('form_email_label')}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('form_email_placeholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white border-gray-300"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">{t('form_password_label')}</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder={t('form_password_placeholder')}
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
                  {loading ? t('login_page_logging_in') : t('login_button')}
                </Button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  {t('login_page_no_account')}
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