"use client";

import { useMemo, useState } from "react";

type NavKey = "overview" | "revenue" | "valuegraph" | "optimizer" | "advisor" | "governance";

const metrics = [
  ["Revenue influenced", "$128.4M", "Mapped to attributable activities"],
  ["Margin influenced", "$31.6M", "Across won contracts"],
  ["Revenue at risk", "$12.8M", "Low-confidence pipeline"],
  ["Average RIS", "74/100", "Demo RIS v0.1"],
  ["Attribution confidence", "86%", "Rolling AEM ±7.8%"]
];

const opportunities = [
  ["ASEAN Banking Cloud Transformation", "Meridian Bank", "$12.5M", "68%", "24%", "82", "88%", "Medium"],
  ["AI Service Operations Modernisation", "Northstar Telecom", "$8.2M", "74%", "29%", "86", "91%", "Low"],
  ["Regional AML Data Remediation", "Union Pacific Finance", "$6.8M", "49%", "21%", "63", "77%", "High"],
  ["ERP Transformation Programme", "Arcadia Manufacturing", "$9.4M", "61%", "26%", "72", "81%", "Medium"]
];

const contributions = [["Presales",31],["Delivery",24],["Marketing",17],["Relationship",14],["Talent",9],["Other",5]];

function Header({ title }: { title: string }) {
  return <header className="topbar"><div><p className="eyebrow">ENTERPRISE VALUE INTELLIGENCE</p><h1>{title}</h1></div><div className="topActions"><span className="pill">● Synthetic demo</span><button>NovaTech Consulting ▾</button></div></header>;
}

function OpportunityTable() {
  return <div className="tableWrap"><table><thead><tr><th>Opportunity</th><th>Value</th><th>Win</th><th>Margin</th><th>RIS</th><th>Confidence</th><th>Risk</th></tr></thead><tbody>{opportunities.map((o)=><tr key={o[0]}><td><b>{o[0]}</b><small>{o[1]}</small></td><td>{o[2]}</td><td>{o[3]}</td><td>{o[4]}</td><td><span className="score">{o[5]}</span></td><td>{o[6]}</td><td><span className={`risk ${String(o[7]).toLowerCase()}`}>{o[7]}</span></td></tr>)}</tbody></table></div>;
}

function Overview() {
  return <><Header title="Executive Overview"/><section className="metricGrid">{metrics.map((m,i)=><article className={`metric ${i===0?"emphasis":""}`} key={m[0]}><span>{m[0]}</span><strong>{m[1]}</strong><small>{m[2]}</small></article>)}</section><section className="twoCol"><article className="panel"><p className="eyebrow">ATTRIBUTION</p><h2>Revenue contribution by function</h2>{contributions.map(([n,p])=><div className="bar" key={n}><div><span>{n}</span><b>{p}%</b></div><i><u style={{width:`${Number(p)*2.7}%`}}/></i></div>)}</article><article className="panel insight"><span className="ai">✦</span><p className="eyebrow">AI INSIGHT</p><h2>Security + domain SMEs appear to improve enterprise banking conversion.</h2><p>Historical synthetic opportunities with both capabilities involved before solution validation show stronger win probability and lower commercial rework.</p><div className="evidence"><div><small>Observed lift</small><b>+7.3%</b></div><div><small>Confidence</small><b>83%</b></div><div><small>Comparable deals</small><b>148</b></div></div><button className="primary">Explore evidence →</button></article></section><article className="panel"><p className="eyebrow">PIPELINE</p><h2>Priority opportunities</h2><OpportunityTable/></article></>;
}

function Revenue() { return <><Header title="Revenue Intelligence"/><article className="panel"><p className="eyebrow">OPPORTUNITY INTELLIGENCE</p><h2>Move from activity volume to measurable business influence.</h2><p className="muted">RIS, confidence and margin indicators are shown together so attribution is never represented as certainty.</p><OpportunityTable/></article></>; }

function Graph() {
  const nodes = [["Campaign",8,32],["Qualified Lead",27,32],["Presales",45,17],["Domain SME",45,48],["Proposal",64,32],["Won Contract",82,32],["Delivery",82,62],["Margin",94,62]];
  return <><Header title="ValueGraph"/><article className="panel graph"><p className="eyebrow">CONNECTED VALUE MODEL</p><h2>Trace the path from action to economic outcome.</h2><div className="canvas"><svg viewBox="0 0 1000 500" preserveAspectRatio="none"><polyline points="80,160 270,160 450,85 640,160 820,160 820,310 940,310"/><polyline points="270,160 450,240 640,160"/></svg>{nodes.map((n,i)=><div className={`node ${i===5||i===7?"outcome":""}`} style={{left:`${n[1]}%`,top:`${n[2]}%`}} key={n[0]}><span>{i===5||i===7?"◆":"◉"}</span><b>{n[0]}</b></div>)}</div><p className="muted">Graph edges represent observed relationships. They are not automatic proof of causality.</p></article></>;
}

