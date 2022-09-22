import type { NextPage } from 'next';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';

import Header from '../componenets/header';
import { AUTH_TOKEN } from '../lib/constants';
import Container from '../componenets/container';
import { SIGNUP_MUTATION } from '../graphql/queries/user';

interface FormType {
  name: string;
  email: string;
  password: string;
}

function Form() {
  const router = useRouter();
  const [nameError, setNameError] = useState<string | null>(null);
  const [formState, setFormState] = useState<FormType>({
    name: '',
    email: '',
    password: '',
  });

  const [signup, { error, loading }] = useMutation(SIGNUP_MUTATION, {
    variables: {
      name: formState.name,
      email: formState.email,
      password: formState.password,
    },
    // eslint-disable-next-line @typescript-eslint/no-shadow
    onCompleted: ({ signup }) => {
      localStorage.setItem(AUTH_TOKEN, signup.token);
      router.push('/login');
    },
  });

  const handleSubmit = () => {
    if (!formState.name || !formState.email || !formState.password) {
      setNameError('All fields must be filled in');
      return;
    }
    signup();
  };

  if (loading)
    return (
      <div className="h-full w-full flex items-center justify-center">
        <p>loading...</p>
      </div>
    );
  if (error) return <div>error...</div>;

  return (
    <div className="'mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form
          action="#"
          method="POST"
          className="space-y-6"
          onSubmit={() => handleSubmit()}
        >
          <div>
            <label htmlFor="text" className="block text-sm font-medium text-grey-700">
              Name
            </label>
            <div className="mt-1">
              <input
                value={formState.name}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                id="text"
                name="text"
                type="text"
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div className="mt-1">
              <input
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                id="email"
                type="email"
                name="email"
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
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const Home: NextPage = () => (
  <Container>
    <Header title={'Sign up'} />
    <Form />
  </Container>
);

export default Home;
