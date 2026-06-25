const teams = {
  Brazil:{zh:"巴西",code:"BRA",group:"C",formation:"4-3-3",style:"边路爆点和高位压迫突出，进攻上限高。",stars:["Vinicius Junior","Rodrygo","Bruno Guimaraes"],veterans:"核心处在黄金年龄，老将经验主要体现在中后场控节奏。",coach:86,rank:5,groupPoints:3,h2h20:"近20年面对弱旅胜率高，但让深盘时需防节奏放缓。",attack:94,midfield:88,defense:84,form:84,depth:90,baseXg:2.15},
  Haiti:{zh:"海地",code:"HAI",group:"C",formation:"5-4-1",style:"低位防守、反击和二点球为主，控球推进较弱。",stars:["Duckens Nazon","Frantzdy Pierrot","Jean-Ricner Bellegarde"],veterans:"锋线经验尚可，但整体大赛经验不足。",coach:61,rank:83,groupPoints:0,h2h20:"面对顶级强队抗压时间越长，后段失球风险越高。",attack:64,midfield:61,defense:59,form:62,depth:55,baseXg:.78},
  Netherlands:{zh:"荷兰",code:"NED",group:"F",formation:"3-4-2-1",style:"三中卫出球稳定，定位球强，边翼卫推进质量高。",stars:["Virgil van Dijk","Frenkie de Jong","Xavi Simons"],veterans:"范戴克等老将提升防线指挥和定位球威胁。",coach:84,rank:8,groupPoints:3,h2h20:"近20年大赛淘汰赛经验足，但面对北欧双前锋要防二点球。",attack:84,midfield:84,defense:87,form:82,depth:82,baseXg:1.62},
  Sweden:{zh:"瑞典",code:"SWE",group:"F",formation:"4-4-2",style:"双前锋支点明确，长传和边路传中直接。",stars:["Alexander Isak","Dejan Kulusevski","Viktor Gyokeres"],veterans:"中后场经验稳定，锋线冲击更年轻化。",coach:76,rank:34,groupPoints:1,h2h20:"面对强队常以防守反击制造低比分拉扯。",attack:82,midfield:76,defense:74,form:77,depth:74,baseXg:1.42},
  Germany:{zh:"德国",code:"GER",group:"E",formation:"4-2-3-1",style:"中前场技术密度高，阵地战强，防线身后需保护。",stars:["Jamal Musiala","Florian Wirtz","Joshua Kimmich"],veterans:"基米希等老将带来比赛管理和压迫触发判断。",coach:85,rank:10,groupPoints:3,h2h20:"大赛底蕴强，领先后控场能力较好。",attack:88,midfield:90,defense:80,form:83,depth:86,baseXg:1.82},
  CIV:{zh:"科特迪瓦",code:"CIV",group:"E",formation:"4-3-3",style:"个人冲击力强，转换速度快，防线协同影响上限。",stars:["Sebastien Haller","Franck Kessie","Simon Adingra"],veterans:"凯西和阿莱提供硬度与支点，节奏稳定性仍需观察。",coach:77,rank:30,groupPoints:1,h2h20:"面对欧洲强队常能制造身体对抗优势。",attack:77,midfield:76,defense:72,form:79,depth:73,baseXg:1.28},
  USA:{zh:"美国",code:"USA",group:"D",formation:"4-3-3",style:"跑动覆盖大，边路速度明显，主场环境强化压迫。",stars:["Christian Pulisic","Weston McKennie","Tyler Adams"],veterans:"主力年龄结构均衡，老将优势不明显但体能充足。",coach:78,rank:16,groupPoints:3,h2h20:"主场赛事稳定性较高，遇密集防守需看边路效率。",attack:80,midfield:79,defense:77,form:80,depth:78,baseXg:1.52},
  Australia:{zh:"澳大利亚",code:"AUS",group:"D",formation:"4-4-1-1",style:"防守组织稳定，身体对抗强，阵地战效率一般。",stars:["Jackson Irvine","Harry Souttar","Mathew Ryan"],veterans:"门将和中卫老将经验有利于守低位。",coach:74,rank:24,groupPoints:1,h2h20:"面对速度型球队容易被边路拉开。",attack:69,midfield:71,defense:75,form:72,depth:68,baseXg:1.03}
};

