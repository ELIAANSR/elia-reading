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
    text: "There is a clear voice in the firm. Someone reading three paragraphs from your website, an email, and a proposal would recognise the same hand.",
    options: [
      { text: "The voice depends entirely on who is writing", value: 0 },
      { text: "There is a voice, but only the founder produces it consistently", value: 1 },
      { text: "The voice is documented and travels through the team", value: 2 },
    ],
  },
  {
    dim: "voice",
    text: "If someone outside the firm, a collaborator, an agency, an advisor, needed to write something on your behalf tomorrow, they would have a written reference for how the firm speaks.",
    options: [
      { text: "There is no such reference", value: 0 },
      { text: "There are scattered guidelines but no codified voice", value: 1 },
      { text: "A document exists and is used", value: 2 },
    ],
  },
  {
    dim: "voice",
    text: "The firm produces communications regularly, newsletters, posts, proposals, articles, without the founder being the bottleneck.",
    options: [
      { text: "Almost everything goes through the founder", value: 0 },
      { text: "Some content is produced by others but quality varies", value: 1 },
      { text: "Production runs without the founder being involved in every piece", value: 2 },
    ],
  },
  // OPERATIONS
  {
    dim: "operations",
    text: "You have identified the repetitive tasks in the firm. The work that consumes hours and does not require senior judgment.",
    options: [
      { text: "Never mapped this systematically", value: 0 },
      { text: "A general sense, no formal mapping", value: 1 },
      { text: "Identified, ranked, and addressed", value: 2 },
    ],
  },
  {
    dim: "operations",
    text: "Some of these tasks are now handled by automation, AI, or workflows.",
    options: [
      { text: "Everything still depends on a person", value: 0 },
      { text: "One or two automations exist", value: 1 },
      { text: "Multiple automations run in the background", value: 2 },
    ],
  },
  {
    dim: "operations",
    text: "The firm could continue operating for two weeks without you, with no meaningful loss in quality or client experience.",
    options: [
      { text: "It would degrade quickly", value: 0 },
      { text: "It would hold for a few days, then strain", value: 1 },
      { text: "It would hold", value: 2 },
    ],
  },
  // CLIENT EXPERIENCE
  {
    dim: "client_experience",
    text: "A new client's first sixty days with the firm follow a structured rhythm. The same rhythm regardless of who is handling them.",
    options: [
      { text: "Each onboarding is improvised", value: 0 },
      { text: "There is a pattern, but it depends on who is handling the client", value: 1 },
      { text: "Codified rituals, applied consistently", value: 2 },
    ],
  },
  {
    dim: "client_experience",
    text: "You adapt the experience to the specific client, their history, their preferences, the moment they are in, without it becoming manual labour for the team.",
    options: [
      { text: "Personalisation is either heavy lifting or absent", value: 0 },
      { text: "Some personalisation, ad hoc", value: 1 },
      { text: "Personalisation is structured and runs without manual labour", value: 2 },
    ],
  },
  {
    dim: "client_experience",
    text: "You measure the relationship with each significant client over time. The quality of it, not only the transactions.",
    options: [
      { text: "No measurement beyond transactional data", value: 0 },
      { text: "Intuition without instruments", value: 1 },
      { text: "Both. Instinct supported by signals", value: 2 },
    ],
  },
  // TEAM
  {
    dim: "team",
    text: "The people in the firm use AI tools and modern digital instruments as a normal part of their work.",
    options: [
      { text: "Almost no one", value: 0 },
      { text: "One or two early adopters", value: 1 },
      { text: "It is normal", value: 2 },
    ],
  },
  {
    dim: "team",
    text: "Decisions, processes, and standards are documented enough that the team can execute most things without checking with you.",
    options: [
      { text: "Most things require the founder", value: 0 },
      { text: "Documented but inconsistently followed", value: 1 },
      { text: "Documented, followed, and updated", value: 2 },
    ],
  },
  {
    dim: "team",
    text: "Your team is trained continuously in the tools and systems that surround their craft, including AI and digital workflows.",
    options: [
      { text: "No structured investment", value: 0 },
      { text: "Occasional, reactive", value: 1 },
      { text: "Continuous and intentional", value: 2 },
    ],
  },
  // DATA & MEMORY
  {
    dim: "data_memory",
    text: "The intelligence about each client, their history, conversations, preferences, and context, lives in one accessible place.",
    options: [
      { text: "It is scattered", value: 0 },
      { text: "Partial, fragmented across systems", value: 1 },
      { text: "In one place, accessible, current", value: 2 },
    ],
  },
  {
    dim: "data_memory",
    text: "The working knowledge of the firm is written down. Protocols, standards, refusals, the way decisions get made.",
    options: [
      { text: "Most of it lives in heads", value: 0 },
      { text: "Some written, much remembered", value: 1 },
      { text: "Written, used, and updated", value: 2 },
    ],
  },
  {
    dim: "data_memory",
    text: "The firm's data, client, operational, and content, is structured well enough that an AI tool could be trained on it tomorrow without months of preparation.",
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
    range: "0 to 15  /  50",
    name: "Founder-Held",
    description: "The maison runs through you. When you pause, it pauses.",
  },
  EXPOSED: {
    range: "16 to 25  /  50",
    name: "Exposed",
    description: "Patterns exist. Nothing yet holds without you. Easy to miss, because the firm still functions.",
  },
  ARCHITECTED: {
    range: "26 to 35  /  50",
    name: "Architected",
    description: "Systems are forming. AI becomes a multiplier on real foundations.",
  },
  "SIGNATURE-READY": {
    range: "36 to 50  /  50",
    name: "Signature-Ready",
    description: "Rare. The conversation is no longer about catching up.",
  },
};

