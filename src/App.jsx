import { useState, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════════
   THE READING — ELIA ATELIER
   Strategic AI direction for premium boutique firms
   ═══════════════════════════════════════════
   
   FINAL LOCKED VERSION — May 2026
   Mirrors ANSR Pulse architecture exactly :
   - Dark theme (#1A1714) for assessment
   - Light theme (#FAF5EE) for results
   - Same fonts, same accent palette, same flow pattern
   
   Adapted from Pulse for the Atelier audience :
   - 15 questions / 5 dimensions / score /50
   - 4 archetypes (Founder-Held, Voice-Forward, Operationally-Mature, Balanced)
   - 4 maturity bands (Founder-Held, Exposed, Architected, Signature-Ready)
   - Cream block treatment for archetype paragraph (the line they quote)
   - Rose-gold italic "If nothing changes" warnings
   - Text-only Calendly invitation. No buttons. Trust the restraint.
   
   Algorithm validated against simulation.py at 100% calibration.
   ═══════════════════════════════════════════ */

// ── Design Tokens (matched to Pulse exactly) ──
const T = {
  bg: "#1A1714",
  bgCard: "rgba(255,255,255,0.03)",
  bgCardHover: "rgba(255,255,255,0.06)",
  accent: "#C4896A",
  accentBright: "#D4976F",
  accentSoft: "rgba(196,137,106,0.18)",
  accentGlow: "rgba(196,137,106,0.08)",
  text: "#F2EDE7",
  textMuted: "#C4BAA8",
  textDim: "#C4BAA8",
  border: "rgba(255,255,255,0.08)",
  borderHover: "rgba(196,137,106,0.4)",
  warmWhite: "#FAF5EE",
  warmCharcoal: "#3A3530",
  fonts: {
    display: "'Cormorant Garamond', Georgia, 'Times New Roman', serif",
    body: "'EB Garamond', Georgia, 'Times New Roman', serif",
    ui: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
};

// ── Results Page Light Theme Tokens ──
const R = {
  bg: "#FAF5EE",              // Warm ivory
  bgAlt: "#F3EDE4",
  bgCream: "#F4F1EA",         // Cream block bg for archetype paragraph
  text: "#2C2C2C",            // Charcoal
  textMuted: "#6B6560",
  textDim: "#9B9590",
  accent: "#B07D62",          // Rose gold for light bg
  accentBright: "#C4896A",
  accentSoft: "rgba(176,125,98,0.12)",
  accentGlow: "rgba(176,125,98,0.06)",
  roseGold: "#B5894A",        // For "If nothing changes" italic warnings
  border: "rgba(44,44,44,0.10)",
  borderAccent: "rgba(176,125,98,0.25)",
};

// ── Dimension Definitions ──
const DIMENSIONS = [
  { key: "voice", label: "Voice", desc: "How readable your firm is from the outside" },
  { key: "operations", label: "Operations", desc: "What still depends on someone being personally present" },
  { key: "client_experience", label: "Client Experience", desc: "What it actually feels like to be a client" },
  { key: "team", label: "Team", desc: "Whether the firm is carrying the founder, or the other way around" },
  { key: "data_memory", label: "Data & Memory", desc: "What your firm remembers" },
];

// ── 15 Questions across 5 Dimensions ──
const QUESTIONS = [
  // VOICE
  {
    dim: "voice",
    text: "Your firm has a clear voice. Someone reading three paragraphs from your website, an email, and a proposal would recognise the same hand.",
    options: [
      { text: "The voice depends entirely on who is writing", value: 0 },
      { text: "There is a voice, but only the founder produces it consistently", value: 1 },
      { text: "The voice is documented and travels through the team", value: 2 },
    ],
  },
  {
    dim: "voice",
    text: "If someone outside the firm — a collaborator, an agency, an advisor — needed to write something on your behalf tomorrow, they would have a written reference for how your firm speaks.",
    options: [
      { text: "There is no such reference", value: 0 },
      { text: "There are scattered guidelines but no codified voice", value: 1 },
      { text: "A document exists and is used", value: 2 },
    ],
  },
  {
    dim: "voice",
    text: "Your firm produces communications regularly — newsletters, posts, proposals, articles — without the founder being the bottleneck.",
    options: [
      { text: "Almost everything goes through the founder", value: 0 },
      { text: "Some content is produced by others but quality varies", value: 1 },
      { text: "Production runs without the founder being involved in every piece", value: 2 },
    ],
  },
  // OPERATIONS
  {
    dim: "operations",
    text: "You have identified the repetitive tasks in your firm — the work that consumes hours but does not require senior judgment.",
    options: [
      { text: "Never mapped this systematically", value: 0 },
      { text: "A general sense, no formal mapping", value: 1 },
      { text: "Identified, ranked, and addressed", value: 2 },
    ],
  },
  {
    dim: "operations",
    text: "Some of these tasks are now handled by automation, AI, or workflows — not people.",
    options: [
      { text: "Everything still depends on a person", value: 0 },
      { text: "One or two automations exist", value: 1 },
      { text: "Multiple automations run quietly in the background", value: 2 },
    ],
  },
  {
    dim: "operations",
    text: "Your firm could continue to operate for two weeks without you, with no significant loss in quality or client experience.",
    options: [
      { text: "It would degrade quickly", value: 0 },
      { text: "It would hold for a few days, then strain", value: 1 },
      { text: "It would hold", value: 2 },
    ],
  },
  // CLIENT EXPERIENCE
  {
    dim: "client_experience",
    text: "A new client's first sixty days with your firm follow a structured rhythm — not whatever the assigned person happens to do that week.",
    options: [
      { text: "Each onboarding is improvised", value: 0 },
      { text: "There is a pattern, but it depends on who is handling the client", value: 1 },
      { text: "Codified rituals, applied consistently", value: 2 },
    ],
  },
  {
    dim: "client_experience",
    text: "You adapt the experience to the specific client — their history, their preferences, the moment they are in — without it becoming manual labour for your team.",
    options: [
      { text: "Personalisation is either heavy lifting or absent", value: 0 },
      { text: "Some personalisation, ad hoc", value: 1 },
      { text: "Personalisation is structured and runs with grace", value: 2 },
    ],
  },
  {
    dim: "client_experience",
    text: "You measure the relationship with each significant client over time — not just transactions, but the quality of the relationship itself.",
    options: [
      { text: "No measurement beyond transactional data", value: 0 },
      { text: "Intuition without instruments", value: 1 },
      { text: "Both — instinct supported by signals", value: 2 },
    ],
  },
  // TEAM
  {
    dim: "team",
    text: "The people in your firm understand how to use AI tools or modern digital instruments in their role — not as a curiosity, as a normal part of their work.",
    options: [
      { text: "Almost no one", value: 0 },
      { text: "One or two early adopters", value: 1 },
      { text: "It is normal", value: 2 },
    ],
  },
  {
    dim: "team",
    text: "Decisions, processes, and standards are documented enough that your team can execute without checking with you on most things.",
    options: [
      { text: "Most things require the founder", value: 0 },
      { text: "Documented but inconsistently followed", value: 1 },
      { text: "Documented, followed, and updated", value: 2 },
    ],
  },
  {
    dim: "team",
    text: "You invest regularly in your team's literacy with the new instruments of the decade — not just craft, but the systems that surround craft.",
    options: [
      { text: "No structured investment", value: 0 },
      { text: "Occasional, reactive", value: 1 },
      { text: "Continuous and intentional", value: 2 },
    ],
  },
  // DATA & MEMORY
  {
    dim: "data_memory",
    text: "The intelligence about each client — their history, their conversations, their preferences, their context — lives in one accessible place. Not in scattered notes, emails, and heads.",
    options: [
      { text: "It is scattered", value: 0 },
      { text: "Partial, fragmented across systems", value: 1 },
      { text: "In one place, accessible, current", value: 2 },
    ],
  },
  {
    dim: "data_memory",
    text: "Your firm has a written archive of how it works — its protocols, its standards, its refusals, its quiet excellences. Not just a CRM. The character of the firm, written down.",
    options: [
      { text: "Most of it lives in heads", value: 0 },
      { text: "Some written, much remembered", value: 1 },
      { text: "Written, used, and updated", value: 2 },
    ],
  },
  {
    dim: "data_memory",
    text: "Your data — client, operational, communicational — is structured well enough that an AI tool could be trained on it tomorrow without months of preparation.",
    options: [
      { text: "Far from it", value: 0 },
      { text: "Some parts are usable", value: 1 },
      { text: "Structured, clean, ready", value: 2 },
    ],
  },
];

// ── Maturity Bands ──
const BANDS = {
  "FOUNDER-HELD": {
    range: "0  —  15  /  50",
    name: "Founder-Held",
    description: "The maison runs through you. When you pause, it pauses.",
  },
  EXPOSED: {
    range: "16  —  25  /  50",
    name: "Exposed",
    description: "Patterns exist. Nothing yet holds without you. The most common, and the most easily missed.",
  },
  ARCHITECTED: {
    range: "26  —  35  /  50",
    name: "Architected",
    description: "Systems are forming. AI becomes a multiplier on real foundations.",
  },
  "SIGNATURE-READY": {
    range: "36  —  50  /  50",
    name: "Signature-Ready",
    description: "Rare. The conversation is no longer about catching up.",
  },
};

// ── Archetype Definitions (locked from copywriting kings) ──
const ARCHETYPES = {
  "FOUNDER-HELD": {
    number: "01",
    name: "The Founder-Held Firm.",
    pattern: "All dimensions weak — most scores 0 to 2 out of 6. Nothing yet structured.",
    color: "#8B7355",
    archetype: "The firm runs through you. The voice in the room is your voice. The standards are your standards. The intelligence about each client lives in your head, in your inbox, and in the heads of two or three trusted people. Nothing is written down, and nothing yet holds without you. This is the most common pattern in expert-led firms in their first or second decade. Advisory, law, wealth, watchmakers, creative ateliers. You are not behind. You are at the beginning of structure. The next ten years will ask more of the firm than the last ten did, and the founder cannot carry it the same way alone.",
    whereYouStand: "The founders we read in this archetype are usually the ones doing the most ambitious work, and carrying the most. The craft is real. The relationships are deep. The clients are with you because of who you are and how you work. The exposure is also clear. When you take a week off, the firm pauses. When a senior person leaves, a year of unwritten judgment walks out the door. AI cannot be introduced into a firm whose voice lives in heads and whose archive lives in inboxes. The instruments need a foundation, and the foundation comes first.",
    recommendedFirstMove: "Begin with structure before voice. Document the work. The protocols, the refusals, the rituals of welcome. Codify the standards. Write down what only you remember. Three months of this work, done well, transforms what AI can do for the firm in the twelve months that follow.",
    aiInYourHouseIntro: "Three concrete moves for a Founder-Held Firm. Each begins with the work the firm has not yet done — codifying, documenting, structuring — and uses AI to make that work three times faster.",
    useCases: [
      {
        title: "Founder Voice Codification",
        description: "An editorial document of fifteen to twenty-five pages that captures your voice across registers. Client communications, proposals, marketing, internal team notes. Built from analysis of fifty to a hundred past communications, refined through founder interviews. Once written, it becomes the reference any team member, agency, or AI tool uses to write in the firm's voice. Three to four weeks. Immediate use across all communications from week four.",
        ifNothingChanges: "Without a codified voice, every team member writes slightly differently. The firm's distinctiveness erodes silently over months. By the time you notice, it is too late to reverse.",
      },
      {
        title: "The Atelier Memory",
        description: "An always-on archive of how the firm works. Protocols, refusals, standards, client preferences, decision history. Stored in a structured database with AI-powered semantic search. The team asks, the firm remembers. Senior people leaving no longer means knowledge walking out the door. Four to six weeks to build, useful from week four.",
        ifNothingChanges: "Premium boutique firms have lost forty percent of their accumulated capability through a single senior departure. Without a memory layer, the firm's value is mortgaged to two or three people staying.",
      },
      {
        title: "Client Intelligence",
        description: "A unified view of every significant client across email, CRM, calendar, and notes. Past conversations summarised, preferences captured, history visualised. Senior team members prep for client meetings in five minutes instead of thirty. Clients feel known across the firm, not just by you. Three to four weeks to set up. Compounding value from month two.",
        ifNothingChanges: "Without it, every senior client feels personally known by you and managed by guesswork by everyone else. The relationship's depth is mortgaged to your bandwidth, and your bandwidth has a ceiling.",
      },
    ],
  },
  "VOICE-FORWARD": {
    number: "02",
    name: "The Voice-Forward Firm.",
    pattern: "Voice strong (4 or higher out of 6). Data and Memory weak (2 or lower out of 6).",
    color: "#A07850",
    archetype: "The firm has identity. Anyone reading three of your communications recognises the same hand. The voice is codified, perhaps even on paper. Your team can write something acceptable in your name. But the intelligence about each client, the part that makes the relationship valuable, lives in scattered notes, old emails, and fragments of memory. When a senior person leaves, the character of the firm holds. The knowledge does not. The voice is built. The memory is not.",
    whereYouStand: "The Voice-Forward Firm is where most strong founders arrive after eight or ten years of building the brand on purpose. The trap is to assume that because the voice is strong, the firm is strong. When AI tools enter a firm with strong voice and weak memory, the output is the same. The communications sound right. The intelligence behind them is patchwork. Clients feel the gap. The firm sounds consistent across the year, but the relationship feels improvised inside each meeting. The next decade rewards firms whose memory is as codified as their voice.",
    recommendedFirstMove: "Build the memory of the firm. The archive of how you work. What you accept, what you refuse, what you have decided about each client over the years. This is not a CRM. It is a structured memory layer that AI can train on without months of preparation.",
    aiInYourHouseIntro: "Three concrete moves for a Voice-Forward Firm. Each takes the rare asset you already have — a codified voice — and turns it into an instrument that scales, while building the memory layer the strong voice has been compensating for.",
    useCases: [
      {
        title: "The Brand Voice Engine",
        description: "An AI instrument trained on the firm's archive. Past communications, articles, proposals, client letters. It generates new content in the firm's exact voice. The team submits a brief, the engine returns a first draft that sounds like you wrote it. You approve, or refine, or reject. The bottleneck moves from creation to curation. The team finally carries the voice without you rewriting every output. Three to four weeks to build, useful from week five.",
        ifNothingChanges: "Without a Brand Voice Engine, AI tools used by your team produce competent but anonymous output. Indistinguishable from any other firm using ChatGPT. The voice you spent ten years building is diluted by every team member's slightly different prompt.",
      },
      {
        title: "The Memory Layer",
        description: "A structured archive that unifies client intelligence — meetings, emails, decisions, preferences, history — into a queryable system. The team can ask, what did we agree with this client last March about that topic, and receive a precise answer. Memory becomes the firm's quiet asset. Four to six weeks to build. Compounding value from month three.",
        ifNothingChanges: "Voice without memory feels hollow to clients. The communications sound polished, the relationship feels improvised. Returning clients feel managed, not remembered. The pattern is invisible to the firm and obvious to the client.",
      },
      {
        title: "Editorial Production at Scale",
        description: "A workflow that produces the firm's articles, newsletters, and thought leadership at three to five times the current cadence, without changing the editorial standard. You record voice notes, AI drafts in the firm's voice, your editor refines, you approve. The bottleneck is removed. Two to three weeks to build. Three-fold output increase from month two.",
        ifNothingChanges: "Without it, your firm's editorial output stays bound to your personal capacity. Competitors with weaker voice and better systems out-publish you, and AI search engines reward the firms whose archive is deepest, not the firms whose voice is strongest.",
      },
    ],
  },
  "OPERATIONALLY-MATURE": {
    number: "03",
    name: "The Operationally Mature Firm.",
    pattern: "Operations and Data strong (4 or higher out of 6 each). Voice weak (2 or lower out of 6).",
    color: "#7A8B6B",
    archetype: "The firm runs cleanly. Processes are tight. Data is structured. The team executes without you in the room. Onboarding follows a rhythm. Information lives in systems, not in heads. By most measures the firm is in good shape. But there is no codified voice, and the client experience, efficient and capable as it is, feels indistinguishable from a dozen other competent firms in your category. The logistics are built. The identity is not.",
    whereYouStand: "Operationally Mature firms often grew by adding structure faster than they refined character. The danger in the next ten years is specific. When AI search engines become how serious clients find premium firms, the operational firm without a distinctive voice becomes invisible in the answer. The well-run firm without a recognisable hand sounds like every other well-run firm. Voice is no longer optional. It is the work that gives the rest its return.",
    recommendedFirstMove: "Codify the voice, then redesign the client experience around it. The Manifesto and Voice work, three to four weeks done well, gives the firm a recognisable register that the existing operational excellence can finally carry.",
    aiInYourHouseIntro: "Three concrete moves for an Operationally Mature Firm. The infrastructure is already there. The signature is what compounds. AI here is the layer that turns operational excellence into editorial distinctiveness.",
    useCases: [
      {
        title: "The Manifesto and Voice Codification",
        description: "A four-week intensive that extracts the firm's actual voice from its operational artefacts. Proposals, internal memos, client communications, founder interviews. The voice is codified into a transmissible editorial register. The firm discovers its voice was already there, hidden in the work. Three to four weeks. Voice deployable across firm from week five.",
        ifNothingChanges: "Without codified voice, every well-run firm in your category sounds the same. Premium pricing erodes within twenty-four months as clients can no longer distinguish based on capability, only on character.",
      },
      {
        title: "The Signature Digital Product",
        description: "A bespoke client-facing instrument that becomes the firm's editorial signature. A proposal generator that produces proposals in the firm's newly codified voice. A private client portal with AI-powered document assistance. A visualisation tool that lets clients explore scenarios in the firm's aesthetic. Six to twelve weeks to build. Becomes the firm's competitive moat.",
        ifNothingChanges: "Without a signature instrument, your firm's operational excellence is matched by any well-run competitor within eighteen months. The advantage that took a decade to build is replicated by AI in less than two years.",
      },
      {
        title: "The Internal AI Concierge",
        description: "An always-on assistant for the team, trained on the firm's archive, voice, and operational standards. Senior team members ask anything, the assistant answers in the firm's register, drawing from past decisions and current data. Reduces meeting time, accelerates onboarding, captures firm knowledge. Three to four weeks. Productivity uplift measurable from week five.",
        ifNothingChanges: "Without it, the firm's accumulated knowledge stays trapped in the heads of senior people who eventually leave or retire. Every new hire starts at zero. The firm's twenty years of decisions cannot be queried.",
      },
    ],
  },
  BALANCED: {
    number: "04",
    name: "The Balanced Firm.",
    pattern: "All dimensions within one point of each other. No extreme strength or weakness.",
    color: "#5B7A7A",
    archetype: "The firm has good instincts across every dimension. The voice exists. Some operations are documented. Clients are reasonably tracked. The team is engaged. The firm is not exceptional anywhere, and not broken anywhere either. You have read the signals, you have made small experiments, you have tried tools. The firm has options, and that is exactly the difficulty. Optionality without commitment is indecision. The next move is not about awareness. It is about choosing one priority and executing it well, before the window closes and balance becomes a disadvantage.",
    whereYouStand: "The Balanced Firm is the most delicate of the four archetypes. Strong founders in this position often resist committing to a direction because every dimension feels manageable as it is. The eighteen-month window will close on the firms that delayed the choice. The firms that move now, even on a single priority, will compound a lead that the still-balanced firms cannot catch by 2027.",
    recommendedFirstMove: "The Diagnostic. Choose one priority, the one that will compound into the next four. The Balanced Firm needs commitment more than capacity. The work begins with a written reading and an honest conversation about what to do first.",
    aiInYourHouseIntro: "For the Balanced Firm, the first move is not technical. It is strategic. Choose the dimension that, when developed deeply, would most amplify the firm's existing position. Then commit. Below are three moves, depending on which dimension you choose.",
    useCases: [
      {
        title: "If you choose Voice  ·  The Brand Voice Engine",
        description: "Deploy a Brand Voice Engine that codifies and amplifies the firm's emerging editorial register. The Balanced Firm's middling voice becomes a strong voice within sixty days. Specialisation begins. Three to four weeks to build.",
        ifNothingChanges: "Without commitment to one direction, the firm stays balanced across all dimensions. Balance becomes invisibility. The firm has nothing to be known for. By 2027, the firms that committed have moved decisively. The Balanced Firm that waited has watched the window close.",
      },
      {
        title: "If you choose Memory  ·  The Memory Infrastructure",
        description: "Build the memory layer that lets the firm compound client intelligence over time. The Balanced Firm's middling data becomes a strategic asset within ninety days. The team operates on shared knowledge instead of individual heads. Four to six weeks to build.",
        ifNothingChanges: "Without a memory infrastructure, every senior departure resets institutional learning. The firm pays the cost of repeated mistakes that a memory layer would have prevented. By the time you measure the loss, the years are gone.",
      },
      {
        title: "If you choose Client Experience  ·  The Signature Move",
        description: "Build a signature digital product that becomes the firm's category-defining instrument. The Balanced Firm's middling experience becomes the experience competitors try to match. Six to twelve weeks to build. Becomes the firm's signature instrument for the decade.",
        ifNothingChanges: "Without a signature, the Balanced Firm remains interchangeable with every well-run competitor in its category. As AI matures, every competitor catches up on the dimensions you have not committed to. The firm's pricing power erodes invisibly until it is gone.",
      },
    ],
  },
};

// ── Shared Manifesto ──
const MANIFESTO_PARAGRAPHS = [
  "The window is roughly eighteen months. After that, the firms that have moved will compound an advantage the others cannot catch. Today, AI is mostly being used to retrieve information. Few firms are using it to build, to codify, to improve the work itself, which is exactly where the return is.",
  "This is not a software problem. It is a strategic one. A serious approach considers four things together. The voice of the firm. The people who carry it. The governance that protects it. The workflows that hold it.",
  "Be careful of providers selling technical solutions alone. The technology is at the service of the firm, not the other way around. The opportunity is short, and it rewards firms that move with both clarity and craft.",
];

// ── Calendly invitation ──
const CALENDLY_URL = "https://calendly.com/alexandre_elia/ai_conversation";

// ══════════════════════════════════════════════════════════════
// SCORING & ARCHETYPE ASSIGNMENT
// (mirrors simulation.py exactly — DO NOT MODIFY)
// ══════════════════════════════════════════════════════════════

function calcScores(answers) {
  // answers: array of 15 selected option objects { text, value }
  // Returns: { raw: {dim: 0-6}, normalized: {dim: 0-10}, total: 0-50 }
  const raw = {};
  DIMENSIONS.forEach((d) => (raw[d.key] = 0));

  QUESTIONS.forEach((q, i) => {
    if (answers[i]) raw[q.dim] += answers[i].value;
  });

  const normalized = {};
  let total = 0;
  DIMENSIONS.forEach((d) => {
    const n = Math.round((raw[d.key] * 10) / 6 * 10) / 10;
    normalized[d.key] = n;
    total += n;
  });
  total = Math.round(total * 10) / 10;

  return { raw, normalized, total };
}

function assignBand(total) {
  if (total <= 15) return "FOUNDER-HELD";
  if (total <= 25) return "EXPOSED";
  if (total <= 35) return "ARCHITECTED";
  return "SIGNATURE-READY";
}

function assignArchetype(scores) {
  const { raw, total } = scores;
  const weakCount = DIMENSIONS.filter((d) => raw[d.key] <= 2).length;

  // PRIORITY 1 — FOUNDER-HELD
  if (weakCount >= 4 || total <= 15) return "FOUNDER-HELD";

  // PRIORITY 2 — VOICE-FORWARD
  if (raw.voice >= 4 && raw.data_memory <= 2) return "VOICE-FORWARD";

  // PRIORITY 3 — OPERATIONALLY-MATURE
  if (raw.operations >= 4 && raw.data_memory >= 4 && raw.voice <= 2) return "OPERATIONALLY-MATURE";

  // PRIORITY 4 — BALANCED (default)
  return "BALANCED";
}

// ── Fade Wrapper ──
function Fade({ children, dep }) {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    setVis(false);
    const t = setTimeout(() => setVis(true), 60);
    return () => clearTimeout(t);
  }, [dep]);
  return (
    <div style={{ opacity: vis ? 1 : 0, transition: "opacity 0.5s ease", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      {children}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// ASSESSMENT SCREENS — DARK THEME (matching Pulse)
// ══════════════════════════════════════════════════════════════

function IntroScreen({ onStart }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { setTimeout(() => setVis(true), 10); }, []);
  return (
    <div style={{ opacity: vis ? 1 : 0, transition: "opacity 0.6s ease", textAlign: "center", padding: "80px 24px", maxWidth: 580, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <p style={{ fontFamily: T.fonts.display, fontSize: 28, fontWeight: 400, color: T.text, letterSpacing: "0.35em", marginBottom: 16 }}>ELIA</p>
      <p style={{ fontFamily: T.fonts.display, fontSize: 14, color: T.accent, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 40, fontWeight: 300 }}>Atelier</p>
      <div style={{ width: 40, height: 1, background: T.accent, margin: "0 auto 40px", opacity: 0.6 }} />
      <div style={{ marginBottom: 48 }}>
        <span style={{ fontFamily: T.fonts.display, fontSize: "clamp(40px, 8vw, 56px)", fontWeight: 300, color: T.text, letterSpacing: "0.04em", fontStyle: "italic" }}>The Reading</span>
      </div>
      <p style={{ fontFamily: T.fonts.body, fontSize: "clamp(17px, 3vw, 20px)", color: T.text, lineHeight: 1.8, marginBottom: 60, fontStyle: "italic", opacity: 0.85 }}>
        A reading of your firm at the threshold<br />of the exponential age.
      </p>
      <p style={{ fontFamily: T.fonts.body, fontSize: 15, color: T.textMuted, lineHeight: 1.8, marginBottom: 48, maxWidth: 460 }}>
        Fifteen questions across five dimensions.<br />A few minutes of attention.<br /><br />It is not a sales tool. It is a first conversation with yourself, written down.
      </p>
      <button onClick={onStart} style={{ fontFamily: T.fonts.display, fontSize: 15, letterSpacing: "0.15em", textTransform: "uppercase", background: T.accent, border: "none", color: "#FFFFFF", padding: "16px 48px", cursor: "pointer", transition: "all 0.4s ease", borderRadius: 2 }}
        onMouseEnter={(e) => { e.target.style.background = T.accentBright; }}
        onMouseLeave={(e) => { e.target.style.background = T.accent; }}>
        Begin
      </button>
      <p style={{ fontFamily: T.fonts.body, fontSize: 12, color: T.textDim, marginTop: 36, letterSpacing: "0.06em" }}>Confidential  ·  Approx. 5 minutes</p>
    </div>
  );
}

function SettleScreen({ onReady }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { setTimeout(() => setVis(true), 300); }, []);
  return (
    <div style={{ opacity: vis ? 1 : 0, transition: "opacity 1s ease", textAlign: "center", padding: "80px 24px", maxWidth: 460, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <p style={{ fontFamily: T.fonts.display, fontSize: 28, fontWeight: 400, color: T.text, letterSpacing: "0.4em", marginBottom: 12 }}>ELIA</p>
      <div style={{ width: 32, height: 1, background: T.accent, marginBottom: 40, opacity: 0.5 }} />
      <p style={{ fontFamily: T.fonts.body, fontSize: 17, color: T.text, lineHeight: 1.9, marginBottom: 32, fontStyle: "italic" }}>
        Find a quiet moment.<br />This works best when you are alone with the firm.
      </p>
      <p style={{ fontFamily: T.fonts.body, fontSize: 15, color: T.textMuted, lineHeight: 1.8, marginBottom: 60 }}>
        Answer from where the firm actually is, not where you wish it were.<br />There are no right answers. Only honest ones.
      </p>
      <button onClick={onReady} style={{ fontFamily: T.fonts.display, fontSize: 15, letterSpacing: "0.12em", background: T.warmWhite, border: "none", color: T.warmCharcoal, padding: "16px 48px", cursor: "pointer", transition: "all 0.4s ease" }}
        onMouseEnter={(e) => { e.target.style.background = "#FFFFFF"; }}
        onMouseLeave={(e) => { e.target.style.background = T.warmWhite; }}>
        I'm ready
      </button>
    </div>
  );
}

function QuestionScreen({ question, index, total, onAnswer, onBack }) {
  const [selected, setSelected] = useState(null);
  const handleSelect = (opt, i) => {
    setSelected(i);
    setTimeout(() => { setSelected(null); onAnswer(opt); }, 500);
  };
  const dim = DIMENSIONS.find((d) => d.key === question.dim);
  return (
    <Fade dep={index}>
      <div style={{ padding: "40px 24px", maxWidth: 580, margin: "0 auto", width: "100%" }}>
        <p style={{ fontFamily: T.fonts.display, fontSize: 20, fontWeight: 400, color: T.text, letterSpacing: "0.35em", textAlign: "center", marginBottom: 32 }}>ELIA</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {index > 0 && (
              <button onClick={onBack} style={{ background: "none", border: "none", color: T.textDim, cursor: "pointer", fontFamily: T.fonts.body, fontSize: 13, padding: "4px 0", transition: "color 0.3s ease" }}
                onMouseEnter={(e) => { e.target.style.color = T.accent; }}
                onMouseLeave={(e) => { e.target.style.color = T.textDim; }}>←</button>
            )}
            <span style={{ fontFamily: T.fonts.ui, fontSize: 12, color: T.accent, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 500 }}>
              {dim?.label}
            </span>
          </div>
          <span style={{ fontFamily: T.fonts.ui, fontSize: 12, color: T.textDim, letterSpacing: "0.06em" }}>
            {index + 1} of {total}
          </span>
        </div>
        <div style={{ display: "flex", gap: 6, marginBottom: 6, justifyContent: "center" }}>
          {Array.from({ length: total }, (_, i) => (
            <div key={i} style={{ width: i <= index ? 18 : 8, height: 2, background: i <= index ? T.accent : "rgba(255,255,255,0.1)", borderRadius: 1, transition: "all 0.5s ease" }} />
          ))}
        </div>
        <h2 style={{ fontFamily: T.fonts.body, fontSize: "clamp(18px, 3.5vw, 24px)", color: T.text, fontWeight: 400, lineHeight: 1.65, margin: "36px 0 40px", fontStyle: "italic" }}>
          {question.text}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {question.options.map((opt, i) => (
            <button key={i} onClick={() => handleSelect(opt, i)} style={{ fontFamily: T.fonts.ui, fontSize: 14, color: selected === i ? "#FFFFFF" : T.warmCharcoal, background: selected === i ? T.accent : T.warmWhite, border: `1px solid ${selected === i ? T.accent : "rgba(220,215,200,0.4)"}`, padding: "18px 22px", textAlign: "left", cursor: "pointer", transition: "all 0.3s ease", lineHeight: 1.6, borderRadius: 3 }}
              onMouseEnter={(e) => { if (selected !== i) { e.target.style.borderColor = T.accent + "66"; e.target.style.background = "rgba(255,252,248,1)"; } }}
              onMouseLeave={(e) => { if (selected !== i) { e.target.style.borderColor = "rgba(220,215,200,0.4)"; e.target.style.background = T.warmWhite; } }}>
              {opt.text}
            </button>
          ))}
        </div>
      </div>
    </Fade>
  );
}

function EmailScreen({ onSubmit }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [firm, setFirm] = useState("");
  const [vis, setVis] = useState(false);
  useEffect(() => { setTimeout(() => setVis(true), 200); }, []);
  const inputStyle = { fontFamily: T.fonts.body, fontSize: 15, background: T.warmWhite, border: `1px solid rgba(220,215,200,0.4)`, color: T.warmCharcoal, padding: "15px 16px", width: "100%", outline: "none", boxSizing: "border-box", borderRadius: 3, transition: "border-color 0.3s ease" };
  const ready = name.trim() && email.trim() && firm.trim();
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "40px 24px" }}>
      <div style={{ opacity: vis ? 1 : 0, transition: "opacity 0.8s ease", textAlign: "center", padding: "48px 32px", maxWidth: 460, width: "100%" }}>
        <p style={{ fontFamily: T.fonts.display, fontSize: 28, fontWeight: 400, color: T.text, letterSpacing: "0.4em", marginBottom: 12 }}>ELIA</p>
        <div style={{ width: 32, height: 1, background: T.accent, margin: "0 auto 32px", opacity: 0.5 }} />
        <p style={{ fontFamily: T.fonts.display, fontSize: 26, fontWeight: 300, color: T.text, letterSpacing: "0.04em", marginBottom: 8, fontStyle: "italic" }}>
          Your <span style={{ color: T.accent }}>Reading</span> is ready
        </p>
        <div style={{ width: 30, height: 1, background: T.accent, margin: "0 auto 24px", opacity: 0.5 }} />
        <p style={{ fontFamily: T.fonts.body, fontSize: 15, color: T.textMuted, fontStyle: "italic", lineHeight: 1.7, marginBottom: 32 }}>
          The result appears on this screen and a copy is sent to your inbox.<br />We do not chase. The reading is yours.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
          <input type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} onFocus={(e) => { e.target.style.borderColor = T.accent; }} onBlur={(e) => { e.target.style.borderColor = "rgba(220,215,200,0.4)"; }} autoComplete="name" />
          <input type="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} onFocus={(e) => { e.target.style.borderColor = T.accent; }} onBlur={(e) => { e.target.style.borderColor = "rgba(220,215,200,0.4)"; }} autoComplete="email" />
          <input type="text" placeholder="Your firm" value={firm} onChange={(e) => setFirm(e.target.value)} style={inputStyle} onFocus={(e) => { e.target.style.borderColor = T.accent; }} onBlur={(e) => { e.target.style.borderColor = "rgba(220,215,200,0.4)"; }} autoComplete="organization" />
        </div>
        <button onClick={() => { if (ready) onSubmit(name.trim(), email.trim(), firm.trim()); }} style={{ fontFamily: T.fonts.display, fontSize: 15, letterSpacing: "0.12em", textTransform: "uppercase", background: T.accent, border: "none", color: "#FFFFFF", padding: "15px 40px", cursor: ready ? "pointer" : "default", transition: "all 0.3s ease", width: "100%", opacity: ready ? 1 : 0.35, borderRadius: 2 }}
          onMouseEnter={(e) => { if (ready) e.target.style.background = T.accentBright; }}
          onMouseLeave={(e) => { e.target.style.background = T.accent; }}>
          Reveal the reading
        </button>
        <p style={{ fontFamily: T.fonts.body, fontSize: 12, color: T.textDim, marginTop: 20 }}>
          Your data is confidential. We do not share it. Ever.
        </p>
      </div>
    </div>
  );
}

function BreathingScreen({ onComplete }) {
  const [vis, setVis] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    setTimeout(() => setVis(true), 200);
    setTimeout(() => setPulse(true), 600);
    setTimeout(() => setPhase(1), 2200);
    setTimeout(() => onComplete(), 4500);
  }, [onComplete]);
  return (
    <div style={{ opacity: vis ? 1 : 0, transition: "opacity 1s ease", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 24 }}>
      <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(196,137,106,0.16) 0%, transparent 60%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: pulse ? 260 : 130, height: pulse ? 260 : 130, borderRadius: "50%", border: `1px solid ${T.accent}`, opacity: pulse ? 0.45 : 0.6, transition: "all 3.5s ease-in-out" }} />
      <div style={{ width: pulse ? 170 : 85, height: pulse ? 170 : 85, borderRadius: "50%", border: `1.5px solid ${T.accent}`, opacity: pulse ? 0.8 : 0.95, transition: "all 2.5s ease-in-out", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <p style={{ fontFamily: T.fonts.display, fontSize: 28, fontWeight: 400, color: T.text, letterSpacing: "0.35em", margin: 0, position: "absolute" }}>ELIA</p>
      </div>
      <p style={{ fontFamily: T.fonts.body, fontSize: 17, color: T.text, marginTop: 48, fontStyle: "italic", opacity: vis ? 1 : 0, transition: "opacity 0.8s ease", letterSpacing: "0.03em" }}>
        {phase === 0 ? "Reading your firm" : "Identifying your archetype"}
      </p>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// RESULTS SCREEN — LIGHT THEME
// ══════════════════════════════════════════════════════════════

function ResultsScreen({ scores, archetype, band, userName }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { setTimeout(() => setVis(true), 300); }, []);
  const a = ARCHETYPES[archetype];
  const b = BANDS[band];
  const firstName = userName ? userName.split(" ")[0] : "";

  return (
    <div style={{ opacity: vis ? 1 : 0, transition: "opacity 1s ease", background: R.bg, minHeight: "100vh", padding: "48px 24px 80px", maxWidth: 620, margin: "0 auto" }}>
      {/* ── Header ── */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <p style={{ fontFamily: T.fonts.display, fontSize: 24, fontWeight: 400, color: R.text, letterSpacing: "0.3em", marginBottom: 8 }}>ELIA</p>
        <p style={{ fontFamily: T.fonts.display, fontSize: 12, color: R.accent, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 32, fontWeight: 300 }}>Atelier</p>
        <p style={{ fontFamily: T.fonts.ui, fontSize: 11, color: R.accent, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12 }}>The Reading</p>
        {firstName && (
          <p style={{ fontFamily: T.fonts.body, fontSize: 15, color: R.textMuted, fontStyle: "italic" }}>for {firstName}</p>
        )}
      </div>

      {/* ── 01. THE SCORE ── */}
      <Section number="01" title="The score">
        <div style={{ display: "flex", alignItems: "baseline", gap: 24, marginBottom: 24, flexWrap: "wrap" }}>
          <div>
            <span style={{ fontFamily: T.fonts.display, fontSize: 84, fontWeight: 300, color: R.text, lineHeight: 1 }}>{scores.total}</span>
            <span style={{ fontFamily: T.fonts.display, fontSize: 28, color: R.textMuted, marginLeft: 6 }}>/ 50</span>
          </div>
          <div>
            <p style={{ fontFamily: T.fonts.ui, fontSize: 11, color: R.accent, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 6 }}>Maturity band</p>
            <p style={{ fontFamily: T.fonts.display, fontSize: 26, color: R.text, fontWeight: 400, marginBottom: 6 }}>{b.name}</p>
          </div>
        </div>
        <p style={{ fontFamily: T.fonts.body, fontSize: 16, color: R.textMuted, fontStyle: "italic", lineHeight: 1.7, marginBottom: 36 }}>
          {b.description}
        </p>

        {/* Per-dimension breakdown */}
        <div style={{ paddingTop: 28, borderTop: `1px solid ${R.border}` }}>
          <p style={{ fontFamily: T.fonts.ui, fontSize: 11, color: R.accent, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 20 }}>By dimension</p>
          {DIMENSIONS.map((d) => {
            const norm = scores.normalized[d.key];
            const pct = (norm / 10) * 100;
            return (
              <div key={d.key} style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14 }}>
                <span style={{ fontFamily: T.fonts.body, fontSize: 14, color: R.text, width: 130, flexShrink: 0 }}>{d.label}</span>
                <div style={{ flex: 1, height: 1, background: R.border, position: "relative" }}>
                  <div style={{ position: "absolute", left: 0, top: 0, height: 1, background: R.accent, width: `${pct}%` }} />
                </div>
                <span style={{ fontFamily: T.fonts.display, fontSize: 14, color: R.textMuted, width: 60, textAlign: "right" }}>{norm} / 10</span>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ── 02. THE ARCHETYPE ── */}
      <Section number="02" title="The archetype">
        <p style={{ fontFamily: T.fonts.ui, fontSize: 11, color: R.accent, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 8 }}>
          Archetype {a.number}
        </p>
        <h2 style={{ fontFamily: T.fonts.display, fontSize: "clamp(32px, 6vw, 44px)", fontWeight: 300, color: R.text, letterSpacing: "0.02em", marginBottom: 24 }}>
          {a.name}
        </h2>
        <p style={{ fontFamily: T.fonts.ui, fontSize: 11, color: R.accent, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 8 }}>Pattern</p>
        <p style={{ fontFamily: T.fonts.body, fontSize: 15, color: R.textMuted, fontStyle: "italic", marginBottom: 28, lineHeight: 1.6 }}>
          {a.pattern}
        </p>
        <p style={{ fontFamily: T.fonts.ui, fontSize: 11, color: R.accent, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12 }}>The archetype</p>
        {/* THE CREAM BLOCK — most important visual element */}
        <div style={{ background: R.bgCream, padding: "30px 32px", marginBottom: 8, borderRadius: 4 }}>
          <p style={{ fontFamily: T.fonts.body, fontSize: 17, color: R.text, lineHeight: 1.85, margin: 0 }}>
            {a.archetype}
          </p>
        </div>
      </Section>

      {/* ── 03. WHERE YOU STAND ── */}
      <Section number="03" title="Where you stand">
        <p style={{ fontFamily: T.fonts.body, fontSize: 16.5, color: R.text, lineHeight: 1.85, marginBottom: 32 }}>
          {a.whereYouStand}
        </p>
        <p style={{ fontFamily: T.fonts.ui, fontSize: 11, color: R.accent, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12 }}>Recommended first move</p>
        <p style={{ fontFamily: T.fonts.body, fontSize: 16.5, color: R.text, lineHeight: 1.85, fontStyle: "italic" }}>
          {a.recommendedFirstMove}
        </p>
      </Section>

      {/* ── 04. AI IN YOUR HOUSE ── */}
      <Section number="04" title="AI in your house">
        <p style={{ fontFamily: T.fonts.body, fontSize: 15.5, color: R.textMuted, fontStyle: "italic", lineHeight: 1.75, marginBottom: 36 }}>
          {a.aiInYourHouseIntro}
        </p>
        {a.useCases.map((uc, i) => (
          <div key={i} style={{ marginBottom: 36 }}>
            <h3 style={{ fontFamily: T.fonts.display, fontSize: 22, fontWeight: 400, color: R.text, marginBottom: 14 }}>
              {uc.title}
            </h3>
            <p style={{ fontFamily: T.fonts.body, fontSize: 16, color: R.text, lineHeight: 1.8, marginBottom: 16 }}>
              {uc.description}
            </p>
            <p style={{ fontFamily: T.fonts.body, fontSize: 14, color: R.roseGold, fontStyle: "italic", lineHeight: 1.7, paddingLeft: 14, borderLeft: `2px solid ${R.roseGold}66`, margin: 0 }}>
              <span style={{ fontStyle: "normal", fontWeight: 500 }}>If nothing changes. </span>
              {uc.ifNothingChanges}
            </p>
          </div>
        ))}
      </Section>

      {/* ── 05. WHAT THE MOMENT DEMANDS ── */}
      <Section number="05" title="What the moment demands">
        {MANIFESTO_PARAGRAPHS.map((p, i) => (
          <p key={i} style={{ fontFamily: T.fonts.body, fontSize: 16.5, color: R.text, lineHeight: 1.85, marginBottom: 18 }}>
            {p}
          </p>
        ))}
      </Section>

      {/* ── THE INVITATION ── */}
      <div style={{ marginTop: 64, paddingTop: 48, borderTop: `1px solid ${R.border}` }}>
        <p style={{ fontFamily: T.fonts.ui, fontSize: 11, color: R.accent, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12 }}>The invitation</p>
        <h3 style={{ fontFamily: T.fonts.display, fontSize: "clamp(28px, 5vw, 36px)", fontWeight: 300, color: R.text, marginBottom: 20 }}>
          If this raised questions.
        </h3>
        <p style={{ fontFamily: T.fonts.body, fontSize: 16.5, color: R.text, lineHeight: 1.85, marginBottom: 40 }}>
          The work of reading a firm honestly is hard to do alone. If this reading raised questions you would like to think through with someone who has spent two decades inside premium firms, we offer a first conversation. Thirty minutes, at our expense. No deck. No obligation.
        </p>

        {/* Calendly — text only, centered, dark Cormorant. No button. Trust the restraint. */}
        <div style={{ textAlign: "center", margin: "56px 0" }}>
          <p style={{ fontFamily: T.fonts.display, fontSize: 22, fontWeight: 300, color: R.text, marginBottom: 12 }}>
            Book a thirty-minute conversation
          </p>
          <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" style={{ fontFamily: T.fonts.display, fontSize: 18, color: R.text, textDecoration: "none", borderBottom: `1px solid ${R.accent}66`, paddingBottom: 2, transition: "border-color 0.3s ease" }}
            onMouseEnter={(e) => { e.target.style.borderColor = R.accent; }}
            onMouseLeave={(e) => { e.target.style.borderColor = R.accent + "66"; }}>
            {CALENDLY_URL.replace("https://", "")}
          </a>
        </div>

        {/* Attachments */}
        <div style={{ marginTop: 56, paddingTop: 32, borderTop: `1px solid ${R.border}` }}>
          <p style={{ fontFamily: T.fonts.ui, fontSize: 11, color: R.accent, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16 }}>Two pieces are attached</p>
          <p style={{ fontFamily: T.fonts.body, fontSize: 15, color: R.text, lineHeight: 1.8, margin: "0 0 6px 0" }}>The article on the exponential age, six pages.</p>
          <p style={{ fontFamily: T.fonts.body, fontSize: 15, color: R.text, lineHeight: 1.8, margin: 0 }}>The Window, the full research paper, twenty-three pages.</p>
          <p style={{ fontFamily: T.fonts.body, fontSize: 13, color: R.textDim, fontStyle: "italic", marginTop: 12, lineHeight: 1.6 }}>
            Both pieces have been sent to your inbox along with this reading.
          </p>
        </div>

        {/* Signature */}
        <div style={{ marginTop: 56, paddingTop: 32, borderTop: `1px solid ${R.border}`, textAlign: "center" }}>
          <p style={{ fontFamily: T.fonts.display, fontSize: 18, color: R.text, fontStyle: "italic", marginBottom: 6 }}>— Alexandre Olive</p>
          <p style={{ fontFamily: T.fonts.body, fontSize: 14, color: R.textMuted, marginBottom: 12 }}>Founder, ELIA Atelier</p>
          <p style={{ fontFamily: T.fonts.body, fontSize: 13, color: R.textDim }}>
            alexandre@eliaatelier.ch  ·  eliaatelier.ch
          </p>
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: 56, paddingTop: 32, textAlign: "center" }}>
        <p style={{ fontFamily: T.fonts.body, fontSize: 12, color: R.textDim, fontStyle: "italic", marginBottom: 4 }}>
          ELIA Atelier is a practice of Uskale SA
        </p>
        <p style={{ fontFamily: T.fonts.body, fontSize: 12, color: R.textDim, marginBottom: 16 }}>
          Mallorca  ·  Switzerland  ·  2026
        </p>
        <p style={{ fontFamily: T.fonts.ui, fontSize: 10, color: R.textDim, letterSpacing: "0.18em", textTransform: "uppercase" }}>Confidential</p>
      </div>
    </div>
  );
}

// ── Section Wrapper for Result Screen ──
function Section({ number, title, children }) {
  return (
    <div style={{ marginBottom: 64 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 24 }}>
        <span style={{ fontFamily: T.fonts.ui, fontSize: 11, color: R.accent, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 500 }}>{number}</span>
        <span style={{ fontFamily: T.fonts.ui, fontSize: 11, color: R.textDim }}>·</span>
        <span style={{ fontFamily: T.fonts.ui, fontSize: 11, color: R.accent, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 500 }}>{title}</span>
      </div>
      <div>{children}</div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN APP — STATE MACHINE
// ══════════════════════════════════════════════════════════════

export default function EliaReading() {
  const [screen, setScreen] = useState("intro");
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [scores, setScores] = useState(null);
  const [archetype, setArchetype] = useState(null);
  const [band, setBand] = useState(null);
  const [userName, setUserName] = useState("");

  const handleAnswer = useCallback((opt) => {
    const newAnswers = [...answers, opt];
    setAnswers(newAnswers);
    if (qIndex < QUESTIONS.length - 1) {
      setQIndex(qIndex + 1);
    } else {
      setScreen("breathing");
    }
  }, [answers, qIndex]);

  const handleBack = useCallback(() => {
    if (qIndex > 0) {
      setAnswers(answers.slice(0, -1));
      setQIndex(qIndex - 1);
    }
  }, [answers, qIndex]);

  const handleEmail = useCallback((name, email, firm) => {
    setUserName(name);
    let computedScores = null;
    let computedArchetype = null;
    let computedBand = null;

    try {
      computedScores = calcScores(answers);
      computedArchetype = assignArchetype(computedScores);
      computedBand = assignBand(computedScores.total);
      setScores(computedScores);
      setArchetype(computedArchetype);
      setBand(computedBand);

      // Capture API call (fire and forget — does not block result display)
      fetch("/api/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          firm,
          archetype: computedArchetype,
          band: computedBand,
          scores: computedScores,
        }),
      }).catch(() => {});
    } catch (err) {
      console.error("Scoring error:", err);
    }

    setScreen("results");
    window.scrollTo(0, 0);
  }, [answers]);

  const isResults = screen === "results" && scores && archetype && band;

  return (
    <div style={{ background: isResults ? R.bg : T.bg, minHeight: "100vh", color: isResults ? R.text : T.text, position: "relative", transition: "background 0.8s ease" }}>
      {/* Background textures — only on dark screens */}
      {!isResults && (
        <>
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none", opacity: 0.025, zIndex: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px" }} />
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none",
            background: "radial-gradient(ellipse at 30% 40%, rgba(196,137,106,0.04) 0%, transparent 60%), radial-gradient(ellipse at 70% 70%, rgba(91,122,122,0.03) 0%, transparent 50%)", zIndex: 0 }} />
        </>
      )}

      <div style={{ position: "relative", zIndex: 1 }}>
        {screen === "intro" && <IntroScreen onStart={() => setScreen("settle")} />}
        {screen === "settle" && <SettleScreen onReady={() => setScreen("questions")} />}
        {screen === "questions" && (
          <QuestionScreen
            question={QUESTIONS[qIndex]}
            index={qIndex}
            total={QUESTIONS.length}
            onAnswer={handleAnswer}
            onBack={handleBack}
          />
        )}
        {screen === "breathing" && <BreathingScreen onComplete={() => setScreen("email")} />}
        {screen === "email" && <EmailScreen onSubmit={handleEmail} />}
        {isResults && (
          <ResultsScreen scores={scores} archetype={archetype} band={band} userName={userName} />
        )}
      </div>
    </div>
  );
}
