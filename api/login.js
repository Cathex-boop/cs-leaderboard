// api/login.js — Vercel Serverless Function
// Verifies password and sets auth cookie

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { password } = req.body;
  const correct = process.env.SITE_PASSWORD;

  if (!correct) return res.status(500).json({ error: "SITE_PASSWORD not configured" });

  if (password === correct) {
    // Set auth cookie — httpOnly, secure, 7 days
    res.setHeader("Set-Cookie",
      `auth=${correct}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}`
    );
    return res.status(200).json({ ok: true });
  }

  return res.status(401).json({ error: "Wrong password" });
}
