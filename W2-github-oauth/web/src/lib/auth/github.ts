export async function completeOauthFlow(
  code: string,
  state: string,
  redirectURI: string
) {
  const url = 'http://localhost:4000/github/oauth';
  const params = `?code=${code}&state=${state}&redirect_uri=${redirectURI}`;
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
