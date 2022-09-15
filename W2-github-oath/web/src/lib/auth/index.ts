import Router from 'next/router';

export const logout = async () => {
  await fetch('http://localhost:4000/logout', {
    method: 'POST',
    credentials: 'include',
  });
  Router.push('/login');
};
