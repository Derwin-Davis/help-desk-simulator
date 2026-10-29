// app.js — runs the queue and the ticket view.

// ===== Finding things on the page =====
// Each of these grabs one element from index.html by its id.
const queueView   = document.getElementById("queue-view");
const queueBody   = document.getElementById("queue-body");
const ticketView  = document.getElementById("ticket-view");
const backButton  = document.getElementById("back-button");
const tvId        = document.getElementById("tv-id");
const tvSubject   = document.getElementById("tv-subject");
const tvRequester = document.getElementById("tv-requester");
const tvPriority  = document.getElementById("tv-priority");
const tvStatus    = document.getElementById("tv-status");
const tvThread    = document.getElementById("tv-thread");
const composer     = document.querySelector(".composer");
const tabReply     = document.getElementById("tab-reply");
const tabNote      = document.getElementById("tab-note");
const composerText = document.getElementById("composer-text");
const composerHint = document.getElementById("composer-hint");
const composerSend = document.getElementById("composer-send");

// ===== The agent's work on each ticket =====
// tickets.js is the "starting script" and never changes.
// What YOU do (priority, status, messages) is stored here instead,
// one entry per ticket id. Example: ticketState["INC-1001"].priority
const ticketState = {};

TICKETS.forEach(function (ticket) {
  ticketState[ticket.id] = {
    priority: "",     // empty = not set yet
    status: "New",
    // The conversation. Each message has a "type":
    //   "user"  = the end user wrote it
    //   "reply" = you wrote it, and the user can see it
    //   "note"  = you wrote it, IT staff only
    messages: [
      { type: "user", text: ticket.firstMessage }
    ]
  };
});

// Which ticket is open right now (null = none, we're on the queue)
let openTicketId = null;

// Is the composer writing a "reply" or a "note"?
let composerMode = "reply";

// ===== Queue =====

// Make the colored priority label, e.g. a red "P1" badge
function priorityBadge(priority) {
  if (priority === "") {
    return `<span class="badge unset">Not set</span>`;
  }
  // The CSS classes are lowercase: .p1 .p2 .p3 .p4
  return `<span class="badge ${priority.toLowerCase()}">${priority}</span>`;
}

// Build one table row for one ticket
function makeRow(ticket) {
  const state = ticketState[ticket.id];
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${ticket.id}</td>
    <td>${ticket.subject}</td>
    <td>${ticket.requester}<br><small>${ticket.setting}</small></td>
    <td>${priorityBadge(state.priority)}</td>
    <td>${state.status}</td>
    <td>—</td>
  `;
  // Clicking the row opens that ticket
  row.addEventListener("click", function () {
    openTicket(ticket.id);
  });
  return row;
}

// Clear the table and rebuild every row (so changes show up)
function renderQueue() {
  queueBody.innerHTML = "";
  TICKETS.forEach(function (ticket) {
    queueBody.appendChild(makeRow(ticket));
  });
}

// ===== Ticket view =====

// Find a ticket in the TICKETS list by its id
function findTicket(id) {
  return TICKETS.find(function (ticket) {
    return ticket.id === id;
  });
}

function openTicket(id) {
  const ticket = findTicket(id);
  const state = ticketState[id];
  openTicketId = id;

  // Fill in the top of the ticket
  tvId.textContent = ticket.id + " · " + ticket.difficulty;
  tvSubject.textContent = ticket.subject;
  tvRequester.textContent = ticket.requester + " · " + ticket.setting;

  // Set the dropdowns to whatever you chose last time
  tvPriority.value = state.priority;
  tvStatus.value = state.status;

  // Show the conversation and reset the writing box
  renderThread();
  composerText.value = "";
  setComposerMode("reply");

  // Swap screens: hide the queue, show the ticket
  queueView.hidden = true;
  ticketView.hidden = false;
}

// Draw every message in the open ticket's conversation
function renderThread() {
  const ticket = findTicket(openTicketId);
  const messages = ticketState[openTicketId].messages;
  tvThread.innerHTML = "";

  messages.forEach(function (message) {
    const box = document.createElement("div");
    const from = document.createElement("div");
    const text = document.createElement("p");
    from.className = "message-from";

    if (message.type === "user") {
      box.className = "message from-user";
      from.textContent = ticket.requester;
    } else if (message.type === "reply") {
      box.className = "message from-agent";
      from.textContent = "You (IT Help Desk)";
    } else {
      box.className = "message note";
      from.className = "message-from note-label";
      from.textContent = "Internal note · not visible to user";
    }

    // textContent (not innerHTML) shows your typing exactly as typed,
    // so text like <b> can't accidentally turn into real HTML.
    text.textContent = message.text;

    box.appendChild(from);
    box.appendChild(text);
    tvThread.appendChild(box);
  });
}

// Switch the composer between "reply" and "note"
function setComposerMode(mode) {
  composerMode = mode;

  if (mode === "reply") {
    tabReply.classList.add("active");
    tabNote.classList.remove("active");
    composer.classList.remove("note-mode");
    composerText.placeholder = "Write a reply the user will see...";
    composerHint.textContent = "The user will see this.";
    composerSend.textContent = "Send reply";
  } else {
    tabNote.classList.add("active");
    tabReply.classList.remove("active");
    composer.classList.add("note-mode");
    composerText.placeholder = "Write a note for IT staff only...";
    composerHint.textContent = "Only IT staff will see this.";
    composerSend.textContent = "Add note";
  }
}

// Add what you typed to the conversation
function sendMessage() {
  const text = composerText.value.trim();   // trim() removes extra spaces
  if (text === "") {
    return;   // nothing typed, do nothing
  }

  ticketState[openTicketId].messages.push({
    type: composerMode,   // "reply" or "note"
    text: text
  });

  composerText.value = "";
  renderThread();
}

function closeTicket() {
  openTicketId = null;
  renderQueue();            // rebuild so new priority/status show in the list
  ticketView.hidden = true;
  queueView.hidden = false;
}

// ===== Reacting to what you do =====

// When you pick a priority, save it for the open ticket
tvPriority.addEventListener("change", function () {
  ticketState[openTicketId].priority = tvPriority.value;
});

// When you pick a status, save it for the open ticket
tvStatus.addEventListener("change", function () {
  ticketState[openTicketId].status = tvStatus.value;
});

backButton.addEventListener("click", closeTicket);

tabReply.addEventListener("click", function () {
  setComposerMode("reply");
});

tabNote.addEventListener("click", function () {
  setComposerMode("note");
});

composerSend.addEventListener("click", sendMessage);

// ===== Start-up =====
renderQueue();
