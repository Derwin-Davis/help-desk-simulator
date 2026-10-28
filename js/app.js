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

// ===== The agent's work on each ticket =====
// tickets.js is the "starting script" and never changes.
// What YOU do (priority you set, status you pick) is stored here instead,
// one entry per ticket id. Example: ticketState["INC-1001"].priority
const ticketState = {};

TICKETS.forEach(function (ticket) {
  ticketState[ticket.id] = {
    priority: "",     // empty = not set yet
    status: "New"
  };
});

// Which ticket is open right now (null = none, we're on the queue)
let openTicketId = null;

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

  // Show the user's first message
  tvThread.innerHTML = `
    <div class="message from-user">
      <div class="message-from">${ticket.requester}</div>
      <p>${ticket.firstMessage}</p>
    </div>
  `;

  // Swap screens: hide the queue, show the ticket
  queueView.hidden = true;
  ticketView.hidden = false;
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

// ===== Start-up =====
renderQueue();
