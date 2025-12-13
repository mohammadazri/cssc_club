import type { Question } from "@/types/quiz";

export const QUESTIONS: Question[] = [
  {
    id: "q1-vault-passwords",
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
    id: "q2-phishing-urgency",
    sceneId: "phishing",
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
    id: "q3-vault-2fa",
    sceneId: "vault",
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
    id: "q4-phishing-domain",
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
    id: "q5-vault-public-wifi",
    sceneId: "vault",
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
    id: "q6-mainframe-updates",
    sceneId: "mainframe",
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
    id: "q7-mainframe-permissions",
    sceneId: "mainframe",
    difficulty: "Elite",
    scenario:
      "You find a USB drive labeled ‘Exam Answers’. The mainframe is one port away.",
    question: "What’s the most secure response?",
    options: [
      {
        id: "a",
        text: "Plug it in quickly and scan later",
        isTrap: true,
      },
      {
        id: "b",
        text: "Do not plug it in; report it to staff/IT",
        isTrap: false,
      },
      {
        id: "c",
        text: "Plug it in only if you disable Wi‑Fi",
        isTrap: true,
      },
      {
        id: "d",
        text: "Plug it in on a friend’s laptop first",
        isTrap: true,
      },
    ],
    explanation:
      "Unknown USB devices can deliver malware instantly. The safest move is to avoid connecting it and report it through proper channels.",
  },
  {
    id: "q8-phishing-attachments",
    sceneId: "phishing",
    difficulty: "Elite",
    scenario:
      "An attachment arrives: ‘invoice.pdf.exe’. The subject line looks legit.",
    question: "What does this most likely indicate?",
    options: [
      {
        id: "a",
        text: "A harmless PDF with a double extension",
        isTrap: true,
      },
      {
        id: "b",
        text: "A likely malicious executable disguised as a document",
        isTrap: false,
      },
      {
        id: "c",
        text: "A compression format used by printers",
        isTrap: true,
      },
      {
        id: "d",
        text: "A verified government document",
        isTrap: true,
      },
    ],
    explanation:
      "Double extensions are a common trick. If it ends with .exe, it’s an executable and should be treated as high risk.",
  },
  {
    id: "q9-mainframe-least-privilege",
    sceneId: "mainframe",
    difficulty: "Elite",
    scenario:
      "Final door: a terminal requests admin privileges ‘to run faster’.",
    question: "Which security principle is most relevant?",
    options: [
      {
        id: "a",
        text: "Security through obscurity",
        isTrap: true,
      },
      {
        id: "b",
        text: "Least privilege",
        isTrap: false,
      },
      {
        id: "c",
        text: "Maximize permissions to avoid errors",
        isTrap: true,
      },
      {
        id: "d",
        text: "Trust on first use",
        isTrap: true,
      },
    ],
    explanation:
      "Least privilege means granting only the access needed. Unnecessary admin rights increase the impact of mistakes and malware.",
  },
];
