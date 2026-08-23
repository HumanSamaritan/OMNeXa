import Link from "next/link";

const officialPortal = "https://www.incometax.gov.in/iec/foportal/";

export default function Home() {
  const startPath = "/workspace";

  return (
    <main className="landing-shell">
      <nav className="topbar landing-nav" aria-label="Primary navigation">
        <Link className="brand" href="/" aria-label="Swayam ITR home">
          <span className="brand-mark">S</span>
          <span><strong>SwayamITR</strong><small>An OMNeXa initiative</small></span>
        </Link>
        <div className="nav-actions">
          <a className="text-link hide-mobile" href={officialPortal} target="_blank" rel="noreferrer">Official e-Filing portal ↗</a>
          <Link className="button button-small" href={startPath}>Open private workspace</Link>
        </div>
      </nav>

      <section className="landing-hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="status-dot" /> AY 2026–27 ruleset</div>
          <h1>Your income tax return, explained and prepared by you.</h1>
          <p className="hero-intro">A guided, privacy-first workspace that turns your Form 16, bank interest and deductions into a checked return—without handing your financial life to a third party.</p>
          <div className="hero-actions">
            <Link className="button button-primary" href={startPath}>Start a private return<span>→</span></Link>
            <a className="button button-ghost" href="#how-it-works">See how it works</a>
          </div>
          <p className="microcopy">Pilot supports the ITR-1 individual workflow. Complex cases are identified before preparation begins.</p>
        </div>

        <div className="return-card" aria-label="Example return readiness summary">
          <div className="return-card-head">
            <div><span className="card-kicker">Return readiness</span><strong>ITR-1 · AY 2026–27</strong></div>
            <span className="secure-pill">Private</span>
          </div>
          <div className="progress-ring-wrap">
            <div className="progress-ring"><span>82%</span><small>ready</small></div>
            <div className="progress-copy"><strong>Almost ready to review</strong><span>2 checks need your attention</span></div>
          </div>
          <div className="check-list">
            <div><span className="check done">✓</span><p><strong>Income matched</strong><small>Salary + bank interest</small></p><span>₹14,82,000</span></div>
            <div><span className="check done">✓</span><p><strong>Tax credits</strong><small>Form 16 and TDS</small></p><span>₹1,48,200</span></div>
            <div><span className="check pending">!</span><p><strong>One item to confirm</strong><small>Savings interest</small></p><span>Review</span></div>
          </div>
          <div className="refund-strip"><span>Estimated outcome</span><strong>₹12,480 refund</strong></div>
        </div>
      </section>

      <section className="trust-strip" aria-label="Privacy commitments">
        <div><span className="mini-icon">01</span><p><strong>Your data stays in your browser</strong><small>No financial documents uploaded in this pilot.</small></p></div>
        <div><span className="mini-icon">02</span><p><strong>Rules you can trace</strong><small>Checks aligned to official AY 2026–27 guidance.</small></p></div>
        <div><span className="mini-icon">03</span><p><strong>You remain in control</strong><small>Review every figure before portal upload.</small></p></div>
      </section>

      <section className="how-section" id="how-it-works">
        <div className="section-heading"><span>One calm workflow</span><h2>From scattered documents to a filing-ready return.</h2><p>SwayamITR asks plain-language questions, recommends the right form and makes every calculation visible.</p></div>
        <div className="steps-grid">
          <article><span>1</span><h3>Check your return type</h3><p>A two-minute eligibility check distinguishes ITR-1 from returns needing capital gains, business or foreign-asset schedules.</p></article>
          <article><span>2</span><h3>Add and reconcile</h3><p>Enter Form 16, interest, property and tax-credit figures. The workspace flags gaps and unusual mismatches.</p></article>
          <article><span>3</span><h3>Review and export</h3><p>Compare tax regimes, read every declaration, then export your private working file and filing checklist.</p></article>
        </div>
      </section>

      <section className="boundary-note">
        <div><span className="boundary-mark">i</span><p><strong>Independent pilot—not an Income Tax Department service.</strong><br />Direct submission and e-verification require an approved e-Return Intermediary integration. Until that approval is in place, this app prepares your return and guides the final upload on the official portal.</p></div>
        <a href={officialPortal} target="_blank" rel="noreferrer">Visit incometax.gov.in ↗</a>
      </section>

      <footer><Link className="brand" href="/"><span className="brand-mark">S</span><span><strong>SwayamITR</strong><small>An OMNeXa initiative</small></span></Link><p>Designed for clarity, privacy and taxpayer control.</p><span>AY 2026–27 Preview</span></footer>
    </main>
  );
}
