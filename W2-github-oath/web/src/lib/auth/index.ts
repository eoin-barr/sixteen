import Router from 'next/router';

export const logout = async () => {
  await fetch('http://localhost:4000/logout', {
    method: 'GET',
    credentials: 'include',
  });
  Router.push('/login');
};
