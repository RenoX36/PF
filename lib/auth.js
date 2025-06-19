import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from 'next/router';

const AuthContext = createContext({ user: null });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);
  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  useEffect(() => {
    if (user === null) router.push('/login');
  }, [user]);
  return user;
}