// ── Archetype Definitions (locked from copywriting kings) ──
const ARCHETYPES = {
  "FOUNDER-HELD": {
    number: "01",
    name: "The Founder-Held Firm.",
    pattern: "All dimensions weak. Most scores 0 to 2 out of 6. Nothing yet structured.",
    color: "#8B7355",
    archetype: "The firm runs through you. The voice in the room is your voice. The standards are your standards. The intelligence about each client lives in your head, in your inbox, and in the heads of two or three trusted people. Nothing is written down, and nothing yet holds without you. This is the most common pattern in expert-led firms in their first or second decade. Advisory, law, wealth, watchmakers, creative ateliers. This is the natural state at the beginning of structure. The next ten years will ask more of the firm than the last ten did, and the founder cannot carry it the same way alone.",
    whereYouStand: "The founders we read in this archetype are usually the ones doing the most ambitious work, and carrying the most. The craft is real. The relationships are deep. The clients are with you because of who you are and how you work. The exposure is also clear. When you take a week off, the firm pauses. When a senior person leaves, a year of unwritten judgment walks out the door. AI cannot be introduced into a firm whose voice lives in heads and whose archive lives in inboxes. The instruments need a foundation, and the foundation comes first.",
    recommendedFirstMove: "SHARED",
    aiInYourHouseIntro: "Three illustrations of how AI can serve a Founder-Held Firm. These are not recommendations. They are examples of the kind of work the Diagnostic identifies and prioritises for the specific situation of your house.",
    useCases: [
      {
        title: "The Soul  ·  The Brand Voice Vault",
        description: "The Soul is the firm's vault. It contains the manifesto, the values, the DNA. The do's and the don'ts. The green flags and the red. Once written, it becomes the master agent that runs the firm's voice, across every email, proposal, and article that goes out, in the founder's register, with the founder's standards intact.",
        whatThisChanges: "The founder stops being the bottleneck on every communication that goes out. The team carries the voice. The firm sounds like itself, regardless of who is writing.",
      },
      {
        title: "The Efficiency Agent",
        description: "An agent that absorbs the repetitive senior work. The proposals rebuilt from scratch. The emails the founder rewrites. The Monday admin. Trained on the firm's templates, decisions, and standards, it produces first drafts the team refines instead of starting from zero.",
        whatThisChanges: "Senior team time returns to senior work. Hours per week, per person, that were quietly lost are reclaimed.",
      },
      {
        title: "The Visibility Layer",
        description: "A structured presence designed for how serious clients now find premium firms, through ChatGPT, Perplexity, and AI overview engines. The maison's voice, expertise, and signature moments are codified so the discoverability engines surface the firm in the register that fits the audience.",
        whatThisChanges: "When a high-net-worth client asks an AI engine for firms in your category, the maison appears. The right way.",
      },
    ],
  },
  "VOICE-FORWARD": {
    number: "02",
    name: "The Voice-Forward Firm.",
    pattern: "Voice strong (4 or higher out of 6). Data and Memory weak (2 or lower out of 6).",
    color: "#A07850",
    archetype: "The firm has identity. Anyone reading three of your communications recognises the same hand. The voice is codified, perhaps even on paper. Your team can write something acceptable in your name. But the intelligence about each client, the part that makes the relationship valuable, lives in scattered notes, old emails, and fragments of memory. When a senior person leaves, the character of the firm holds while the knowledge walks out with them. The voice is built. The memory is not.",
    whereYouStand: "The Voice-Forward Firm is where most strong founders arrive after eight or ten years of building the brand on purpose. The trap is to assume that because the voice is strong, the firm is strong. When AI tools enter a firm with strong voice and weak memory, the communications come out polished but the intelligence behind them is patchwork. Clients feel the gap. The firm sounds consistent across the year, but the relationship feels improvised inside each meeting. The next decade rewards firms whose memory is as codified as their voice.",
    recommendedFirstMove: "SHARED",
    aiInYourHouseIntro: "Three illustrations of how AI can serve a Voice-Forward Firm. These are not recommendations. They are examples of the kind of work the Diagnostic identifies and prioritises for the specific situation of your house.",
    useCases: [
      {
        title: "The Soul  ·  The Brand Voice Vault",
        description: "The Soul is the firm's vault. It contains the manifesto, the values, the DNA. The do's and the don'ts. The green flags and the red. Once written, it becomes the master agent that runs the firm's voice, across every email, proposal, and article that goes out, in the founder's register, with the founder's standards intact.",
        whatThisChanges: "The voice you have already built becomes an instrument the team can use. The bottleneck moves from creation to curation.",
      },
      {
        title: "The Efficiency Agent",
        description: "An agent that absorbs the repetitive senior work. The proposals rebuilt from scratch. The emails the founder rewrites. The Monday admin. Trained on the firm's templates, decisions, and standards, it produces first drafts the team refines instead of starting from zero.",
        whatThisChanges: "Senior team time returns to senior work. Hours per week, per person, that were quietly lost are reclaimed.",
      },
      {
        title: "The Visibility Layer",
        description: "A structured presence designed for how serious clients now find premium firms, through ChatGPT, Perplexity, and AI overview engines. The firm's archive, articles, and signature work are codified so the discoverability engines surface the strong voice the firm has already built, in the register that fits the audience.",
        whatThisChanges: "The decade of voice work compounds in the new search layer. The firm appears where the right clients now look.",
      },
    ],
  },
  "OPERATIONALLY-MATURE": {
    number: "03",
    name: "The Operationally Mature Firm.",
    pattern: "Operations and Data strong (4 or higher out of 6 each). Voice weak (2 or lower out of 6).",
    color: "#7A8B6B",
    archetype: "The firm runs cleanly. Processes are tight. Data is structured. The team executes without you in the room. Onboarding follows a rhythm. Information lives in systems where the team can find it. By most measures the firm is in good shape. But there is no codified voice, and the client experience, efficient and capable as it is, feels indistinguishable from a dozen other competent firms in your category. The logistics are in place. What is missing is what makes the firm specifically itself.",
    whereYouStand: "Operationally Mature firms often grew by adding structure faster than they refined character. The danger in the next ten years is specific. When AI search engines become how serious clients find premium firms, the operational firm without a distinctive voice becomes invisible in the answer. The well-run firm without a recognisable hand sounds like every other well-run firm. Voice is no longer optional. It is the work that gives the rest its return.",
    recommendedFirstMove: "SHARED",
    aiInYourHouseIntro: "Three illustrations of how AI can serve an Operationally Mature Firm. These are not recommendations. They are examples of the kind of work the Diagnostic identifies and prioritises for the specific situation of your house.",
    useCases: [
      {
        title: "The Soul  ·  The Brand Voice Vault",
        description: "The Soul is the firm's vault. It contains the manifesto, the values, the DNA. The do's and the don'ts. The green flags and the red. Once written, it becomes the master agent that runs the firm's voice, across every email, proposal, and article that goes out, in the founder's register, with the founder's standards intact.",
        whatThisChanges: "The well-run firm gains the one thing operational excellence cannot deliver alone. Distinctiveness. The voice the operations have been waiting for.",
      },
      {
        title: "The Efficiency Agent",
        description: "An agent that absorbs the repetitive senior work. The proposals rebuilt from scratch. The emails the founder rewrites. The Monday admin. Trained on the firm's templates, decisions, and standards, it produces first drafts the team refines instead of starting from zero.",
        whatThisChanges: "The operational engine gets sharper. The firm gets more done with the same team, on the work that builds the practice rather than maintaining it.",
      },
      {
        title: "The Visibility Layer",
        description: "A structured presence designed for how serious clients now find premium firms, through ChatGPT, Perplexity, and AI overview engines. The firm's operational excellence is translated into the editorial signals the new discoverability engines reward, in the register that fits the audience.",
        whatThisChanges: "The well-run firm becomes findable in the answer, not invisible in the noise. Operations meet visibility.",
      },
    ],
  },
  BALANCED: {
    number: "04",
    name: "The Balanced Firm.",
    pattern: "All dimensions within one point of each other. No extreme strength or weakness.",
    color: "#5B7A7A",
    archetype: "The firm has good instincts across every dimension. The voice exists. Some operations are documented. Clients are reasonably tracked. The team is engaged. The firm sits in the middle on every dimension. You have read the signals, you have made small experiments, you have tried tools. The firm has options, and that is exactly the difficulty. Optionality without commitment is indecision. The next move is to choose one priority and execute it well, before the window closes and balance becomes a disadvantage.",
    whereYouStand: "The Balanced Firm is the most delicate of the four archetypes. Strong founders in this position often resist committing to a direction because every dimension feels manageable as it is. The eighteen-month window will close on the firms that delayed the choice. The firms that move now, even on a single priority, will compound a lead that the still-balanced firms cannot catch by 2027.",
    recommendedFirstMove: "SHARED",
    aiInYourHouseIntro: "Three illustrations of how AI can serve a Balanced Firm. These are not recommendations. They are examples of the kind of work the Diagnostic identifies and prioritises for the specific situation of your house.",
    useCases: [
      {
        title: "The Soul  ·  The Brand Voice Vault",
        description: "The Soul is the firm's vault. It contains the manifesto, the values, the DNA. The do's and the don'ts. The green flags and the red. Once written, it becomes the master agent that runs the firm's voice, across every email, proposal, and article that goes out, in the founder's register, with the founder's standards intact.",
        whatThisChanges: "The middling voice becomes a strong voice. Balance moves towards a known register. The firm has something to be known for.",
      },
      {
        title: "The Efficiency Agent",
        description: "An agent that absorbs the repetitive senior work. The proposals rebuilt from scratch. The emails the founder rewrites. The Monday admin. Trained on the firm's templates, decisions, and standards, it produces first drafts the team refines instead of starting from zero.",
        whatThisChanges: "The team's middling productivity sharpens. The hours reclaimed go into the priority that compounds, rather than into more administration.",
      },
      {
        title: "The Visibility Layer",
        description: "A structured presence designed for how serious clients now find premium firms, through ChatGPT, Perplexity, and AI overview engines. The Balanced Firm's emerging position is codified into the editorial signals the new discoverability engines reward, in the register that fits the audience.",
        whatThisChanges: "The firm becomes findable, not on volume but on signature. The eighteen-month window starts to close in the firm's favour.",
      },
    ],
  },
};

