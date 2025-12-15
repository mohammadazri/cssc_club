import type { Question } from "@/types/quiz";

export const QUESTIONS_HARD: Question[] = [
  {
    id: "hard-q01",
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
    id: "hard-q02",
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
    id: "hard-q03",
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
  {
    id: "hard-q04",
    sceneId: "mainframe",
    difficulty: "Elite",
    scenario: "A service requests admin rights to run.",
    question: "What principle should guide granting access?",
    options: [
      {
        id: "a",
        text: "Least privilege: grant only necessary rights",
        isTrap: false,
      },
      { id: "b", text: "Grant admin to avoid future prompts", isTrap: true },
      { id: "c", text: "Grant to everyone for convenience", isTrap: true },
      { id: "d", text: "Disable logging when granting rights", isTrap: true },
    ],
    explanation: "Least privilege reduces attack surface and blast radius.",
  },
  {
    id: "hard-q05",
    sceneId: "mainframe",
    difficulty: "Elite",
    scenario: "You notice unexpected changes in system configuration.",
    question: "Best next step?",
    options: [
      {
        id: "a",
        text: "Review audit logs and isolate affected systems",
        isTrap: false,
      },
      { id: "b", text: "Ignore; it's probably fine", isTrap: true },
      { id: "c", text: "Reboot all machines immediately", isTrap: true },
      { id: "d", text: "Share credentials to fix it quickly", isTrap: true },
    ],
    explanation: "Audit logs help determine cause and scope of changes.",
  },
  {
    id: "hard-q06",
    sceneId: "mainframe",
    difficulty: "Elite",
    scenario: "Service accounts hold sensitive keys.",
    question: "How should keys be handled?",
    options: [
      {
        id: "a",
        text: "Rotate and store secrets in a vault with access controls",
        isTrap: false,
      },
      { id: "b", text: "Hard-code keys into source code", isTrap: true },
      { id: "c", text: "Email keys to admins", isTrap: true },
      { id: "d", text: "Use same key for all services", isTrap: true },
    ],
    explanation: "Secret management and rotation reduce compromise impact.",
  },
  {
    id: "hard-q07",
    sceneId: "mainframe",
    difficulty: "Elite",
    scenario: "You detect outbound traffic to unknown IPs.",
    question: "What action helps contain potential exfiltration?",
    options: [
      {
        id: "a",
        text: "Isolate affected hosts and investigate",
        isTrap: false,
      },
      { id: "b", text: "Increase outbound bandwidth", isTrap: true },
      { id: "c", text: "Delete logs to hide it", isTrap: true },
      { id: "d", text: "Restart services to clear state", isTrap: true },
    ],
    explanation: "Isolation limits further data loss while investigating.",
  },
  {
    id: "hard-q08",
    sceneId: "mainframe",
    difficulty: "Elite",
    scenario: "An urgent kernel patch is released.",
    question: "How should you proceed in production?",
    options: [
      {
        id: "a",
        text: "Test in staging, then schedule rollout with rollback plan",
        isTrap: false,
      },
      {
        id: "b",
        text: "Patch all production at once without testing",
        isTrap: true,
      },
      { id: "c", text: "Never apply patches", isTrap: true },
      { id: "d", text: "Disable monitoring before patching", isTrap: true },
    ],
    explanation: "Controlled rollout with rollback minimizes risk of outages.",
  },
  {
    id: "hard-q09",
    sceneId: "mainframe",
    difficulty: "Elite",
    scenario: "A new device appears on the internal network.",
    question: "What should you do?",
    options: [
      {
        id: "a",
        text: "Authenticate and profile the device before granting access",
        isTrap: false,
      },
      { id: "b", text: "Allow all new devices automatically", isTrap: true },
      { id: "c", text: "Disconnect the entire network", isTrap: true },
      { id: "d", text: "Trust devices that look familiar", isTrap: true },
    ],
    explanation: "Network access control reduces unauthorized devices.",
  },
  {
    id: "hard-q10",
    sceneId: "mainframe",
    difficulty: "Elite",
    scenario: "Critical system generates verbose logs.",
    question: "Why keep secure, tamper-evident logs?",
    options: [
      {
        id: "a",
        text: "They support incident response and forensics",
        isTrap: false,
      },
      { id: "b", text: "They are unnecessary overhead", isTrap: true },
      { id: "c", text: "They should be deleted daily", isTrap: true },
      { id: "d", text: "Logs should be stored locally only", isTrap: true },
    ],
    explanation: "Preserved logs are essential for understanding attacks.",
  },
  {
    id: "hard-q11",
    sceneId: "mainframe",
    difficulty: "Elite",
    scenario: "A developer requests direct DB access for debugging.",
    question: "Best practice?",
    options: [
      {
        id: "a",
        text: "Provide limited, audited access or use shared read-only views",
        isTrap: false,
      },
      { id: "b", text: "Grant full admin access immediately", isTrap: true },
      { id: "c", text: "Share DBA credentials with the team", isTrap: true },
      { id: "d", text: "Disable authentication for speed", isTrap: true },
    ],
    explanation: "Temporary, least-privileged access with auditing is safer.",
  },
  {
    id: "hard-q12",
    sceneId: "mainframe",
    difficulty: "Elite",
    scenario: "You want earlier detection of anomalies.",
    question: "Which improves detection?",
    options: [
      {
        id: "a",
        text: "Centralized telemetry and anomaly alerts",
        isTrap: false,
      },
      { id: "b", text: "Rely only on manual checks", isTrap: true },
      { id: "c", text: "Turn off alerts to reduce noise", isTrap: true },
      { id: "d", text: "Ignore endpoints", isTrap: true },
    ],
    explanation:
      "Telemetry and automated alerts surface suspicious behavior quickly.",
  },
  {
    id: "hard-q13",
    sceneId: "mainframe",
    difficulty: "Elite",
    scenario: "You’re designing network zones for apps.",
    question: "What principle should guide design?",
    options: [
      {
        id: "a",
        text: "Segment by trust and limit cross-zone access",
        isTrap: false,
      },
      { id: "b", text: "Place everything on one flat network", isTrap: true },
      { id: "c", text: "Allow all traffic for convenience", isTrap: true },
      { id: "d", text: "Disable firewalls between services", isTrap: true },
    ],
    explanation: "Segmentation reduces lateral movement for attackers.",
  },
  {
    id: "hard-q14",
    sceneId: "mainframe",
    difficulty: "Elite",
    scenario: "A catastrophic outage occurs.",
    question: "Which is a core part of recovery preparedness?",
    options: [
      {
        id: "a",
        text: "A tested disaster recovery plan and backups",
        isTrap: false,
      },
      { id: "b", text: "Hoping systems restart themselves", isTrap: true },
      {
        id: "c",
        text: "Relying on a single person to fix everything",
        isTrap: true,
      },
      { id: "d", text: "Never rehearsing recovery", isTrap: true },
    ],
    explanation: "Practice and tested backups enable reliable recovery.",
  },
  {
    id: "hard-q15",
    sceneId: "mainframe",
    difficulty: "Elite",
    scenario: "A build pipeline exposes credentials in logs.",
    question: "What immediate mitigation is appropriate?",
    options: [
      {
        id: "a",
        text: "Rotate the exposed credentials and remove them from logs",
        isTrap: false,
      },
      { id: "b", text: "Leave them; it's faster", isTrap: true },
      { id: "c", text: "Publish the logs to a public repo", isTrap: true },
      { id: "d", text: "Share credentials with devs via chat", isTrap: true },
    ],
    explanation: "Rotate secrets and purge logs to limit exposure.",
  },
  {
    id: "hard-q16",
    sceneId: "mainframe",
    difficulty: "Elite",
    scenario: "A privileged account shows unusual login times.",
    question: "Which step helps investigate securely?",
    options: [
      {
        id: "a",
        text: "Collect session logs and freeze the account pending investigation",
        isTrap: false,
      },
      { id: "b", text: "Reset everyone’s passwords immediately", isTrap: true },
      { id: "c", text: "Ignore; it’s probably normal", isTrap: true },
      { id: "d", text: "Delete logs to hide activity", isTrap: true },
    ],
    explanation:
      "Preserving evidence and isolating suspects supports safe investigation.",
  },
  {
    id: "hard-q17",
    sceneId: "mainframe",
    difficulty: "Elite",
    scenario: "A service dependency goes down during peak hours.",
    question: "What’s an operationally secure approach?",
    options: [
      {
        id: "a",
        text: "Failover to redundant services with controlled rollback",
        isTrap: false,
      },
      {
        id: "b",
        text: "Make immediate config changes without testing",
        isTrap: true,
      },
      { id: "c", text: "Shut down all services to be safe", isTrap: true },
      { id: "d", text: "Expose internal APIs publicly", isTrap: true },
    ],
    explanation:
      "Controlled failover minimizes downtime while preserving security posture.",
  },
  {
    id: "hard-q18",
    sceneId: "mainframe",
    difficulty: "Elite",
    scenario: "Developers request SSH access to production nodes.",
    question: "Which policy is most secure?",
    options: [
      {
        id: "a",
        text: "Use just-in-time access with approval and audit logs",
        isTrap: false,
      },
      {
        id: "b",
        text: "Provide permanent SSH keys to all developers",
        isTrap: true,
      },
      {
        id: "c",
        text: "Share a single root account for convenience",
        isTrap: true,
      },
      { id: "d", text: "Disable logging for performance", isTrap: true },
    ],
    explanation: "JIT access limits exposure and provides an audit trail.",
  },
  {
    id: "hard-q19",
    sceneId: "mainframe",
    difficulty: "Elite",
    scenario: "An attacker may be moving laterally inside the network.",
    question: "What control limits lateral movement?",
    options: [
      {
        id: "a",
        text: "Network segmentation and least-privilege host access",
        isTrap: false,
      },
      { id: "b", text: "Open all internal ports", isTrap: true },
      { id: "c", text: "Disable internal firewalls", isTrap: true },
      { id: "d", text: "Share admin credentials widely", isTrap: true },
    ],
    explanation:
      "Segmentation and strict host permissions reduce attacker mobility.",
  },
  {
    id: "hard-q20",
    sceneId: "mainframe",
    difficulty: "Elite",
    scenario: "You need to validate a backup's integrity before restore.",
    question: "Which practice ensures reliable restores?",
    options: [
      {
        id: "a",
        text: "Regularly test restores from backups in an isolated environment",
        isTrap: false,
      },
      {
        id: "b",
        text: "Assume backups are fine without testing",
        isTrap: true,
      },
      {
        id: "c",
        text: "Keep backups on the same failing hardware",
        isTrap: true,
      },
      { id: "d", text: "Encrypt backups but never verify", isTrap: true },
    ],
    explanation:
      "Periodic restore tests verify backup integrity and recovery procedures.",
  },
];
