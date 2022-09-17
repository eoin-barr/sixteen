export async function loginWithGithub(code: string, state: string) {
  const url = 'http://localhost:4000/login';
  const params = `?code=${code}&state=${state}`;
  const endpoint = url + params;

  const res = await fetch(endpoint, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.status;
}
