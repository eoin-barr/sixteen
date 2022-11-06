import { ChakraProvider } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { Account } from '../components/account';
import Auth from '../components/auth/auth';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const getInfo = async () => {
      const {
        data: { session: se },
      } = await supabase.auth.getSession();
      if (se) setSession(se);
      supabase.auth.onAuthStateChange((_event, s) => {
        setSession(s);
      });
    };

    getInfo();
  }, []);

  return (
    <ChakraProvider>{!session ? <Auth /> : <Account session={session} />}</ChakraProvider>
  );
}
