import { useEffect, useState } from "react";
import {
  Menu, X, HandHeart, ReceiptText, CalendarDays, Trophy, Users, Utensils, Mail, ShoppingBag,
  ChevronRight, Copy, ExternalLink, ArrowUp, Flame, Heart, Pause, Play, Search, Music2, Drama, Guitar
} from "lucide-react";

const NAV = [
  { id: "home", label: "Home" },
  { id: "contribute", label: "Contribute" },
  { id: "schedule", label: "Schedule" },
  { id: "community-feast", label: "Community Feast" },
  { id: "sports", label: "Sports" },
  { id: "flea-market", label: "Flea Markets" },
  { id: "donations", label: "Donation Details" },
  { id: "sponsors", label: "Our Sponsors" },
  { id: "about", label: "About Us" },
  { id: "contact", label: "Get in Touch" }
];

const FEATURES = [
  { id: "schedule", title: "Schedule", desc: "Puja timings and cultural programmes.", Icon: CalendarDays, tone: "red" },
  { id: "keya-kalakriti", title: "Keya Kalakriti", desc: "A cultural competition.", Icon: Music2, tone: "blue", event: true },
  { id: "tarangaa", title: "Tarangaa", desc: "The Kali Chronicles in Keya.", Icon: Drama, tone: "red", event: true },
  { id: "bongolorean-live", title: "Bongolorean Live", desc: "Live music and performances.", Icon: Guitar, tone: "blue", event: true },
  { id: "community-feast", title: "Community Feast", desc: "Celebrate together over a community feast.", Icon: Utensils, tone: "red" },
  { id: "sports", title: "Sports", desc: "Join the community sports events.", Icon: Trophy, tone: "blue" },
  { id: "flea-market", title: "Flea Markets", desc: "Explore the stalls at our community flea market.", Icon: ShoppingBag, tone: "red" },
  { id: "donations", title: "Donation Details", desc: "See contributions from our community.", Icon: ReceiptText, tone: "blue" },
  { id: "sponsors", title: "Our Sponsors", desc: "Thank you to our celebration partners.", Icon: Heart, tone: "red" },
  { id: "about", title: "About Us", desc: "Meet the team behind the celebration.", Icon: Users, tone: "blue" },
  { id: "contact", title: "Get in Touch", desc: "Get in touch with the organising team.", Icon: Mail, tone: "red" }
];

const SECTION_PATHS = {
  home: "/",
  contribute: "/contribute",
  schedule: "/schedule",
  "keya-kalakriti": "/keyaKalakriti",
  tarangaa: "/tarangaa",
  "bongolorean-live": "/bongoloreanLive",
  "community-feast": "/communityFeast",
  sports: "/sports",
  "flea-market": "/fleaMarket",
  donations: "/donationDetails",
  sponsors: "/ourSponsors",
  about: "/aboutUs",
  contact: "/getInTouch"
};
const PATH_SECTIONS = Object.fromEntries(
  Object.entries(SECTION_PATHS).map(([id, path]) => [path.toLowerCase(), id])
);

