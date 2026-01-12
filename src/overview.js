/**
 * 52 Apps Tracker - Overview Page
 * Minimal view with just status dots
 */

import { subscribeToWeeks, saveWeeks, getNextStatus, STATUS_INFO } from './data.js';
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

/**
 * Render all dots with current weeks data
 */
function renderWeeks(weeks, userId) {
    // Clear existing dots
    quarterRanges.forEach(({ quarter }) => {
        const row = document.querySelector(`.dots-row[data-quarter="${quarter}"]`);
        if (row) row.innerHTML = '';
    });

    // Render dots to each quarter row
    quarterRanges.forEach(({ quarter, start, end }) => {
        const row = document.querySelector(`.dots-row[data-quarter="${quarter}"]`);
        if (!row) return;

        for (let i = start; i <= end; i++) {
            const week = weeks[i - 1];
            const dot = createDot(week, weeks, userId);
            row.appendChild(dot);
        }
    });
}

/**
 * Create a single status dot
 */
function createDot(week, weeks, userId) {
    const statusInfo = STATUS_INFO[week.status];

    const dot = document.createElement('button');
    dot.className = `overview-dot ${statusInfo.className}`;
    dot.setAttribute('aria-label', `Week ${week.weekNumber}: ${statusInfo.label}`);
    dot.title = `Week ${week.weekNumber}: ${statusInfo.label}`;

    dot.addEventListener('click', () => {
        week.status = getNextStatus(week.status);
        const newInfo = STATUS_INFO[week.status];

        dot.className = `overview-dot ${newInfo.className}`;
        dot.setAttribute('aria-label', `Week ${week.weekNumber}: ${newInfo.label}`);
        dot.title = `Week ${week.weekNumber}: ${newInfo.label}`;

        saveWeeks(userId, weeks);
    });

    return dot;
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
