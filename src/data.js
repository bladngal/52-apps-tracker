/**
 * Data model and LocalStorage utilities for 52 Apps Tracker
 */

const STORAGE_KEY = '52_apps_2026';

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
  const jan1 = new Date(year, 0, 1); // Jan 1, 2026
  
  // Calculate start of the week (week 1 starts Jan 1)
  const weekStart = new Date(jan1);
  weekStart.setDate(jan1.getDate() + (weekNumber - 1) * 7);
  
  // Calculate end of the week (6 days later)
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  
  // Format the dates
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const startMonth = months[weekStart.getMonth()];
  const startDay = weekStart.getDate();
  const endMonth = months[weekEnd.getMonth()];
  const endDay = weekEnd.getDate();
  
  // Same month format: "Jan 1–7"
  // Different month format: "Jan 29–Feb 4"
  if (startMonth === endMonth) {
    return `${startMonth} ${startDay}–${endDay}`;
  } else {
    return `${startMonth} ${startDay}–${endMonth} ${endDay}`;
  }
}

/**
 * Generate default week data for all 52 weeks
 */
function generateDefaultWeeks() {
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
 * Load weeks from LocalStorage or generate defaults
 */
export function loadWeeks() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      // Ensure all 52 weeks exist and have valid data
      const defaults = generateDefaultWeeks();
      return defaults.map((defaultWeek, i) => ({
        ...defaultWeek,
        appName: data[i]?.appName || '',
        status: data[i]?.status || STATUS.FUTURE
      }));
    }
  } catch (e) {
    console.error('Error loading from LocalStorage:', e);
  }
  return generateDefaultWeeks();
}

/**
 * Save weeks to LocalStorage
 */
export function saveWeeks(weeks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(weeks));
  } catch (e) {
    console.error('Error saving to LocalStorage:', e);
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
