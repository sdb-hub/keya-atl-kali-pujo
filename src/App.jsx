import { useEffect, useState } from "react";
import {
  Menu, X, HandHeart, ReceiptText, CalendarDays, Trophy, Users, Utensils,
  ChevronRight, Copy, ExternalLink, ArrowUp, Flame, Heart, Pause, Play
} from "lucide-react";

const NAV = [
  { id: "home", label: "Home" },
  { id: "contribute", label: "Contribute" },
  { id: "donations", label: "Donations" },
  { id: "schedule", label: "Schedule" },
  { id: "sports", label: "Sports" },
  { id: "community-feast", label: "Community Feast" },
  { id: "about", label: "About Us" }
];

const FEATURES = [
  { id: "contribute", title: "Contribute", desc: "Support the celebration with a contribution.", Icon: HandHeart, tone: "red" },
  { id: "donations", title: "Donation Details", desc: "See contributions from our community.", Icon: ReceiptText, tone: "blue" },
  { id: "schedule", title: "Schedule", desc: "Puja timings and cultural programmes.", Icon: CalendarDays, tone: "red" },
  { id: "sports", title: "Sports", desc: "Join the community sports events.", Icon: Trophy, tone: "blue" },
  { id: "community-feast", title: "Community Feast", desc: "Celebrate together over a community feast.", Icon: Utensils, tone: "red" },
  { id: "about", title: "About Us", desc: "Meet the Kali Pujo team and contact us.", Icon: Users, tone: "blue", wide: true }
];

