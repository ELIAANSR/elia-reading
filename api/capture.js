// ═══════════════════════════════════════════
// THE READING — Capture API (Vercel Serverless)
// Saves to Google Sheets + Sends results email via Resend + Pushes to Kajabi via Zapier
// Mirrors the ANSR Pulse capture pattern exactly.
// ═══════════════════════════════════════════

// ── Archetype Email Data ──
const ARCHETYPE_EMAIL_DATA = {
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

const MANIFESTO_PARAGRAPHS = [
  "The window is roughly eighteen months. After that, the firms that have moved will compound an advantage the others cannot catch. Today, AI is mostly being used to retrieve information. Few firms are using it to build, to codify, to improve the work itself, which is exactly where the return is.",
  "This is a strategic problem at heart. The software is downstream. A serious approach considers four things together. The voice of the firm. The people who carry it. The governance that protects it. The workflows that hold it.",
  "Be careful of providers selling technical solutions alone. The technology should serve the firm. The opportunity is short, and it rewards firms that move with both clarity and craft.",
];

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

const DIMENSION_LABELS = {
  voice: "Voice",
  operations: "Operations",
  client_experience: "Client Experience",
  team: "Team",
  data_memory: "Data & Memory",
};

const CALENDLY_URL = "https://calendly.com/alexandre_elia/ai_conversation";
const SITE_URL = process.env.SITE_URL || "https://reading.eliaatelier.ch";

function escapeHtml(s) {
  if (!s) return "";
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

// ── Build the HTML email (matches Pulse dark luxury aesthetic) ──
function buildEmail(data) {
  const a = ARCHETYPE_EMAIL_DATA[data.archetype] || ARCHETYPE_EMAIL_DATA["BALANCED"];
  const firstName = data.name ? data.name.split(" ")[0] : "";
  const total = data.scores?.total ?? 0;
  const bandLabel = data.band ? data.band.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "";

  // Dimension rows
  let dimensionRows = "";
  if (data.scores?.normalized) {
    Object.entries(data.scores.normalized).forEach(([key, score]) => {
      const label = DIMENSION_LABELS[key] || key;
      const pct = (score / 10) * 100;
      dimensionRows += `
        <tr><td style="padding: 6px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-family: 'EB Garamond', Georgia, serif; font-size: 13px; color: #2C2C2C; padding-right: 12px; width: 130px;">${label}</td>
              <td style="width: 100%;">
                <div style="position: relative; height: 1px; background: rgba(44,44,44,0.10);">
                  <div style="position: absolute; left: 0; top: 0; height: 1px; background: #B07D62; width: ${pct}%;"></div>
                </div>
              </td>
              <td align="right" style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 13px; color: #6B6560; padding-left: 12px; white-space: nowrap;">${score} / 10</td>
            </tr>
          </table>
        </td></tr>`;
    });
  }

  // Use cases
  const useCasesHtml = a.useCases.map((uc) => `
    <tr><td style="padding: 0 0 32px;">
      <h3 style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 22px; font-weight: 400; color: #2C2C2C; margin: 0 0 14px;">${escapeHtml(uc.title)}</h3>
      <p style="font-family: 'EB Garamond', Georgia, serif; font-size: 16px; color: #2C2C2C; line-height: 1.8; margin: 0 0 16px;">${escapeHtml(uc.description)}</p>
      <p style="font-family: 'EB Garamond', Georgia, serif; font-size: 14px; color: #B5894A; font-style: italic; line-height: 1.7; padding-left: 14px; border-left: 2px solid rgba(181,137,74,0.4); margin: 0;">
        <span style="font-style: normal; font-weight: 500;">What this changes. </span>${escapeHtml(uc.whatThisChanges)}
      </p>
    </td></tr>`).join("");

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>Your Reading from ELIA Atelier</title></head>
<body style="margin: 0; padding: 0; background: #FAF5EE; font-family: 'EB Garamond', Georgia, serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #FAF5EE;">
<tr><td align="center" style="padding: 48px 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background: #FFFFFF;">
<tr><td style="padding: 56px 40px;">

  <!-- Header -->
  <div style="text-align: center; margin-bottom: 48px;">
    <p style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 24px; color: #2C2C2C; letter-spacing: 0.3em; margin: 0 0 6px;">ELIA</p>
    <p style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 11px; color: #B07D62; letter-spacing: 0.3em; text-transform: uppercase; margin: 0 0 24px;">Atelier</p>
    <p style="font-family: 'DM Sans', sans-serif; font-size: 11px; color: #B07D62; letter-spacing: 0.18em; text-transform: uppercase; margin: 0 0 8px;">The Reading</p>
    ${firstName ? `<p style="font-family: 'EB Garamond', Georgia, serif; font-size: 14px; color: #6B6560; font-style: italic; margin: 0;">for ${escapeHtml(firstName)}</p>` : ""}
  </div>

  <!-- 01 SCORE -->
  <p style="font-family: 'DM Sans', sans-serif; font-size: 11px; color: #B07D62; letter-spacing: 0.18em; text-transform: uppercase; margin: 0 0 20px;">01 &middot; The score</p>
  <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 0 20px;">
    <tr>
      <td style="vertical-align: bottom; padding-right: 24px;">
        <span style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 64px; font-weight: 300; color: #2C2C2C; line-height: 1;">${total}</span>
        <span style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 24px; color: #6B6560; margin-left: 4px;">/ 50</span>
      </td>
      <td style="vertical-align: bottom;">
        <p style="font-family: 'DM Sans', sans-serif; font-size: 11px; color: #B07D62; letter-spacing: 0.18em; text-transform: uppercase; margin: 0 0 4px;">Maturity band</p>
        <p style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 22px; color: #2C2C2C; margin: 0;">${escapeHtml(bandLabel)}</p>
      </td>
    </tr>
  </table>

  <p style="font-family: 'DM Sans', sans-serif; font-size: 11px; color: #B07D62; letter-spacing: 0.18em; text-transform: uppercase; margin: 32px 0 16px;">By dimension</p>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${dimensionRows}</table>

  <hr style="border: 0; border-top: 1px solid rgba(44,44,44,0.10); margin: 48px 0;" />

  <!-- 02 ARCHETYPE -->
  <p style="font-family: 'DM Sans', sans-serif; font-size: 11px; color: #B07D62; letter-spacing: 0.18em; text-transform: uppercase; margin: 0 0 8px;">02 &middot; The archetype</p>
  <p style="font-family: 'DM Sans', sans-serif; font-size: 11px; color: #B07D62; letter-spacing: 0.18em; text-transform: uppercase; margin: 0 0 4px;">Archetype ${a.number}</p>
  <h2 style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 36px; font-weight: 300; color: #2C2C2C; margin: 0 0 24px;">${escapeHtml(a.name)}</h2>

  <p style="font-family: 'DM Sans', sans-serif; font-size: 11px; color: #B07D62; letter-spacing: 0.18em; text-transform: uppercase; margin: 0 0 8px;">Pattern</p>
  <p style="font-family: 'EB Garamond', Georgia, serif; font-size: 15px; color: #6B6560; font-style: italic; margin: 0 0 28px;">${escapeHtml(a.pattern)}</p>

  <!-- THE CREAM BLOCK — most important visual element -->
  <div style="background: #F4F1EA; padding: 30px 32px; margin: 0 0 24px;">
    <p style="font-family: 'EB Garamond', Georgia, serif; font-size: 17px; color: #2C2C2C; line-height: 1.85; margin: 0;">${escapeHtml(a.archetype)}</p>
  </div>

  <hr style="border: 0; border-top: 1px solid rgba(44,44,44,0.10); margin: 48px 0;" />

  <!-- 03 WHERE YOU STAND -->
  <p style="font-family: 'DM Sans', sans-serif; font-size: 11px; color: #B07D62; letter-spacing: 0.18em; text-transform: uppercase; margin: 0 0 16px;">03 &middot; Where you stand</p>
  <p style="font-family: 'EB Garamond', Georgia, serif; font-size: 16.5px; color: #2C2C2C; line-height: 1.85; margin: 0;">${escapeHtml(a.whereYouStand)}</p>

  <hr style="border: 0; border-top: 1px solid rgba(44,44,44,0.10); margin: 48px 0;" />

  <!-- 04 RECOMMENDED FIRST MOVE -->
  <p style="font-family: 'DM Sans', sans-serif; font-size: 11px; color: #B07D62; letter-spacing: 0.18em; text-transform: uppercase; margin: 0 0 20px;">04 &middot; Recommended first move</p>
  <p style="font-family: 'EB Garamond', Georgia, serif; font-size: 17px; color: #2C2C2C; line-height: 1.85; font-style: italic; margin: 0 0 28px;">${escapeHtml(RECOMMENDED_FIRST_MOVE.intro)}</p>
  ${RECOMMENDED_FIRST_MOVE.places.map((place) => `
    <div style="margin-bottom: 28px;">
      <p style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 20px; font-weight: 400; color: #2C2C2C; margin: 0 0 10px;">${escapeHtml(place.label)}</p>
      <p style="font-family: 'EB Garamond', Georgia, serif; font-size: 16px; color: #2C2C2C; line-height: 1.85; margin: 0;">${escapeHtml(place.body)}</p>
    </div>
  `).join("")}
  ${RECOMMENDED_FIRST_MOVE.closing.map((p) => `<p style="font-family: 'EB Garamond', Georgia, serif; font-size: 16px; color: #2C2C2C; line-height: 1.85; margin: 18px 0 0;">${escapeHtml(p)}</p>`).join("")}

  <hr style="border: 0; border-top: 1px solid rgba(44,44,44,0.10); margin: 48px 0;" />

  <!-- 05 EXAMPLES OF WHAT BECOMES POSSIBLE -->
  <p style="font-family: 'DM Sans', sans-serif; font-size: 11px; color: #B07D62; letter-spacing: 0.18em; text-transform: uppercase; margin: 0 0 16px;">05 &middot; Examples of what becomes possible</p>
  <p style="font-family: 'EB Garamond', Georgia, serif; font-size: 15.5px; color: #6B6560; font-style: italic; line-height: 1.75; margin: 0 0 36px;">${escapeHtml(a.aiInYourHouseIntro)}</p>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${useCasesHtml}</table>

  <hr style="border: 0; border-top: 1px solid rgba(44,44,44,0.10); margin: 48px 0;" />

  <!-- 06 A FIRST READING IS NOT ENOUGH -->
  <p style="font-family: 'DM Sans', sans-serif; font-size: 11px; color: #B07D62; letter-spacing: 0.18em; text-transform: uppercase; margin: 0 0 20px;">06 &middot; A first reading is not enough</p>
  <p style="font-family: 'EB Garamond', Georgia, serif; font-size: 17px; color: #2C2C2C; line-height: 1.85; font-style: italic; margin: 0 0 24px;">${escapeHtml(FIRST_READING_NOT_ENOUGH.opening)}</p>
  ${FIRST_READING_NOT_ENOUGH.paragraphs.map((p) => `<p style="font-family: 'EB Garamond', Georgia, serif; font-size: 16.5px; color: #2C2C2C; line-height: 1.85; margin: 0 0 18px;">${escapeHtml(p)}</p>`).join("")}

  <hr style="border: 0; border-top: 1px solid rgba(44,44,44,0.10); margin: 48px 0;" />

  <!-- 07 WHAT THE MOMENT DEMANDS -->
  <p style="font-family: 'DM Sans', sans-serif; font-size: 11px; color: #B07D62; letter-spacing: 0.18em; text-transform: uppercase; margin: 0 0 20px;">07 &middot; What the moment demands</p>
  ${MANIFESTO_PARAGRAPHS.map((p) => `<p style="font-family: 'EB Garamond', Georgia, serif; font-size: 16.5px; color: #2C2C2C; line-height: 1.85; margin: 0 0 18px;">${escapeHtml(p)}</p>`).join("")}

  <hr style="border: 0; border-top: 1px solid rgba(44,44,44,0.10); margin: 56px 0 40px;" />

  <!-- THE NEXT STEP -->
  <p style="font-family: 'DM Sans', sans-serif; font-size: 11px; color: #B07D62; letter-spacing: 0.18em; text-transform: uppercase; margin: 0 0 12px;">The next step</p>
  <h3 style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 30px; font-weight: 300; color: #2C2C2C; margin: 0 0 20px;">If this reading recognised something true.</h3>
  <p style="font-family: 'EB Garamond', Georgia, serif; font-size: 16.5px; color: #2C2C2C; line-height: 1.85; margin: 0 0 40px;">Thirty minutes. Private. No deck. We discuss what the reading surfaced, where the firm sits, what the first move would be. If the work fits, we agree to begin. If it does not fit, we part well and you keep the reading.</p>

  <!-- Calendly — text only, centered, dark Cormorant. No button. -->
  <div style="text-align: center; margin: 48px 0;">
    <p style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 22px; font-weight: 300; color: #2C2C2C; margin: 0 0 12px;">Book a thirty-minute conversation</p>
    <a href="${CALENDLY_URL}" target="_blank" style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 18px; color: #2C2C2C; text-decoration: none; border-bottom: 1px solid rgba(176,125,98,0.4); padding-bottom: 2px;">${CALENDLY_URL.replace("https://", "")}</a>
  </div>

  <hr style="border: 0; border-top: 1px solid rgba(44,44,44,0.10); margin: 48px 0;" />

  <!-- Two pieces to read alongside — text-only links, editorial restraint -->
  <div style="margin: 0 0 40px;">
    <p style="font-family: 'DM Sans', sans-serif; font-size: 11px; color: #B07D62; letter-spacing: 0.18em; text-transform: uppercase; margin: 0 0 20px;">Two pieces to read alongside</p>
    <p style="margin: 0 0 14px;">
      <a href="${SITE_URL}/the-exponential-age.pdf" target="_blank" style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 18px; color: #2C2C2C; text-decoration: none; border-bottom: 1px solid rgba(176,125,98,0.4); padding-bottom: 2px; font-style: italic;">The article on the exponential age</a>
    </p>
    <p style="margin: 0;">
      <a href="${SITE_URL}/the-window.pdf" target="_blank" style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 18px; color: #2C2C2C; text-decoration: none; border-bottom: 1px solid rgba(176,125,98,0.4); padding-bottom: 2px; font-style: italic;">The Window, the research paper</a>
    </p>
  </div>

  <hr style="border: 0; border-top: 1px solid rgba(44,44,44,0.10); margin: 48px 0;" />

  <!-- Signature -->
  <div style="text-align: center;">
    <p style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 18px; color: #2C2C2C; font-style: italic; margin: 0 0 6px;">Alexandre Olive</p>
    <p style="font-family: 'EB Garamond', Georgia, serif; font-size: 14px; color: #6B6560; margin: 0 0 12px;">Founder, ELIA Atelier</p>
    <p style="font-family: 'EB Garamond', Georgia, serif; font-size: 13px; color: #9B9590; margin: 0;">alexandre@eliaatelier.ch &middot; eliaatelier.ch</p>
  </div>

  <!-- Footer -->
  <div style="margin-top: 48px; padding-top: 24px; text-align: center; border-top: 1px solid rgba(44,44,44,0.05);">
    <p style="font-family: 'EB Garamond', Georgia, serif; font-size: 12px; color: #9B9590; font-style: italic; margin: 0 0 4px;">ELIA Atelier is a practice of Uskale SA</p>
    <p style="font-family: 'EB Garamond', Georgia, serif; font-size: 12px; color: #9B9590; margin: 0;">Mallorca &middot; Switzerland &middot; 2026</p>
  </div>

</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

// ── Main handler ──
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const data = req.body;
  if (!data || !data.email) return res.status(400).json({ error: "Missing email" });

  const results = { sheet: false, email: false, zapier: false };

  // ═══ 1. SAVE TO GOOGLE SHEET ═══
  const SHEET_WEBHOOK = process.env.GOOGLE_SHEET_WEBHOOK;
  if (SHEET_WEBHOOK) {
    try {
      const sheetRes = await fetch(SHEET_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(data),
        redirect: "follow",
      });
      results.sheet = sheetRes.ok;
    } catch (e) {
      console.error("Sheet error:", e.message);
    }
  }

  // ═══ 2. PUSH TO KAJABI VIA ZAPIER ═══
  const ZAPIER_WEBHOOK = process.env.ZAPIER_WEBHOOK;
  if (ZAPIER_WEBHOOK) {
    try {
      const zapRes = await fetch(ZAPIER_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name || "",
          email: data.email || "",
          firm: data.firm || "",
          archetype: data.archetype || "",
          band: data.band || "",
          total: data.scores?.total ?? "",
          scores: data.scores || {},
          reflection: data.reflection || "",
        }),
      });
      results.zapier = zapRes.ok;
    } catch (e) {
      console.error("Zapier error:", e.message);
    }
  }

  // ═══ 3. SEND RESULTS EMAIL VIA RESEND ═══
  const RESEND_KEY = process.env.RESEND_API_KEY;
  const FROM = process.env.FROM_EMAIL || "Alexandre Olive <alexandre@eliaatelier.ch>";
  const NOTIFY = process.env.NOTIFY_EMAIL; // optional internal notification

  if (RESEND_KEY) {
    try {
      const archetypeData = ARCHETYPE_EMAIL_DATA[data.archetype] || ARCHETYPE_EMAIL_DATA["BALANCED"];
      const subject = `Your Reading. ${archetypeData.name.replace(/\.$/, "")}`;
      const emailHtml = buildEmail(data);

      // 3A — Send the actual reading to the prospect (clean, no reflection echoed back)
      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_KEY}`,
        },
        body: JSON.stringify({
          from: FROM,
          to: [data.email],
          subject,
          html: emailHtml,
          reply_to: "alexandre@eliaatelier.ch",
        }),
      });

      if (emailResponse.ok) {
        results.email = true;
      } else {
        const errText = await emailResponse.text();
        console.error("Resend error:", errText);
      }

      // 3B — Send a separate internal notification to Alexandre (includes reflection)
      if (NOTIFY) {
        const internalSubject = `[Reading] ${data.name || "Unknown"}  ·  ${archetypeData.name.replace(/\.$/, "")}  ·  ${data.scores?.total ?? "?"}/50`;
        const reflectionBlock = data.reflection
          ? `<div style="background:#F4F1EA;padding:24px;margin:20px 0;border-left:3px solid #B5894A;"><p style="margin:0 0 8px;font-family:'DM Sans',sans-serif;font-size:11px;color:#B07D62;letter-spacing:0.18em;text-transform:uppercase;">Their reflection</p><p style="margin:0;font-family:'EB Garamond',Georgia,serif;font-size:16px;line-height:1.7;color:#2C2C2C;font-style:italic;">"${escapeHtml(data.reflection)}"</p></div>`
          : `<p style="font-family:'EB Garamond',Georgia,serif;font-size:14px;color:#9B9590;font-style:italic;margin:20px 0;">They skipped the reflection question.</p>`;

        const internalHtml = `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#FAF5EE;font-family:'EB Garamond',Georgia,serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FAF5EE;"><tr><td align="center" style="padding:40px 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#FFFFFF;"><tr><td style="padding:40px;">
<p style="margin:0 0 8px;font-family:'DM Sans',sans-serif;font-size:11px;color:#B07D62;letter-spacing:0.18em;text-transform:uppercase;">New Reading delivered</p>
<h2 style="margin:0 0 24px;font-family:'Cormorant Garamond',Georgia,serif;font-size:28px;font-weight:300;color:#2C2C2C;">${escapeHtml(data.name || "Unknown")}</h2>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
<tr><td style="padding:6px 0;font-family:'EB Garamond',Georgia,serif;font-size:14px;color:#6B6560;width:120px;">Email</td><td style="padding:6px 0;font-family:'EB Garamond',Georgia,serif;font-size:14px;color:#2C2C2C;"><a href="mailto:${escapeHtml(data.email || "")}" style="color:#B07D62;">${escapeHtml(data.email || "Not provided")}</a></td></tr>
<tr><td style="padding:6px 0;font-family:'EB Garamond',Georgia,serif;font-size:14px;color:#6B6560;">Firm</td><td style="padding:6px 0;font-family:'EB Garamond',Georgia,serif;font-size:14px;color:#2C2C2C;">${escapeHtml(data.firm || "Not provided")}</td></tr>
<tr><td style="padding:6px 0;font-family:'EB Garamond',Georgia,serif;font-size:14px;color:#6B6560;">Archetype</td><td style="padding:6px 0;font-family:'EB Garamond',Georgia,serif;font-size:14px;color:#2C2C2C;">${escapeHtml(archetypeData.name.replace(/\.$/, ""))}</td></tr>
<tr><td style="padding:6px 0;font-family:'EB Garamond',Georgia,serif;font-size:14px;color:#6B6560;">Band</td><td style="padding:6px 0;font-family:'EB Garamond',Georgia,serif;font-size:14px;color:#2C2C2C;">${escapeHtml((data.band || "").replace(/-/g," ").replace(/\b\w/g, c => c.toUpperCase()))}</td></tr>
<tr><td style="padding:6px 0;font-family:'EB Garamond',Georgia,serif;font-size:14px;color:#6B6560;">Score</td><td style="padding:6px 0;font-family:'Cormorant Garamond',Georgia,serif;font-size:18px;color:#2C2C2C;">${data.scores?.total ?? "?"} / 50</td></tr>
</table>
${reflectionBlock}
<p style="margin:32px 0 0;font-family:'EB Garamond',Georgia,serif;font-size:13px;color:#9B9590;font-style:italic;">A copy of the reading itself was sent to ${escapeHtml(data.email || "the prospect")}.</p>
</td></tr></table></td></tr></table></body></html>`;

        try {
          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${RESEND_KEY}`,
            },
            body: JSON.stringify({
              from: FROM,
              to: [NOTIFY],
              subject: internalSubject,
              html: internalHtml,
            }),
          });
        } catch (e) {
          console.error("Internal notification error:", e);
        }
      }
    } catch (e) {
      console.error("Email error:", e);
    }
  }

  return res.status(200).json({ ok: true, ...results });
}
