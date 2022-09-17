import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';

import { GET_USER_DETAILS } from '../../graphql/queries/user';

export function useUser() {
  const { loading, error, data } = useQuery(GET_USER_DETAILS);
  if (loading || error) {
    return null;
  }
  return data.me;
}

export function useUserSession() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const {
    loading: userLoading,
    error: userError,
    data: userData,
  } = useQuery(GET_USER_DETAILS);

  useEffect(() => {
    if (userLoading) {
      return;
    }

    if (!userError) {
      setReady(true);
      return;
    }

    if (userError && userError.graphQLErrors[0]?.extensions.code === 'UNAUTHORIZED') {
      router.push(`/login?origin=${router.pathname}`, '/login', { shallow: true });
      return;
    }

    setReady(true);
  }, [userError, userLoading, userData]);

  return {
    user: userData?.me,
    loading: userLoading || !ready,
    error:
      userError && userError.graphQLErrors[0]?.extensions.code !== 'UNAUTHORIZED'
        ? userError.message
        : null,
  };
}
