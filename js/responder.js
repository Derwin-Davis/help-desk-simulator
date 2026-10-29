// responder.js — plays the end users.
//
// v1: users answer from the script in tickets.js.
// v2: this file gets swapped for one that asks Claude to play the user.
// The rest of the app only ever calls getUserReply(), so nothing else
// has to change when that swap happens.

// How long the user takes to "type" (milliseconds). 2000 = 2 seconds.
const USER_TYPING_DELAY = 2000;

// What the user says if you ask the same thing twice
const REPEAT_REPLY = "I already answered that. Did you see my last message?";

// Get the user's answer to one of your replies.
//   ticket   — the ticket from tickets.js
//   state    — your work on it (from app.js)
//   actionId — which action you picked, or "general" for none
//
// It returns a Promise: an "IOU" for an answer that arrives later.
// That's on purpose. A real AI user takes time to answer, so the app
// is already built to wait. The answer is the user's text, or null
// if the user doesn't reply.
function getUserReply(ticket, state, actionId) {
  let text = null;

  if (actionId !== "general") {
    const action = ticket.actions.find(function (a) {
      return a.id === actionId;
    });

    // Count how many times you've used this action (including just now)
    const timesUsed = state.actionsTaken.filter(function (id) {
      return id === actionId;
    }).length;

    text = timesUsed > 1 ? REPEAT_REPLY : action.reply;
  }

  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(text);
    }, USER_TYPING_DELAY);
  });
}