function Optimizer() {
  const [sme,setSme]=useState(70); const [presales,setPresales]=useState(65); const [confidence,setConfidence]=useState(82);
  const result=useMemo(()=>({win:Math.min(92,Math.round(51+sme*.055+presales*.04)),margin:Math.min(42,Number((25.1+sme*.018+presales*.024).toFixed(1)))}),[sme,presales]);
  return <><Header title="Resource Optimizer"/><section className="twoCol"><article className="panel"><p className="eyebrow">SCENARIO INPUT</p><h2>Banking transformation opportunity</h2><div className="facts"><span>Deal value</span><b>$8.0M</b><span>Current win probability</span><b>51%</b><span>Current margin</span><b>25.1%</b></div>{[["Domain / security SME coverage",sme,setSme],["Presales capability coverage",presales,setPresales],["Evidence confidence",confidence,setConfidence]].map(([l,v,s])=><label className="range" key={String(l)}><span>{String(l)}</span><b>{String(v)}%</b><input type="range" min="40" max="100" value={Number(v)} onChange={e=>(s as (n:number)=>void)(Number(e.target.value))}/></label>)}</article><article className="panel projection"><span className="ai">◎</span><p className="eyebrow">PROJECTED CONFIGURATION</p><div className="big"><span>Win probability</span><strong>{result.win}%</strong><small>from 51%</small></div><div className="big"><span>Expected margin</span><strong>{result.margin}%</strong><small>from 25.1%</small></div><div className="recommend"><b>Recommended team pattern</b><p>Relationship lead · Banking SME · Cloud architect · Security SME · Pricing lead</p></div><p className="muted">Decision-support estimate only. Evidence confidence: {confidence}%.</p></article></section></>;
}

function Advisor() { const prompts=["Why did margins decline?","Where should I invest another $500k?","Which deals are most at risk?"]; const [q,setQ]=useState(prompts[0]); const answers:Record<string,string>={"Why did margins decline?":"The strongest synthetic signal is late commercial/pricing involvement in three high-value programmes, followed by higher-than-baseline specialist subcontractor cost. Validate both against finance actuals before acting.","Where should I invest another $500k?":"The current demo evidence favours earlier domain/security SME coverage on large regulated-industry bids. Use a staged experiment/control design before full rollout.","Which deals are most at risk?":"Regional AML Data Remediation is highest risk in this sample: 49% win probability, RIS 63 and 77% confidence. Strengthen domain expertise before proposal lock."}; return <><Header title="AI Advisor"/><section className="twoCol"><article className="panel"><p className="eyebrow">ASK VALUEGRAPH</p><h2>Executive questions grounded in attributed evidence.</h2>{prompts.map(p=><button className={`prompt ${q===p?"active":""}`} onClick={()=>setQ(p)} key={p}>{p}<span>→</span></button>)}</article><article className="panel insight"><span className="ai">✦</span><p className="eyebrow">DEMO REASONING LAYER</p><h2>{q}</h2><p>{answers[q]}</p><div className="evidence"><div><small>Evidence</small><b>Indicative</b></div><div><small>Data</small><b>Synthetic</b></div><div><small>Approval</small><b>Human</b></div></div></article></section></>; }

function Governance() { return <><Header title="AI Governance"/><section className="metricGrid gov"><article className="metric emphasis"><span>Algorithmic Error Margin</span><strong>±7.8%</strong><small>Below demo threshold</small></article><article className="metric"><span>Attribution confidence</span><strong>86%</strong><small>Weighted portfolio</small></article><article className="metric"><span>Model version</span><strong>RIS v0.1</strong><small>Transparent heuristic</small></article><article className="metric"><span>Human overrides</span><strong>12</strong><small>Retained in audit trail</small></article></section><section className="twoCol"><article className="panel"><p className="eyebrow">GUARDRAILS</p><h2>Automated governance controls</h2><div className="guard good"><b>Confidence ceiling</b><span>High-confidence patterns may be promoted for human review and reuse.</span></div><div className="guard warn"><b>AEM intervention</b><span>If model error exceeds the approved threshold, prescriptive recommendations are suspended for audit.</span></div><div className="guard"><b>Decision authority</b><span>ValueGraph advises; accountable business leaders retain final authority.</span></div></article><article className="panel"><p className="eyebrow">MODEL CARD</p><h2>RIS v0.1 — demonstration only</h2><div className="facts"><span>Intended use</span><b>Commercial attribution exploration</b><span>Not permitted</span><b>Automated employment / compensation decisions</b><span>Training data</span><b>Synthetic only</b><span>Validation status</span><b>Not customer-calibrated</b></div></article></section></>; }

export default function Page(){ const [active,setActive]=useState<NavKey>("overview"); const nav:[NavKey,string,string][]=[["overview","Executive Overview","◈"],["revenue","Revenue Intelligence","↗"],["valuegraph","ValueGraph","⌘"],["optimizer","Resource Optimizer","◎"],["advisor","AI Advisor","✦"],["governance","AI Governance","◇"]]; return <main className="shell"><aside><div className="brand"><i>V</i><div><b>OMNeXa</b><span>ValueGraph</span></div></div><p className="asideLabel">INTELLIGENCE</p><nav>{nav.map(([k,l,ic])=><button className={active===k?"active":""} key={k} onClick={()=>setActive(k)}><span>{ic}</span>{l}</button>)}</nav><div className="demo"><small>DEMO ENVIRONMENT</small><b>NovaTech Consulting</b><span>5,000 employees · $850M revenue</span></div></aside><section className="content">{active==="overview"&&<Overview/>}{active==="revenue"&&<Revenue/>}{active==="valuegraph"&&<Graph/>}{active==="optimizer"&&<Optimizer/>}{active==="advisor"&&<Advisor/>}{active==="governance"&&<Governance/>}</section></main>; }
