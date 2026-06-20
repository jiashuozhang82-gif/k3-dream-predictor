const teams = {
  Brazil:{zh:"巴西",code:"BRA",group:"C",formation:"4-3-3",style:"边路爆点多，前场压迫强，定位球防守需谨慎。",stars:["Vinicius Junior","Rodrygo","Bruno Guimaraes"],attack:94,midfield:88,defense:84,form:84,depth:90,baseXg:2.15},
  Haiti:{zh:"海地",code:"HAI",group:"C",formation:"5-4-1",style:"低位防守，依赖反击和二点球，控球推进偏弱。",stars:["Duckens Nazon","Frantzdy Pierrot","Jean-Ricner Bellegarde"],attack:64,midfield:61,defense:59,form:62,depth:55,baseXg:.78},
  Scotland:{zh:"苏格兰",code:"SCO",group:"C",formation:"3-4-2-1",style:"身体对抗强，边翼卫推进明确，中路创造力依赖核心状态。",stars:["Scott McTominay","Andrew Robertson","John McGinn"],attack:74,midfield:78,defense:76,form:73,depth:70,baseXg:1.22},
  Morocco:{zh:"摩洛哥",code:"MAR",group:"C",formation:"4-1-4-1",style:"防线纪律强，边路转换快，适合打强队身后空间。",stars:["Achraf Hakimi","Sofyan Amrabat","Youssef En-Nesyri"],attack:78,midfield:80,defense:84,form:81,depth:76,baseXg:1.34},
  Turkiye:{zh:"土耳其",code:"TUR",group:"D",formation:"4-2-3-1",style:"前腰和边锋创造力强，节奏高，防守转换有波动。",stars:["Hakan Calhanoglu","Arda Guler","Kenan Yildiz"],attack:81,midfield:82,defense:73,form:78,depth:75,baseXg:1.48},
  Paraguay:{zh:"巴拉圭",code:"PAR",group:"D",formation:"4-4-2",style:"防守韧性和空中对抗好，进攻依赖定位球和二次进攻。",stars:["Miguel Almiron","Julio Enciso","Gustavo Gomez"],attack:73,midfield:72,defense:78,form:74,depth:70,baseXg:1.12},
  USA:{zh:"美国",code:"USA",group:"D",formation:"4-3-3",style:"跑动覆盖大，边路速度明显，主场环境提升压迫强度。",stars:["Christian Pulisic","Weston McKennie","Tyler Adams"],attack:80,midfield:79,defense:77,form:80,depth:78,baseXg:1.52},
  Australia:{zh:"澳大利亚",code:"AUS",group:"D",formation:"4-4-1-1",style:"防守组织稳定，身体对抗强，阵地战破密集效率一般。",stars:["Jackson Irvine","Harry Souttar","Mathew Ryan"],attack:69,midfield:71,defense:75,form:72,depth:68,baseXg:1.03},
  Germany:{zh:"德国",code:"GER",group:"E",formation:"4-2-3-1",style:"中前场技术密度高，阵地战强，防线身后空间需控制。",stars:["Jamal Musiala","Florian Wirtz","Joshua Kimmich"],attack:88,midfield:90,defense:80,form:83,depth:86,baseXg:1.82},
  CIV:{zh:"科特迪瓦",code:"CIV",group:"E",formation:"4-3-3",style:"个人冲击力强，转换速度快，防线协同影响上限。",stars:["Sebastien Haller","Franck Kessie","Simon Adingra"],attack:77,midfield:76,defense:72,form:79,depth:73,baseXg:1.28},
  Netherlands:{zh:"荷兰",code:"NED",group:"F",formation:"3-4-2-1",style:"三中卫出球稳定，定位球强，前场终结效率决定上限。",stars:["Virgil van Dijk","Frenkie de Jong","Xavi Simons"],attack:84,midfield:84,defense:87,form:82,depth:82,baseXg:1.62},
  Sweden:{zh:"瑞典",code:"SWE",group:"F",formation:"4-4-2",style:"前锋支点明确，长传和边路传中直接，防线移动速度是风险点。",stars:["Alexander Isak","Dejan Kulusevski","Viktor Gyokeres"],attack:82,midfield:76,defense:74,form:77,depth:74,baseXg:1.42}
};