function App() {
  const [active, setActive] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [donations, setDonations] = useState([]);
  const [donationSummary, setDonationSummary] = useState({ total: 0, flatCount: 0, towers: [] });
  const [donationStatus, setDonationStatus] = useState("loading");
  const [paused, setPaused] = useState(false);

  const goTo = (id) => {
    setActive(id);
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const sections = NAV.map(({ id }) => document.getElementById(id)).filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    }, { rootMargin: "-25% 0px -60% 0px", threshold: [0, .2, .5] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const response = await fetch("/api/donations", { headers: { Accept: "application/json" } });
        if (!response.ok) throw new Error("Donation feed is not configured yet.");
        const data = await response.json();
        if (alive) {
          setDonations(Array.isArray(data.donations) ? data.donations : []);
          setDonationSummary({
            total: Number(data.total) || 0,
            flatCount: Number(data.flatCount) || 0,
            towers: Array.isArray(data.towers) ? data.towers : []
          });
          setDonationStatus(data.configured === false ? "unavailable" : "ready");
        }
      } catch {
        if (alive) setDonationStatus("unavailable");
      }
    };
    load();
    const timer = window.setInterval(load, 5 * 60 * 1000);
    return () => { alive = false; window.clearInterval(timer); };
  }, []);

  const copyText = async (value) => {
    try { await navigator.clipboard.writeText(value); alert("Copied to clipboard"); }
    catch { alert("Please copy this UPI ID manually."); }
  };

  return (
    <>
      <header className="site-header">
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
          {menuOpen ? <X /> : <Menu />}
        </button>
        <nav className={menuOpen ? "nav-links open" : "nav-links"} aria-label="Main navigation">
          {NAV.map((item) => (
            <button key={item.id} className={active === item.id ? "nav-link active" : "nav-link"} onClick={() => goTo(item.id)}>{item.label}</button>
          ))}
        </nav>
      </header>

      <main>
        <section id="home" className="hero section-anchor">
          <div className="hero-content">
            <div className="eyebrow"><Flame size={15} /> COMMUNITY · CULTURE · CELEBRATION</div>
            <h1>Keya ATL<br /><span>Kali Pujo 2026</span></h1>
            <p className="hero-subtitle">A celebration of devotion, culture and community</p>
            <div className="ornament"><span />✦<span /></div>
            <div className="feature-grid">
              {FEATURES.map(({ id, title, desc, Icon, tone, wide }) => (
                <button key={id} className={`feature-card ${tone} ${wide ? "wide" : ""}`} onClick={() => goTo(id)}>
                  <span className="feature-icon"><Icon size={27} strokeWidth={1.8} /></span>
                  <span className="feature-copy"><strong>{title}</strong><small>{desc}</small></span>
                  <span className="feature-arrow"><ChevronRight size={19} /></span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section id="contribute" className="content-section section-anchor">
          <SectionHeading kicker="BE A PART OF THE CELEBRATION" title="Contribute" subtitle="Your support helps bring our community celebration to life." />
          <div className="contributor-grid">
            <article className="info-card contributor-card">
              <h3>Soumalya Das</h3>
              <img className="contributor-qr" src="/images/qr-soumalya-das.jpeg.JPG" alt="Soumalya Das UPI QR code" />
              <div className="contributor-details">
                <div><span>Phone</span><strong>9734523975</strong></div>
                <div><span>UPI ID</span><strong>dassoumalyadas-2@okhdfcbank</strong></div>
                <button className="copy-upi" onClick={() => copyText("dassoumalyadas-2@okhdfcbank")}><Copy size={15} /> Copy UPI ID</button>
              </div>
            </article>
            <article className="info-card contributor-card">
              <h3>Prateek Sadhukhan</h3>
              <img className="contributor-qr" src="/images/qr-prateek-sadhukhan.jpeg.JPG" alt="Prateek Sadhukhan UPI QR code" />
              <div className="contributor-details">
                <div><span>Phone</span><strong>9477559166</strong></div>
                <div><span>UPI ID</span><strong>prateek.sadhukhan4-1@oksbi</strong></div>
                <button className="copy-upi" onClick={() => copyText("prateek.sadhukhan4-1@oksbi")}><Copy size={15} /> Copy UPI ID</button>
              </div>
            </article>
            <article className="info-card contributor-card">
              <h3>Soumyadip Basu</h3>
              <img className="contributor-qr" src="/images/qr-soumyadip-basu.jpeg.JPG" alt="Soumyadip Basu PhonePe QR code" />
              <div className="contributor-details">
                <div><span>Phone</span><strong>7686041496</strong></div>
                <div><span>UPI ID</span><strong>7686041496@ybl</strong></div>
                <button className="copy-upi" onClick={() => copyText("7686041496@ybl")}><Copy size={15} /> Copy UPI ID</button>
              </div>
            </article>
          </div>
          <p className="section-note">Scan the QR code or copy the UPI ID to contribute. Please verify the recipient name before completing your payment.</p>
        </section>

        <section id="donations" className="content-section section-anchor">
          <SectionHeading kicker="OUR COMMUNITY, OUR CONTRIBUTION" title="Donation Details" subtitle="Thank you to every household supporting Kali Pujo." />

          {donationStatus === "loading" && (
            <div className="donation-panel"><p className="empty-state">Loading live contributions…</p></div>
          )}

          {donationStatus === "unavailable" && (
            <div className="donation-panel"><p className="empty-state">Donation details are temporarily unavailable. Please check back shortly.</p></div>
          )}

          {donationStatus === "ready" && (
            <>
              <div className="donation-summary-grid">
                <article className="donation-stat donation-stat-total">
                  <span>TOTAL CONTRIBUTIONS</span>
                  <strong>₹{donationSummary.total.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</strong>
                  <small>Across all towers</small>
                </article>
                <article className="donation-stat">
                  <span>CONTRIBUTING HOUSEHOLDS</span>
                  <strong>{donationSummary.flatCount.toLocaleString("en-IN")}</strong>
                  <small>Unique contributing flats</small>
                </article>
              </div>

              <div className="tower-summary-grid">
                {["A", "B", "C"].map((tower) => {
                  const item = donationSummary.towers.find((entry) => entry.tower === tower) || { total: 0, flatCount: 0 };
                  return (
                    <article className="tower-summary-card" key={tower}>
                      <span className="tower-summary-label">TOWER {tower}</span>
                      <strong>₹{Number(item.total).toLocaleString("en-IN", { maximumFractionDigits: 2 })}</strong>
                      <small>{Number(item.flatCount).toLocaleString("en-IN")} contributing {Number(item.flatCount) === 1 ? "flat" : "flats"}</small>
                    </article>
                  );
                })}
              </div>

              <div className="donation-panel donor-panel">
                <div className="panel-top">
                  <div><span className="live-dot" /> HOUSEHOLD CONTRIBUTIONS</div>
                  <button className="pause-button" onClick={() => setPaused(!paused)}>
                    {paused ? <Play size={15} /> : <Pause size={15} />}
                    {paused ? "Resume" : "Pause"}
                  </button>
                </div>
                {donations.length === 0 ? (
                  <p className="empty-state">No public contributions have been recorded yet.</p>
                ) : (
                  <div className={paused ? "donation-scroll paused" : "donation-scroll"}>
                    <div className="donation-track">
                      {[...donations, ...donations].map((item, index) => (
                        <div className="donation-row" key={`${item.flat}-${index}`}>
                          <span>{item.flat}</span>
                          <strong>{item.name}</strong>
                          <b>₹{Number(item.amount).toLocaleString("en-IN", { maximumFractionDigits: 2 })}</b>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="panel-foot">Live data · Automatically refreshed every 5 minutes</div>
              </div>
            </>
          )}
        </section>

        <section id="schedule" className="content-section section-anchor">
          <SectionHeading kicker="PLAN YOUR VISIT" title="Festival Schedule" subtitle="Join us for puja, rituals and cultural programmes." />
          <article className="info-card centered-card">
            <CalendarDays className="large-card-icon" size={38} />
            <h3>Programme Schedule</h3>
            <p>The detailed Kali Pujo schedule will be published here.</p>
            <span className="coming-soon">SCHEDULE PDF TO BE ADDED</span>
          </article>
        </section>

        <section id="sports" className="content-section section-anchor">
          <SectionHeading kicker="PLAY · PARTICIPATE · CELEBRATE" title="Sports & Games" subtitle="Bring your energy and join the fun." />
          <article className="info-card centered-card">
            <Trophy className="large-card-icon" size={38} />
            <h3>Sports Registration</h3>
            <p>Registration details and event categories will be announced here.</p>
            <span className="coming-soon">REGISTRATION LINK TO BE ADDED</span>
          </article>
        </section>

        <section id="community-feast" className="content-section section-anchor">\n          <SectionHeading kicker="COME TOGETHER · SHARE THE JOY" title="Community Feast" subtitle="Be part of our celebration and enjoy a meal together with the community." />\n          <article className="info-card centered-card">\n            <Utensils className="large-card-icon" size={38} />\n            <h3>Community Feast Registration</h3>\n            <p>Registration details and the booking link will be shared here soon.</p>\n            <span className="coming-soon">REGISTRATION LINK TO BE ADDED</span>\n          </article>\n        </section>\n\n        <section id="about" className="content-section section-anchor">
          <SectionHeading kicker="THE PEOPLE BEHIND THE CELEBRATION" title="About Us" subtitle="A community coming together to celebrate Kali Pujo." />
          <article className="info-card centered-card">
            <Users className="large-card-icon" size={38} />
            <h3>Kali Pujo Organising Team</h3>
            <p>Our organising team details will be published here.</p>
            <span className="coming-soon">TEAM MEMBERS TO BE ADDED</span>
          </article>
          <div className="contact-strip"><Heart size={18} /> For queries, committee contact details will be shared here.</div>
        </section>
      </main>

      <footer className="site-footer"><span>🪔</span><strong>Keya ATL Kali Pujo 2026</strong><small>Celebrating devotion, culture and community</small><button onClick={() => goTo("home")}><ArrowUp size={15} /> Back to top</button></footer>
    </>
  );
}

function SectionHeading({ kicker, title, subtitle }) {
  return <div className="section-heading"><span>{kicker}</span><h2>{title}</h2><p>{subtitle}</p></div>;
}

export default App;