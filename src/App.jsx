import { useEffect, useState } from "react";
import {
  Menu, X, HandHeart, ReceiptText, CalendarDays, Trophy, Users, Utensils,
  ChevronRight, Copy, ExternalLink, ArrowUp, Flame, Heart, Pause, Play, Search
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
  const [flatSearch, setFlatSearch] = useState("");

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
              <div className="contributor-details">
                <div><span>Phone</span><strong>9734523975</strong></div>
                <div><span>UPI ID</span><strong>dassoumalyadas-2@okhdfcbank</strong></div>
                <button className="copy-upi" onClick={() => copyText("dassoumalyadas-2@okhdfcbank")}><Copy size={15} /> Copy UPI ID</button>
              </div>
            </article>
            <article className="info-card contributor-card">
              <h3>Prateek Sadhukhan</h3>
              <div className="contributor-details">
                <div><span>Phone</span><strong>9477559166</strong></div>
                <div><span>UPI ID</span><strong>prateek.sadhukhan4-1@oksbi</strong></div>
                <button className="copy-upi" onClick={() => copyText("prateek.sadhukhan4-1@oksbi")}><Copy size={15} /> Copy UPI ID</button>
              </div>
            </article>
            <article className="info-card contributor-card">
              <h3>Soumyadip Basu</h3>
              <div className="contributor-details">
                <div><span>Phone</span><strong>7686041496</strong></div>
                <div><span>UPI ID</span><strong>7686041496@ybl</strong></div>
                <button className="copy-upi" onClick={() => copyText("7686041496@ybl")}><Copy size={15} /> Copy UPI ID</button>
              </div>
            </article>
          </div>
          <p className="section-note">Use the UPI ID to contribute. Please verify the recipient name before completing your payment.</p>
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
                <div className="donation-search">
                  <Search size={17} aria-hidden="true" />
                  <input
                    type="search"
                    value={flatSearch}
                    onChange={(event) => setFlatSearch(event.target.value)}
                    placeholder="Search by flat number (e.g. A-101)"
                    aria-label="Search household contributions by flat number"
                  />
                  {flatSearch && <button type="button" onClick={() => setFlatSearch("")} aria-label="Clear flat search"><X size={16} /></button>}
                </div>
                {donations.length === 0 ? (
                  <p className="empty-state">No public contributions have been recorded yet.</p>
                ) : flatSearch.trim() ? (
                  (() => {
                    const query = flatSearch.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
                    const matches = donations.filter((item) =>
                      String(item.flat || "").toUpperCase().replace(/[^A-Z0-9]/g, "").includes(query)
                    );
                    return matches.length ? (
                      <div className="donation-results" aria-live="polite">
                        <div className="search-result-count">{matches.length} matching contribution{matches.length === 1 ? "" : "s"}</div>
                        {matches.map((item, index) => (
                          <div className="donation-row" key={`${item.flat}-${item.name}-${index}`}>
                            <span>{item.flat}</span>
                            <strong>{item.name}</strong>
                            <b>₹{Number(item.amount).toLocaleString("en-IN", { maximumFractionDigits: 2 })}</b>
                          </div>
                        ))}
                      </div>
                    ) : <p className="empty-state">No contributions found for “{flatSearch}”. Try another flat number.</p>;
                  })()
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
          <SectionHeading kicker="PLAN YOUR VISIT" title="Festival Schedule" subtitle="Join us for four days of devotion, culture and community celebrations." />
          <div className="schedule-grid">
            <article className="schedule-card">
              <div className="schedule-card-heading"><span>08</span><div><h3>8th November</h3><p>Sunday</p></div></div>
              <div className="schedule-events">
                <ScheduleEvent time="12:00 PM" title="Agomon" />
                <ScheduleEvent time="6:30 PM" title="Preparation of Pujo" />
                <ScheduleEvent time="9:30 PM" title="Pushpanjali" />
                <ScheduleEvent time="10:30 PM" title="Bhog Distribution" />
                <ScheduleEvent time="11:00 PM – 2:00 AM" title="Yagya" />
              </div>
            </article>
            <article className="schedule-card">
              <div className="schedule-card-heading"><span>09</span><div><h3>9th November</h3><p>Monday</p></div></div>
              <div className="schedule-events">
                <ScheduleEvent time="11:00 AM – 10:30 PM" title="Flea Market" />
                <ScheduleEvent time="10:00 AM – 12:00 PM" title="Sports" />
                <ScheduleEvent time="2:00 PM – 4:00 PM" title="Sports" />
                <ScheduleEvent time="4:30 PM – 6:30 PM" title="Keya Kalakriti" detail="A Cultural Competition" />
                <ScheduleEvent time="7:00 PM – 8:00 PM" title="Aarti + Dhunuchi" />
                <ScheduleEvent time="8:00 PM – 8:30 PM" title="Traditional Dhak Performance" />
                <ScheduleEvent time="7:30 PM – 10:00 PM" title="Community Feast" />
              </div>
            </article>
            <article className="schedule-card">
              <div className="schedule-card-heading"><span>10</span><div><h3>10th November</h3><p>Tuesday</p></div></div>
              <div className="schedule-events">
                <ScheduleEvent time="11:00 AM – 10:30 PM" title="Flea Market" />
                <ScheduleEvent time="5:00 PM – 5:30 PM" title="Aarti" />
                <ScheduleEvent time="5:30 PM – 7:00 PM" title="Tarangaa" detail="The Kali Chronicles in Keya" />
                <ScheduleEvent time="7:30 PM – 10:00 PM" title="Live Band Performance" />
              </div>
            </article>
            <article className="schedule-card">
              <div className="schedule-card-heading"><span>11</span><div><h3>11th November</h3><p>Wednesday</p></div></div>
              <div className="schedule-events schedule-events-single">
                <div className="visarjan-mark">✦</div>
                <ScheduleEvent time="4:00 PM" title="Visarjan" />
              </div>
            </article>
          </div>
        </section>

        <section id="sports" className="content-section section-anchor">
          <SectionHeading kicker="PLAY · PARTICIPATE · CELEBRATE" title="Sports & Games" subtitle="Bring your energy and join the fun." />
          <article className="info-card centered-card">
            <Trophy className="large-card-icon" size={38} />
            <h3>Sports Registration</h3>
            <p>Register for the sports and games organised as part of our Kali Pujo celebrations.</p>
            <a className="registration-link" href="https://script.google.com/macros/s/AKfycbyPg50eRJmwx66oVuOzobVLYWygiiRKHANa2NRiHV6zDU1P6MCLjuvmZMg0X8vTGAE2Gg/exec" target="_blank" rel="noreferrer">Register for Sports <ExternalLink size={16} /></a>
          </article>
        </section>

        <section id="community-feast" className="content-section section-anchor">
          <SectionHeading kicker="COME TOGETHER · SHARE THE JOY" title="Community Feast" subtitle="Be part of our celebration and enjoy a meal together with the community." />
          <article className="info-card centered-card">
            <Utensils className="large-card-icon" size={38} />
            <h3>Community Feast Registration</h3>
            <p>Book your plates for the community feast and celebrate together.</p>
            <a className="registration-link" href="https://script.google.com/macros/s/AKfycbyoeaxK7ftt6av0CYAh8TGWgFP4zyjoobvh1XlrRLs1tu98RImk6tGPA7HD-JLmkrw/exec" target="_blank" rel="noreferrer">Register for Community Feast <ExternalLink size={16} /></a>
          </article>
        </section>

        <section id="about" className="content-section section-anchor">
          <SectionHeading kicker="THE PEOPLE BEHIND THE CELEBRATION" title="About Us" subtitle="A community coming together to celebrate Kali Pujo." />
          <article className="info-card team-card">
            <Users className="large-card-icon" size={38} />
            <h3>Team KaliPujo</h3>
            <div className="team-grid">
              <div className="team-member">Soumalya Das</div>
              <div className="team-member">Sonam Agnihotri</div>
              <div className="team-member">Shatam Bhattacharyya</div>
              <div className="team-member">Ritika Dey</div>
              <div className="team-member">Prateek Sadhukhan</div>
              <div className="team-member">Poulomi Mukherjee</div>
              <div className="team-member">Rwitam Mitra</div>
              <div className="team-member">Swaagata Chowdhury</div>
              <div className="team-member">Soumyadip Basu</div>
              <div className="team-member">Asmita Biswas</div>
              <div className="team-member">Yoghesh Dakshinamoorthy</div>
              <div className="team-member">Ivani Konar</div>
              <div className="team-member">Dipayan Dev</div>
              <div className="team-member">Subrat Panda</div>
              <div className="team-member">Priyanka Ghosh</div>
              <div className="team-member">Abhishek Pal</div>
              <div className="team-member">Subhasis Deb</div>
              <div className="team-member">Shamim md</div>
              <div className="team-member">Nadira Parveen</div>
              <div className="team-member">Siddhartha Pathak</div>
              <div className="team-member">Moutushi Saha</div>
              <div className="team-member">Arpa Banerjee</div>
              <div className="team-member">Aakash</div>
              <div className="team-member">Amit Bhowmick</div>
              <div className="team-member">Aditi Dey</div>
              <div className="team-member">Geetha Venkat</div>
              <div className="team-member">Sougata Basu</div>
            </div>
          </article>
          <div className="contact-strip contact-strip-stack">
            <Heart size={18} />
            <div><strong>For any queries, please contact:</strong><br /><a href="tel:9477559166">Prateek – 9477559166</a><span> · </span><a href="tel:7686041496">Soumyadip – 7686041496</a></div>
          </div>
        </section>
      </main>

      <footer className="site-footer"><span>🪔</span><strong>Keya ATL Kali Pujo 2026</strong><small>Celebrating devotion, culture and community</small><button onClick={() => goTo("home")}><ArrowUp size={15} /> Back to top</button></footer>
    </>
  );
}

function ScheduleEvent({ time, title, detail }) {
  return <div className="schedule-event"><span>{time}</span><strong>{title}</strong>{detail && <small>{detail}</small>}</div>;
}

function SectionHeading({ kicker, title, subtitle }) {
  return <div className="section-heading"><span>{kicker}</span><h2>{title}</h2><p>{subtitle}</p></div>;
}

export default App;