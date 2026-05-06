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
    color: "#8B7355",
    pattern: "All dimensions weak — most scores 0 to 2 out of 6. Nothing yet structured.",
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
    color: "#A07850",
    pattern: "Voice strong (4 or higher out of 6). Data and Memory weak (2 or lower out of 6).",
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
    color: "#7A8B6B",
    pattern: "Operations and Data strong (4 or higher out of 6 each). Voice weak (2 or lower out of 6).",
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
    color: "#5B7A7A",
    pattern: "All dimensions within one point of each other. No extreme strength or weakness.",
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

const MANIFESTO_PARAGRAPHS = [
  "The window is roughly eighteen months. After that, the firms that have moved will compound an advantage the others cannot catch. Today, AI is mostly being used to retrieve information. Few firms are using it to build, to codify, to improve the work itself, which is exactly where the return is.",
  "This is not a software problem. It is a strategic one. A serious approach considers four things together. The voice of the firm. The people who carry it. The governance that protects it. The workflows that hold it.",
  "Be careful of providers selling technical solutions alone. The technology is at the service of the firm, not the other way around. The opportunity is short, and it rewards firms that move with both clarity and craft.",
];

const DIMENSION_LABELS = {
  voice: "Voice",
  operations: "Operations",
  client_experience: "Client Experience",
  team: "Team",
  data_memory: "Data & Memory",
};

const CALENDLY_URL = "https://calendly.com/alexandre_elia/ai_conversation";

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
        <span style="font-style: normal; font-weight: 500;">If nothing changes. </span>${escapeHtml(uc.ifNothingChanges)}
      </p>
    </td></tr>`).join("");

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>Your Reading — ELIA Atelier</title></head>
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
  <p style="font-family: 'EB Garamond', Georgia, serif; font-size: 16.5px; color: #2C2C2C; line-height: 1.85; margin: 0 0 32px;">${escapeHtml(a.whereYouStand)}</p>
  <p style="font-family: 'DM Sans', sans-serif; font-size: 11px; color: #B07D62; letter-spacing: 0.18em; text-transform: uppercase; margin: 0 0 12px;">Recommended first move</p>
  <p style="font-family: 'EB Garamond', Georgia, serif; font-size: 16.5px; color: #2C2C2C; line-height: 1.85; font-style: italic; margin: 0;">${escapeHtml(a.recommendedFirstMove)}</p>

  <hr style="border: 0; border-top: 1px solid rgba(44,44,44,0.10); margin: 48px 0;" />

  <!-- 04 AI IN YOUR HOUSE -->
  <p style="font-family: 'DM Sans', sans-serif; font-size: 11px; color: #B07D62; letter-spacing: 0.18em; text-transform: uppercase; margin: 0 0 16px;">04 &middot; AI in your house</p>
  <p style="font-family: 'EB Garamond', Georgia, serif; font-size: 15.5px; color: #6B6560; font-style: italic; line-height: 1.75; margin: 0 0 36px;">${escapeHtml(a.aiInYourHouseIntro)}</p>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${useCasesHtml}</table>

  <hr style="border: 0; border-top: 1px solid rgba(44,44,44,0.10); margin: 48px 0;" />

  <!-- 05 MANIFESTO -->
  <p style="font-family: 'DM Sans', sans-serif; font-size: 11px; color: #B07D62; letter-spacing: 0.18em; text-transform: uppercase; margin: 0 0 20px;">05 &middot; What the moment demands</p>
  ${MANIFESTO_PARAGRAPHS.map((p) => `<p style="font-family: 'EB Garamond', Georgia, serif; font-size: 16.5px; color: #2C2C2C; line-height: 1.85; margin: 0 0 18px;">${escapeHtml(p)}</p>`).join("")}

  <hr style="border: 0; border-top: 1px solid rgba(44,44,44,0.10); margin: 56px 0 40px;" />

  <!-- INVITATION -->
  <p style="font-family: 'DM Sans', sans-serif; font-size: 11px; color: #B07D62; letter-spacing: 0.18em; text-transform: uppercase; margin: 0 0 12px;">The invitation</p>
  <h3 style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 30px; font-weight: 300; color: #2C2C2C; margin: 0 0 20px;">If this raised questions.</h3>
  <p style="font-family: 'EB Garamond', Georgia, serif; font-size: 16.5px; color: #2C2C2C; line-height: 1.85; margin: 0 0 40px;">The work of reading a firm honestly is hard to do alone. If this reading raised questions you would like to think through with someone who has spent two decades inside premium firms, we offer a first conversation. Thirty minutes, at our expense. No deck. No obligation.</p>

  <!-- Calendly — text only, centered, dark Cormorant. No button. -->
  <div style="text-align: center; margin: 48px 0;">
    <p style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 22px; font-weight: 300; color: #2C2C2C; margin: 0 0 12px;">Book a thirty-minute conversation</p>
    <a href="${CALENDLY_URL}" target="_blank" style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 18px; color: #2C2C2C; text-decoration: none; border-bottom: 1px solid rgba(176,125,98,0.4); padding-bottom: 2px;">${CALENDLY_URL.replace("https://", "")}</a>
  </div>

  <hr style="border: 0; border-top: 1px solid rgba(44,44,44,0.10); margin: 48px 0;" />

  <!-- Signature -->
  <div style="text-align: center;">
    <p style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 18px; color: #2C2C2C; font-style: italic; margin: 0 0 6px;">— Alexandre Olive</p>
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
  const NOTIFY = process.env.NOTIFY_EMAIL; // optional bcc

  if (RESEND_KEY) {
    try {
      const archetypeData = ARCHETYPE_EMAIL_DATA[data.archetype] || ARCHETYPE_EMAIL_DATA["BALANCED"];
      const subject = `Your Reading — ${archetypeData.name.replace(/\.$/, "")}`;
      const emailHtml = buildEmail(data);

      const body = {
        from: FROM,
        to: [data.email],
        subject,
        html: emailHtml,
        reply_to: "alexandre@eliaatelier.ch",
      };
      if (NOTIFY) body.bcc = [NOTIFY];

      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_KEY}`,
        },
        body: JSON.stringify(body),
      });

      if (emailResponse.ok) {
        results.email = true;
      } else {
        const errText = await emailResponse.text();
        console.error("Resend error:", errText);
      }
    } catch (e) {
      console.error("Email error:", e);
    }
  }

  return res.status(200).json({ ok: true, ...results });
}
