// src/firebase/authLoaders.ts
import { redirect } from "react-router-dom";
import { getAuth } from "firebase/auth";

// For protected routes - redirects to login if not authenticated
export async function requireAuth() {
  const auth = getAuth();
  
  // Wait briefly for auth to initialize if it hasn't already
  if (!auth.currentUser) {
    return new Promise((resolve, reject) => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        unsubscribe();
        if (!user) {
          // Redirect to login if no user
          reject(redirect("/login"));
        } else {
          resolve(user);
        }
      });
      
      // Don't wait too long - if auth is taking too long, redirect to login
      setTimeout(() => {
        unsubscribe();
        reject(redirect("/login"));
      }, 1000);
    });
  }
  
  // If we already have a user, return them
  return auth.currentUser;
}

// For public routes that change behavior when authenticated
export async function getAuthState() {
  const auth = getAuth();
  
  // If auth is already initialized, return current state
  if (auth.currentUser !== null || auth.currentUser === null) {
    return {
      user: auth.currentUser,
      isLoggedIn: !!auth.currentUser
    };
  }
  
  // Otherwise wait briefly for auth to initialize
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve({
        user,
        isLoggedIn: !!user
      });
    });
    
    // Don't wait too long
    setTimeout(() => {
      unsubscribe();
      resolve({
        user: null,
        isLoggedIn: false
      });
    }, 1000);
  });
}