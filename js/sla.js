// sla.js — SLA targets and the game clock.
//
// SLA = Service Level Agreement: the deadline the help desk promises
// for each ticket, based on priority. There are two clocks:
//   First response = how fast someone must reply to the user
//   Resolution     = how fast the problem must be fixed

// ===== Game speed =====
// 1 real second = 15 game seconds, so 1 real minute = 15 work minutes.
// Change this number to make the game faster or slower.
const GAME_SPEED = 15;

// ===== SLA targets, in game minutes =====
const SLA_TARGETS = {
  P1: { response: 15,  resolve: 4 * 60 },    // 15 min / 4 hrs
  P2: { response: 60,  resolve: 8 * 60 },    // 1 hr   / 8 hrs
  P3: { response: 240, resolve: 24 * 60 },   // 4 hrs  / 24 hrs
  P4: { response: 480, resolve: 40 * 60 }    // 8 hrs  / 40 hrs
};

// Until you set a priority, the clock uses P3 targets.
// Many real help desks default new tickets to Medium the same way.
const DEFAULT_PRIORITY = "P3";

// These statuses pause the clock. Waiting on the user isn't your delay.
const PAUSED_STATUSES = ["Waiting on User", "On Hold"];

// These statuses stop the clock for good (the ticket is done).
const DONE_STATUSES = ["Resolved", "Closed"];

// Get the targets for a priority ("" means not set yet)
function slaTargets(priority) {
  return SLA_TARGETS[priority] || SLA_TARGETS[DEFAULT_PRIORITY];
}

// Turn minutes into readable text: 75 -> "1h 15m", 30 -> "30m"
function formatMinutes(minutes) {
  const total = Math.max(0, Math.round(minutes));
  const hours = Math.floor(total / 60);
  const mins = total % 60;
  if (hours === 0) {
    return mins + "m";
  }
  return hours + "h " + mins + "m";
}

// Work out how one SLA clock is doing.
//   target  = minutes allowed
//   elapsed = minutes used so far (paused time doesn't count)
//   metAt   = minute it was completed, or null if not done yet
// Returns { text, color } for the page to show.
function slaClock(target, elapsed, metAt, paused) {
  // Already done: was it on time?
  if (metAt !== null) {
    if (metAt <= target) {
      return { text: "Met", color: "met" };
    }
    return { text: "Missed by " + formatMinutes(metAt - target), color: "breached" };
  }

  const left = target - elapsed;

  // Ran out of time
  if (left <= 0) {
    return { text: "Breached " + formatMinutes(-left) + " ago", color: "breached" };
  }

  if (paused) {
    return { text: formatMinutes(left) + " left (paused)", color: "paused" };
  }

  // Half the time or less left = warning
  if (left <= target / 2) {
    return { text: formatMinutes(left) + " left", color: "warning" };
  }
  return { text: formatMinutes(left) + " left", color: "ok" };
}
