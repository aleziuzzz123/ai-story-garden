import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { loadStripe } from '@stripe/stripe-js';
import { CreditCard, Star, Loader2 } from 'lucide-react';
import { Header } from '@/components/Header'; // Import the reusable Header

const STRIPE_PUBLISHABLE_KEY = "pk_live_51MrAjNKucnJQ8ZaNSQ9ikK5Uz07cutNbhFK1NAUTPMxGcaJePh6XDNdccWi2zVWUPiv43yZA7HxjstgaHKNR1Dwc00VQBTFDSv"; 
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const CreditsPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [credits, setCredits] = useState(0);
  const [loadingCredits, setLoadingCredits] = useState(true);
  const [loadingPurchase, setLoadingPurchase] = useState(null);

  const creditPackages = [
    { nameKey: "credits_package_sparkler", credits: 50, price: "$10", priceId: "price_1RlG89KucnJQ8ZaNSQKACvJE" },
    { nameKey: "credits_package_dreamer", credits: 120, price: "$20", priceId: "price_1RlGA1KucnJQ8ZaNRUb9Ns0M", popular: true },
    { nameKey: "credits_package_visionary", credits: 300, price: "$40", priceId: "price_1RlGAoKucnJQ8ZaNuVLpIYJE" },
  ];

  useEffect(() => {
    const fetchCredits = async () => {
      if (!user) return;
      setLoadingCredits(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', user.id)
        .single();

      if (error) {
        toast({
          title: t('toast_credits_fetch_error_title'),
          description: error.message,
          variant: "destructive",
        });
      } else if (data) {
        setCredits(data.credits);
      }
      setLoadingCredits(false);
    };

    fetchCredits();
  }, [user, toast, t]);

  const handlePurchase = async (priceId) => {
    if (!user) {
        toast({
            title: t('toast_auth_error_title'),
            description: t('toast_auth_error_desc'),
            variant: "destructive",
        });
        return;
    }

    setLoadingPurchase(priceId);
    try {
        const { data, error: functionError } = await supabase.functions.invoke('create-checkout-session', {
            body: { 
                priceId: priceId,
                userId: user.id,
                userEmail: user.email
            },
        });

        if (functionError) {
            throw functionError;
        }

        const { sessionId } = data;
        const stripe = await stripePromise;
        const { error: stripeError } = await stripe.redirectToCheckout({ sessionId });

        if (stripeError) {
            throw stripeError;
        }
    } catch (error) {
        toast({
            title: t('toast_payment_error_title'),
            description: error.message || t('toast_payment_error_desc'),
            variant: "destructive",
        });
        setLoadingPurchase(null);
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('meta_title_credits')}</title>
        <meta name="description" content={t('meta_description_credits')} />
      </Helmet>
      
      <Header />

      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-orange-300">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">{t('credits_page_title')}</h1>
              <p className="text-xl text-white/80">
                {t('credits_page_subtitle')}
              </p>
            </div>

            <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 mb-8">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-gray-800">{t('credits_page_balance_title')}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                {loadingCredits ? (
                  <Loader2 className="h-12 w-12 mx-auto animate-spin text-purple-600" />
                ) : (
                  <p className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                    {credits}
                  </p>
                )}
                <p className="text-gray-600 mt-2">{t('credits_page_available_credits')}</p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-8">
              {creditPackages.map((pkg) => (
                <motion.div
                  key={pkg.nameKey}
                  whileHover={{ y: -10 }}
                  className={`relative ${pkg.popular ? 'transform md:scale-105' : ''}`}
                >
                  <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 h-full flex flex-col">
                    {pkg.popular && (
                      <div className="absolute -top-4 right-4 bg-yellow-400 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg z-10">
                        <Star className="inline h-4 w-4 mr-1" />
                        {t('credits_page_popular')}
                      </div>
                    )}
                    <CardHeader className="text-center">
                      <CardTitle className="text-2xl font-bold text-gray-800">{t(pkg.nameKey)}</CardTitle>
                      <CardDescription className="text-gray-600">{pkg.price}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col justify-between text-center">
                      <p className="text-5xl font-bold text-purple-600 mb-6">{pkg.credits}</p>
                      <Button
                        onClick={() => handlePurchase(pkg.priceId)}
                        disabled={loadingPurchase === pkg.priceId}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                      >
                        {loadingPurchase === pkg.priceId ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <>
                            <CreditCard className="mr-2 h-5 w-5" />
                            {t('credits_page_buy_now')}
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default CreditsPage;