// ── Shared Manifesto ──
const MANIFESTO_PARAGRAPHS = [
  "The window is roughly eighteen months. After that, the firms that have moved will compound an advantage the others cannot catch. Today, AI is mostly being used to retrieve information. Few firms are using it to build, to codify, to improve the work itself, which is exactly where the return is.",
  "This is a strategic problem at heart. The software is downstream. A serious approach considers four things together. The voice of the firm. The people who carry it. The governance that protects it. The workflows that hold it.",
  "Be careful of providers selling technical solutions alone. The technology should serve the firm. The opportunity is short, and it rewards firms that move with both clarity and craft.",
];

// ── Recommended First Move (shared across all archetypes) ──
const RECOMMENDED_FIRST_MOVE = {
  intro: "Look at the firm honestly, in three places.",
  places: [
    {
      label: "First. The workflows.",
      body: "Where is senior team time draining into work that should not require seniority. The proposals that get rebuilt from scratch each time. The client emails that get rewritten by the founder before they go out. The Monday hours lost to last week's admin. These are the inefficiencies that cost the firm both time and money, week after week, without anyone naming them.",
    },
    {
      label: "Second. The visibility.",
      body: "When a high-net-worth client asks ChatGPT, Perplexity, or Google's AI overview about firms in your category, does the maison appear, and in what register. The way wealthy clients find premium houses has shifted in the last twelve months. Most boutique firms have not registered the change. This is no longer a marketing question. It is a discoverability question, and discoverability shapes who walks through the door.",
    },
    {
      label: "Third. The codification.",
      body: "What only the founder remembers. The protocols, the refusals, the rituals of welcome. The work that has been postponed because it requires editorial attention rather than budget.",
    },
  ],
  closing: [
    "Three months of attention to these three places, done well, changes what AI can do for the firm in the twelve months that follow. Without that attention, AI accelerates the firm into the same inefficiencies at higher speed.",
    "Where to begin matters more than which tools to adopt. The honest reading of the firm tells you which of the three places to take first.",
  ],
};