let matches = [
  {id:"ned-swe",date:"2026-06-21",time:"01:00",group:"F",venue:"周六033",home:"Netherlands",away:"Sweden",stakes:"世界杯小组关键战，胜者接近小组前二。",odds:{h:1.54,d:3.8,a:4.6,o:1.9,u:1.85,ht:2.05}},
  {id:"ger-civ",date:"2026-06-21",time:"04:00",group:"E",venue:"周六034",home:"Germany",away:"CIV",stakes:"德国控球优势明显，科特迪瓦转换速度是主要变量。",odds:{h:1.62,d:3.65,a:5.1,o:1.72,u:1.98,ht:2.22}},
  {id:"usa-aus",date:"2026-06-21",time:"07:00",group:"D",venue:"周六035",home:"USA",away:"Australia",stakes:"美国主场压迫对澳大利亚低位防守。",odds:{h:1.82,d:3.35,a:4.05,o:1.88,u:1.82,ht:2.08}}
];

let state = {date: matches[0].date, id: matches[0].id};
let scheduleMeta = {source:"本地/远程赛程", updatedAt:null, fallback:true};
let monitorTimer = null;

const $ = (selector) => document.querySelector(selector);
const pct = (value) => `${(value * 100).toFixed(1)}%`;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const avg = (items) => items.reduce((sum, item)=>sum+item,0)/items.length;

function factorial(n){let result = 1; for(let i = 2; i <= n; i += 1) result *= i; return result;}
function poisson(lambda, goals){return Math.exp(-lambda) * Math.pow(lambda, goals) / factorial(goals);}
function currentMatch(){return matches.find((match) => match.id === state.id) || matches[0];}
function readOdds(){return {h:+$("#oH").value,d:+$("#oD").value,a:+$("#oA").value,o:+$("#oO").value,u:+$("#oU").value,ht:+$("#oHT").value};}
function implied(odds){const raw = {h:1/odds.h,d:1/odds.d,a:1/odds.a}; const total = raw.h + raw.d + raw.a; return {h:raw.h/total,d:raw.d/total,a:raw.a/total,margin:total-1};}
function kellyFraction(probability, decimalOdds){const b=decimalOdds-1; if(!b || b<=0) return 0; return Math.max(0,(b*probability-(1-probability))/b);}
function evValue(probability, decimalOdds, stake){return probability * (decimalOdds - 1) * stake - (1 - probability) * stake;}

function ensureTeam(key, name, rank=50){
  if(teams[key]) return;
  const rating = clamp(92 - rank * .55, 58, 88);
  teams[key] = {zh:name || key, code:String(name || key).slice(0,3).toUpperCase(), group:"竞彩", formation:"待确认", style:"自动赛程源球队，阵容、伤停、首发和教练信息需赛前复核。", stars:["首发待确认"], veterans:"老将与核心球员信息待赛前确认。", coach:Math.round(rating), rank, groupPoints:0, h2h20:"近20年交手样本需赛前补充。", attack:Math.round(rating), midfield:Math.round(rating-1), defense:Math.round(rating-2), form:Math.round(rating), depth:Math.round(rating-3), baseXg:1.15};
}

function mapLotteryRows(payload){
  if(!(payload?.code===0 && Array.isArray(payload.data))) return null;
  return payload.data.flatMap((group)=>Array.isArray(group.list)?group.list.map((item)=>{
    const homeKey=`team-${item.homeId || item.homeChs}`;
    const awayKey=`team-${item.awayId || item.awayChs}`;
    ensureTeam(homeKey,item.homeChs,Number(item.homeRank)||50);
    ensureTeam(awayKey,item.awayChs,Number(item.awayRank)||50);
    return {id:String(item.matchGuid || item.matchId),date:(item.matchTime || "").slice(0,10) || new Date().toISOString().slice(0,10),time:(item.matchTime || "").slice(11,16) || "待确认",group:item.leagueChs || "竞彩",venue:item.lotteryId || "体彩开放赛事",home:homeKey,away:awayKey,stakes:[item.lotteryId,item.leagueChs,Number.isFinite(Number(item.goalFoot))?`让球 ${item.goalFoot}`:"",item.singleSpfFoot?"支持单关":""].filter(Boolean).join(" · "),odds:{h:Number(item.spfWinFoot)||2.1,d:Number(item.spfEqualFoot)||3.1,a:Number(item.spfLoseFoot)||3.2,o:Number(item.over)||1.9,u:Number(item.under)||1.85,ht:2.05}};
  }):[]);
}

