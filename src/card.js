/**
 * Card component for 52 Apps Tracker
 */

import { STATUS_INFO, getNextStatus, saveWeeks } from './data.js';

/**
 * Create a week card element
 * @param {Object} week - Week data object
 * @param {Array} weeks - All weeks array (for saving)
 * @param {string} userId - Authenticated user ID
 */
export function createCard(week, weeks, userId) {
    const card = document.createElement('div');
    card.className = 'week-card';
    card.dataset.week = week.weekNumber;

    // Week number and date (secondary info)
    const meta = document.createElement('div');
    meta.className = 'card-meta';
    meta.innerHTML = `
    <span class="week-number">Week ${week.weekNumber}</span>
    <span class="date-range">${week.dateRange}</span>
  `;

    // App name input (primary info)
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.className = 'app-name-input';
    nameInput.placeholder = 'App name...';
    nameInput.value = week.appName;
    nameInput.addEventListener('input', (e) => {
        week.appName = e.target.value;
        saveWeeks(userId, weeks);
    });
    nameInput.addEventListener('blur', () => {
        saveWeeks(userId, weeks);
    });

    // Status indicator
    const statusInfo = STATUS_INFO[week.status];
    const statusContainer = document.createElement('div');
    statusContainer.className = 'status-container';

    const statusIndicator = document.createElement('button');
    statusIndicator.className = `status-indicator ${statusInfo.className}`;
    statusIndicator.setAttribute('aria-label', `Status: ${statusInfo.label}. Click to change.`);

    const statusLabel = document.createElement('span');
    statusLabel.className = 'status-label';
    statusLabel.textContent = statusInfo.label;

    // Click to cycle status
    statusIndicator.addEventListener('click', () => {
        week.status = getNextStatus(week.status);
        const newInfo = STATUS_INFO[week.status];

        // Update indicator
        statusIndicator.className = `status-indicator ${newInfo.className}`;
        statusIndicator.setAttribute('aria-label', `Status: ${newInfo.label}. Click to change.`);

        // Update label
        statusLabel.textContent = newInfo.label;

        // Persist
        saveWeeks(userId, weeks);
    });

    statusContainer.appendChild(statusIndicator);
    statusContainer.appendChild(statusLabel);

    // Assemble card
    card.appendChild(meta);
    card.appendChild(nameInput);
    card.appendChild(statusContainer);

    return card;
}
