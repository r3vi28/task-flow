// A trivial useNavigate stub for environments without react-router.
// It simply logs navigation. In a real app, replace with react-router's hook.
import { useCallback } from 'react';

export const useNavigate = () => {
  return useCallback((path: string) => {
    console.log(`Navigating to ${path}`);
  }, []);
};