function normalizeRemoteSchedule(payload){
  const rows = mapLotteryRows(payload) || (Array.isArray(payload) ? payload : payload.matches);
  if(!Array.isArray(rows)) return [];
  return rows.map((item,index)=>{
    const homeKey=item.homeKey || item.home || `RemoteHome${index}`;
    const awayKey=item.awayKey || item.away || `RemoteAway${index}`;
    ensureTeam(homeKey,item.homeName || item.home || homeKey,item.homeRank || 50);
    ensureTeam(awayKey,item.awayName || item.away || awayKey,item.awayRank || 50);
    return {id:item.id || `${homeKey}-${awayKey}-${item.date || ""}`,date:item.date || new Date().toISOString().slice(0,10),time:item.time || "待确认",group:item.group || "竞彩",venue:item.venue || "体彩开放赛事",home:homeKey,away:awayKey,stakes:item.stakes || "自动更新赛程，阵容与盘口需临场复核。",odds:{h:+(item.odds?.h || item.h || item.win || 2.1),d:+(item.odds?.d || item.d || item.draw || 3.1),a:+(item.odds?.a || item.a || item.loss || 3.2),o:+(item.odds?.o || item.o || item.over || 1.9),u:+(item.odds?.u || item.u || item.under || 1.85),ht:+(item.odds?.ht || item.ht || item.halfDraw || 2.05)}};
  }).filter((item)=>item.home && item.away);
}

