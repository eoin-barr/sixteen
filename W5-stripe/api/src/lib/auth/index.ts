import { IncomingHttpHeaders } from 'http';
import { GqlUnauthorizedError } from '../errors';
import { authenticateBearerToken } from './bearer';
import { authenticateCookie, getCookieFromRequest } from './cookie';

export const BEARER_CREDENTIALS_REGEXP =
  /^ *[Bb][Ee][Aa][Rr][Ee][Rr] +([A-Za-z0-9\-._~+/]+=*) *$/;

function getAuthFunction(headers: IncomingHttpHeaders) {
  let token = '';
  token = getCookieFromRequest(headers);
  if (token) {
    return () => authenticateCookie(token);
  }

  if (!headers.authorization) {
    throw new GqlUnauthorizedError('No authorization header');
  }

  if (!BEARER_CREDENTIALS_REGEXP.exec(headers.authorization)) {
    throw new GqlUnauthorizedError('Invalid authorization header');
  }

  token = headers.authorization.split(' ')[1];

  return () => authenticateBearerToken(token);
}

function auth(req: IncomingHttpHeaders) {
  const af = new Promise<Function>((resolve) => {
    resolve(getAuthFunction(req));
  });
  return af.then((f) => f());
}

export { getAuthFunction, auth };
