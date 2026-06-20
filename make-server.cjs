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

function statFromRank(rank, fallback) {
  const value = Number(rank);
  if (!Number.isFinite(value) || value <= 0) return fallback;
  return Math.max(58, Math.min(90, 92 - value * 0.65));
}

function mapLotteryMatch(item) {
  const homeKey = "team-" + (item.homeId || item.homeChs || "home");
  const awayKey = "team-" + (item.awayId || item.awayChs || "away");
  const matchTime = item.matchTime || "";
  const homeRankStat = statFromRank(item.homeRank, 72);
  const awayRankStat = statFromRank(item.awayRank, 72);

  return {
    id: String(item.matchGuid || item.matchId || homeKey + "-" + awayKey),
    date: matchTime.slice(0, 10) || new Date().toISOString().slice(0, 10),
    time: matchTime.slice(11, 16) || "待确认",
    group: item.leagueChs || "竞彩",
    venue: item.lotteryId || "体彩开放赛事",
    stakes: [
      item.lotteryId || "竞彩",
      item.leagueChs || "赛事",
      Number.isFinite(Number(item.goalFoot)) ? "让球 " + item.goalFoot : "",
      item.singleSpfFoot ? "支持单关" : ""
    ].filter(Boolean).join(" · "),
    homeKey,
    awayKey,
    homeName: item.homeChs || item.home || homeKey,
    awayName: item.awayChs || item.away || awayKey,
    homeFormation: "待确认",
    awayFormation: "待确认",
    homeStyle: "自动赛程源已更新，阵容、伤停和首发需要赛前复核。",
    awayStyle: "自动赛程源已更新，阵容、伤停和首发需要赛前复核。",
    homeStars: ["首发待确认"],
    awayStars: ["首发待确认"],
    homeAttack: Math.round(homeRankStat),
    homeMidfield: Math.round(homeRankStat - 1),
    homeDefense: Math.round(homeRankStat - 2),
    homeForm: Math.round(homeRankStat),
    homeDepth: Math.round(homeRankStat - 3),
    awayAttack: Math.round(awayRankStat),
    awayMidfield: Math.round(awayRankStat - 1),
    awayDefense: Math.round(awayRankStat - 2),
    awayForm: Math.round(awayRankStat),
    awayDepth: Math.round(awayRankStat - 3),
    homeXg: item.spfWinFoot ? Math.max(0.6, Math.min(2.6, 2.4 / Number(item.spfWinFoot))) : 1.25,
    awayXg: item.spfLoseFoot ? Math.max(0.5, Math.min(2.4, 2.2 / Number(item.spfLoseFoot))) : 1.1,
    odds: {
      h: Number(item.spfWinFoot) || 2.1,
      d: Number(item.spfEqualFoot) || 3.1,
      a: Number(item.spfLoseFoot) || 3.2,
      o: Number(item.over) || 1.9,
      u: Number(item.under) || 1.85,
      ht: 2.05
    }
  };
}

function mapLotterySchedule(data) {
  const groups = Array.isArray(data && data.data) ? data.data : [];
  return groups.flatMap((group) => Array.isArray(group.list) ? group.list.map(mapLotteryMatch) : []);
}

async function loadConfiguredSchedule(env) {
  const sourceUrl = env.SCHEDULE_API_URL || "https://justpost.haoyun999.cn/api/Game/GetSimpleMatchsAll";

  const res = await fetch(sourceUrl, {
    headers: env.SCHEDULE_API_TOKEN ? { authorization: "Bearer " + env.SCHEDULE_API_TOKEN } : undefined
  });

  if (!res.ok) {
    return {
      source: sourceUrl,
      updatedAt: new Date().toISOString(),
      matches: [],
      message: "Schedule source returned HTTP " + res.status
    };
  }

  const data = await res.json();
  const mapped = data && data.code === 0 && Array.isArray(data.data)
    ? mapLotterySchedule(data)
    : Array.isArray(data) ? data : data.matches || [];

  return {
    source: data.source || sourceUrl,
    updatedAt: data.updatedAt || new Date().toISOString(),
    matches: mapped,
    message: data.message || data.info || ""
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
