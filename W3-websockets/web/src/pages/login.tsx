import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';

import { AUTH_TOKEN } from '../lib/constants';
import { LOGIN_MUTATION } from '../graphql/queries/user';

import Header from '../componenets/header';
import Container from '../componenets/container';

interface FormType {
  email: string;
  password: string;
}

function Form(props: any) {
  const router = useRouter();
  const [formState, setFormState] = useState<FormType>({
    email: '',
    password: '',
  });

  const [login, { loading, error }] = useMutation(LOGIN_MUTATION, {
    variables: {
      email: formState.email,
      password: formState.password,
    },
    // eslint-disable-next-line @typescript-eslint/no-shadow
    onCompleted: ({ login }) => {
      console.log('login', login);
      localStorage.setItem(AUTH_TOKEN, login.token);
      localStorage.setItem('user-id', login.user.id);
      router.push('/messages');
    },
  });

  const handleSubmit = () => {
    if (!formState.email || !formState.password) {
      console.log('error');
      return;
    }
    login();
  };

  if (loading)
    return (
      <div className="h-full w-full flex items-center justify-center">
        <p>loading...</p>
      </div>
    );
  if (error) return <div>error...</div>;

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md" {...props}>
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form onSubmit={handleSubmit} className="space-y-6" action="#" method="POST">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div className="mt-1">
              <input
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="mt-1">
              <input
                value={formState.password}
                onChange={(e) => setFormState({ ...formState, password: e.target.value })}
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-blue hover:bg-light-blue1 active:bg-dark-blue1 focus:outline-none"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const Login: NextPage = () => (
  <Container>
    <Header title={'Login'} />
    <Form />
  </Container>
);

export default Login;