const matches = [
  {id:"bra-hai",date:"2026-06-19",time:"待确认",group:"C",venue:"Philadelphia Stadium",home:"Brazil",away:"Haiti",stakes:"巴西争取提前锁定出线主动权；海地需要控制净胜球，第三名排名也会受影响。",odds:{h:1.12,d:6.8,a:18,o:1.58,u:2.15,ht:2.75}},
  {id:"sco-mar",date:"2026-06-19",time:"待确认",group:"C",venue:"Boston Stadium",home:"Scotland",away:"Morocco",stakes:"C组第二名关键战，胜者大概率占据直接晋级位置，败者可能被迫计算第三名积分。",odds:{h:3.05,d:3.05,a:2.25,o:2.08,u:1.62,ht:1.95}},
  {id:"tur-par",date:"2026-06-19",time:"待确认",group:"D",venue:"San Francisco Bay Area Stadium",home:"Turkiye",away:"Paraguay",stakes:"D组中游对冲战，平局会让最后一轮压力上升，胜者接近前二。",odds:{h:2.18,d:3.1,a:3.15,o:1.92,u:1.76,ht:2.02}},
  {id:"usa-aus",date:"2026-06-19",time:"待确认",group:"D",venue:"Seattle Stadium",home:"USA",away:"Australia",stakes:"美国主场优势明显，若取胜将大幅提升小组前二概率；澳大利亚需要降低比赛回合数。",odds:{h:1.82,d:3.35,a:4.05,o:1.88,u:1.82,ht:2.08}},
  {id:"ger-civ",date:"2026-06-20",time:"待确认",group:"E",venue:"Toronto Stadium",home:"Germany",away:"CIV",stakes:"德国控球优势明显，但科特迪瓦转换速度会测试德国防线身后保护。",odds:{h:1.62,d:3.65,a:5.1,o:1.72,u:1.98,ht:2.22}},
  {id:"ned-swe",date:"2026-06-20",time:"待确认",group:"F",venue:"Houston Stadium",home:"Netherlands",away:"Sweden",stakes:"荷兰控场与瑞典双前锋冲击的对比明显，定位球可能改变胜负概率。",odds:{h:1.88,d:3.25,a:3.85,o:1.95,u:1.75,ht:2.05}}
];

let state = {date: matches[0].date, id: matches[0].id};
const $ = (selector) => document.querySelector(selector);
const pct = (value) => `${(value * 100).toFixed(1)}%`;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function factorial(n){let result = 1; for(let i = 2; i <= n; i += 1) result *= i; return result;}
function poisson(lambda, goals){return Math.exp(-lambda) * Math.pow(lambda, goals) / factorial(goals);}
function currentMatch(){return matches.find((match) => match.id === state.id) || matches[0];}
function expectedGoals(match){const h = teams[match.home], a = teams[match.away]; const edge = match.home === "USA" ? .18 : .08; return {h: clamp(h.baseXg + (h.attack - a.defense) / 52 + (h.form - a.form) / 95 + edge, .25, 3.6), a: clamp(a.baseXg + (a.attack - h.defense) / 55 + (a.form - h.form) / 100, .2, 3.2)};}
function model(match){const xg = expectedGoals(match); const scores = []; let h = 0, d = 0, a = 0, over = 0, bts = 0; for(let home = 0; home <= 6; home += 1){for(let away = 0; away <= 6; away += 1){const p = poisson(xg.h, home) * poisson(xg.a, away); scores.push({score:`${home}-${away}`, p}); if(home > away) h += p; else if(home === away) d += p; else a += p; if(home + away > 2.5) over += p; if(home && away) bts += p;}} const covered = scores.reduce((sum, item) => sum + item.p, 0); return {xg, h:h/covered, d:d/covered, a:a/covered, over:over/covered, bts:bts/covered, scores:scores.sort((x,y)=>y.p-x.p).slice(0,5)};}
function readOdds(){return {h:+$("#oH").value,d:+$("#oD").value,a:+$("#oA").value,o:+$("#oO").value,u:+$("#oU").value,ht:+$("#oHT").value};}
function implied(odds){const raw = {h:1/odds.h,d:1/odds.d,a:1/odds.a}; const total = raw.h + raw.d + raw.a; return {h:raw.h/total,d:raw.d/total,a:raw.a/total,margin:total-1};}

