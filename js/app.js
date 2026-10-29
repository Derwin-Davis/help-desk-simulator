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
const actionRow       = document.getElementById("action-row");
const composerAction  = document.getElementById("composer-action");
const tvSlaResponse = document.getElementById("tv-sla-response");
const tvSlaResolve  = document.getElementById("tv-sla-resolve");

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
    ],
    // SLA tracking, all in game minutes (see sla.js)
    elapsed: 0,             // working time used so far (pauses don't count)
    firstResponseAt: null,  // when you sent your first reply
    resolvedAt: null,       // when you set Resolved or Closed
    actionsTaken: [],       // ids of actions you picked, in order (for grading)
    userTyping: false       // true while the user is "typing" an answer
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
    <td><span id="sla-${ticket.id}"></span></td>
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
  updateSlaDisplays();
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

  updateSlaDisplays();

  // Show the conversation and reset the writing box
  buildActionOptions(ticket);
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
      // Show which action this reply used, as a small tag
      if (message.actionLabel) {
        const tag = document.createElement("span");
        tag.className = "action-tag";
        tag.textContent = message.actionLabel;
        from.appendChild(tag);
      }
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

  // "Dana is typing..." while we wait for the user's answer
  if (ticketState[openTicketId].userTyping) {
    const typing = document.createElement("div");
    typing.className = "typing";
    typing.textContent = ticket.requester + " is typing...";
    tvThread.appendChild(typing);
  }
}

// Fill the action dropdown with this ticket's actions, grouped by kind
function buildActionOptions(ticket) {
  const groups = {
    ask: "Ask the user",
    do:  "Have the user try something",
    fix: "Take action yourself"
  };

  composerAction.innerHTML = "";

  const general = document.createElement("option");
  general.value = "general";
  general.textContent = "General update (no question or action)";
  composerAction.appendChild(general);

  Object.keys(groups).forEach(function (kind) {
    const group = document.createElement("optgroup");
    group.label = groups[kind];
    ticket.actions.forEach(function (action) {
      if (action.kind === kind) {
        const option = document.createElement("option");
        option.value = action.id;
        option.textContent = action.label;
        group.appendChild(option);
      }
    });
    composerAction.appendChild(group);
  });
}

// Switch the composer between "reply" and "note"
function setComposerMode(mode) {
  composerMode = mode;

  if (mode === "reply") {
    tabReply.classList.add("active");
    tabNote.classList.remove("active");
    composer.classList.remove("note-mode");
    actionRow.hidden = false;
    composerText.placeholder = "Write a reply the user will see...";
    composerHint.textContent = "The user will see this.";
    composerSend.textContent = "Send reply";
  } else {
    tabNote.classList.add("active");
    tabReply.classList.remove("active");
    composer.classList.add("note-mode");
    actionRow.hidden = true;     // notes don't go to the user, so no action
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

  const ticket = findTicket(openTicketId);
  const state = ticketState[openTicketId];

  if (composerMode === "note") {
    state.messages.push({ type: "note", text: text });
  } else {
    // A reply: remember which action it used
    const actionId = composerAction.value;
    const option = composerAction.options[composerAction.selectedIndex];
    state.messages.push({
      type: "reply",
      text: text,
      actionId: actionId,
      actionLabel: actionId === "general" ? "" : option.textContent
    });
    state.actionsTaken.push(actionId);
    waitForUser(ticket, state, actionId);
  }

  // Your first reply to the user stops the first-response clock.
  // Internal notes don't count: the user can't see them.
  if (composerMode === "reply" && state.firstResponseAt === null) {
    state.firstResponseAt = state.elapsed;
    updateSlaDisplays();
  }

  composerText.value = "";
  composerAction.value = "general";
  renderThread();
}

// Ask responder.js for the user's answer, then add it to the ticket
function waitForUser(ticket, state, actionId) {
  state.userTyping = true;

  getUserReply(ticket, state, actionId).then(function (answer) {
    state.userTyping = false;

    if (answer !== null) {
      state.messages.push({ type: "user", text: answer });

      // The user answered, so the ticket isn't waiting on them anymore
      if (state.status === "Waiting on User") {
        state.status = "In Progress";
      }
    }

    // Redraw whichever screen you're on
    if (openTicketId === ticket.id) {
      tvStatus.value = state.status;
      renderThread();
    } else if (openTicketId === null) {
      renderQueue();
    }
  });
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
  updateSlaDisplays();   // new priority = new SLA targets
});

// When you pick a status, save it for the open ticket
tvStatus.addEventListener("change", function () {
  const state = ticketState[openTicketId];
  state.status = tvStatus.value;

  // Resolved/Closed stops the resolution clock.
  // Reopening (any other status) starts it again.
  if (DONE_STATUSES.includes(state.status)) {
    if (state.resolvedAt === null) {
      state.resolvedAt = state.elapsed;
    }
  } else {
    state.resolvedAt = null;
  }
  updateSlaDisplays();
});

backButton.addEventListener("click", closeTicket);

tabReply.addEventListener("click", function () {
  setComposerMode("reply");
});

tabNote.addEventListener("click", function () {
  setComposerMode("note");
});

composerSend.addEventListener("click", sendMessage);

// ===== SLA clock =====

// Is this ticket's clock running right now?
function clockRunning(state) {
  return !PAUSED_STATUSES.includes(state.status) && state.resolvedAt === null;
}

// Work out both SLA clocks for one ticket
function slaFor(state) {
  const targets = slaTargets(state.priority);
  const paused = PAUSED_STATUSES.includes(state.status);
  return {
    response: slaClock(targets.response, state.elapsed, state.firstResponseAt, paused),
    resolve:  slaClock(targets.resolve,  state.elapsed, state.resolvedAt, paused)
  };
}

// Put a clock's text and color on an element
function showClock(element, label, clock) {
  element.textContent = label + clock.text;
  element.className = "sla sla-" + clock.color;
}

// Refresh every SLA shown on the page
function updateSlaDisplays() {
  TICKETS.forEach(function (ticket) {
    const state = ticketState[ticket.id];
    const sla = slaFor(state);
    const cell = document.getElementById("sla-" + ticket.id);
    if (cell === null) {
      return;
    }
    // The queue shows whichever clock matters right now:
    // response until you've replied, then resolution.
    if (state.firstResponseAt === null) {
      showClock(cell, "Respond: ", sla.response);
    } else {
      showClock(cell, "Resolve: ", sla.resolve);
    }
  });

  // The open ticket shows both clocks
  if (openTicketId !== null) {
    const sla = slaFor(ticketState[openTicketId]);
    showClock(tvSlaResponse, "First response: ", sla.response);
    showClock(tvSlaResolve,  "Resolution: ",     sla.resolve);
  }
}

// Every real second, add game time to every running clock
function tick() {
  TICKETS.forEach(function (ticket) {
    const state = ticketState[ticket.id];
    if (clockRunning(state)) {
      state.elapsed += GAME_SPEED / 60;   // 15 game seconds = 0.25 game minutes
    }
  });
  updateSlaDisplays();
}

// ===== Start-up =====
renderQueue();
setInterval(tick, 1000);   // run tick() once every 1000 ms (1 second)
