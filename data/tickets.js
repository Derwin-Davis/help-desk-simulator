// tickets.js — every ticket in the simulator.
// "correctPriority" is the answer key. The app uses it for grading
// and never shows it on screen.

const TICKETS = [
  {
    id: "INC-1001",
    subject: "Forgot my password, locked out",
    requester: "Dana Whitfield",
    setting: "Office",
    difficulty: "Easy",
    firstMessage: "Hi, I forgot my password and now it says my account is locked. Can you just reset it? I have a meeting at 10.",
    correctPriority: "P3"
  },
  {
    id: "INC-1002",
    subject: "ER wristband printer not printing",
    requester: "Kim Alvarez, RN",
    setting: "Hospital",
    difficulty: "Medium",
    firstMessage: "The wristband printer at the ER desk stopped working. We're handwriting bands for now. Not a huge deal but can someone look when you get a chance?",
    correctPriority: "P1"
  },
  {
    id: "INC-1003",
    subject: "Computer slow, shared drive acting weird",
    requester: "Marcus Bell",
    setting: "Office",
    difficulty: "Hard",
    firstMessage: "My computer has been really slow this morning and the shared drive is acting weird. Low priority, whenever you have time.",
    correctPriority: "P1"
  },
  {
    id: "INC-1004",
    subject: "Projector shows No Signal",
    requester: "Ms. Patel",
    setting: "School",
    difficulty: "Easy",
    firstMessage: "The projector just says No Signal and my class starts in 10 minutes!! Please hurry.",
    correctPriority: "P2"
  },
];