function renderDates(){const dates = [...new Set(matches.map((match)=>match.date))]; $("#dateSelect").innerHTML = dates.map((date)=>`<option value="${date}">${date}</option>`).join(""); $("#dateSelect").value = state.date;}
function renderMatchList(){const list = matches.filter((match)=>match.date === state.date); if(!list.some((match)=>match.id === state.id)) state.id = list[0].id; $("#matchList").innerHTML = list.map((match)=>`<button class="match ${match.id===state.id?"active":""}" data-id="${match.id}"><strong>${teams[match.home].zh} vs ${teams[match.away].zh}</strong><span>${match.group}组 · ${match.venue}</span><span>${match.stakes}</span></button>`).join("");}
function setOdds(match){$("#oH").value=match.odds.h;$("#oD").value=match.odds.d;$("#oA").value=match.odds.a;$("#oO").value=match.odds.o;$("#oU").value=match.odds.u;$("#oHT").value=match.odds.ht;}
function renderOddsText(md){const odds = readOdds(); if([odds.h, odds.d, odds.a].some((value)=>!value || value <= 1)){ $("#oddsText").textContent = "请输入有效赔率。"; return;} const market = implied(odds); const gap = [["主胜", md.h-market.h],["平局", md.d-market.d],["客胜", md.a-market.a]].sort((x,y)=>y[1]-x[1]); const overMarket = odds.o && odds.u ? (1/odds.o)/(1/odds.o+1/odds.u) : 0; $("#oddsText").innerHTML = `赔率隐含：主胜 ${pct(market.h)}、平局 ${pct(market.d)}、客胜 ${pct(market.a)}；水位约 ${(market.margin*100).toFixed(1)}%。<br>模型差最大：${gap[0][0]} ${gap[0][1]>=0?"+":""}${(gap[0][1]*100).toFixed(1)} 个百分点。${overMarket ? `<br>大2.5 隐含 ${pct(overMarket)}，泊松模型 ${pct(md.over)}。` : ""}`;}
function statBars(team){const labels = {attack:"进攻", midfield:"中场", defense:"防守", form:"状态", depth:"深度"}; return Object.keys(labels).map((key)=>`<div class="bar"><span>${labels[key]}</span><span class="track"><span class="fill" style="width:${team[key]}%"></span></span><span>${team[key]}</span></div>`).join("");}
function renderAIModels(home, away, md, choices){const strength = (home.attack+home.midfield+home.defense+home.form+away.attack+away.midfield+away.defense+away.form)/8; const caution = md.d > .27 ? "平局权重偏高，建议复核半场和小球赔率。" : "胜负方向较清晰，重点复核临场首发。"; const cards = [["K3本地泊松","已启用",`${choices[0].label} ${pct(choices[0].value)}`,`基于预期进球 ${md.xg.h.toFixed(2)}-${md.xg.a.toFixed(2)}、比分矩阵和赔率差值生成。`],["Qwen 千问","待接入","需要后端API","适合做中文赛事情报、伤停摘要、球队新闻结构化。当前页面未连接真实千问接口。"],["Gemini","待接入","需要后端API","适合做长上下文赛程路径、阵容变化和多来源信息交叉检查。当前页面未连接真实 Gemini 接口。"]]; return cards.map((card)=>`<div class="ai-card ${card[1]==="待接入"?"pending":""}"><h3>${card[0]}<em>${card[1]}</em></h3><strong>${card[2]}</strong><p>${card[3]}</p><p>${caution} 综合强度指数 ${strength.toFixed(1)}。</p></div>`).join("");}

