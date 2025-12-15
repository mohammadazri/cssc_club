import type { Question } from "@/types/quiz";

export const QUESTIONS_MEDIUM: Question[] = [
  {
    id: "medium-q01",
    sceneId: "phishing",
    difficulty: "Hacker",
    scenario:
      "The vault demands a second factor. Your team needs a method that holds up in practice.",
    question: "Which 2FA option is generally strongest for typical users?",
    options: [
      {
        id: "a",
        text: "SMS codes (text message)",
        isTrap: true,
      },
      {
        id: "b",
        text: "Authenticator app (TOTP) or security key",
        isTrap: false,
      },
      {
        id: "c",
        text: "Email-based verification only",
        isTrap: true,
      },
      {
        id: "d",
        text: "A second password written on paper",
        isTrap: true,
      },
    ],
    explanation:
      "SMS can be vulnerable to SIM-swap and interception. Authenticator apps (TOTP) and especially security keys are typically more resilient.",
  },
  {
    id: "medium-q02",
    sceneId: "phishing",
    difficulty: "Hacker",
    scenario:
      "You inspect the ‘university portal’ email. The sender looks nearly correct.",
    question: "Which detail is the strongest phishing warning sign?",
    options: [
      {
        id: "a",
        text: "A misspelled or look-alike domain (e.g., un1kl.edu)",
        isTrap: false,
      },
      {
        id: "b",
        text: "The email contains a logo",
        isTrap: true,
      },
      {
        id: "c",
        text: "The email uses formal wording",
        isTrap: true,
      },
      {
        id: "d",
        text: "The email is short",
        isTrap: true,
      },
    ],
    explanation:
      "Attackers commonly use look‑alike domains (homoglyphs/typos) to trick you. Always verify the real domain, not the display name.",
  },
  {
    id: "medium-q03",
    sceneId: "phishing",
    difficulty: "Hacker",
    scenario:
      "You’re on public Wi‑Fi. The team needs to transmit credentials safely.",
    question: "What reduces risk most when using public Wi‑Fi?",
    options: [
      {
        id: "a",
        text: "Disable HTTPS so the page loads faster",
        isTrap: true,
      },
      {
        id: "b",
        text: "Use a VPN and prefer HTTPS sites",
        isTrap: false,
      },
      {
        id: "c",
        text: "Use Incognito mode to encrypt traffic",
        isTrap: true,
      },
      {
        id: "d",
        text: "Only visit websites with lots of ads (popular sites)",
        isTrap: true,
      },
    ],
    explanation:
      "Incognito doesn’t encrypt traffic. VPN + HTTPS helps protect your data from interception and local network attacks.",
  },
  {
    id: "medium-q04",
    sceneId: "phishing",
    difficulty: "Hacker",
    scenario:
      "The mainframe room is humming. Your laptop prompts: ‘Update available’.",
    question: "Why are software updates a security priority?",
    options: [
      {
        id: "a",
        text: "They mainly add new features, not security",
        isTrap: true,
      },
      {
        id: "b",
        text: "They often patch known vulnerabilities attackers actively use",
        isTrap: false,
      },
      {
        id: "c",
        text: "They prevent all scams automatically",
        isTrap: true,
      },
      {
        id: "d",
        text: "They make your password stronger",
        isTrap: true,
      },
    ],
    explanation:
      "Updates frequently fix exploitable bugs. Unpatched software is one of the most common real-world attack paths.",
  },
  {
    id: "medium-q05",
    sceneId: "phishing",
    difficulty: "Hacker",
    scenario: "An email contains an attachment named 'invoice.zip'.",
    question: "What should you check before opening attachments?",
    options: [
      { id: "a", text: "Verify sender and scan the file with AV", isTrap: false },
      { id: "b", text: "Open it immediately to save time", isTrap: true },
      { id: "c", text: "Forward it to others first", isTrap: true },
      { id: "d", text: "Rename it and open", isTrap: true }
    ],
    explanation: "Confirm sender identity and scan attachments before opening.",
  },
  {
    id: "medium-q06",
    sceneId: "phishing",
    difficulty: "Hacker",
    scenario: "The email 'From' shows a colleague's name but the address is odd.",
    question: "What's the safest interpretation?",
    options: [
      { id: "a", text: "Display names can be spoofed; check the actual email address", isTrap: false },
      { id: "b", text: "If the display name matches, it’s safe", isTrap: true },
      { id: "c", text: "Delete any mail with a different domain", isTrap: true },
      { id: "d", text: "Respond asking for verification", isTrap: true }
    ],
    explanation: "Always verify the real address; display names are unreliable.",
  },
  {
    id: "medium-q07",
    sceneId: "phishing",
    difficulty: "Hacker",
    scenario: "A short link is in a message you received.",
    question: "How can you inspect it safely?",
    options: [
      { id: "a", text: "Use a link expander or preview in a safe environment", isTrap: false },
      { id: "b", text: "Click it directly to see where it goes", isTrap: true },
      { id: "c", text: "Trust links from unknown senders", isTrap: true },
      { id: "d", text: "Share it publicly to ask others", isTrap: true }
    ],
    explanation: "Expanding links helps reveal the true destination without visiting it.",
  },
  {
    id: "medium-q08",
    sceneId: "phishing",
    difficulty: "Hacker",
    scenario: "An urgent request asks you to transfer funds now.",
    question: "What’s the most cautious response?",
    options: [
      { id: "a", text: "Verify through another channel (call) before sending", isTrap: false },
      { id: "b", text: "Transfer immediately to avoid trouble", isTrap: true },
      { id: "c", text: "Post the request on social media", isTrap: true },
      { id: "d", text: "Ignore and hope it resolves", isTrap: true }
    ],
    explanation: "Confirm instructions via a trusted channel to avoid fraud.",
  },
  {
    id: "medium-q09",
    sceneId: "phishing",
    difficulty: "Hacker",
    scenario: "A message claims to be from IT asking for your password.",
    question: "What should you do?",
    options: [
      { id: "a", text: "Never provide passwords; contact IT separately", isTrap: false },
      { id: "b", text: "Send your password to comply", isTrap: true },
      { id: "c", text: "Reply with partial password", isTrap: true },
      { id: "d", text: "Disable your account", isTrap: true }
    ],
    explanation: "Legitimate IT will not ask for your password via email.",
  },
  {
    id: "medium-q10",
    sceneId: "phishing",
    difficulty: "Hacker",
    scenario: "A link shows a trusted domain when hovered but redirects elsewhere.",
    question: "Which tool helps confirm the real target?",
    options: [
      { id: "a", text: "Use link preview or copy the URL to inspect", isTrap: false },
      { id: "b", text: "Assume hover preview is always correct", isTrap: true },
      { id: "c", text: "Click then quickly close", isTrap: true },
      { id: "d", text: "Share the link to test", isTrap: true }
    ],
    explanation: "Inspecting the URL without visiting helps spot redirects.",
  },
  {
    id: "medium-q11",
    sceneId: "phishing",
    difficulty: "Hacker",
    scenario: "An attachment ends with .scr or .exe disguised as a document.",
    question: "What does this indicate?",
    options: [
      { id: "a", text: "It’s likely malicious; treat with caution", isTrap: false },
      { id: "b", text: "Executables are safe if small", isTrap: true },
      { id: "c", text: "It’s probably a compressed image", isTrap: true },
      { id: "d", text: "Open it on a work machine immediately", isTrap: true }
    ],
    explanation: "Executable attachments are high risk and should not be opened without verification.",
  },
  {
    id: "medium-q12",
    sceneId: "phishing",
    difficulty: "Hacker",
    scenario: "The sender uses a lookalike domain.",
    question: "Best verification step?",
    options: [
      { id: "a", text: "Check the full email address and reply-to headers", isTrap: false },
      { id: "b", text: "Trust the display name", isTrap: true },
      { id: "c", text: "Assume it’s safe if from a big company", isTrap: true },
      { id: "d", text: "Immediately block the domain", isTrap: true }
    ],
    explanation: "Inspecting headers helps detect spoofing.",
  },
  {
    id: "medium-q13",
    sceneId: "phishing",
    difficulty: "Hacker",
    scenario: "A login form asks for additional personal details.",
    question: "Which is the correct approach?",
    options: [
      { id: "a", text: "Be suspicious; verify site authenticity before entering", isTrap: false },
      { id: "b", text: "Provide extra details to help verify identity", isTrap: true },
      { id: "c", text: "Send details via social media instead", isTrap: true },
      { id: "d", text: "Ignore everything and never report", isTrap: true }
    ],
    explanation: "Unusual requests for personal details often indicate phishing.",
  },
  {
    id: "medium-q14",
    sceneId: "phishing",
    difficulty: "Hacker",
    scenario: "A form asks for your SSN to 'confirm' your account.",
    question: "What should you do?",
    options: [
      { id: "a", text: "Do not provide sensitive identifiers; verify via official channels", isTrap: false },
      { id: "b", text: "Provide it if the site looks real", isTrap: true },
      { id: "c", text: "Share in a direct message", isTrap: true },
      { id: "d", text: "Post it publicly to speed things up", isTrap: true }
    ],
    explanation: "Sensitive identifiers should only be given through verified, secure processes.",
  },
  {
    id: "medium-q15",
    sceneId: "phishing",
    difficulty: "Hacker",
    scenario: "A text asks you to call a number to confirm billing.",
    question: "How to proceed?",
    options: [
      { id: "a", text: "Look up official support number and call that instead", isTrap: false },
      { id: "b", text: "Call the provided number immediately", isTrap: true },
      { id: "c", text: "Text back your card details", isTrap: true },
      { id: "d", text: "Ignore all billing messages forever", isTrap: true }
    ],
    explanation: "Use official channels, not numbers provided in unsolicited messages.",
  },
  {
    id: "medium-q16",
    sceneId: "phishing",
    difficulty: "Hacker",
    scenario: "An email asks to 'reply with yes' to confirm.",
    question: "Why is replying risky?",
    options: [
      { id: "a", text: "Replying can confirm your address is active to attackers", isTrap: false },
      { id: "b", text: "Replies are always safe", isTrap: true },
      { id: "c", text: "Replying deletes the message automatically", isTrap: true },
      { id: "d", text: "Replying flags it as trusted", isTrap: true }
    ],
    explanation: "Confirming activity by reply helps attackers target you further.",
  },
  {
    id: "medium-q17",
    sceneId: "phishing",
    difficulty: "Hacker",
    scenario: "A site requests permission to access your account via OAuth.",
    question: "Best practice before granting access?",
    options: [
      { id: "a", text: "Review requested scopes and revoke if unnecessary", isTrap: false },
      { id: "b", text: "Grant access to any app that looks nice", isTrap: true },
      { id: "c", text: "Share your password with app support", isTrap: true },
      { id: "d", text: "Allow unlimited access forever", isTrap: true }
    ],
    explanation: "Check permissions and only grant what’s necessary.",
  },
  {
    id: "medium-q18",
    sceneId: "phishing",
    difficulty: "Hacker",
    scenario: "You suspect a message is phishing.",
    question: "What should you do?",
    options: [
      { id: "a", text: "Report it to your security team or provider", isTrap: false },
      { id: "b", text: "Ignore to avoid trouble", isTrap: true },
      { id: "c", text: "Forward to everyone you know", isTrap: true },
      { id: "d", text: "Delete without reporting", isTrap: true }
    ],
    explanation: "Reporting helps block the attacker and protect others.",
  },
  {
    id: "medium-q19",
    sceneId: "phishing",
    difficulty: "Hacker",
    scenario: "A message contains an unexpected attachment labeled 'report.doc'.",
    question: "What’s the cautious approach?",
    options: [
      { id: "a", text: "Verify sender and scan before opening", isTrap: false },
      { id: "b", text: "Open to see what it is", isTrap: true },
      { id: "c", text: "Forward to a group for advice", isTrap: true },
      { id: "d", text: "Rename and open", isTrap: true }
    ],
    explanation: "Verify and scan attachments; do not open blindly.",
  },
  {
    id: "medium-q20",
    sceneId: "phishing",
    difficulty: "Hacker",
    scenario: "A link claims to be from your bank but domain looks odd.",
    question: "Safest first step?",
    options: [
      { id: "a", text: "Navigate to the bank’s official site manually", isTrap: false },
      { id: "b", text: "Click the link to check quickly", isTrap: true },
      { id: "c", text: "Reply asking for clarification", isTrap: true },
      { id: "d", text: "Ignore and hope nothing happens", isTrap: true }
    ],
    explanation: "Manual navigation avoids malicious redirect links.",
  },
];
