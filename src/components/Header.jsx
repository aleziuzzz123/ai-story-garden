// src/components/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Sparkles, LogOut, Crown, BookMarked, Trees, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Header = () => {
  const { user, signOut } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-purple-500" />
          <span className="text-xl font-bold text-gray-800">
            AI Story Garden
          </span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4">
          {user ? (
            // --- LOGGED-IN USER VIEW ---
            <>
              <Button asChild variant="ghost" className="hidden sm:inline-flex">
                <Link to="/my-cast"><Users className="mr-2 h-4 w-4" />{t('nav_my_cast')}</Link>
              </Button>
              <Button asChild variant="ghost" className="hidden sm:inline-flex">
                <Link to="/community"><Trees className="mr-2 h-4 w-4" />{t('nav_community')}</Link>
              </Button>
              <LanguageSwitcher />
              <Button onClick={handleSignOut} variant="outline">
                <LogOut className="mr-2 h-4 w-4" />
                {t('nav_sign_out')}
              </Button>
            </>
          ) : (
            // --- LOGGED-OUT USER VIEW ---
            <>
              <LanguageSwitcher />
              <Link to="/login">
                <Button>{t('login_button')}</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};