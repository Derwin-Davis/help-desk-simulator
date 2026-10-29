// tickets.js — every ticket in the simulator.
//
// "correctPriority" is the answer key. The app uses it for grading
// and never shows it on screen.
//
// "actions" are the moves you can make when you reply. Each one has:
//   id     — a short name the code uses (grading will check these)
//   kind   — "ask" (question), "do" (have the user try something),
//            or "fix" (something IT does)
//   label  — what you see in the dropdown
//   reply  — what the user says back
// Some actions are good moves, some are wasted time, and some are mistakes.

const TICKETS = [
  {
    id: "INC-1001",
    subject: "Forgot my password, locked out",
    requester: "Dana Whitfield",
    setting: "Office",
    difficulty: "Easy",
    firstMessage: "Hi, I forgot my password and now it says my account is locked. Can you just reset it? I have a meeting at 10.",
    correctPriority: "P3",
    actions: [
      { id: "verify_id", kind: "ask", label: "Ask for their employee ID to verify identity",
        reply: "Sure, it's E-20417. Can we hurry? My meeting is in 20 minutes." },
      { id: "callback", kind: "fix", label: "Call the phone number on file to confirm it's them",
        reply: "Yep, that's me, I just picked up. I'm at my desk." },
      { id: "ask_error", kind: "ask", label: "Ask for the exact error message",
        reply: "It says \"Your account has been locked. Contact your administrator.\"" },
      { id: "ask_devices", kind: "ask", label: "Ask if any other devices are signed in",
        reply: "Just my laptop. Oh, and my phone has work email on it." },
      { id: "check_caps", kind: "do", label: "Ask them to check Caps Lock",
        reply: "Caps Lock is off. I really just don't remember the password." },
      { id: "restart", kind: "do", label: "Ask them to restart the computer",
        reply: "I already restarted. Still locked. Can you please just reset it?" },
      { id: "reset_password", kind: "fix", label: "Unlock the account and reset the password",
        reply: "Got the temporary password and changed it. I'm in! Thank you!!" }
    ]
  },
  {
    id: "INC-1002",
    subject: "ER wristband printer not printing",
    requester: "Kim Alvarez, RN",
    setting: "Hospital",
    difficulty: "Medium",
    firstMessage: "The wristband printer at the ER desk stopped working. We're handwriting bands for now. Not a huge deal but can someone look when you get a chance?",
    correctPriority: "P1",
    actions: [
      { id: "ask_scope", kind: "ask", label: "Ask if other printers or workstations are affected",
        reply: "Just this wristband printer. The label printer at triage works fine." },
      { id: "ask_lights", kind: "ask", label: "Ask what the printer shows (lights, errors)",
        reply: "Green light is on, no error on the printer. The computer says the jobs are \"printing\" but nothing comes out." },
      { id: "ask_patient", kind: "ask", label: "Ask for the patient's name on the stuck wristband",
        reply: "Um... I don't think I'm supposed to send patient names in a ticket. Is that okay?" },
      { id: "check_paper", kind: "do", label: "Ask them to check the wristband roll",
        reply: "It's full. We loaded a new roll this morning." },
      { id: "power_cycle", kind: "do", label: "Ask them to turn the printer off and back on",
        reply: "Turned it off and on. Still nothing prints." },
      { id: "check_queue", kind: "do", label: "Have them open the print queue on the computer",
        reply: "There's one job at the top that says \"Error - Printing\" and 6 more stuck behind it." },
      { id: "clear_queue", kind: "fix", label: "Clear the stuck job and restart the print spooler",
        reply: "It's printing! All the bands just came out. Thank you!" },
      { id: "send_replacement", kind: "fix", label: "Order a replacement printer",
        reply: "Okay... how long will that take? We're still handwriting bands for every patient." }
    ]
  },
  {
    id: "INC-1003",
    subject: "Computer slow, shared drive acting weird",
    requester: "Marcus Bell",
    setting: "Office",
    difficulty: "Hard",
    firstMessage: "My computer has been really slow this morning and the shared drive is acting weird. Low priority, whenever you have time.",
    correctPriority: "P1",
    actions: [
      { id: "ask_weird", kind: "ask", label: "Ask what \"acting weird\" means on the shared drive",
        reply: "Some files won't open. They have a strange ending now, like Budget.xlsx.locked" },
      { id: "ask_new_files", kind: "ask", label: "Ask about any pop-ups or new files",
        reply: "There's a text file on my desktop called READ_ME_TO_RESTORE. I didn't open it." },
      { id: "ask_email", kind: "ask", label: "Ask if they opened any email attachments recently",
        reply: "I opened an invoice from a vendor this morning. It was a zip file. Why?" },
      { id: "clear_temp", kind: "do", label: "Have them delete temp files to speed it up",
        reply: "Did that. Still slow." },
      { id: "restart", kind: "do", label: "Ask them to restart the computer",
        reply: "Okay, it's back up. Still slow, and now even MORE files end in .locked" },
      { id: "run_scan", kind: "do", label: "Have them run an antivirus scan",
        reply: "The scan says it'll take 3 hours. Can I keep working while it runs?" },
      { id: "disconnect", kind: "do", label: "Have them unplug the network cable and turn off Wi-Fi now",
        reply: "Okay, cable's unplugged and Wi-Fi is off. Is something wrong?" },
      { id: "escalate_security", kind: "fix", label: "Escalate to the security team",
        reply: "Someone from security just called. They told me not to touch anything. This is serious, isn't it?" }
    ]
  },
  {
    id: "INC-1004",
    subject: "Projector shows No Signal",
    requester: "Ms. Patel",
    setting: "School",
    difficulty: "Easy",
    firstMessage: "The projector just says No Signal and my class starts in 10 minutes!! Please hurry.",
    correctPriority: "P2",
    actions: [
      { id: "ask_laptop_screen", kind: "ask", label: "Ask if the laptop screen itself is working",
        reply: "My laptop screen is fine. It's just not showing up on the projector." },
      { id: "ask_input", kind: "ask", label: "Ask what input the projector is set to",
        reply: "It says HDMI 1. That's what we always use." },
      { id: "check_cable", kind: "do", label: "Ask them to check the HDMI cable at both ends",
        reply: "It's plugged into the laptop and the wall plate. I didn't touch it." },
      { id: "check_bulb", kind: "ask", label: "Ask if the projector bulb is working",
        reply: "The projector is on. It's showing a blue screen that says No Signal, so the bulb works." },
      { id: "restart_laptop", kind: "do", label: "Have them restart the laptop",
        reply: "That took forever... it's back, and it STILL says No Signal. The kids are here!!" },
      { id: "win_p", kind: "do", label: "Have them press Windows + P and pick Duplicate",
        reply: "OH. It was set to \"PC screen only.\" It's working! Thank you so much!" },
      { id: "send_tech", kind: "fix", label: "Send a technician to the room",
        reply: "How long will that take? Class already started." }
    ]
  }
];