function kellyFraction(probability, decimalOdds){const b=decimalOdds-1; if(!b || b<=0) return 0; return Math.max(0,(b*probability-(1-probability))/b);}
function getSamples(){try{return JSON.parse(localStorage.getItem("k3OddsSamples")||"[]");}catch{return [];}}
function setSamples(samples){localStorage.setItem("k3OddsSamples",JSON.stringify(samples.slice(-300)));}
function readWeights(){return {market:+$("#wMarket")?.value||35, poisson:+$("#wPoisson")?.value||35, team:+$("#wTeam")?.value||30};}
function renderAdvancedAnalytics(match, home, away, md, choices){
  const odds = readOdds();
  const hLine = +$("#handicapLine")?.value || 0;
  const hHome = +$("#handicapHome")?.value || 1.9;
  const hAway = +$("#handicapAway")?.value || 1.9;
  const fav = choices[0];
  const handicapLean = hLine < 0 ? `${home.zh}让 ${Math.abs(hLine)}` : hLine > 0 ? `${away.zh}让 ${Math.abs(hLine)}` : "平手盘";
  const handicapImpliedHome = (1/hHome)/((1/hHome)+(1/hAway));
  $("#handicapText").innerHTML = `${handicapLean}；盘口隐含主队方向 ${pct(handicapImpliedHome)}，泊松主胜 ${pct(md.h)}。`;
  const kellyItems = [[`${home.zh}胜`,md.h,odds.h],["平局",md.d,odds.d],[`${away.zh}胜`,md.a,odds.a]];
  $("#kellyGrid").innerHTML = kellyItems.map(([label,p,o])=>`<div class="kelly-cell"><span>${label}</span><b>${pct(kellyFraction(p,o))}</b><span>赔率 ${o || "-"}</span></div>`).join("");
  const samples = getSamples();
  const matchSamples = samples.filter(s=>s.matchId===match.id);
  const last = matchSamples.at(-1);
  const move = last ? `较上次：主胜 ${((odds.h-last.odds.h)||0).toFixed(2)}，平局 ${((odds.d-last.odds.d)||0).toFixed(2)}，客胜 ${((odds.a-last.odds.a)||0).toFixed(2)}` : "暂无上一条样本";
  $("#dataStats").innerHTML = `总样本 ${samples.length} 条；本场 ${matchSamples.length} 条。${move}`;
  const weights = readWeights();
  const total = weights.market + weights.poisson + weights.team;
  const selectedOdd = fav.label === `${home.zh}胜` ? odds.h : fav.label === "平局" ? odds.d : odds.a;
  const marketSignal = 1 / Math.max(1.01, selectedOdd || 2);
  const poissonSignal = fav.value;
  const teamSignal = (home.attack+home.midfield+home.defense+away.attack+away.midfield+away.defense)/600;
  const score = ((weights.market*marketSignal)+(weights.poisson*poissonSignal)+(weights.team*teamSignal))/total;
  $("#trainingText").innerHTML = `策略评分 ${(score*100).toFixed(1)}；当前建议：${score>.48?"可进入重点观察池":"等待赔率或阵容确认"}。持续记录样本后，可用于回测权重。`;
  $("#oddsHistory").innerHTML = matchSamples.slice(-6).reverse().map(s=>`<div class="history-row"><b>${new Date(s.time).toLocaleTimeString()}</b><span>主 ${s.odds.h}</span><span>平 ${s.odds.d}</span><span>客 ${s.odds.a}</span></div>`).join("") || '<div class="note">暂无本场历史样本，点击“记录当前赔率”开始收集。</div>';
}
function recordCurrentOdds(){const match=currentMatch(); const samples=getSamples(); samples.push({time:Date.now(),matchId:match.id,odds:readOdds(),handicap:{line:+$("#handicapLine").value,home:+$("#handicapHome").value,away:+$("#handicapAway").value}}); setSamples(samples); renderMain();}
function exportSamples(){const blob=new Blob([JSON.stringify(getSamples(),null,2)],{type:"application/json"}); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download="k3-odds-samples.json"; a.click(); URL.revokeObjectURL(url);}
function clearSamples(){setSamples([]); renderMain();}
function renderMain(){const match = currentMatch(); const home = teams[match.home], away = teams[match.away], md = model(match); const choices = [{label:`${home.zh}胜`,value:md.h},{label:"平局",value:md.d},{label:`${away.zh}胜`,value:md.a}].sort((x,y)=>y.value-x.value); $("#heroPick").textContent = `${choices[0].label} ${pct(choices[0].value)}`; $("#heroText").textContent = `${home.zh} vs ${away.zh}，最高概率比分 ${md.scores[0].score}。`; $("#meta").textContent = `${match.date} · ${match.group}组 · ${match.venue} · ${match.time}`; $("#title").textContent = `${home.zh} vs ${away.zh}`; $("#context").textContent = match.stakes; $("#pick").textContent = `${choices[0].label} ${pct(choices[0].value)}`; $("#xg").textContent = `${md.xg.h.toFixed(2)} - ${md.xg.a.toFixed(2)}`; $("#over25").textContent = pct(md.over); $("#pH").textContent = pct(md.h); $("#pD").textContent = pct(md.d); $("#pA").textContent = pct(md.a); $("#scores").innerHTML = md.scores.map((item)=>`<div class="score"><b>${item.score}</b><span>${pct(item.p)}</span></div>`).join(""); setOdds(match); renderOddsText(md); $("#compare").innerHTML = `<div class="section-head"><h2>阵容与风格</h2><p>阵型和核心球员为赛前分析口径，正式首发需赛前确认。</p></div><div class="compare">${[home,away].map((team)=>`<div class="team"><header><div><h3>${team.zh}</h3><p>${team.formation} · ${team.style}</p></div><div class="badge">${team.code}</div></header>${statBars(team)}<ul class="bullets">${team.stars.map((star)=>`<li>${star}</li>`).join("")}</ul></div>`).join("")}</div>`; $("#path").innerHTML = `<div class="section-head"><h2>晋级路径</h2><p>48队分12组，每组前二和8个最佳第三进入32强。</p></div><div class="advance"><div class="metric"><span>本场关键</span><strong>${choices[0].label}更占优</strong></div><div class="metric"><span>小组影响</span><strong>${md.d>.27?"平局概率偏高，第三名积分和净胜球权重上升。":"胜负倾向较清晰，胜者更接近小组前二。"}</strong></div><div class="metric"><span>32强推理</span><strong>${match.group}组前二进入固定32强路径；第三名对手取决于8个最佳第三组合。</strong></div><div class="metric"><span>赛程风险</span><strong>短间隔比赛下，阵容深度和轮换能力会提高权重。</strong></div></div>`; $("#aiGrid").innerHTML = renderAIModels(home, away, md, choices); renderAdvancedAnalytics(match, home, away, md, choices); $("#reason").innerHTML = [["胜负",`首选 ${choices[0].label}。预期进球 ${home.zh} ${md.xg.h.toFixed(2)}，${away.zh} ${md.xg.a.toFixed(2)}。`],["比分",`最高概率比分 ${md.scores[0].score}，其次 ${md.scores.slice(1,3).map((item)=>item.score).join("、")}。`],["半场",`半场进球按全场约45%估算，半场平局通常高于全场平局，需单独校验半场赔率。`],["梦想单",`大2.5概率 ${pct(md.over)}，双方进球概率 ${pct(md.bts)}；赔率差异较大时优先复查实时盘口。`]].map((item)=>`<div class="reason-card"><h3>${item[0]}</h3><p>${item[1]}</p></div>`).join("");}
function render(){renderDates(); renderMatchList(); renderMain(); refreshAccess();}

