import axios from 'axios';
import { io } from 'socket.io-client';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');

export const api = axios.create({
  baseURL: API_URL,
});

// Initial auth header
const token = localStorage.getItem('mergemind_token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export const socket = io(API_URL);
