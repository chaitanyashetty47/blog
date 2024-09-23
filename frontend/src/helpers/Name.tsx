import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  name?: string;
}

export function getNameFromToken(): string | null {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.name || null;
  } catch (error) {
    console.error('Failed to decode token', error);
    return null;
  }
}