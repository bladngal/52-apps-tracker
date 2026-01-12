/**
 * Authentication module for 52 Apps Tracker
 * Handles Google sign-in/sign-out and auth state UI
 */

import { auth, googleProvider } from './firebase.js';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

/**
 * Sign in with Google
 */
export async function signIn() {
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (error) {
    console.error('Sign in error:', error);
    alert('Failed to sign in. Please try again.');
  }
}

/**
 * Sign out
 */
export async function logOut() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign out error:', error);
  }
}

/**
 * Initialize auth UI and return a promise that resolves with the user
 * @param {Function} onUserChange - Callback when auth state changes
 */
export function initAuth(onUserChange) {
  const authContainer = document.getElementById('auth-container');
  const appContent = document.getElementById('app-content');

  // Render auth UI
  renderAuthUI(authContainer);

  // Listen for auth state changes
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in
      showSignedInState(authContainer, user);
      if (appContent) appContent.style.display = '';
    } else {
      // User is signed out
      showSignedOutState(authContainer);
      if (appContent) appContent.style.display = 'none';
    }
    onUserChange(user);
  });
}

/**
 * Render the auth container structure
 */
function renderAuthUI(container) {
  if (!container) return;

  container.innerHTML = `
    <div class="auth-signed-out">
      <p class="auth-message">Sign in to track your 52 apps challenge</p>
      <button class="auth-button auth-sign-in">
        <svg class="google-icon" viewBox="0 0 24 24" width="18" height="18">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Sign in with Google
      </button>
    </div>
    <div class="auth-signed-in" style="display: none;">
      <div class="auth-user">
        <img class="auth-avatar" src="" alt="Profile" />
        <span class="auth-name"></span>
      </div>
      <button class="auth-button auth-sign-out">Sign out</button>
    </div>
  `;

  // Attach event listeners
  const signInBtn = container.querySelector('.auth-sign-in');
  const signOutBtn = container.querySelector('.auth-sign-out');

  signInBtn?.addEventListener('click', signIn);
  signOutBtn?.addEventListener('click', logOut);
}

/**
 * Show signed-in state
 */
function showSignedInState(container, user) {
  if (!container) return;

  const signedOut = container.querySelector('.auth-signed-out');
  const signedIn = container.querySelector('.auth-signed-in');
  const avatar = container.querySelector('.auth-avatar');
  const name = container.querySelector('.auth-name');

  if (signedOut) signedOut.style.display = 'none';
  if (signedIn) signedIn.style.display = '';

  // Handle avatar - hide if no photo, show initials fallback
  if (avatar) {
    if (user.photoURL) {
      avatar.src = user.photoURL;
      avatar.style.display = '';
    } else {
      avatar.style.display = 'none';
    }
  }

  if (name) name.textContent = user.displayName || user.email;
}

/**
 * Show signed-out state
 */
function showSignedOutState(container) {
  if (!container) return;

  const signedOut = container.querySelector('.auth-signed-out');
  const signedIn = container.querySelector('.auth-signed-in');

  if (signedOut) signedOut.style.display = '';
  if (signedIn) signedIn.style.display = 'none';
}
