import { AUTH_TOKEN } from '../constants';

export function setToken(token: string) {
  window.localStorage.setItem(AUTH_TOKEN, token);
}

export function getToken() {
  return window.localStorage.getItem(AUTH_TOKEN);
}

export function removeToken() {
  window.localStorage.removeItem(AUTH_TOKEN);
}

export function getPayLoad() {
  const token = getToken();
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length < 3) return false;
  return JSON.parse(atob(parts[1]));
}

export function isAuthenticated() {
  const payload = getPayLoad();
  if (!payload) return false;
  const now = Math.round(Date.now() / 1000);
  return now < payload.exp;
}

export function isOwner(userId: number) {
  const payload = getPayLoad();
  if (!payload) return false;
  return userId === payload.sub;
}

export function getUserId() {
  const payload = getPayLoad();
  if (!payload) return false;
  return payload.userId;
}
