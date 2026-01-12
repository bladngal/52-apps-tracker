/**
 * Data model and Firestore utilities for 52 Apps Tracker
 */

import { db } from './firebase.js';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';

// Status values matching the PRD
export const STATUS = {
  FUTURE: 'future',
  SUCCESS: 'success',
  DIDNT_SHIP: 'didnt_ship'
};

// Status cycle order
export const STATUS_CYCLE = [STATUS.FUTURE, STATUS.SUCCESS, STATUS.DIDNT_SHIP];

// Status display info
export const STATUS_INFO = {
  [STATUS.FUTURE]: { label: 'Future project', className: 'status-future' },
  [STATUS.SUCCESS]: { label: 'Success', className: 'status-success' },
  [STATUS.DIDNT_SHIP]: { label: "Didn't ship", className: 'status-didnt-ship' }
};

/**
 * Calculate date range for a given week number in 2026
 * Week 1 starts on Jan 1, 2026 (Wednesday)
 */
function getDateRange(weekNumber) {
  const year = 2026;
  const jan1 = new Date(year, 0, 1);

  const weekStart = new Date(jan1);
  weekStart.setDate(jan1.getDate() + (weekNumber - 1) * 7);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const startMonth = months[weekStart.getMonth()];
  const startDay = weekStart.getDate();
  const endMonth = months[weekEnd.getMonth()];
  const endDay = weekEnd.getDate();

  if (startMonth === endMonth) {
    return `${startMonth} ${startDay}–${endDay}`;
  } else {
    return `${startMonth} ${startDay}–${endMonth} ${endDay}`;
  }
}

/**
 * Generate default week data for all 52 weeks
 */
export function generateDefaultWeeks() {
  const weeks = [];
  for (let i = 1; i <= 52; i++) {
    weeks.push({
      weekNumber: i,
      dateRange: getDateRange(i),
      appName: '',
      status: STATUS.FUTURE
    });
  }
  return weeks;
}

/**
 * Merge stored data with defaults (ensures all 52 weeks exist)
 */
function mergeWithDefaults(storedWeeks) {
  const defaults = generateDefaultWeeks();
  if (!storedWeeks || !Array.isArray(storedWeeks)) {
    return defaults;
  }
  return defaults.map((defaultWeek, i) => ({
    ...defaultWeek,
    appName: storedWeeks[i]?.appName || '',
    status: storedWeeks[i]?.status || STATUS.FUTURE
  }));
}

/**
 * Subscribe to real-time weeks data from Firestore
 * @param {string} userId - The authenticated user's ID
 * @param {Function} callback - Called with weeks array on each update
 * @returns {Function} Unsubscribe function
 */
export function subscribeToWeeks(userId, callback) {
  const docRef = doc(db, 'users', userId);

  return onSnapshot(docRef, (snapshot) => {
    const data = snapshot.data();
    const weeks = mergeWithDefaults(data?.weeks);
    callback(weeks);
  }, (error) => {
    console.error('Error subscribing to weeks:', error);
    callback(generateDefaultWeeks());
  });
}

/**
 * Save weeks to Firestore
 * @param {string} userId - The authenticated user's ID
 * @param {Array} weeks - The weeks array to save
 */
export async function saveWeeks(userId, weeks) {
  try {
    const docRef = doc(db, 'users', userId);
    // Only save the mutable fields (weekNumber is implicit by index)
    const weeksData = weeks.map(w => ({
      weekNumber: w.weekNumber,
      appName: w.appName,
      status: w.status
    }));
    await setDoc(docRef, { weeks: weeksData }, { merge: true });
  } catch (error) {
    console.error('Error saving to Firestore:', error);
  }
}

/**
 * Get the next status in the cycle
 */
export function getNextStatus(currentStatus) {
  const currentIndex = STATUS_CYCLE.indexOf(currentStatus);
  const nextIndex = (currentIndex + 1) % STATUS_CYCLE.length;
  return STATUS_CYCLE[nextIndex];
}
