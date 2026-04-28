export interface AchievementShareData {
  username: string;
  score: number;
  rank: string;
  accuracy: number;
  outcome: "success" | "failed";
  difficulty?: "ScriptKiddie" | "Hacker" | "Elite";
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null); // fail gracefully — card still renders without logo
    img.src = src;
  });
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

const DIFF_COLOR: Record<string, string> = {
  ScriptKiddie: "#00ff88",
  Hacker: "#ffaa00",
  Elite: "#ff2244",
};
const DIFF_LABEL: Record<string, string> = {
  ScriptKiddie: "EASY",
  Hacker: "MEDIUM",
  Elite: "ELITE",
};

export async function generateAchievementCard(data: AchievementShareData): Promise<Blob> {
  const { username, score, rank, accuracy, outcome, difficulty } = data;

  const SIZE = 1080;
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d")!;

  const [uniKLImg, csscImg] = await Promise.all([
    loadImage("/ICON/unikl-logo-png-new.png"),
    loadImage("/ICON/CLUB.png"),
  ]);

  const isSuccess = outcome === "success";
  const accent = isSuccess ? "#00ff88" : "#ff2244";
  const accentRgb = isSuccess ? "0,255,136" : "255,34,68";

  // ── Background ───────────────────────────────────────────────
  ctx.fillStyle = "#0a0f1a";
  ctx.fillRect(0, 0, SIZE, SIZE);

  // ── Grid overlay ─────────────────────────────────────────────
  ctx.strokeStyle = "rgba(0,255,136,0.05)";
  ctx.lineWidth = 1;
  for (let y = 0; y <= SIZE; y += 44) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(SIZE, y); ctx.stroke();
  }
  for (let x = 0; x <= SIZE; x += 44) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, SIZE); ctx.stroke();
  }

  // ── Radial glow ───────────────────────────────────────────────
  const glow = ctx.createRadialGradient(540, 500, 0, 540, 500, 520);
  glow.addColorStop(0, `rgba(${accentRgb},0.11)`);
  glow.addColorStop(1, "transparent");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // ── Top accent line ───────────────────────────────────────────
  const topLine = ctx.createLinearGradient(0, 0, SIZE, 0);
  topLine.addColorStop(0, "transparent");
  topLine.addColorStop(0.5, accent);
  topLine.addColorStop(1, "transparent");
  ctx.fillStyle = topLine;
  ctx.fillRect(0, 0, SIZE, 3);

  // ── Logos — centered pair ─────────────────────────────────────
  const LOGO_SIZE = 90;
  const LOGO_GAP = 24;
  const LOGO_PAD = 12;
  const LOGO_Y = 62;
  const totalLogoW = LOGO_SIZE * 2 + LOGO_GAP;
  const logo1X = (SIZE - totalLogoW) / 2;
  const logo2X = logo1X + LOGO_SIZE + LOGO_GAP;

  // UniKL tile
  ctx.fillStyle = "rgba(255,255,255,0.07)";
  roundRect(ctx, logo1X, LOGO_Y, LOGO_SIZE, LOGO_SIZE, 14);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.10)";
  ctx.lineWidth = 1.5;
  roundRect(ctx, logo1X, LOGO_Y, LOGO_SIZE, LOGO_SIZE, 14);
  ctx.stroke();
  if (uniKLImg) {
    ctx.drawImage(
      uniKLImg,
      logo1X + LOGO_PAD, LOGO_Y + LOGO_PAD,
      LOGO_SIZE - LOGO_PAD * 2, LOGO_SIZE - LOGO_PAD * 2,
    );
  }

  // CSSC tile
  ctx.fillStyle = "rgba(12,12,12,0.80)";
  roundRect(ctx, logo2X, LOGO_Y, LOGO_SIZE, LOGO_SIZE, 14);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.10)";
  ctx.lineWidth = 1.5;
  roundRect(ctx, logo2X, LOGO_Y, LOGO_SIZE, LOGO_SIZE, 14);
  ctx.stroke();
  if (csscImg) {
    ctx.drawImage(
      csscImg,
      logo2X + LOGO_PAD, LOGO_Y + LOGO_PAD,
      LOGO_SIZE - LOGO_PAD * 2, LOGO_SIZE - LOGO_PAD * 2,
    );
  }

  // ── Divider under logos ───────────────────────────────────────
  ctx.fillStyle = "rgba(255,255,255,0.07)";
  ctx.fillRect(80, 188, SIZE - 160, 1.5);

  // All remaining text is center-aligned
  ctx.textAlign = "center";
  ctx.shadowBlur = 0;

  // ── Outcome badge ─────────────────────────────────────────────
  ctx.font = "bold 28px 'Courier New', Courier, monospace";
  ctx.fillStyle = accent;
  ctx.shadowColor = accent;
  ctx.shadowBlur = 14;
  ctx.fillText(isSuccess ? "[ ACCESS GRANTED ]" : "[ ACCESS DENIED ]", SIZE / 2, 248);
  ctx.shadowBlur = 0;

  // ── Username ──────────────────────────────────────────────────
  ctx.font = "bold 62px 'Courier New', Courier, monospace";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(`@${username}`, SIZE / 2, 350);

  // ── Score ─────────────────────────────────────────────────────
  ctx.font = "bold 150px 'Courier New', Courier, monospace";
  ctx.fillStyle = accent;
  ctx.shadowColor = accent;
  ctx.shadowBlur = 40;
  ctx.fillText(score.toLocaleString(), SIZE / 2, 518);
  ctx.shadowBlur = 0;

  ctx.font = "bold 22px 'Courier New', Courier, monospace";
  ctx.fillStyle = "rgba(255,255,255,0.28)";
  ctx.fillText("POINTS", SIZE / 2, 562);

  // ── Rank ──────────────────────────────────────────────────────
  ctx.font = "bold 46px 'Courier New', Courier, monospace";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(rank.toUpperCase(), SIZE / 2, 656);

  // ── Stats row ─────────────────────────────────────────────────
  const statsY = 768;

  ctx.font = "bold 42px 'Courier New', Courier, monospace";
  ctx.fillStyle = "#ffaa00";
  ctx.fillText(`${accuracy}%`, SIZE * 0.3, statsY);
  ctx.font = "18px 'Courier New', Courier, monospace";
  ctx.fillStyle = "rgba(255,255,255,0.28)";
  ctx.fillText("ACCURACY", SIZE * 0.3, statsY + 34);

  // Vertical separator
  ctx.fillStyle = "rgba(255,255,255,0.07)";
  ctx.fillRect(SIZE / 2 - 1, statsY - 46, 2, 76);

  ctx.font = "bold 42px 'Courier New', Courier, monospace";
  ctx.fillStyle = difficulty ? (DIFF_COLOR[difficulty] ?? "#ffffff") : "#ffffff";
  ctx.fillText(difficulty ? (DIFF_LABEL[difficulty] ?? "—") : "—", SIZE * 0.7, statsY);
  ctx.font = "18px 'Courier New', Courier, monospace";
  ctx.fillStyle = "rgba(255,255,255,0.28)";
  ctx.fillText("DIFFICULTY", SIZE * 0.7, statsY + 34);

  // ── Bottom divider ────────────────────────────────────────────
  ctx.fillStyle = "rgba(255,255,255,0.07)";
  ctx.fillRect(80, 852, SIZE - 160, 1.5);

  // ── Watermark ─────────────────────────────────────────────────
  ctx.font = "18px 'Courier New', Courier, monospace";
  ctx.fillStyle = `rgba(${accentRgb},0.32)`;
  ctx.fillText("ZERO DAY RECRUIT · CSSC CLUB UNIKL MIIT", SIZE / 2, 908);

  // ── Corner accents ────────────────────────────────────────────
  const AL = 72; // accent length
  const AP = 36; // accent padding from edge
  ctx.strokeStyle = `rgba(${accentRgb},0.55)`;
  ctx.lineWidth = 3;
  ctx.lineCap = "square";
  ctx.beginPath(); ctx.moveTo(AP, AP + AL); ctx.lineTo(AP, AP); ctx.lineTo(AP + AL, AP); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(SIZE - AP - AL, AP); ctx.lineTo(SIZE - AP, AP); ctx.lineTo(SIZE - AP, AP + AL); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(AP, SIZE - AP - AL); ctx.lineTo(AP, SIZE - AP); ctx.lineTo(AP + AL, SIZE - AP); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(SIZE - AP - AL, SIZE - AP); ctx.lineTo(SIZE - AP, SIZE - AP); ctx.lineTo(SIZE - AP, SIZE - AP - AL); ctx.stroke();

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Canvas toBlob failed"))),
      "image/png",
    );
  });
}
