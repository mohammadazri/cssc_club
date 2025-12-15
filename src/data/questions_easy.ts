import type { Question } from "@/types/quiz";

export const QUESTIONS_EASY: Question[] = [
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
];
