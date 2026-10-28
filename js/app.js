// app.js — builds the ticket queue on the page.

// Find the empty table body in index.html (the one with id="queue-body")
const queueBody = document.getElementById("queue-body");

// Build one table row for one ticket
function makeRow(ticket) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${ticket.id}</td>
    <td>${ticket.subject}</td>
    <td>${ticket.requester}<br><small>${ticket.setting}</small></td>
    <td><span class="badge unset">Not set</span></td>
    <td>New</td>
    <td>—</td>
  `;
  return row;
}

// Go through every ticket and add its row to the table
TICKETS.forEach(function (ticket) {
  queueBody.appendChild(makeRow(ticket));
});
