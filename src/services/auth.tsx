import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { auth } from './firebase';
import { MOCK_STUDENT, Student } from '../data';

type AuthCtx = {
  user: User | null;
  student: Student;
  loading: boolean;
  logout: () => Promise<void>;
  /** true when using demo/mock mode (no real Firebase user) */
  useMock: boolean;
  enterDemoMode: () => void;
};

const Ctx = createContext<AuthCtx>({
  user: null,
  student: MOCK_STUDENT,
  loading: true,
  logout: async () => {},
  useMock: false,
  enterDemoMode: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);

  const useMock = demoMode && !user;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const student: Student = user
    ? {
        uid: user.uid,
        name: user.displayName ?? 'Student',
        regNo: user.email?.split('@')[0].toUpperCase() ?? 'UNKNOWN',
        email: user.email ?? '',
        department: MOCK_STUDENT.department,
        semester: MOCK_STUDENT.semester,
        batch: MOCK_STUDENT.batch,
        college: MOCK_STUDENT.college,
      }
    : MOCK_STUDENT;

  const logout = async () => {
    setDemoMode(false);
    await signOut(auth);
  };

  const enterDemoMode = () => setDemoMode(true);

  return (
    <Ctx.Provider value={{ user, student, loading, logout, useMock, enterDemoMode }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);
