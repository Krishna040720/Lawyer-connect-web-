import { io } from 'socket.io-client';
import { API_URL } from './api';

let socket = null;

// Creates (or reuses) a single socket connection authenticated with the JWT
export function getSocket() {
  const token = localStorage.getItem('lc_token');
  if (!socket && token) {
    socket = io(API_URL, { auth: { token } });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
