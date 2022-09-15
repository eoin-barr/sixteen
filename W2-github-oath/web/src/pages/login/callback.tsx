import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { loginWithGithub } from '../../lib/auth/login';

const GithubOauthCallback: NextPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (Object.keys(router.query).length !== 0) {
      if (!router.query.code || !router.query.state) {
        setLoading(false);
        setError('Invalid query params');
        return;
      }
      loginWithGithub(router.query.code as string, router.query.state as string)
        .then((status) => {
          if (status !== 200) {
            setLoading(false);
            setError('Failed to complete oauth flow');
            return;
          }
          router.push(router.query.state as string);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
          setError('Failed to login');
        });
    }
  }, [router.query]);

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-black">
      {loading ? <div>Loading</div> : <div>{error}</div>}
    </div>
  );
};

export default GithubOauthCallback;
