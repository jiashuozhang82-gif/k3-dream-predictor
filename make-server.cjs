const fs = require("fs");

const qrPath = "assets/alipay-qr.jpg";
const qrDataUri = fs.existsSync(qrPath)
  ? `data:image/jpeg;base64,${fs.readFileSync(qrPath).toString("base64")}`
  : "";

const html = fs.readFileSync("index.html", "utf8")
  .replace("./assets/alipay-qr.jpg", qrDataUri || "./assets/alipay-qr.jpg")
  .replace(
    '<link rel="stylesheet" href="./styles.css" />',
    `<style>${fs.readFileSync("styles.css", "utf8")}</style>`
  )
  .replace(
    '<script type="module" src="./app.js"></script>',
    `<script type="module">${fs.readFileSync("app.js", "utf8")}</script>`
  );

const server = `const html = ${JSON.stringify(html)};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" }
  });
}

function buildPrompt(payload) {
  return [
    "You are a football pre-match analysis assistant. Use market odds, Kelly indicators, Poisson probabilities, squad/style context, and historical samples to produce a concise prediction.",
    "Return strict JSON only with fields pick and analysis. Do not include betting guarantees or financial promises.",
    JSON.stringify(payload)
  ].join("\\\\n");
}

async function sha256Text(text) {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function activationCode(phone, secret) {
  const hash = await sha256Text(String(phone).trim() + ":" + secret);
  return hash.slice(0, 8).toUpperCase();
}

function validPhone(phone) {
  return /^1\\d{10}$/.test(String(phone || "").trim());
}

async function loadConfiguredSchedule(env) {
  if (!env.SCHEDULE_API_URL) {
    return {
      source: "local-fallback",
      updatedAt: new Date().toISOString(),
      matches: [],
      message: "SCHEDULE_API_URL is not configured. Showing local fallback schedule."
    };
  }

  const res = await fetch(env.SCHEDULE_API_URL, {
    headers: env.SCHEDULE_API_TOKEN ? { authorization: "Bearer " + env.SCHEDULE_API_TOKEN } : undefined
  });

  if (!res.ok) {
    return {
      source: env.SCHEDULE_API_URL,
      updatedAt: new Date().toISOString(),
      matches: [],
      message: "Schedule source returned HTTP " + res.status
    };
  }

  const data = await res.json();
  return {
    source: data.source || env.SCHEDULE_API_URL,
    updatedAt: data.updatedAt || new Date().toISOString(),
    matches: Array.isArray(data) ? data : data.matches || [],
    message: data.message || ""
  };
}

async function callChat(provider, apiKey, endpoint, model, payload) {
  if (!apiKey) return { provider, ok: false, error: "API key is not configured" };

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: "Bearer " + apiKey
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: buildPrompt(payload) }],
      temperature: 0.2
    })
  });

  if (!res.ok) return { provider, ok: false, error: "HTTP " + res.status };

  const data = await res.json();
  const text = data.choices && data.choices[0] && data.choices[0].message
    ? data.choices[0].message.content || ""
    : "";

  try {
    return { provider, ok: true, ...JSON.parse(text) };
  } catch {
    return { provider, ok: true, pick: "Model analysis", analysis: text.slice(0, 500) };
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/health") return new Response("ok");

    if (url.pathname === "/api/schedule") {
      try {
        return json(await loadConfiguredSchedule(env));
      } catch (error) {
        return json({
          source: "schedule-error",
          updatedAt: new Date().toISOString(),
          matches: [],
          message: error.message || "Schedule update failed"
        });
      }
    }

    if (url.pathname === "/api/admin-code" && request.method === "POST") {
      const body = await request.json();
      if (!validPhone(body.phone)) return json({ ok: false, error: "Invalid phone number" }, 400);
      if (!env.ADMIN_PASSWORD || !env.ACTIVATION_SECRET) {
        return json({ ok: false, error: "Admin activation is not configured" }, 500);
      }
      if (body.password !== env.ADMIN_PASSWORD) {
        return json({ ok: false, error: "Admin password is incorrect" }, 403);
      }
      return json({ ok: true, phone: body.phone, code: await activationCode(body.phone, env.ACTIVATION_SECRET) });
    }

    if (url.pathname === "/api/verify-activation" && request.method === "POST") {
      const body = await request.json();
      if (!validPhone(body.phone)) return json({ ok: false, error: "Invalid phone number" }, 400);
      if (!env.ACTIVATION_SECRET) {
        return json({ ok: false, error: "Activation is not configured" }, 500);
      }
      const expected = await activationCode(body.phone, env.ACTIVATION_SECRET);
      if (String(body.code || "").trim().toUpperCase() !== expected) {
        return json({ ok: false, error: "授权码无效或手机号不匹配" }, 403);
      }
      return json({ ok: true, phone: body.phone });
    }

    if (url.pathname === "/api/ai-analysis" && request.method === "POST") {
      try {
        const payload = await request.json();
        const results = await Promise.all([
          callChat("Qwen", env.QWEN_API_KEY, "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions", "qwen-plus", payload),
          callChat("DeepSeek", env.DEEPSEEK_API_KEY, "https://api.deepseek.com/chat/completions", "deepseek-chat", payload)
        ]);
        return json({ results });
      } catch (error) {
        return json({ error: error.message || "AI analysis failed" }, 500);
      }
    }

    return new Response(html, {
      headers: { "content-type": "text/html; charset=utf-8" }
    });
  }
};
`;

fs.writeFileSync("index.js", server, "utf8");