function App() {
  const [active, setActive] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [donations, setDonations] = useState([]);
  const [donationSummary, setDonationSummary] = useState({ total: 0, flatCount: 0, towers: [] });
  const [donationStatus, setDonationStatus] = useState("loading");
  const [paused, setPaused] = useState(false);
  const [flatSearch, setFlatSearch] = useState("");
  const [fleaVideoOpen, setFleaVideoOpen] = useState(false);
  const [feastDonationOpen, setFeastDonationOpen] = useState(false);

  const scrollToSection = (id, behavior = "smooth") => {
    const section = document.getElementById(id);
    if (!section) return;
    const headerHeight = document.querySelector(".site-header")?.getBoundingClientRect().height || 0;
    const top = window.scrollY + section.getBoundingClientRect().top - headerHeight - 12;
    window.scrollTo({ top: Math.max(0, top), behavior });
  };

  const goTo = (id) => {
    setActive(id);
    setMenuOpen(false);
    const path = SECTION_PATHS[id];
    if (path && window.location.pathname !== path) window.history.pushState({ section: id }, "", path);
    requestAnimationFrame(() => scrollToSection(id, "smooth"));
  };

  useEffect(() => {
    const resolvePath = () => { const path = window.location.pathname.toLowerCase(); const normalizedPath = path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path; return PATH_SECTIONS[normalizedPath || "/"] || "home"; };
    const initialSection = resolvePath();
    if (initialSection !== "home") {
      requestAnimationFrame(() => {
        scrollToSection(initialSection, "auto");
        setActive(initialSection);
      });
    }
    const handlePopState = () => {
      const id = resolvePath();
      setActive(id);
      scrollToSection(id, "smooth");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

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
            <div className="contribute-quick-wrap">
              <p className="feast-live-announcement" onClick={() => goTo("community-feast")} role="link" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") goTo("community-feast"); }}>✦ Feast Menu is LIVE now !! ✦</p>
              <button className="feature-card contribute-quick-card" onClick={() => goTo("contribute")}>
                <span className="feature-icon"><HandHeart size={21} strokeWidth={1.9} /></span>
                <span className="feature-copy"><strong>Contribute</strong><small>Support the celebrations</small></span>
                <span className="feature-arrow"><ChevronRight size={17} /></span>
              </button>
            </div>
            <div className="feature-grid">
              {FEATURES.map(({ id, title, desc, Icon, tone, event }) => (
                <button key={id} className={`feature-card ${tone} ${event ? "event-feature-card" : ""}`} onClick={() => goTo(id)}>
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

<section id="keya-kalakriti" className="content-section section-anchor event-poster-section">
          <SectionHeading kicker="CULTURE · CREATIVITY · COMMUNITY" title="Keya Kalakriti" subtitle="A cultural competition celebrating the talents of our community." />
          <img className="event-poster-image" src="/images/Kalakriti.jpg" alt="Keya Kalakriti event poster" />
        </section>

<section id="tarangaa" className="content-section section-anchor event-poster-section">
          <SectionHeading kicker="THE KALI CHRONICLES IN KEYA" title="Tarangaa" subtitle="Join us for Tarangaa, a special cultural presentation." />
          <img className="event-poster-image" src="/images/Tarangaa.jpg" alt="Tarangaa event poster" />
        </section>

<section id="bongolorean-live" className="content-section section-anchor event-poster-section">
          <SectionHeading kicker="MUSIC · ENERGY · CELEBRATION" title="Bongolorean Live" subtitle="Get ready for a live musical celebration." />
          <img className="event-poster-image" src="/images/Bongolorean.jpg" alt="Bongolorean Live event poster" />
        </section>

<section id="community-feast" className="content-section section-anchor">
          <SectionHeading kicker="COME TOGETHER · SHARE THE JOY" title="Community Feast" subtitle="Be part of our celebration and enjoy a meal together with the community." />
          <article className="info-card centered-card feast-menu-card">
            <Utensils className="large-card-icon" size={38} />
            <h3>Community Feast Menu</h3>
            <p className="feast-menu-intro">A traditional vegetarian feast awaits! All food preparations are without onion and garlic.</p>
            <p className="feast-menu-timing">Timing: 7:30 PM onwards</p>
            <ul className="feast-menu-list">
              <li>Khichudi</li>
              <li>Alur Dum</li>
              <li>Beguni</li>
              <li>Chatni</li>
              <li>Papad</li>
              <li>Payesh (Kheer)</li>
            </ul>
            <div className="feast-donation-note">
              <strong>A small request to our community</strong>
              <p>If you haven't had a chance to contribute, we warmly invite you to make any voluntary contribution. Every contribution, big or small, helps us celebrate together.</p>
              <button className="registration-link feast-donation-trigger" onClick={() => setFeastDonationOpen(true)}>Make a Voluntary Contribution</button>
            </div>
            <div className="feast-query-contacts">
              <strong>For any queries:</strong>
              <p>Dipayan: <a href="tel:9686630031">9686630031</a></p>
              <p>Soumalya: <a href="tel:9734523975">9734523975</a></p>
            </div>
          </article>
          {feastDonationOpen && (
            <div className="feast-donation-modal" role="dialog" aria-modal="true" aria-label="Voluntary contribution details" onClick={() => setFeastDonationOpen(false)}>
              <div className="feast-donation-modal-content" onClick={(event) => event.stopPropagation()}>
                <button className="feast-donation-close" onClick={() => setFeastDonationOpen(false)} aria-label="Close contribution details"><X size={22} /></button>
                <div className="feast-donation-modal-icon"><Heart size={25} /></div>
                <h3>Support Our Kali Pujo</h3>
                <p>Your voluntary contribution will help us make the celebrations memorable for everyone. Thank you for your support!</p>
                <div className="feast-upi-option">
                  <span>Soumyadip Basu</span>
                  <strong>Phone: 7686041496</strong>
                  <button onClick={() => copyText("7686041496")}><Copy size={15} /> Copy Phone Number</button>
                  <strong>7686041496@ybl</strong>
                  <button onClick={() => copyText("7686041496@ybl")}><Copy size={15} /> Copy UPI ID</button>
                </div>
                <div className="feast-upi-option">
                  <span>Prateek Sadhukhan</span>
                  <strong>Phone: 9477559166</strong>
                  <button onClick={() => copyText("9477559166")}><Copy size={15} /> Copy Phone Number</button>
                  <strong>prateek.sadhukhan4-1@oksbi</strong>
                  <button onClick={() => copyText("prateek.sadhukhan4-1@oksbi")}><Copy size={15} /> Copy UPI ID</button>
                </div>
                <small>Any amount is welcome. Contributions are entirely voluntary.</small>
              </div>
            </div>
          )}
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

<section id="flea-market" className="content-section section-anchor">
          <SectionHeading kicker="EXPLORE · SHOP · SUPPORT LOCAL" title="Flea Market Stalls" subtitle="Take a look at the stalls and discover what our community flea market has to offer." />
          <article className="info-card flea-video-card">
            <button className="flea-video-launch" onClick={() => setFleaVideoOpen(true)} aria-label="Play flea market stalls video">
              <span className="flea-video-play"><Play size={30} fill="currentColor" /></span>
              <strong>Explore Our Flea Market Stalls</strong>
              <small>Click to play video</small>
            </button>
            <p className="flea-video-caption">Watch the video showcasing our flea market stalls</p>
          </article>
          {fleaVideoOpen && (
            <div className="flea-video-modal" role="dialog" aria-modal="true" aria-label="Flea Market Stalls video" onClick={() => setFleaVideoOpen(false)}>
              <div className="flea-video-modal-content" onClick={(event) => event.stopPropagation()}>
                <button className="flea-video-close" onClick={() => setFleaVideoOpen(false)} aria-label="Close video"><X size={23} /></button>
                <div className="flea-video-player flea-video-shorts">
                  <iframe
                    src="https://www.youtube.com/embed/2tcIcMoDi_k?autoplay=1&playsinline=1&rel=0"
                    title="Keya ATL Kali Pujo 2026 Flea Market Stalls"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          )}
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
                          <div className="donation-row" key={`${item.flat}-${index}`}>
                            <span>{item.flat}</span>
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

<section id="sponsors" className="content-section section-anchor">
          <SectionHeading kicker="WITH GRATITUDE" title="Our Sponsors" subtitle="Thank you to our sponsors for supporting the Keya ATL Kali Pujo 2026 celebrations." />
          <div className="sponsor-board-wrap">
            <img
              className="sponsor-board-image"
              src="/images/sponsors-transparent.png"
              alt="Keya ATL Kali Pujo 2026 sponsors"
            />
          </div>
        </section>

<section id="about" className="content-section section-anchor">
          <SectionHeading kicker="THE PEOPLE BEHIND THE CELEBRATION" title="About Us" subtitle="A community coming together to celebrate Kali Pujo." />
          <article className="info-card team-card">
            <Users className="large-card-icon" size={38} />
            <h3 className="team-card-title">Team Kali Pujo</h3>
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
              <div className="team-member">Satrajit Nath</div>
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
              <div className="team-member">Prachi Debnath</div>
            </div>
          </article>
        </section>

<section id="contact" className="content-section section-anchor">
          <SectionHeading kicker="WE’RE HERE TO HELP" title="Contact Us" subtitle="For any queries about Keya ATL Kali Pujo 2026, please get in touch." />
          <article className="info-card contact-card">
            <Heart className="large-card-icon" size={38} />
            <h3>Get in Touch</h3>
            <div className="contact-details">
              <p><strong>Prateek Sadhukhan</strong><a href="tel:9477559166">9477559166</a></p>
              <p><strong>Soumyadip Basu</strong><a href="tel:7686041496">7686041496</a></p>
              <p><strong>Official Email</strong><a href="mailto:keyaatlkpcommittee@gmail.com">keyaatlkpcommittee@gmail.com</a></p>
            </div>
          </article>
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