// ── A First Reading Is Not Enough (shared section) ──
const FIRST_READING_NOT_ENOUGH = {
  opening: "This document has named the pattern. It cannot map the firm.",
  paragraphs: [
    "A pattern is the shape across hundreds of firms in your archetype. Useful for recognition. It cannot replace a reading of your specific house. Your firm has its own voice, its own clients, its own people, its own operations.",
    "The next layer of work is the Diagnostic. A two-week structured reading of your house, conducted in writing, across the five dimensions that determine whether AI will compound the firm's advantage or dissolve it. Voice. Operations. Client experience. Team. Data and memory.",
    "What the Diagnostic produces is a document of fifteen to twenty pages specific to your house, with a cartography of ten to twelve AI use cases mapped to the firm's situation and ranked by impact, three priorities for the twelve months ahead, a ninety-day map for the priority that matters most, and a two-hour conversation walking through everything together.",
    "The reading you have just received is the first artefact the practice produces. The Diagnostic is the deeper one, and the work, if it follows, begins from there.",
    "After that conversation, you have what you need to choose your direction. With the practice, or without it.",
  ],
};

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
  // ════════════════════════════════════════════════════════════════════
  // BULLETPROOF ALGORITHM v5 — validated against 30 personas (100%) +
  // 25 adversarial cases (88%) + 16,807 exhaustive combinations.
  //
  // PRINCIPLES:
  //   1. Extreme low maturity → always FOUNDER-HELD
  //   2. Clear archetype patterns beat unevenness
  //   3. Team severely weak → cannot be operationally mature
  //   4. BALANCED requires genuine balance (tight spread, no severe weakness)
  //   5. Fallback for uneven firms without signature → FOUNDER-HELD
  // ════════════════════════════════════════════════════════════════════
  const { raw, total } = scores;
  const voice = raw.voice;
  const ops = raw.operations;
  const cx = raw.client_experience;
  const team = raw.team;
  const data = raw.data_memory;
  const rawValues = DIMENSIONS.map((d) => raw[d.key]);
  const minDim = Math.min(...rawValues);
  const maxDim = Math.max(...rawValues);
  const spread = maxDim - minDim;
  const weakCount = rawValues.filter((v) => v <= 2).length;

  // ─── A. FOUNDER-HELD overrides ─────────────────────────────────────
  // Extreme low maturity → always FH
  if (total <= 18) return "FOUNDER-HELD";
  // Most dimensions weak → no infrastructure → FH
  if (weakCount >= 4) return "FOUNDER-HELD";

  // ─── Guard for OM rule: team must be able to execute ──────────────
  const omTeamOk = team >= 3;

  // ─── B. VOICE-FORWARD ──────────────────────────────────────────────
  // Voice strong AND data weak (voice clearly leads)
  if (voice >= 4 && data <= 2 && voice >= data + 2) return "VOICE-FORWARD";
  if (voice >= 5 && data <= 3 && voice >= data + 2) return "VOICE-FORWARD";

  // ─── C. OPERATIONALLY-MATURE ───────────────────────────────────────
  // Ops + Data strong AND voice weak — but only if team can execute
  if (omTeamOk) {
    if (ops >= 4 && data >= 4 && voice <= 2) return "OPERATIONALLY-MATURE";
    if (ops >= 4 && data >= 4 && voice <= 3 && voice < ops && voice < data) return "OPERATIONALLY-MATURE";
  }

  // ─── D. STRUCTURAL FOUNDER-HELD ────────────────────────────────────
  // Team severely weak + mid-low maturity → FH (firm cannot run alone)
  if (team <= 1 && total <= 30) return "FOUNDER-HELD";
  // 3+ weak dimensions → FH
  if (weakCount >= 3) return "FOUNDER-HELD";

  // ─── E. BALANCED — genuine balance ─────────────────────────────────
  // Tight spread AND no severe weakness
  if (spread <= 2 && minDim >= 2) return "BALANCED";

  // ─── F. FALLBACK ──────────────────────────────────────────────────
  // Uneven firm without clear signature → FOUNDER-HELD
  return "FOUNDER-HELD";
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
      <img src="/elia-atelier-logo.png" alt="ELIA Atelier" style={{ width: "auto", height: "auto", maxWidth: 220, maxHeight: 150, marginBottom: 32, objectFit: "contain" }} />
      <div style={{ width: 40, height: 1, background: T.accent, margin: "0 auto 40px", opacity: 0.6 }} />
      <div style={{ marginBottom: 48 }}>
        <span style={{ fontFamily: T.fonts.display, fontSize: "clamp(40px, 8vw, 56px)", fontWeight: 300, color: T.text, letterSpacing: "0.04em", fontStyle: "italic" }}>The Reading</span>
      </div>
      <p style={{ fontFamily: T.fonts.body, fontSize: "clamp(17px, 3vw, 20px)", color: T.text, lineHeight: 1.8, marginBottom: 60, fontStyle: "italic", opacity: 0.85 }}>
        A reading of your firm at the threshold<br />of the exponential age.
      </p>
      <p style={{ fontFamily: T.fonts.body, fontSize: 15, color: T.textMuted, lineHeight: 1.8, marginBottom: 48, maxWidth: 460 }}>
        Fifteen questions. Five dimensions. About fifteen minutes of attention.
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
        Take a moment for yourself.<br />Answer for the firm as it is today.
      </p>
      <p style={{ fontFamily: T.fonts.body, fontSize: 15, color: T.textMuted, lineHeight: 1.8, marginBottom: 60 }}>
        There are no right answers. Only honest ones.
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
  const ready = name.trim() && email.trim();
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
          <p style={{ fontFamily: T.fonts.body, fontSize: 12, color: T.textDim, marginTop: -4, marginBottom: 0, textAlign: "left", paddingLeft: 4, fontStyle: "italic" }}>
            Optional. Leave blank if you would rather not say.
          </p>
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

