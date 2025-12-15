import type { Question } from "@/types/quiz";

export const QUESTIONS_EASY: Question[] = [
  {
    id: "easy-q01",
    sceneId: "vault",
    difficulty: "ScriptKiddie",
    scenario:
      "You reach the Digital Vault. The lock accepts only one credential. Cameras are sweeping.",
    question: "Which password practice is the safest for most people?",
    options: [
      {
        id: "a",
        text: "Reuse your favorite password across sites (easier to remember)",
        isTrap: true,
      },
      {
        id: "b",
        text: "Use a password manager with unique, long passwords",
        isTrap: false,
      },
      {
        id: "c",
        text: "Use your birthday plus your name (hard to guess)",
        isTrap: true,
      },
      {
        id: "d",
        text: "Write passwords in Notes so you can quickly search",
        isTrap: true,
      },
    ],
    explanation:
      "Password reuse turns one leak into many account takeovers. A password manager helps generate and store unique long passwords, reducing your real-world risk.",
  },
  {
    id: "easy-q02",
    sceneId: "vault",
    difficulty: "ScriptKiddie",
    scenario:
      "A glowing envelope floats in: ‘URGENT: Your account will be closed in 10 minutes’.",
    question: "What’s the best first move?",
    options: [
      {
        id: "a",
        text: "Click the link quickly to avoid losing access",
        isTrap: true,
      },
      {
        id: "b",
        text: "Reply asking if the message is real",
        isTrap: true,
      },
      {
        id: "c",
        text: "Open a new tab and sign in from the official website/app",
        isTrap: false,
      },
      {
        id: "d",
        text: "Forward the email to your friends to warn them",
        isTrap: true,
      },
    ],
    explanation:
      "Urgency is a classic social-engineering trigger. Use a fresh path (official app/site) instead of email links so you control the destination.",
  },
  {
    id: "easy-q03",
    sceneId: "vault",
    difficulty: "ScriptKiddie",
    scenario: "A workstation is left unlocked in the lab.",
    question: "What’s the best immediate action?",
    options: [
      { id: "a", text: "Lock the screen before leaving", isTrap: false },
      { id: "b", text: "Leave it since it’s only for a moment", isTrap: true },
      { id: "c", text: "Ask a friend to watch it", isTrap: true },
      { id: "d", text: "Write your password on the desk", isTrap: true }
    ],
    explanation: "Locking prevents someone nearby from accessing your session.",
  },
  {
    id: "easy-q04",
    sceneId: "vault",
    difficulty: "ScriptKiddie",
    scenario: "You need to share a credential with a teammate.",
    question: "How should you share it safely?",
    options: [
      { id: "a", text: "Send via unsecured chat", isTrap: true },
      { id: "b", text: "Use a secure password manager share feature", isTrap: false },
      { id: "c", text: "Post it to a shared doc without protection", isTrap: true },
      { id: "d", text: "Call and read it aloud in public", isTrap: true }
    ],
    explanation: "Password managers can securely share secrets without exposing them.",
  },
  {
    id: "easy-q05",
    sceneId: "vault",
    difficulty: "ScriptKiddie",
    scenario: "Your laptop prompts to enable full-disk encryption.",
    question: "Why enable it?",
    options: [
      { id: "a", text: "It protects data if the device is lost or stolen", isTrap: false },
      { id: "b", text: "It speeds up the computer", isTrap: true },
      { id: "c", text: "It disables passwords", isTrap: true },
      { id: "d", text: "It prevents phishing", isTrap: true }
    ],
    explanation: "Encryption prevents an attacker from reading data on a stolen device.",
  },
  {
    id: "easy-q06",
    sceneId: "vault",
    difficulty: "ScriptKiddie",
    scenario: "Critical files need protection from accidental deletion.",
    question: "What’s a reliable approach?",
    options: [
      { id: "a", text: "Keep a single copy on your desktop", isTrap: true },
      { id: "b", text: "Use a versioned backup or cloud sync with MFA", isTrap: false },
      { id: "c", text: "Email copies to yourself", isTrap: true },
      { id: "d", text: "Print them on paper", isTrap: true }
    ],
    explanation: "Versioned backups and MFA-protected cloud storage reduce risk.",
  },
  {
    id: "easy-q07",
    sceneId: "vault",
    difficulty: "ScriptKiddie",
    scenario: "Setting a new password for an account.",
    question: "Which choice is strongest for most people?",
    options: [
      { id: "a", text: "Short memorable words", isTrap: true },
      { id: "b", text: "Long passphrase or manager-generated random password", isTrap: false },
      { id: "c", text: "12345678", isTrap: true },
      { id: "d", text: "Password with your name", isTrap: true }
    ],
    explanation: "Long passphrases or random passwords stored in a manager increase security.",
  },
  {
    id: "easy-q08",
    sceneId: "vault",
    difficulty: "ScriptKiddie",
    scenario: "Entering a PIN at an ATM in public.",
    question: "What should you do?",
    options: [
      { id: "a", text: "Shield the keypad with your hand", isTrap: false },
      { id: "b", text: "Type openly to be quick", isTrap: true },
      { id: "c", text: "Ask someone to hold your bag while you type", isTrap: true },
      { id: "d", text: "Use the same PIN for everything", isTrap: true }
    ],
    explanation: "Shielding reduces the risk of shoulder-surfing and camera capture.",
  },
  {
    id: "easy-q09",
    sceneId: "vault",
    difficulty: "ScriptKiddie",
    scenario: "Connecting to a remote workstation over the internet.",
    question: "Which connection is safer?",
    options: [
      { id: "a", text: "Use an encrypted VPN or SSH tunnel", isTrap: false },
      { id: "b", text: "Use plain RDP over the open internet", isTrap: true },
      { id: "c", text: "Share credentials via public gist", isTrap: true },
      { id: "d", text: "Use an unknown free remote tool", isTrap: true }
    ],
    explanation: "Encrypted tunnels protect traffic from eavesdroppers.",
  },
  {
    id: "easy-q10",
    sceneId: "vault",
    difficulty: "ScriptKiddie",
    scenario: "A critical security update is available for your OS.",
    question: "What should you do?",
    options: [
      { id: "a", text: "Install updates from trusted sources promptly", isTrap: false },
      { id: "b", text: "Ignore updates forever", isTrap: true },
      { id: "c", text: "Install updates from random sites", isTrap: true },
      { id: "d", text: "Uninstall security software", isTrap: true }
    ],
    explanation: "Trusted updates often fix exploited vulnerabilities.",
  },
  {
    id: "easy-q11",
    sceneId: "vault",
    difficulty: "ScriptKiddie",
    scenario: "You receive a link asking for login credentials.",
    question: "Best immediate action?",
    options: [
      { id: "a", text: "Navigate to the official site manually and login", isTrap: false },
      { id: "b", text: "Click and enter credentials", isTrap: true },
      { id: "c", text: "Share it with coworkers to verify", isTrap: true },
      { id: "d", text: "Reply with your password", isTrap: true }
    ],
    explanation: "Manually visiting the official site prevents link-based redirects.",
  },
  {
    id: "easy-q12",
    sceneId: "vault",
    difficulty: "ScriptKiddie",
    scenario: "An account offers phone call 2FA and authenticator app 2FA.",
    question: "Which is preferable?",
    options: [
      { id: "a", text: "Use an authenticator app or security key", isTrap: false },
      { id: "b", text: "Use a phone call every time", isTrap: true },
      { id: "c", text: "Disable 2FA for convenience", isTrap: true },
      { id: "d", text: "Share 2FA codes with colleagues", isTrap: true }
    ],
    explanation: "Authenticator apps and keys are more resilient than phone calls.",
  },
  {
    id: "easy-q13",
    sceneId: "vault",
    difficulty: "ScriptKiddie",
    scenario: "Setting up recovery options for an important account.",
    question: "What’s a strong recovery strategy?",
    options: [
      { id: "a", text: "Use multiple secure recovery methods and record them safely", isTrap: false },
      { id: "b", text: "Use a public email that anyone can access", isTrap: true },
      { id: "c", text: "Write recovery answers on a sticky note on your monitor", isTrap: true },
      { id: "d", text: "Share recovery info on social media", isTrap: true }
    ],
    explanation: "Securely stored recovery methods help regain access without exposing data.",
  },
];
