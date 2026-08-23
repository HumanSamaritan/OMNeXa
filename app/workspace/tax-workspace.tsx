"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Props = { userName: string; signOutPath: string };
type Step = "profile" | "income" | "deductions" | "taxes" | "review";
type Profile = { resident: string; age: string; business: boolean; foreignAssets: boolean; director: boolean; unlistedShares: boolean; capitalGains: boolean };
type Taxpayer = { fullName: string; pan: string; dob: string; email: string };

const officialPortal = "https://www.incometax.gov.in/iec/foportal/";
const officialOfflineHelp = "https://www.incometax.gov.in/iec/foportal/help/offline-utility";
const rupees = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const clean = (value: string) => Math.max(0, Number(value.replace(/,/g, "")) || 0);
const xmlEscape = (value: string) => value.replace(/[<>&'\"]/g, character => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", "\"": "&quot;" })[character] ?? character);

function slabTax(income: number, regime: "new" | "old", age: string, resident: boolean) {
  const oldSlabs = age === "80plus" && resident
    ? [[500000, 0], [1000000, .20], [Infinity, .30]]
    : age === "60to79" && resident
      ? [[300000, 0], [500000, .05], [1000000, .20], [Infinity, .30]]
      : [[250000, 0], [500000, .05], [1000000, .20], [Infinity, .30]];
  const slabs = regime === "new"
    ? [[400000, 0], [800000, .05], [1200000, .10], [1600000, .15], [2000000, .20], [2400000, .25], [Infinity, .30]]
    : oldSlabs;
  let tax = 0;
  let lower = 0;
  for (const [upper, rate] of slabs) {
    tax += Math.max(0, Math.min(income, upper) - lower) * rate;
    lower = upper;
    if (income <= upper) break;
  }
  if (resident && regime === "new") {
    if (income <= 1200000) tax = 0;
    else tax = Math.min(tax, income - 1200000);
  }
  if (resident && regime === "old" && income <= 500000) tax = Math.max(0, tax - Math.min(12500, tax));
  return Math.round(tax * 1.04);
}

function downloadText(contents: string, filename: string, mime = "text/plain") {
  const blob = new Blob([contents], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function TaxWorkspace({ userName, signOutPath }: Props) {
  const [step, setStep] = useState<Step>("profile");
  const [taxpayer, setTaxpayer] = useState<Taxpayer>({ fullName: userName.includes("@") ? "" : userName, pan: "", dob: "", email: userName.includes("@") ? userName : "" });
  const [profile, setProfile] = useState<Profile>({ resident: "resident", age: "under60", business: false, foreignAssets: false, director: false, unlistedShares: false, capitalGains: false });
  const [salary, setSalary] = useState("0");
  const [interest, setInterest] = useState("0");
  const [houseIncome, setHouseIncome] = useState("0");
  const [deductions, setDeductions] = useState("0");
  const [tds, setTds] = useState("0");
  const [regime, setRegime] = useState<"new" | "old">("new");
  const [confirmed, setConfirmed] = useState(false);
  const [showPack, setShowPack] = useState(false);
  const [notice, setNotice] = useState("");

  const grossInput = clean(salary) + clean(interest) + clean(houseIncome);
  const form = profile.business ? "ITR-3 / ITR-4" : grossInput > 5000000 || profile.foreignAssets || profile.director || profile.unlistedShares || profile.capitalGains || profile.resident !== "resident" ? "ITR-2" : "ITR-1";
  const eligible = form === "ITR-1";
  const isResident = profile.resident === "resident";
  const calculations = useMemo(() => {
    const gross = grossInput;
    const newStandard = Math.min(clean(salary), 75000);
    const oldStandard = Math.min(clean(salary), 50000);
    const newTaxable = Math.max(0, gross - newStandard);
    const oldTaxable = Math.max(0, gross - oldStandard - clean(deductions));
    const newer = { taxable: newTaxable, standard: newStandard, chapterVI: 0, tax: slabTax(newTaxable, "new", profile.age, isResident) };
    const older = { taxable: oldTaxable, standard: oldStandard, chapterVI: clean(deductions), tax: slabTax(oldTaxable, "old", profile.age, isResident) };
    return { gross, new: newer, old: older };
  }, [grossInput, salary, deductions, profile.age, isResident]);
  const result = calculations[regime];
  const balance = result.tax - clean(tds);
  const panValid = /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(taxpayer.pan);
  const packReady = eligible && panValid && Boolean(taxpayer.fullName.trim()) && Boolean(taxpayer.dob) && confirmed;

  const steps: { id: Step; label: string; caption: string }[] = [
    { id: "profile", label: "Return type", caption: form },
    { id: "income", label: "Income", caption: rupees.format(calculations.gross) },
    { id: "deductions", label: "Deductions", caption: regime === "old" ? rupees.format(result.chapterVI) : "Regime limited" },
    { id: "taxes", label: "Tax paid", caption: rupees.format(clean(tds)) },
    { id: "review", label: "Review", caption: packReady ? "Ready" : "Checks pending" },
  ];

  function buildInternalXml() {
    return `<?xml version="1.0" encoding="UTF-8"?>\n<SwayamITRReturn version="1.0" assessmentYear="2026-27" governmentUpload="false">\n  <Taxpayer>\n    <FullName>${xmlEscape(taxpayer.fullName)}</FullName>\n    <PAN>${xmlEscape(taxpayer.pan)}</PAN>\n    <DateOfBirth>${xmlEscape(taxpayer.dob)}</DateOfBirth>\n    <Email>${xmlEscape(taxpayer.email)}</Email>\n    <ResidentialStatus>${xmlEscape(profile.resident)}</ResidentialStatus>\n    <AgeBand>${xmlEscape(profile.age)}</AgeBand>\n  </Taxpayer>\n  <Eligibility recommendedForm="${xmlEscape(form)}">\n    <BusinessIncome>${profile.business}</BusinessIncome>\n    <CapitalGainsBeyondITR1>${profile.capitalGains}</CapitalGainsBeyondITR1>\n    <ForeignAssetsOrIncome>${profile.foreignAssets}</ForeignAssetsOrIncome>\n    <CompanyDirector>${profile.director}</CompanyDirector>\n    <UnlistedShares>${profile.unlistedShares}</UnlistedShares>\n  </Eligibility>\n  <Income>\n    <Salary>${clean(salary)}</Salary>\n    <InterestAndOther>${clean(interest)}</InterestAndOther>\n    <HouseProperty>${clean(houseIncome)}</HouseProperty>\n    <GrossTotal>${calculations.gross}</GrossTotal>\n  </Income>\n  <Deductions chapterVIA="${clean(deductions)}" />\n  <Tax regime="${regime}" taxableIncome="${result.taxable}" computedTaxIncludingCess="${result.tax}" taxCredits="${clean(tds)}" balance="${balance}" />\n  <Declaration sourceDocumentsChecked="${confirmed}" />\n  <Notice>This is a private SwayamITR working file, not an Income Tax Department upload file.</Notice>\n</SwayamITRReturn>\n`;
  }

  function exportXml() {
    downloadText(buildInternalXml(), "swayamitr-draft-AY2026-27.xml", "application/xml");
    setNotice("Private XML downloaded. It contains sensitive data—store it securely.");
  }

  async function importXml(file: File | undefined) {
    if (!file) return;
    try {
      const source = await file.text();
      if (/<!DOCTYPE/i.test(source)) throw new Error("Document types are not accepted");
      const documentXml = new DOMParser().parseFromString(source, "application/xml");
      if (documentXml.querySelector("parsererror") || documentXml.documentElement.tagName !== "SwayamITRReturn" || documentXml.documentElement.getAttribute("assessmentYear") !== "2026-27") throw new Error("Not a compatible AY 2026–27 SwayamITR XML file");
      const text = (selector: string) => documentXml.querySelector(selector)?.textContent?.trim() ?? "";
      const bool = (selector: string) => text(selector) === "true";
      setTaxpayer({ fullName: text("FullName"), pan: text("PAN").toUpperCase(), dob: text("DateOfBirth"), email: text("Email") });
      setProfile({ resident: text("ResidentialStatus") || "resident", age: text("AgeBand") || "under60", business: bool("BusinessIncome"), capitalGains: bool("CapitalGainsBeyondITR1"), foreignAssets: bool("ForeignAssetsOrIncome"), director: bool("CompanyDirector"), unlistedShares: bool("UnlistedShares") });
      setSalary(text("Salary") || "0");
      setInterest(text("InterestAndOther") || "0");
      setHouseIncome(text("HouseProperty") || "0");
      setDeductions(documentXml.querySelector("Deductions")?.getAttribute("chapterVIA") ?? "0");
      setTds(documentXml.querySelector("Tax")?.getAttribute("taxCredits") ?? "0");
      setRegime(documentXml.querySelector("Tax")?.getAttribute("regime") === "old" ? "old" : "new");
      setConfirmed(documentXml.querySelector("Declaration")?.getAttribute("sourceDocumentsChecked") === "true");
      setNotice("XML restored successfully. Review the figures before continuing.");
      setStep("profile");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not read that XML file");
    }
  }

  function downloadChecklist() {
    downloadText(`SWAYAMITR FILING CHECKLIST — AY 2026-27\n\nRecommended form: ${form}\nSelected regime: ${regime}\nGross income: ${rupees.format(calculations.gross)}\nTaxable income: ${rupees.format(result.taxable)}\nTax including cess: ${rupees.format(result.tax)}\nTax credits entered: ${rupees.format(clean(tds))}\nEstimated ${balance <= 0 ? "refund" : "payable"}: ${rupees.format(Math.abs(balance))}\n\nBEFORE FILING\n[ ] Match Form 16 / 16A figures\n[ ] Reconcile AIS and Form 26AS\n[ ] Confirm bank account for refund\n[ ] Pay any self-assessment tax and refresh credits\n[ ] Validate with the current official utility or e-Filing portal\n[ ] Submit and e-verify within the permitted time\n\nThis checklist is not an ITR or government-compatible upload file.`, "swayamitr-filing-checklist-AY2026-27.txt");
  }

  function preparePack() {
    setStep("review");
    setShowPack(true);
  }

  return (
    <main className="workspace-shell">
      <header className="workspace-topbar">
        <Link className="brand" href="/"><span className="brand-mark">S</span><span><strong>SwayamITR</strong><small>AY 2026–27</small></span></Link>
        <div className="workspace-status"><span className="autosave-dot" />Stored only in this browser session</div>
        <div className="vault-actions"><label className="file-button">Import XML<input type="file" accept=".xml,application/xml" onChange={event => importXml(event.target.files?.[0])} /></label><button onClick={exportXml}>Export XML</button></div>
        <div className="user-menu"><span>{userName.slice(0, 1).toUpperCase()}</span><div><strong>{userName}</strong><small>Private Preview</small></div><Link href={signOutPath}>Exit</Link></div>
      </header>
      {notice && <div className="notice-bar" role="status"><span>{notice}</span><button onClick={() => setNotice("")} aria-label="Dismiss notification">×</button></div>}

      <div className="workspace-grid">
        <aside className="workspace-sidebar">
          <div className="return-title"><span>Individual return</span><h1>AY 2026–27</h1><p>FY 2025–26</p></div>
          <nav aria-label="Return sections">{steps.map((item, index) => <button key={item.id} onClick={() => setStep(item.id)} className={step === item.id ? "active" : ""}><span>{index + 1}</span><p><strong>{item.label}</strong><small>{item.caption}</small></p></button>)}</nav>
          <div className="privacy-card" id="privacy"><span>Private by design</span><p>Your entries stay on this device unless you export them. The XML is not uploaded.</p><button onClick={exportXml}>Download private XML →</button></div>
        </aside>

        <section className="workspace-main">
          <div className="workspace-heading"><div><span>Guided return</span><h2>{step === "profile" ? "Let’s choose the right return" : step === "income" ? "Add your income" : step === "deductions" ? "Compare tax regimes" : step === "taxes" ? "Match tax already paid" : "Review your return"}</h2><p>{step === "profile" ? "Your identity stays in this browser and these questions prevent use of an ineligible form." : "Enter annual figures in Indian rupees. You can change them at any time."}</p></div><div className="readiness"><span>{form}</span><small>{eligible ? "Supported in pilot" : "Advanced workflow"}</small></div></div>

          {step === "profile" && <div className="form-surface">
            <div className="surface-title"><div><span>Taxpayer details</span><h3>Who is filing this return?</h3></div><small>Not sent to a server</small></div>
            <div className="field-grid two identity-grid"><TextField label="Full legal name" value={taxpayer.fullName} onChange={value => setTaxpayer({ ...taxpayer, fullName: value })} placeholder="As shown on PAN" /><TextField label="PAN" value={taxpayer.pan} onChange={value => setTaxpayer({ ...taxpayer, pan: value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10) })} placeholder="ABCDE1234F" error={taxpayer.pan.length > 0 && !panValid ? "Use the 10-character PAN format" : ""} /><TextField label="Date of birth" type="date" value={taxpayer.dob} onChange={value => setTaxpayer({ ...taxpayer, dob: value })} /><TextField label="Email" type="email" value={taxpayer.email} onChange={value => setTaxpayer({ ...taxpayer, email: value })} placeholder="name@example.com" /></div>
            <div className="subsection-rule" />
            <div className="field-grid two"><label><span>Residential status</span><select value={profile.resident} onChange={event => setProfile({ ...profile, resident: event.target.value })}><option value="resident">Resident and ordinarily resident</option><option value="rnor">Resident but not ordinarily resident</option><option value="nri">Non-resident</option></select><small>ITR-1 is limited to resident individuals other than RNOR.</small></label><label><span>Age on 31 March 2026</span><select value={profile.age} onChange={event => setProfile({ ...profile, age: event.target.value })}><option value="under60">Below 60</option><option value="60to79">60–79</option><option value="80plus">80 or above</option></select></label></div>
            <div className="question-list"><p>Did any of these apply during FY 2025–26?</p>{[
              ["business", "Business or professional income", "Includes freelance work and presumptive income"],
              ["capitalGains", "Capital gains beyond ITR-1 scope", "Property, crypto or gains other than permitted section 112A LTCG"],
              ["foreignAssets", "Foreign assets or foreign income", "Includes overseas accounts or signing authority"],
              ["director", "Director in a company", "Indian or foreign company"],
              ["unlistedShares", "Unlisted equity shares", "Held at any time during the year"],
            ].map(([key, title, copy]) => <label className="toggle-row" key={key}><div><strong>{title}</strong><small>{copy}</small></div><input type="checkbox" checked={profile[key as keyof Profile] as boolean} onChange={event => setProfile({ ...profile, [key]: event.target.checked })} /><span className="toggle" /></label>)}</div>
            <div className={eligible ? "recommendation eligible" : "recommendation attention"}><span>{eligible ? "✓" : "!"}</span><div><small>Recommended return</small><strong>{form}</strong><p>{eligible ? "Based on your answers, the guided ITR-1 workflow can continue." : "Your situation needs schedules beyond the current ITR-1 pilot. Calculations are indicative only."}</p></div></div>
          </div>}

          {step === "income" && <div className="form-surface"><div className="source-banner"><div><strong>Income sources</strong><small>Use annual totals from Form 16 and your statements</small></div><span>{rupees.format(calculations.gross)}</span></div><div className="field-grid two"><MoneyField label="Gross salary / pension" hint="Form 16, before standard deduction" value={salary} onChange={setSalary} /><MoneyField label="Interest and other income" hint="Savings, deposits and other taxable interest" value={interest} onChange={setInterest} /><MoneyField label="Net positive house property income" hint="The pilot flags property losses for an advanced workflow" value={houseIncome} onChange={setHouseIncome} /></div><div className="calculation-note"><span>i</span><p><strong>Standard deduction is calculated by regime</strong><small>{rupees.format(result.standard)} is included in the selected {regime}-regime estimate.</small></p></div></div>}

          {step === "deductions" && <div className="form-surface"><div className="regime-compare"><div><span>New regime estimate</span><strong>{rupees.format(calculations.new.tax)}</strong><small>Tax including 4% cess</small></div><div><span>Old regime estimate</span><strong>{rupees.format(calculations.old.tax)}</strong><small>Tax including 4% cess</small></div></div><div className="regime-switch"><button className={regime === "new" ? "active" : ""} onClick={() => setRegime("new")}><strong>New tax regime</strong><small>Default for AY 2026–27</small></button><button className={regime === "old" ? "active" : ""} onClick={() => setRegime("old")}><strong>Old tax regime</strong><small>Uses eligible exemptions and deductions</small></button></div><MoneyField label="Chapter VI-A deductions" hint="80C, 80D and other eligible deductions; used for the old-regime estimate" value={deductions} onChange={setDeductions} /><div className="calculation-note"><span>i</span><p><strong>{regime === "new" ? "Most Chapter VI-A deductions are unavailable" : "Deduction included in this estimate"}</strong><small>{regime === "new" ? "The pilot excludes them from the new-regime calculation. Employer NPS and other exceptions need detailed capture." : `${rupees.format(result.chapterVI)} has been deducted from gross total income.`}</small></p></div></div>}

          {step === "taxes" && <div className="form-surface"><div className="document-checks"><span>Reconcile before entering</span><div><p><strong>Form 16 / 16A</strong><small>Employer and deductor certificates</small></p><p><strong>AIS</strong><small>Reported financial information</small></p><p><strong>Form 26AS</strong><small>Tax-credit statement</small></p></div></div><MoneyField label="TDS / TCS and advance tax paid" hint="Enter only credits that match official records" value={tds} onChange={setTds} /><div className="source-banner result-banner"><div><strong>Estimated balance</strong><small>After tax credits entered above</small></div><span className={balance <= 0 ? "positive" : "negative"}>{balance <= 0 ? `${rupees.format(Math.abs(balance))} refund` : `${rupees.format(balance)} payable`}</span></div><div className="calculation-note warning"><span>!</span><p><strong>Credit matching remains essential</strong><small>A refund estimate is not final until TDS/TCS entries match AIS and Form 26AS.</small></p></div></div>}

          {step === "review" && <div className="review-grid"><div className="form-surface"><h3>Return summary</h3>{[["Taxpayer", taxpayer.fullName || "Not entered"], ["PAN", panValid ? `••••••${taxpayer.pan.slice(-4)}` : "Check PAN"], ["Recommended form", form], ["Selected regime", regime === "new" ? "New regime" : "Old regime"], ["Gross income", rupees.format(calculations.gross)], ["Taxable income", rupees.format(result.taxable)], ["Tax + 4% cess", rupees.format(result.tax)], ["Tax credits", rupees.format(clean(tds))]].map(([label, value]) => <div className="summary-row" key={label}><span>{label}</span><strong>{value}</strong></div>)}<div className="declaration-check"><input id="confirm" type="checkbox" checked={confirmed} onChange={event => setConfirmed(event.target.checked)} /><label htmlFor="confirm">I have checked these figures against Form 16/16A, AIS, Form 26AS and my source documents.</label></div></div><aside className="outcome-card"><span>Estimated outcome</span><strong>{rupees.format(Math.abs(balance))}</strong><p>{balance <= 0 ? "Expected refund" : "Tax payable"}</p><small>Normal-rate income estimate including section 87A rebate/marginal relief where applicable and 4% cess. Special-rate income and surcharge are outside this pilot.</small><button className="button button-primary" onClick={preparePack}>Prepare filing pack <span>→</span></button></aside></div>}

          <div className="workspace-footer-actions"><button className="button button-ghost" onClick={() => setStep(steps[Math.max(0, steps.findIndex(item => item.id === step) - 1)].id)} disabled={step === "profile"}>← Back</button><p><span className="autosave-dot" /> Entries retained for this session</p><button className="button button-primary" onClick={() => step === "review" ? preparePack() : setStep(steps[Math.min(steps.length - 1, steps.findIndex(item => item.id === step) + 1)].id)}>{step === "review" ? "Prepare filing pack" : "Save & continue"} <span>→</span></button></div>
        </section>

        <aside className="tax-panel">
          <span className="panel-kicker">Live tax estimate</span><h3>{regime === "new" ? "New regime" : "Old regime"}</h3>
          <div className="tax-total"><span>Taxable income</span><strong>{rupees.format(result.taxable)}</strong></div>
          <div className="tax-breakdown"><div><span>Gross income</span><strong>{rupees.format(calculations.gross)}</strong></div><div><span>Standard deduction</span><strong>− {rupees.format(result.standard)}</strong></div><div><span>Chapter VI-A</span><strong>− {rupees.format(result.chapterVI)}</strong></div><div><span>Tax incl. cess</span><strong>{rupees.format(result.tax)}</strong></div><div><span>Tax credits</span><strong>− {rupees.format(clean(tds))}</strong></div></div>
          <div className={balance <= 0 ? "panel-outcome refund" : "panel-outcome payable"}><span>{balance <= 0 ? "Estimated refund" : "Estimated payable"}</span><strong>{rupees.format(Math.abs(balance))}</strong></div>
          <p className="panel-note">AY 2026–27 normal slabs, eligible 87A relief and 4% cess. The pilot excludes special-rate income and surcharge.</p>
          <div className="regime-tip"><span>{calculations.new.tax <= calculations.old.tax ? "New" : "Old"} regime is lower in this estimate</span><strong>{rupees.format(Math.abs(calculations.new.tax - calculations.old.tax))} difference</strong><button onClick={() => setStep("deductions")}>Compare assumptions →</button></div>
        </aside>
      </div>

      {showPack && <div className="modal-backdrop" role="presentation" onMouseDown={event => event.target === event.currentTarget && setShowPack(false)}><section className="filing-modal" role="dialog" aria-modal="true" aria-labelledby="pack-title"><button className="modal-close" onClick={() => setShowPack(false)} aria-label="Close filing pack">×</button><span className="modal-kicker">Filing readiness</span><h2 id="pack-title">Your self-filing pack</h2><p className="modal-intro">This pilot prepares and preserves your working data. Final submission stays on the official Income Tax portal until an approved ERI integration is activated.</p><div className={packReady ? "pack-status ready" : "pack-status blocked"}><span>{packReady ? "✓" : "!"}</span><div><strong>{packReady ? "Working file ready" : "Complete the checks below"}</strong><small>{packReady ? "Download your XML and checklist, then validate figures on the official portal." : "The app will not describe an incomplete return as filing-ready."}</small></div></div><div className="pack-checks">{[[eligible, `${form} is supported by this pilot`], [Boolean(taxpayer.fullName.trim()), "Legal name entered"], [panValid, "PAN format checked"], [Boolean(taxpayer.dob), "Date of birth entered"], [confirmed, "Source-document declaration confirmed"]].map(([done, label]) => <div key={String(label)}><span className={done ? "done" : "pending"}>{done ? "✓" : "•"}</span><p>{label}</p></div>)}</div><div className="pack-downloads"><button onClick={exportXml}><span>XML</span><p><strong>Private working file</strong><small>Restore and edit this return later</small></p><b>Download</b></button><button onClick={downloadChecklist}><span>TXT</span><p><strong>Portal filing checklist</strong><small>Review, payment and e-verification steps</small></p><b>Download</b></button></div><div className="government-boundary"><span>Official submission boundary</span><p>The internal XML is not accepted by the e-Filing portal. Government-compatible JSON generation needs the complete current schema, registered software identifiers and validation; direct submission needs Type-2 ERI approval and taxpayer consent.</p><div><a href={officialOfflineHelp} target="_blank" rel="noreferrer">Official offline-utility guide ↗</a><a className="button button-primary" href={officialPortal} target="_blank" rel="noreferrer">Open official e-Filing portal ↗</a></div></div></section></div>}
    </main>
  );
}

function MoneyField({ label, hint, value, onChange }: { label: string; hint: string; value: string; onChange: (value: string) => void }) {
  return <label className="money-field"><span>{label}</span><div><b>₹</b><input inputMode="numeric" value={value} onChange={event => onChange(event.target.value.replace(/[^0-9]/g, ""))} aria-label={label} /></div><small>{hint}</small></label>;
}

function TextField({ label, value, onChange, placeholder = "", type = "text", error = "" }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string; error?: string }) {
  return <label className={`text-field ${error ? "has-error" : ""}`}><span>{label}</span><input type={type} value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} /><small>{error || " "}</small></label>;
}
