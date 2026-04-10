// api/auth.js — checks if the auth cookie is valid
module.exports = function handler(req, res) {
  const correct = process.env.SITE_PASSWORD;
  const cookies = req.headers.cookie || "";
  const authCookie = cookies.split(";").map(c => c.trim())
    .find(c => c.startsWith("auth="));
  const value = authCookie ? authCookie.split("=")[1] : null;

  if (value === correct) {
    return res.status(200).json({ ok: true });
  }
  return res.status(401).json({ ok: false });
};