function isActivated(){return localStorage.getItem("k3Activated") === "1";}
function refreshAccess(){const predict = $("#predict"); const btn = $("#accountBtn"); if(!predict || !btn) return; predict.classList.toggle("locked", !isActivated()); btn.textContent = isActivated() ? "已开通" : "登录/充值";}
function openAuth(){const dialog = $("#authDialog"); if(dialog) dialog.showModal();}

$("#dateSelect").addEventListener("change", (event)=>{state.date = event.target.value; state.id = matches.find((match)=>match.date === state.date).id; render();});
$("#matchList").addEventListener("click", (event)=>{const button = event.target.closest(".match"); if(button){state.id = button.dataset.id; render();}});
["#oH","#oD","#oA","#oO","#oU","#oHT","#handicapLine","#handicapHome","#handicapAway","#wMarket","#wPoisson","#wTeam"].forEach((selector)=>$(selector)?.addEventListener("input",()=>renderMain()));
$("#skipIntro").addEventListener("click",()=>$("#intro").classList.add("hide"));
setTimeout(()=>$("#intro").classList.add("hide"),3800);
$("#accountBtn").addEventListener("click", openAuth);
$("#openPaywall").addEventListener("click", openAuth);
$("#activateBtn").addEventListener("click", ()=>{const phone = $("#phoneInput").value.trim(); const code = $("#unlockCode").value.trim(); const hint = $("#authHint"); if(!/^1\d{10}$/.test(phone)){hint.className = "auth-hint"; hint.textContent = "请输入有效的 11 位手机号。"; return;} if(code !== "K3-2026"){hint.className = "auth-hint"; hint.textContent = "测试版请输入授权码 K3-2026。正式版需接入支付宝回调后自动开通。"; return;} localStorage.setItem("k3Phone", phone); localStorage.setItem("k3Activated", "1"); hint.className = "auth-hint ok"; hint.textContent = "已开通当前浏览器的预测功能。"; refreshAccess(); setTimeout(()=>$("#authDialog").close(),650);});

render();
$("#recordOdds")?.addEventListener("click",recordCurrentOdds);
$("#exportSamples")?.addEventListener("click",exportSamples);
$("#clearSamples")?.addEventListener("click",clearSamples);