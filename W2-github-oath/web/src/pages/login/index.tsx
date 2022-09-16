import { NextPage } from 'next';
import React, { useState } from 'react';
import { AiFillGithub } from 'react-icons/ai';
import Loading from '../../components/loading';

const Login: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const state = '/';
  const base = `https://github.com/login/oauth/authorize`;
  // redirect to login callback
  const params = `?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&scope=user&redirect_uri=${process.env.NEXT_PUBLIC_LOGIN_REDIRECT_URI}&state=${state}`;
  const url = base + params;

  function handleSubmit() {
    setLoading(true);
    window.location.href = url;
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-purple1">
      <button
        onClick={handleSubmit}
        className="flex items-center justify-center rounded-lg bg-purple2 p-4 hover:bg-purple3 w-[200px]"
      >
        {loading ? (
          <Loading />
        ) : (
          <div className="flex items-center">
            <span className="mr-2">Login with Github</span>
            <AiFillGithub className="w-6 h-6" />
          </div>
        )}
      </button>
    </div>
  );
};

export default Login;