async function loadSchedule(){
  const sources=["/api/schedule","https://justpost.haoyun999.cn/api/Game/GetSimpleMatchsAll"];
  let lastError=null;
  for(const source of sources){
    try{
      const response = await fetch(source,{cache:"no-store"});
      if(!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload = await response.json();
      const remote = normalizeRemoteSchedule(payload);
      scheduleMeta = {source:payload.source || source, updatedAt:payload.updatedAt || new Date().toISOString(), fallback:!remote.length, message:payload.message || payload.info || ""};
      if(remote.length){matches = remote; state.date = matches[0].date; state.id = matches[0].id; render(); return;}
    }catch(error){lastError=error;}
  }
  scheduleMeta = {...scheduleMeta, fallback:true, message:`实时赛程暂未更新：${lastError?.message || "数据源不可用"}`};
  renderMatchList();
}

function expectedGoals(match){
  const h = teams[match.home], a = teams[match.away];
  const rankEdge = ((a.rank||50) - (h.rank||50)) / 85;
  const coachEdge = ((h.coach||72) - (a.coach||72)) / 120;
  const formEdge = (h.form - a.form) / 95;
  return {h: clamp(h.baseXg + (h.attack-a.defense)/52 + formEdge + coachEdge + rankEdge + .06, .25, 3.6), a: clamp(a.baseXg + (a.attack-h.defense)/55 - formEdge/2 - coachEdge/2 - rankEdge/2, .2, 3.2)};
}

function model(match){
  const xg = expectedGoals(match); const scores = [];
  let h=0,d=0,a=0,over=0,bts=0,big=0,htD=0;
  for(let home=0; home<=7; home+=1){for(let away=0; away<=7; away+=1){
    const p = poisson(xg.h,home)*poisson(xg.a,away);
    scores.push({score:`${home}-${away}`,p});
    if(home>away) h+=p; else if(home===away) d+=p; else a+=p;
    if(home+away>2.5) over+=p;
    if(home && away) bts+=p;
    if(home+away>=4) big+=p;
  }}
  for(let home=0; home<=4; home+=1){for(let away=0; away<=4; away+=1){
    if(home===away) htD += poisson(xg.h*.45,home)*poisson(xg.a*.45,away);
  }}
  const covered=scores.reduce((sum,item)=>sum+item.p,0);
  return {xg,h:h/covered,d:d/covered,a:a/covered,over:over/covered,bts:bts/covered,big:big/covered,htDraw:clamp(htD,0,1),scores:scores.sort((x,y)=>y.p-x.p).slice(0,6)};
}

function renderDates(){const dates=[...new Set(matches.map((match)=>match.date))]; $("#dateSelect").innerHTML=dates.map((date)=>`<option value="${date}">${date}</option>`).join(""); $("#dateSelect").value=state.date;}
function renderMatchList(){const list=matches.filter((match)=>match.date===state.date); if(!list.length){$("#matchList").innerHTML=`<div class="note">今日暂无可用赛程。${scheduleMeta.message || ""}</div>`; return;} if(!list.some((match)=>match.id===state.id)) state.id=list[0].id; const status=`<div class="schedule-status ${scheduleMeta.fallback?"warn":"ok"}">赛程源：${scheduleMeta.source}${scheduleMeta.updatedAt?` · ${new Date(scheduleMeta.updatedAt).toLocaleString()}`:""}${scheduleMeta.message?`<br>${scheduleMeta.message}`:""}</div>`; $("#matchList").innerHTML=status+list.map((match)=>`<button class="match ${match.id===state.id?"active":""}" data-id="${match.id}"><strong>${teams[match.home].zh} vs ${teams[match.away].zh}</strong><span>${match.group} · ${match.venue}</span><span>${match.stakes}</span></button>`).join("");}
function setOdds(match){$("#oH").value=match.odds.h; $("#oD").value=match.odds.d; $("#oA").value=match.odds.a; $("#oO").value=match.odds.o; $("#oU").value=match.odds.u; $("#oHT").value=match.odds.ht;}
function statBars(team){const labels={attack:"进攻",midfield:"中场",defense:"防守",form:"状态",depth:"深度",coach:"教练"}; return Object.keys(labels).map((key)=>`<div class="bar"><span>${labels[key]}</span><span class="track"><span class="fill" style="width:${team[key]}%"></span></span><span>${team[key]}</span></div>`).join("");}
function getSamples(){try{return JSON.parse(localStorage.getItem("k3OddsSamples")||"[]");}catch{return [];}}
function setSamples(samples){localStorage.setItem("k3OddsSamples",JSON.stringify(samples.slice(-500)));}
function readWeights(){return {market:+$("#wMarket")?.value||35, poisson:+$("#wPoisson")?.value||35, team:+$("#wTeam")?.value||30};}
function parseResultScore(text){const m=String(text||"").trim().match(/^(\d+)\s*[-:]\s*(\d+)$/); return m?{home:+m[1],away:+m[2]}:null;}
function outcomeFromScore(score){if(!score)return null; return score.home>score.away?"h":score.home===score.away?"d":"a";}

function trainFromSamples(){
  const done=getSamples().filter(s=>s.result);
  if(!done.length) return null;
  let marketHit=0,poissonHit=0;
  for(const s of done){
    const marketPick=Object.entries(s.odds).filter(([k])=>["h","d","a"].includes(k)).sort((x,y)=>x[1]-y[1])[0]?.[0];
    if(marketPick===s.result) marketHit+=1;
    if(s.modelPick===s.result) poissonHit+=1;
  }
  const marketRate=marketHit/done.length, poissonRate=poissonHit/done.length;
  const market=Math.round(20+marketRate*45), poissonWeight=Math.round(20+poissonRate*45), team=Math.max(10,100-market-poissonWeight);
  return {count:done.length,marketRate,poissonRate,weights:{market,poisson:poissonWeight,team}};
}
function applyTrainedWeights(){const trained=trainFromSamples(); if(!trained)return; $("#wMarket").value=trained.weights.market; $("#wPoisson").value=trained.weights.poisson; $("#wTeam").value=trained.weights.team;}

function blendedProbabilities(match, md){
  const odds=readOdds(), market=implied(odds), weights=readWeights();
  const home=teams[match.home], away=teams[match.away];
  const teamHome=clamp(.5 + (avg([home.attack,home.midfield,home.defense,home.form,home.coach])-avg([away.attack,away.midfield,away.defense,away.form,away.coach]))/260, .18, .78);
  const teamAway=clamp(.5 - (teamHome-.5), .18, .78);
  const teamDraw=clamp(.26 + (1-Math.abs(teamHome-teamAway))*.08, .18, .34);
  const normalize = (p) => {const t=p.h+p.d+p.a; return {h:p.h/t,d:p.d/t,a:p.a/t};};
  return normalize({
    h:(md.h*weights.poisson + market.h*weights.market + teamHome*weights.team),
    d:(md.d*weights.poisson + market.d*weights.market + teamDraw*weights.team),
    a:(md.a*weights.poisson + market.a*weights.market + teamAway*weights.team)
  });
}

function evRows(match, md){
  const odds=readOdds(), stake=+$("#evStake")?.value || 100, baseRate=+$("#baseRate")?.value || .52;
  const blend=blendedProbabilities(match, md);
  const priorAdjust = (p) => clamp(p*.72 + baseRate*.28, .02, .92);
  return [
    {key:"h",label:`${teams[match.home].zh}胜`,p:priorAdjust(blend.h),odds:odds.h},
    {key:"d",label:"平局",p:priorAdjust(blend.d),odds:odds.d},
    {key:"a",label:`${teams[match.away].zh}胜`,p:priorAdjust(blend.a),odds:odds.a},
    {key:"o",label:"大2.5球",p:priorAdjust(md.over),odds:odds.o}
  ].map((row)=>({...row,ev:evValue(row.p,row.odds,stake),kelly:kellyFraction(row.p,row.odds)})).sort((x,y)=>y.ev-x.ev);
}

function saveMatchResult(){const score=parseResultScore($("#resultScore")?.value); const result=outcomeFromScore(score); if(!result){alert("请输入正确赛果，例如 2-1"); return;} const match=currentMatch(); const samples=getSamples(); const last=[...samples].reverse().find(s=>s.matchId===match.id); if(last){last.score=score; last.result=result;} else {samples.push({time:Date.now(),matchId:match.id,odds:readOdds(),result,score});} setSamples(samples); applyTrainedWeights(); renderMain();}
function recordCurrentOdds(silent=false){const match=currentMatch(); const md=model(match); const top=[{key:"h",value:md.h},{key:"d",value:md.d},{key:"a",value:md.a}].sort((a,b)=>b.value-a.value)[0]; const samples=getSamples(); samples.push({time:Date.now(),matchId:match.id,odds:readOdds(),modelPick:top.key,handicap:{line:+$("#handicapLine").value,home:+$("#handicapHome").value,away:+$("#handicapAway").value}}); setSamples(samples); renderMain(); if(!silent) alert("已记录当前赔率。");}
function toggleMonitor(){const btn=$("#toggleMonitor"); if(monitorTimer){clearInterval(monitorTimer); monitorTimer=null; if(btn)btn.textContent="开始监控"; return;} recordCurrentOdds(true); const seconds=Math.max(60,+$("#monitorSeconds")?.value||7200); monitorTimer=setInterval(()=>recordCurrentOdds(true),seconds*1000); if(btn)btn.textContent="停止监控";}
function exportSamples(){const blob=new Blob([JSON.stringify(getSamples(),null,2)],{type:"application/json"}); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download="k3-odds-samples.json"; a.click(); URL.revokeObjectURL(url);}
function clearSamples(){setSamples([]); renderMain();}

function renderOddsText(md){
  const odds=readOdds(); if([odds.h,odds.d,odds.a].some((value)=>!value || value<=1)){ $("#oddsText").textContent="请输入有效赔率。"; return;}
  const market=implied(odds); const gaps=[["主胜",md.h-market.h],["平局",md.d-market.d],["客胜",md.a-market.a]].sort((x,y)=>Math.abs(y[1])-Math.abs(x[1]));
  const hard = Math.max(md.h,md.d,md.a)<.45 || Math.abs(md.h-market.h)<.035 && Math.abs(md.a-market.a)<.035;
  const overMarket = odds.o && odds.u ? (1/odds.o)/(1/odds.o+1/odds.u) : 0;
  $("#oddsText").innerHTML = `赔率隐含：主胜 ${pct(market.h)}、平局 ${pct(market.d)}、客胜 ${pct(market.a)}；水位约 ${(market.margin*100).toFixed(1)}%。<br>模型与市场最大偏差：${gaps[0][0]} ${gaps[0][1]>=0?"+":""}${(gaps[0][1]*100).toFixed(1)} 个百分点。${overMarket?`<br>大2.5 市场 ${pct(overMarket)}，泊松 ${pct(md.over)}。`:""}<br>${hard?"盘口较难拿定主意：模型和市场没有形成明显共识。":"盘口方向相对清晰，但仍需复核临场首发和水位变化。"}`;
}

function renderAIModels(home, away, md, choices){
  const strength=(home.attack+home.midfield+home.defense+home.form+away.attack+away.midfield+away.defense+away.form)/8;
  const cards=[
    ["K3本地泊松","已启用",`${choices[0].label} ${pct(choices[0].value)}`,`预期进球 ${md.xg.h.toFixed(2)}-${md.xg.a.toFixed(2)}，大比分概率 ${pct(md.big)}。`],
    ["Qwen 千问","公开静态版","情报结构化视角",`侧重球队状态、阵容、老将经验、教练和历史交手的文字判断。`],
    ["DeepSeek","公开静态版","赔率策略视角",`侧重盘口分歧、EV、凯利、止损和偶然因素交叉检查。`]
  ];
  return cards.map((card)=>`<div class="ai-card ${card[1]==="已启用"?"":"pending"}"><h3>${card[0]}<em>${card[1]}</em></h3><strong>${card[2]}</strong><p>${card[3]}</p><p>综合强度指数 ${strength.toFixed(1)}。公开 GitHub Pages 版不暴露 API Key，云端模型需另接后端。</p></div>`).join("");
}

function renderAdvancedAnalytics(match, home, away, md, choices){
  const odds=readOdds(), samples=getSamples(), matchSamples=samples.filter(s=>s.matchId===match.id), last=matchSamples.at(-1);
  const hLine=+$("#handicapLine")?.value || 0, hHome=+$("#handicapHome")?.value || 1.9, hAway=+$("#handicapAway")?.value || 1.9;
  const handicapLean=hLine<0?`${home.zh}让 ${Math.abs(hLine)}`:hLine>0?`${away.zh}让 ${Math.abs(hLine)}`:"平手盘";
  const handicapHomeMarket=(1/hHome)/((1/hHome)+(1/hAway));
  const uncertainty = Math.max(md.h,md.d,md.a)<.45 || md.d>.29 || Math.abs(handicapHomeMarket-md.h)>.12;
  $("#handicapText").innerHTML = `${handicapLean}；盘口主队方向 ${pct(handicapHomeMarket)}，泊松主胜 ${pct(md.h)}。${uncertainty?"<br>难点：胜平负、让球或平局权重存在分歧，建议降低权重或等待水位确认。":""}`;
  const kellyItems=[[`${home.zh}胜`,md.h,odds.h],["平局",md.d,odds.d],[`${away.zh}胜`,md.a,odds.a]];
  $("#kellyGrid").innerHTML=kellyItems.map(([label,p,o])=>`<div class="kelly-cell"><span>${label}</span><b>${pct(kellyFraction(p,o))}</b><span>赔率 ${o || "-"}</span></div>`).join("");
  const twoHours = 2*60*60*1000;
  const twoHourSamples = matchSamples.filter(s=>Date.now()-s.time<=twoHours);
  const move = last ? `较上次：主 ${((odds.h-last.odds.h)||0).toFixed(2)}，平 ${((odds.d-last.odds.d)||0).toFixed(2)}，客 ${((odds.a-last.odds.a)||0).toFixed(2)}` : "暂无上一条样本";
  const threshold=+$("#moveThreshold")?.value||.08;
  const isAlert=last && Math.max(Math.abs(odds.h-last.odds.h||0),Math.abs(odds.d-last.odds.d||0),Math.abs(odds.a-last.odds.a||0))>=threshold;
  const trained=trainFromSamples();
  $("#dataStats").innerHTML=`总样本 ${samples.length} 条；本场 ${matchSamples.length} 条；近2小时 ${twoHourSamples.length} 条。${move}${trained?`<br>训练样本 ${trained.count} 条；盘口命中 ${(trained.marketRate*100).toFixed(1)}%，泊松命中 ${(trained.poissonRate*100).toFixed(1)}%。建议权重：盘口 ${trained.weights.market} / 泊松 ${trained.weights.poisson} / 阵容 ${trained.weights.team}`:""}${isAlert?`<div class="monitor-alert">赔率变化超过阈值 ${threshold.toFixed(2)}，建议复核盘口。</div>`:""}`;
  const rows=evRows(match,md), stake=+$("#evStake")?.value||100, stopLoss=+$("#evStopLoss")?.value||300;
  $("#evGrid").innerHTML=rows.map((row)=>`<div class="kelly-cell"><span>${row.label}</span><b>${row.ev>=0?"+":""}${row.ev.toFixed(1)}</b><span>胜率 ${pct(row.p)} · 凯利 ${pct(row.kelly)}</span></div>`).join("");
  const best=rows[0], allowedLoss=Math.max(1,Math.floor(stopLoss/stake)), suggestion=best.ev>0 && best.kelly>0 ? `${best.label} 为正EV观察项；建议小注试探，不超过凯利 ${(Math.min(best.kelly,.05)*100).toFixed(1)}%，连续亏损 ${allowedLoss} 次或触及 ${stopLoss} 止损必须停。` : "没有明确正EV项；建议观望，等盘口或首发信息确认。";
  $("#decisionText").innerHTML=`EV=成功概率×收益-失败概率×损失。当前最佳：${best.label}，EV ${best.ev.toFixed(1)} / 每 ${stake} 单位。${suggestion}`;
  $("#trainingText").innerHTML=`策略评分 ${(Math.max(best.ev/stake,0)*50 + choices[0].value*50).toFixed(1)}；只做正期望值，不因单场波动加码。`;
  $("#uncertaintyText").innerHTML=`平局概率 ${pct(md.d)}；大比分概率 ${pct(md.big)}；双方进球 ${pct(md.bts)}；半场平 ${pct(md.htDraw)}。偶然因素：早牌、点球、门将失误、临场伤停、天气和密集赛程会放大波动。${uncertainty?"本场属于难判断盘口，建议降低仓位或等待临场。":"当前分歧可控，但仍需监控2小时水位变化。"}`;
  $("#oddsHistory").innerHTML=matchSamples.slice(-8).reverse().map(s=>`<div class="history-row"><b>${new Date(s.time).toLocaleString()}</b><span>主 ${s.odds.h}</span><span>平 ${s.odds.d}</span><span>客 ${s.odds.a}</span></div>`).join("") || '<div class="note">暂无本场历史样本，点击“记录当前赔率”或启动2小时监控。</div>';
}

function renderMain(){
  const match=currentMatch(), home=teams[match.home], away=teams[match.away], md=model(match);
  const choices=[{label:`${home.zh}胜`,value:md.h},{label:"平局",value:md.d},{label:`${away.zh}胜`,value:md.a}].sort((x,y)=>y.value-x.value);
  $("#heroPick").textContent=`${choices[0].label} ${pct(choices[0].value)}`;
  $("#heroText").textContent=`${home.zh} vs ${away.zh}，最高概率比分 ${md.scores[0].score}。`;
  $("#meta").textContent=`${match.date} · ${match.group} · ${match.venue} · ${match.time}`;
  $("#title").textContent=`${home.zh} vs ${away.zh}`;
  $("#context").textContent=match.stakes;
  $("#pick").textContent=`${choices[0].label} ${pct(choices[0].value)}`;
  $("#xg").textContent=`${md.xg.h.toFixed(2)} - ${md.xg.a.toFixed(2)}`;
  $("#over25").textContent=pct(md.over);
  $("#pH").textContent=pct(md.h); $("#pD").textContent=pct(md.d); $("#pA").textContent=pct(md.a);
  $("#scores").innerHTML=md.scores.map((item)=>`<div class="score"><b>${item.score}</b><span>${pct(item.p)}</span></div>`).join("");
  setOdds(match); renderOddsText(md);
  $("#compare").innerHTML=`<div class="section-head"><h2>阵容、老将与教练</h2><p>结合阵型、排名差、状态、教练和20年交手口径。</p></div><div class="compare">${[home,away].map((team)=>`<div class="team"><header><div><h3>${team.zh}</h3><p>${team.formation} · 世界排名 ${team.rank} · 小组积分 ${team.groupPoints}</p></div><div class="badge">${team.code}</div></header>${statBars(team)}<ul class="bullets"><li>${team.style}</li><li>老将优势：${team.veterans}</li><li>20年战绩口径：${team.h2h20}</li>${team.stars.map((star)=>`<li>${star}</li>`).join("")}</ul></div>`).join("")}</div>`;
  $("#path").innerHTML=`<div class="section-head"><h2>晋级路径</h2><p>48队分12组，每组前二和8个最佳第三进入32强。</p></div><div class="advance"><div class="metric"><span>本场关键</span><strong>${choices[0].label}更占优</strong></div><div class="metric"><span>小组影响</span><strong>${md.d>.27?"平局概率偏高，第三名积分和净胜球权重上升。":"胜负倾向较清晰，胜者更接近小组前二。"}</strong></div><div class="metric"><span>后续对手推理</span><strong>${match.group}组前二进入固定32强路径；第三名对手取决于8个最佳第三组合，需要随积分榜更新。</strong></div><div class="metric"><span>风格风险</span><strong>${home.style} 对 ${away.style}</strong></div></div>`;
  $("#aiGrid").innerHTML=renderAIModels(home,away,md,choices);
  renderAdvancedAnalytics(match,home,away,md,choices);
  const evBest=evRows(match,md)[0];
  $("#reason").innerHTML=[["胜负",`首选 ${choices[0].label}。模型胜率 ${pct(choices[0].value)}，但若 EV 为负则不做。`],["比分",`最高概率比分 ${md.scores[0].score}，其次 ${md.scores.slice(1,3).map((item)=>item.score).join("、")}。`],["半场",`半场平 ${pct(md.htDraw)}，半场更适合保守判断。`],["最终建议",`${evBest.ev>0?`推荐观察 ${evBest.label}，EV ${evBest.ev.toFixed(1)}。`:"当前无明确正EV推荐，建议观望。"} 结论只作为分析，不构成投注承诺。`]].map((item)=>`<div class="reason-card"><h3>${item[0]}</h3><p>${item[1]}</p></div>`).join("");
}

function render(){renderDates(); renderMatchList(); renderMain(); refreshAccess();}
function isActivated(){return localStorage.getItem("k3Activated")==="1";}
function refreshAccess(){const predict=$("#predict"), btn=$("#accountBtn"); if(!predict || !btn) return; predict.classList.toggle("locked",!isActivated()); btn.textContent=isActivated()?"已登录":"手机号登录";}
function openAuth(){const dialog=$("#authDialog"); if(dialog) dialog.showModal();}

$("#dateSelect").addEventListener("change",(event)=>{state.date=event.target.value; state.id=matches.find((match)=>match.date===state.date)?.id || matches[0].id; render();});
$("#matchList").addEventListener("click",(event)=>{const button=event.target.closest(".match"); if(button){state.id=button.dataset.id; render();}});
["#oH","#oD","#oA","#oO","#oU","#oHT","#handicapLine","#handicapHome","#handicapAway","#wMarket","#wPoisson","#wTeam","#evStake","#evStopLoss","#baseRate"].forEach((selector)=>$(selector)?.addEventListener("input",()=>renderMain()));
$("#skipIntro").addEventListener("click",()=>$("#intro").classList.add("hide"));
setTimeout(()=>$("#intro").classList.add("hide"),3800);
$("#accountBtn").addEventListener("click",openAuth);
$("#openPaywall").addEventListener("click",openAuth);
$("#activateBtn").addEventListener("click",()=>{const phone=$("#phoneInput").value.trim(), hint=$("#authHint"); if(!/^1\d{10}$/.test(phone)){hint.className="auth-hint"; hint.textContent="请输入有效的 11 位手机号。"; return;} localStorage.setItem("k3Phone",phone); localStorage.setItem("k3Activated","1"); localStorage.setItem("k3ActivatedAt",new Date().toISOString()); hint.className="auth-hint ok"; hint.textContent="已登录，预测功能已开放。"; refreshAccess(); setTimeout(()=>$("#authDialog").close(),650);});
$("#generateCodeBtn")?.addEventListener("click",()=>{$("#adminCodeResult").className="auth-hint"; $("#adminCodeResult").textContent="公开静态版无需管理员授权码。";});
$("#recordOdds")?.addEventListener("click",()=>recordCurrentOdds(false));
$("#exportSamples")?.addEventListener("click",exportSamples);
$("#clearSamples")?.addEventListener("click",clearSamples);
$("#saveResult")?.addEventListener("click",saveMatchResult);
$("#toggleMonitor")?.addEventListener("click",toggleMonitor);

render();
loadSchedule();
setInterval(loadSchedule,30*60*1000);
