/**
 * 52 Apps Tracker - Main Application
 */

import { subscribeToWeeks } from './data.js';
import { createCard } from './card.js';
import { initAuth } from './auth.js';
import './style.css';

// Quarter ranges
const quarterRanges = [
    { quarter: 1, start: 1, end: 13 },
    { quarter: 2, start: 14, end: 26 },
    { quarter: 3, start: 27, end: 39 },
    { quarter: 4, start: 40, end: 52 }
];

// Track current subscription
let unsubscribe = null;

// Track if initial render has happened
let hasRendered = false;

/**
 * Render all cards with current weeks data
 */
function renderWeeks(weeks, userId) {
    // Skip re-render if user is actively typing in an input
    const activeEl = document.activeElement;
    if (hasRendered && activeEl && activeEl.classList.contains('app-name-input')) {
        return;
    }

    // Clear existing cards
    quarterRanges.forEach(({ quarter }) => {
        const grid = document.querySelector(`[data-quarter="${quarter}"]`);
        if (grid) grid.innerHTML = '';
    });

    // Render cards to each quarter
    quarterRanges.forEach(({ quarter, start, end }) => {
        const grid = document.querySelector(`[data-quarter="${quarter}"]`);
        if (!grid) return;

        for (let i = start; i <= end; i++) {
            const week = weeks[i - 1];
            const card = createCard(week, weeks, userId);
            grid.appendChild(card);
        }
    });

    hasRendered = true;
}

/**
 * Handle auth state changes
 */
function handleAuthChange(user) {
    // Cleanup previous subscription
    if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
    }

    if (user) {
        // Subscribe to real-time updates
        unsubscribe = subscribeToWeeks(user.uid, (weeks) => {
            renderWeeks(weeks, user.uid);
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initAuth(handleAuthChange);
});
