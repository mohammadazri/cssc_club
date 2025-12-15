import type { Question } from "@/types/quiz";

export const QUESTIONS_HARD: Question[] = [
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
    sceneId: "mainframe",
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
