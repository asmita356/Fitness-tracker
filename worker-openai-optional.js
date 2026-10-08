// Cloudflare Worker: private AI proxy for Discipline30.
// Secrets (set in the Worker dashboard, never in this file): OPENAI_API_KEY
// Variable: ALLOWED_ORIGIN = your app's address, e.g. https://yourapp.netlify.app

const MODEL = "gpt-4o-mini"; // change to any chat model your provider offers

export default {
  async fetch(req, env) {
    const origin = env.ALLOWED_ORIGIN || "*";
    const cors = {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };
    if (req.method === "OPTIONS") return new Response(null, { headers: cors });
    if (req.method !== "POST") return new Response("Not found", { status: 404, headers: cors });

    try {
      const b = await req.json();
      const clip = (v, n) => String(v || "").slice(0, n);
      const system =
        "You are a warm, firm personal fitness and discipline coach. Reply in under 120 words, plain text, no markdown. " +
        "Be specific and practical. Do not give medical advice or diagnose; for pain or injury tell the user to see a doctor. " +
        "Use the numbers to give personal, specific advice. Only discuss fitness, nutrition basics, sleep, habits and motivation.";
      const data =
        `User: ${clip(b.name, 30)}; goal: ${clip(b.goal, 40)}; level: ${clip(b.level, 20)}; ` +
        `day ${Number(b.day) || 1} of ${Number(b.totalDays) || 30} (${clip(b.phase, 12)} phase); streak ${Number(b.streak) || 0}; core habits ticked ${Number(b.habits) || 0}/5; water ${Number(b.water) || 0}/10 glasses; sleep ${Number(b.sleep) || 0} h; healthy meals ${Number(b.meals) || 0}/3; discipline score today ${Number(b.score) || 0}/100 (average ${Number(b.avgScore) || 0}); ` +
        `today's plan: ${clip(b.workout, 300)}; own tasks: ${(Array.isArray(b.tasks) ? b.tasks : []).slice(0, 10).map((t) => clip(t, 60)).join(", ") || "none"}.`;

      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + env.OPENAI_API_KEY },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 250,
          messages: [
            { role: "system", content: system },
            { role: "user", content: data + "\nRequest: " + clip(b.message, 300) },
          ],
        }),
      });
      if (!r.ok) throw new Error("provider " + r.status);
      const j = await r.json();
      const reply = j.choices?.[0]?.message?.content?.trim() || "";
      return new Response(JSON.stringify({ reply }), { headers: { ...cors, "Content-Type": "application/json" } });
    } catch (e) {
      return new Response(JSON.stringify({ error: "coach_unavailable" }), { status: 502, headers: { ...cors, "Content-Type": "application/json" } });
    }
  },
};
