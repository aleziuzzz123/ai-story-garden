import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { loadStripe } from '@stripe/stripe-js';
import { Sparkles, ArrowLeft, CreditCard, Star, Loader2 } from 'lucide-react';

const STRIPE_PUBLISHABLE_KEY = "pk_live_51MrAjNKucnJQ8ZaNSQ9ikK5Uz07cutNbhFK1NAUTPMxGcaJePh6XDNdccWi2zVWUPiv43yZA7HxjstgaHKNR1Dwc00VQBTFDSv"; 
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const creditPackages = [
  { name: "Sparkler Pack", credits: 50, price: "$10", priceId: "price_1RlG89KucnJQ8ZaNSQKACvJE" },
  { name: "Dreamer Pack", credits: 120, price: "$20", priceId: "price_1RlGA1KucnJQ8ZaNRUb9Ns0M", popular: true },
  { name: "Visionary Pack", credits: 300, price: "$40", priceId: "price_1RlGAoKucnJQ8ZaNuVLpIYJE" },
];

const CreditsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [credits, setCredits] = useState(0);
  const [loadingCredits, setLoadingCredits] = useState(true);
  const [loadingPurchase, setLoadingPurchase] = useState(null);

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
          title: "Error fetching credits",
          description: error.message,
          variant: "destructive",
        });
      } else if (data) {
        setCredits(data.credits);
      }
      setLoadingCredits(false);
    };

    fetchCredits();
  }, [user, toast]);

  const handlePurchase = async (priceId) => {
    if (!user) {
        toast({
            title: "Authentication Error",
            description: "You must be logged in to make a purchase.",
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
            title: "Payment Error",
            description: error.message || "Could not redirect to checkout. Please try again.",
            variant: "destructive",
        });
        setLoadingPurchase(null);
    }
  };

  return (
    <>
      <Helmet>
        <title>Buy Credits - AI Story Garden</title>
        <meta name="description" content="Purchase credits to create more magical storybooks with AI Story Garden." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-orange-300">
        <header className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-8 w-8 text-white" />
            <span className="text-2xl font-bold text-white">AI Story Garden</span>
          </div>
          
          <Link to="/dashboard">
            <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </header>

        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">Get More Credits</h1>
              <p className="text-xl text-white/80">
                Unlock more stories with our new, affordable credit packs!
              </p>
            </div>

            <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 mb-8">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-gray-800">Your Balance</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                {loadingCredits ? (
                  <Loader2 className="h-12 w-12 mx-auto animate-spin text-purple-600" />
                ) : (
                  <p className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                    {credits}
                  </p>
                )}
                <p className="text-gray-600 mt-2">Available Credits</p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-8">
              {creditPackages.map((pkg) => (
                <motion.div
                  key={pkg.name}
                  whileHover={{ y: -10 }}
                  className={`relative ${pkg.popular ? 'transform md:scale-105' : ''}`}
                >
                  <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 h-full flex flex-col">
                    {pkg.popular && (
                      <div className="absolute -top-4 right-4 bg-yellow-400 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg z-10">
                        <Star className="inline h-4 w-4 mr-1" />
                        Popular
                      </div>
                    )}
                    <CardHeader className="text-center">
                      <CardTitle className="text-2xl font-bold text-gray-800">{pkg.name}</CardTitle>
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
                            Buy Now
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