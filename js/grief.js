/* ==========================================================================
   Personal Development Reviewer - Module 03: Grief & Mental Health
   ========================================================================== */
(() => {
  "use strict";

  const RS = window.RS;
  const { DATA, ui, icon } = RS;
  const lesson = DATA.lessons.find((item) => item.id === 3);

  const LAB_QUESTIONS = [
    {
      prompt: "A grieving student keeps saying, “This cannot be happening. She will walk through the door.” Which response is this?",
      options: ["Denial", "Bargaining", "Acceptance", "Compassion"],
      answer: 0,
      why: "Denial is a grief response in which a person refuses to believe or accept a painful truth."
    },
    {
      prompt: "A grieving student keeps thinking, “If I had called that night, maybe everything would be different.” Which response is this?",
      options: ["Bargaining", "Denial", "Acceptance", "High-grief death"],
      answer: 0,
      why: "Bargaining involves attempts to negotiate, make deals, or imagine ways to postpone or reverse a loss."
    },
    {
      prompt: "A student is overwhelmed by intrusive thoughts about contamination and repeatedly cleans to reduce the anxiety. Which condition does this most closely describe?",
      options: ["Obsessive-Compulsive Disorder (OCD)", "Obsessive-Compulsive Personality Disorder (OCPD)", "Bipolar disorder", "Schizophrenia"],
      answer: 0,
      why: "OCD is characterised by obsessions and/or compulsions. The reviewer names repetitive cleaning to reduce anxiety as an example."
    },
    {
      prompt: "A student is extremely perfectionistic, needs everything orderly, and becomes distressed when others do not follow their way of doing things. Which pattern fits best?",
      options: ["Obsessive-Compulsive Personality Disorder (OCPD)", "Obsessive-Compulsive Disorder (OCD)", "Bipolar disorder", "Schizophrenia"],
      answer: 0,
      why: "OCPD is a personality pattern marked by perfectionism, orderliness, and a strong need for control."
    },
    {
      prompt: "A person has episodes of significantly changed mood, sometimes elevated and sometimes depressed. Which condition is being described?",
      options: ["Bipolar disorder", "OCPD", "OCD", "Schizophrenia"],
      answer: 0,
      why: "Bipolar disorder involves episodes of significant mood changes, which may include elevated mood and depression."
    },
    {
      prompt: "A person has difficulty telling what is real from what is imagined, which affects their perception of reality. Which condition does the reviewer describe?",
      options: ["Schizophrenia", "Bipolar disorder", "OCPD", "OCD"],
      answer: 0,
      why: "Schizophrenia can affect a person's perception of reality and ability to distinguish real experiences from imagined ones."
    },
    {
      prompt: "A family receives news of a fatal car accident. The loss is sudden and traumatic, and the grief is overwhelming. Which term fits?",
      options: ["High-grief death", "Bargaining", "Acceptance", "Compassion"],
      answer: 0,
      why: "High-grief death is a sudden, traumatic loss — such as a fatal car accident — that may trigger an intense emotional breakdown."
    }
  ];

  const conditionCards = [
    {
      name: "Bipolar disorder",
      tag: "Mood episodes",
      definition: "A mental health condition involving episodes of significant mood changes, which may include elevated mood and depression.",
      icon: "chart"
    },
    {
      name: "Obsessive-Compulsive Disorder (OCD)",
      tag: "Obsessions / compulsions",
      definition: "A mental health condition involving obsessions and/or compulsions; repetitive cleaning to reduce anxiety can be a sign.",
      icon: "rotate"
    },
    {
      name: "Obsessive-Compulsive Personality Disorder (OCPD)",
      tag: "Personality pattern",
      definition: "A personality pattern marked by perfectionism, orderliness, and a strong need for control.",
      icon: "target"
    },
    {
      name: "Schizophrenia",
      tag: "Reality / imagination",
      definition: "Schizophrenia can affect a person's perception of reality and ability to distinguish real experiences from imagined ones.",
      icon: "eye"
    }
  ];

  function renderGrief() {
    const sections = [
      ui.section({
        id: "grief-stages",
        num: "01",
        eyebrow: "Loss has a shape",
        title: "Three grief responses to recognise.",
        lede: "The reviewer highlights denial, bargaining, and acceptance. Treat them as responses that can appear, overlap, and return — not a rigid checklist.",
        body: `
          <div class="pd-grief-track" aria-label="Three grief responses">
            <article class="pd-grief-card pd-grief-card--denial"><span class="pd-grief-num">01</span><span class="eyebrow">Protection</span><h3>Denial</h3><p>Refusing to believe or accept a painful truth.</p><span class="pd-grief-signal">“This cannot be real.”</span></article>
            <span class="pd-grief-arrow" aria-hidden="true">${icon("arrow-right")}</span>
            <article class="pd-grief-card pd-grief-card--bargain"><span class="pd-grief-num">02</span><span class="eyebrow">Negotiation</span><h3>Bargaining</h3><p>Attempting to negotiate, make deals, or imagine ways to postpone or reverse the loss.</p><span class="pd-grief-signal">“If only I had…”</span></article>
            <span class="pd-grief-arrow" aria-hidden="true">${icon("arrow-right")}</span>
            <article class="pd-grief-card pd-grief-card--accept"><span class="pd-grief-num">03</span><span class="eyebrow">Integration</span><h3>Acceptance</h3><p>Increasingly accepting the loss and becoming ready to move forward.</p><span class="pd-grief-signal">“I can carry this and keep living.”</span></article>
          </div>
          ${ui.callout("note", "Not a straight line", "<p>Grief is not a clean sequence. A person may move between denial, bargaining, and acceptance, or feel none of them in order. The exam asks you to <strong>recognise the response</strong>, not to grade how someone grieves.</p>")}
          <div class="pd-high-grief">
            <div class="pd-high-grief-icon">${icon("alert")}</div>
            <div><span class="eyebrow">Sudden + traumatic</span><h3>High-grief death</h3><p>A sudden, traumatic loss — such as a fatal car accident — that may trigger an intense emotional breakdown. The shock and lack of preparation can make the grief especially intense.</p></div>
          </div>`
      }),
      ui.section({
        id: "support",
        num: "02",
        eyebrow: "Compassion in practice",
        title: "Support begins with listening.",
        lede: "The reviewer's definition is direct: listening carefully, showing empathy, and supporting a grieving friend. Being content and emotionally balanced helps you stay present without making the loss about you.",
        body: `
          <div class="pd-support-grid">
            <div class="pd-support-card pd-support-card--do">
              <span class="eyebrow">Try this</span>
              <h3>Support looks like</h3>
              <ul>
                <li>Listening carefully without rushing to fix the pain.</li>
                <li>Showing empathy: “I'm here, and I'm listening.”</li>
                <li>Offering practical help with ordinary tasks.</li>
                <li>Remembering the person who died by name.</li>
                <li>Checking in again after the first few days.</li>
              </ul>
            </div>
            <div class="pd-support-card pd-support-card--dont">
              <span class="eyebrow">Be careful</span>
              <h3>Support is not</h3>
              <ul>
                <li>“At least…” sentences that minimise the loss.</li>
                <li>Forcing a timeline or telling someone to move on.</li>
                <li>Making the conversation about your own story.</li>
                <li>Offering advice before you understand what they need.</li>
                <li>Promising that everything will be fine.</li>
              </ul>
            </div>
          </div>
          ${ui.callout("memory", "The exact definition", "<p><strong>Compassion and emotional support</strong> = listening carefully, showing empathy, and supporting a grieving friend. <strong>Be content and emotionally balanced</strong> = finding joy in simple daily experiences can reflect contentment and emotional balance. Both are about steadiness, not performance.</p>")}
          ${ui.callout("trap", "Know your role", "<p>You can be a caring friend, but you are not the therapist. If someone is in danger of hurting themselves or someone else, involve a trusted adult or a mental-health professional immediately. Supporting someone does not mean carrying the crisis alone.</p>")}`
      }),
      ui.section({
        id: "conditions",
        num: "03",
        eyebrow: "Distinctions that matter",
        title: "Four conditions, four different patterns.",
        lede: "These terms are easy to blur under stress. Read each definition for its distinctive pattern instead of sorting people into labels.",
        body: `
          <div class="pd-condition-grid">
            ${conditionCards.map((card, index) => `
              <article class="pd-condition-card" style="--factor-delay:${index * 55}ms">
                <div class="pd-condition-top"><span class="pd-condition-icon">${icon(card.icon)}</span><span class="tag">${card.tag}</span></div>
                <h3>${card.name}</h3>
                <p>${card.definition}</p>
              </article>`).join("")}
          </div>
          <div class="pd-ocd-compare">
            <div class="pd-ocd-side"><span class="eyebrow">OCD</span><h3>Obsessions and/or compulsions</h3><p>Intrusive thoughts or urges, and repeated behaviours used to reduce distress. The reviewer's example is repetitive cleaning to reduce anxiety.</p></div>
            <div class="pd-ocd-divider" aria-hidden="true">vs</div>
            <div class="pd-ocd-side"><span class="eyebrow">OCPD</span><h3>Perfectionism and control</h3><p>A broader personality pattern: orderliness, perfectionism, and a strong need for control. It is not the same condition as OCD.</p></div>
          </div>
          ${ui.scenarioLab({
            id: "grief-lab",
            title: "Name the Pattern",
            description: "Seven scenarios covering grief responses, a high-grief loss, and the mental-health distinctions. Choose carefully.",
            badge: "Interactive lab",
            questions: LAB_QUESTIONS,
            doneText: "Lab complete. Explain OCD vs OCPD in one sentence without using your notes."
          })}
          ${ui.callout("trap", "The trap in the wording", "<p><strong>Bipolar is about mood episodes.</strong> <strong>Schizophrenia is about reality vs imagination.</strong> <strong>OCD is about obsessions/compulsions.</strong> <strong>OCPD is about perfectionism, order, and control.</strong> If you can name the distinctive pattern first, the label usually follows.</p>")}`
      })
    ];

    return ui.lessonPage({
      lesson,
      title: "Holding grief, <em>naming the mind</em>.",
      lede: "Learn the grief responses, the shape of sudden loss, what compassionate support actually sounds like, and the differences between four mental-health terms.",
      intro: ui.callout("memory", "The one-line map", "<p><strong>Grief asks for presence. Diagnosis asks for precision.</strong> Be gentle with the person; be exact with the term. The exam tests the second skill, but the first one is the reason it matters.</p>"),
      sections
    });
  }

  function bindGrief(root) {
    RS.bindQuickCheck(root, 3);
    RS.bindScenarioLab(root, "grief-lab");
  }

  RS.renderGrief = renderGrief;
  RS.bindGrief = bindGrief;
})();
