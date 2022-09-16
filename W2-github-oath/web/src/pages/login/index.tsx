import { NextPage } from 'next';
import React, { useState } from 'react';
import { FiGithub } from 'react-icons/fi';

const Login: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const state = '/';
  const base = `https://github.com/login/oauth/authorize`;
  // redirect to login callback
  const params = `?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_LOGIN_REDIRECT_URI}&state=${state}`;
  const url = base + params;

  function handleSubmit() {
    setLoading(true);
    window.location.href = url;
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-black">
      <button
        onClick={handleSubmit}
        className="flex rounded-lg bg-gray-700 p-4 hover:bg-gray-900"
      >
        {loading ? (
          <span>Loading</span>
        ) : (
          <div className="flex">
            <span>Login with Github</span>
            <FiGithub className="w-6 h-6 pl-2" />
          </div>
        )}
      </button>
    </div>
  );
};

export default Login;