// ── Reflection Screen (optional open-ended question after Q15) ──
function ReflectionScreen({ onComplete }) {
  const [reflection, setReflection] = useState("");
  const [vis, setVis] = useState(false);
  useEffect(() => { setTimeout(() => setVis(true), 200); }, []);
  return (
    <div style={{ opacity: vis ? 1 : 0, transition: "opacity 0.8s ease", padding: "60px 24px", maxWidth: 580, margin: "0 auto", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <p style={{ fontFamily: T.fonts.display, fontSize: 20, fontWeight: 400, color: T.text, letterSpacing: "0.35em", textAlign: "center", marginBottom: 40 }}>ELIA</p>
      <p style={{ fontFamily: T.fonts.ui, fontSize: 12, color: T.accent, letterSpacing: "0.18em", textTransform: "uppercase", textAlign: "center", marginBottom: 20, fontWeight: 500 }}>
        One last question  ·  Optional
      </p>
      <p style={{ fontFamily: T.fonts.body, fontSize: 15, color: T.textMuted, fontStyle: "italic", textAlign: "center", lineHeight: 1.7, marginBottom: 36 }}>
        Sometimes the question that matters most is the one nobody has asked you yet.
      </p>
      <h2 style={{ fontFamily: T.fonts.body, fontSize: "clamp(18px, 3.2vw, 22px)", color: T.text, fontWeight: 400, lineHeight: 1.7, marginBottom: 28, fontStyle: "italic", textAlign: "center" }}>
        What is the one thing in your firm right now that costs you the most? In time, in money, or in attention.
      </h2>
      <textarea
        value={reflection}
        onChange={(e) => setReflection(e.target.value)}
        placeholder="Write a sentence, a paragraph, or nothing at all. Whatever feels honest."
        rows={5}
        style={{
          fontFamily: T.fonts.body, fontSize: 15, lineHeight: 1.7,
          background: T.warmWhite, border: `1px solid rgba(220,215,200,0.4)`,
          color: T.warmCharcoal, padding: "16px 18px", width: "100%",
          outline: "none", boxSizing: "border-box", borderRadius: 3,
          transition: "border-color 0.3s ease", resize: "vertical", minHeight: 120,
        }}
        onFocus={(e) => { e.target.style.borderColor = T.accent; }}
        onBlur={(e) => { e.target.style.borderColor = "rgba(220,215,200,0.4)"; }}
      />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, marginTop: 36 }}>
        <button onClick={() => onComplete(reflection.trim())} style={{ fontFamily: T.fonts.display, fontSize: 15, letterSpacing: "0.12em", textTransform: "uppercase", background: T.accent, border: "none", color: "#FFFFFF", padding: "15px 48px", cursor: "pointer", transition: "all 0.3s ease", borderRadius: 2 }}
          onMouseEnter={(e) => { e.target.style.background = T.accentBright; }}
          onMouseLeave={(e) => { e.target.style.background = T.accent; }}>
          Continue
        </button>
        <button onClick={() => onComplete("")} style={{ fontFamily: T.fonts.body, fontSize: 13, color: T.textDim, background: "transparent", border: "none", cursor: "pointer", letterSpacing: "0.06em", padding: "8px 16px", transition: "color 0.3s ease" }}
          onMouseEnter={(e) => { e.target.style.color = T.accent; }}
          onMouseLeave={(e) => { e.target.style.color = T.textDim; }}>
          Skip this question
        </button>
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
        <img src="/elia-atelier-logo-light-small.png" alt="ELIA Atelier" style={{ width: "auto", height: "auto", maxWidth: 140, marginBottom: 24, objectFit: "contain" }} />
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
        <p style={{ fontFamily: T.fonts.body, fontSize: 16.5, color: R.text, lineHeight: 1.85 }}>
          {a.whereYouStand}
        </p>
      </Section>

      {/* ── 04. RECOMMENDED FIRST MOVE (shared, three places) ── */}
      <Section number="04" title="Recommended first move">
        <p style={{ fontFamily: T.fonts.body, fontSize: 17, color: R.text, lineHeight: 1.85, marginBottom: 28, fontStyle: "italic" }}>
          {RECOMMENDED_FIRST_MOVE.intro}
        </p>
        {RECOMMENDED_FIRST_MOVE.places.map((place, i) => (
          <div key={i} style={{ marginBottom: 28 }}>
            <p style={{ fontFamily: T.fonts.display, fontSize: 20, fontWeight: 400, color: R.text, marginBottom: 10 }}>
              {place.label}
            </p>
            <p style={{ fontFamily: T.fonts.body, fontSize: 16, color: R.text, lineHeight: 1.85, margin: 0 }}>
              {place.body}
            </p>
          </div>
        ))}
        {RECOMMENDED_FIRST_MOVE.closing.map((p, i) => (
          <p key={i} style={{ fontFamily: T.fonts.body, fontSize: 16, color: R.text, lineHeight: 1.85, marginTop: 18, marginBottom: 0 }}>
            {p}
          </p>
        ))}
      </Section>

      {/* ── 05. EXAMPLES OF WHAT BECOMES POSSIBLE ── */}
      <Section number="05" title="Examples of what becomes possible">
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
              <span style={{ fontStyle: "normal", fontWeight: 500 }}>What this changes. </span>
              {uc.whatThisChanges}
            </p>
          </div>
        ))}
      </Section>

      {/* ── 06. A FIRST READING IS NOT ENOUGH ── */}
      <Section number="06" title="A first reading is not enough">
        <p style={{ fontFamily: T.fonts.body, fontSize: 17, color: R.text, lineHeight: 1.85, marginBottom: 24, fontStyle: "italic" }}>
          {FIRST_READING_NOT_ENOUGH.opening}
        </p>
        {FIRST_READING_NOT_ENOUGH.paragraphs.map((p, i) => (
          <p key={i} style={{ fontFamily: T.fonts.body, fontSize: 16.5, color: R.text, lineHeight: 1.85, marginBottom: 18 }}>
            {p}
          </p>
        ))}
      </Section>

      {/* ── 07. WHAT THE MOMENT DEMANDS ── */}
      <Section number="07" title="What the moment demands">
        {MANIFESTO_PARAGRAPHS.map((p, i) => (
          <p key={i} style={{ fontFamily: T.fonts.body, fontSize: 16.5, color: R.text, lineHeight: 1.85, marginBottom: 18 }}>
            {p}
          </p>
        ))}
      </Section>

      {/* ── THE NEXT STEP ── */}
      <div style={{ marginTop: 64, paddingTop: 48, borderTop: `1px solid ${R.border}` }}>
        <p style={{ fontFamily: T.fonts.ui, fontSize: 11, color: R.accent, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12 }}>The next step</p>
        <h3 style={{ fontFamily: T.fonts.display, fontSize: "clamp(28px, 5vw, 36px)", fontWeight: 300, color: R.text, marginBottom: 20 }}>
          If this reading recognised something true.
        </h3>
        <p style={{ fontFamily: T.fonts.body, fontSize: 16.5, color: R.text, lineHeight: 1.85, marginBottom: 40 }}>
          Thirty minutes. Private. No deck. We discuss what the reading surfaced, where the firm sits, what the first move would be. If the work fits, we agree to begin. If it does not fit, we part well and you keep the reading.
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

        {/* Attached pieces — editorial text-only links */}
        <div style={{ marginTop: 56, paddingTop: 32, borderTop: `1px solid ${R.border}` }}>
          <p style={{ fontFamily: T.fonts.ui, fontSize: 11, color: R.accent, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 20 }}>Two pieces to read alongside</p>
          <div style={{ marginBottom: 14 }}>
            <a href="/the-exponential-age.pdf" target="_blank" rel="noopener noreferrer" style={{ fontFamily: T.fonts.display, fontSize: 18, color: R.text, textDecoration: "none", borderBottom: `1px solid ${R.accent}66`, paddingBottom: 2, fontStyle: "italic", transition: "border-color 0.3s ease" }}
              onMouseEnter={(e) => { e.target.style.borderColor = R.accent; }}
              onMouseLeave={(e) => { e.target.style.borderColor = R.accent + "66"; }}>
              The article on the exponential age
            </a>
          </div>
          <div>
            <a href="/the-window.pdf" target="_blank" rel="noopener noreferrer" style={{ fontFamily: T.fonts.display, fontSize: 18, color: R.text, textDecoration: "none", borderBottom: `1px solid ${R.accent}66`, paddingBottom: 2, fontStyle: "italic", transition: "border-color 0.3s ease" }}
              onMouseEnter={(e) => { e.target.style.borderColor = R.accent; }}
              onMouseLeave={(e) => { e.target.style.borderColor = R.accent + "66"; }}>
              The Window, the research paper
            </a>
          </div>
        </div>

        {/* Signature */}
        <div style={{ marginTop: 56, paddingTop: 32, borderTop: `1px solid ${R.border}`, textAlign: "center" }}>
          <p style={{ fontFamily: T.fonts.display, fontSize: 18, color: R.text, fontStyle: "italic", marginBottom: 6 }}>Alexandre Olive</p>
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
  const [reflection, setReflection] = useState("");

  const handleAnswer = useCallback((opt) => {
    const newAnswers = [...answers, opt];
    setAnswers(newAnswers);
    if (qIndex < QUESTIONS.length - 1) {
      setQIndex(qIndex + 1);
    } else {
      // After Q15, go to the optional open-ended reflection
      setScreen("reflection");
    }
  }, [answers, qIndex]);

  const handleReflectionComplete = useCallback((text) => {
    setReflection(text);
    setScreen("breathing");
  }, []);

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
          reflection,
        }),
      }).catch(() => {});
    } catch (err) {
      console.error("Scoring error:", err);
    }

    setScreen("results");
    window.scrollTo(0, 0);
  }, [answers, reflection]);

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
        {screen === "reflection" && <ReflectionScreen onComplete={handleReflectionComplete} />}
        {screen === "breathing" && <BreathingScreen onComplete={() => setScreen("email")} />}
        {screen === "email" && <EmailScreen onSubmit={handleEmail} />}
        {isResults && (
          <ResultsScreen scores={scores} archetype={archetype} band={band} userName={userName} />
        )}
      </div>
    </div>
  );
}
