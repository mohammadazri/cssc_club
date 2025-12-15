import type { Question } from "@/types/quiz";

export const QUESTIONS_MEDIUM: Question[] = [
  {
    id: "q3-vault-2fa",
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
    id: "q6-mainframe-updates",
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
];
