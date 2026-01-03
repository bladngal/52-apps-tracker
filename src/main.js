/**
 * 52 Apps Tracker - Main Application
 */

import { loadWeeks } from './data.js';
import { createCard } from './card.js';
import './style.css';

// Initialize the application
function init() {
    const weeks = loadWeeks();

    // Render cards to each quarter
    const quarterRanges = [
        { quarter: 1, start: 1, end: 13 },
        { quarter: 2, start: 14, end: 26 },
        { quarter: 3, start: 27, end: 39 },
        { quarter: 4, start: 40, end: 52 }
    ];

    quarterRanges.forEach(({ quarter, start, end }) => {
        const grid = document.querySelector(`[data-quarter="${quarter}"]`);
        if (!grid) return;

        for (let i = start; i <= end; i++) {
            const week = weeks[i - 1]; // Array is 0-indexed
            const card = createCard(week, weeks);
            grid.appendChild(card);
        }
    });
}

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', init);
