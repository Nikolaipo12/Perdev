/* ==========================================================================
   Personal Development Reviewer - Module 02: Love & Attachment
   ========================================================================== */
(() => {
  "use strict";

  const RS = window.RS;
  const { DATA, ui, icon } = RS;
  const lesson = DATA.lessons.find((item) => item.id === 2);

  const LAB_QUESTIONS = [
    {
      prompt: "Two students sit beside each other every day. Repeated contact makes them more comfortable with each other. Which factor is at work?",
      options: ["Propinquity effect", "Similarity", "Reciprocity", "Self-disclosure"],
      answer: 0,
      why: "The propinquity effect is the tendency to like people we are physically or emotionally near, especially when repeated contact builds familiarity."
    },
    {
      prompt: "A new friendship grows because both students value honesty, love the same music, and want similar things from life. Which factor is strongest?",
      options: ["Similarity", "Propinquity effect", "Physical attractiveness", "Attachment"],
      answer: 0,
      why: "Similarity is a factor in attraction in which shared values, interests, and backgrounds increase liking."
    },
    {
      prompt: "Someone says, “You always make me feel welcome,” and the other person begins to feel the same warmth. Which factor is this?",
      options: ["Reciprocity", "Self-disclosure", "Similarity", "Secure attachment"],
      answer: 0,
      why: "Reciprocity is the tendency to like people who show that they like us, reinforcing mutual attraction."
    },
    {
      prompt: "A caregiver is warm, consistent, and emotionally available. Which attachment style is most likely to develop?",
      options: ["Secure attachment", "Avoidant attachment", "Anxious-ambivalent attachment", "Triangular attachment"],
      answer: 0,
      why: "Secure attachment develops when a caregiver is warm, consistent, and emotionally available."
    },
    {
      prompt: "A caregiver responds warmly one moment and is distant or unpredictable the next. The child becomes anxious about whether connection is safe. Which style fits?",
      options: ["Anxious-ambivalent attachment", "Secure attachment", "Avoidant attachment", "Reciprocity"],
      answer: 0,
      why: "Anxious-ambivalent attachment is linked to inconsistent caregiving, which can leave a child uncertain about connection."
    },
    {
      prompt: "One student shares a genuine fear with a trusted friend, and the friendship becomes closer. Which factor is this?",
      options: ["Self-disclosure", "Physical attractiveness", "Propinquity effect", "Bargaining"],
      answer: 0,
      why: "Self-disclosure is the act of sharing personal thoughts and feelings with another person, which can build intimacy."
    },
    {
      prompt: "Which set names the three components of Sternberg's Triangular Theory of Love?",
      options: ["Intimacy, passion, commitment", "Lust, attraction, attachment", "Propinquity, similarity, reciprocity", "Denial, bargaining, acceptance"],
      answer: 0,
      why: "Sternberg's Triangular Theory of Love describes love through intimacy, passion, and commitment. Lust, attraction, and attachment are the stages in the reviewer's sequence."
    }
  ];

  const factors = [
    {
      id: "propinquity",
      name: "Propinquity effect",
      definition: "The tendency to like people we are physically or emotionally near, especially when repeated contact builds familiarity.",
      icon: "compass"
    },
    {
      id: "similarity",
      name: "Similarity",
      definition: "A factor in attraction in which shared values, interests, and backgrounds can increase liking between people.",
      icon: "layers"
    },
    {
      id: "reciprocity",
      name: "Reciprocity",
      definition: "The tendency to like people who show that they like us, reinforcing mutual attraction.",
      icon: "heart"
    },
    {
      id: "attractiveness",
      name: "Physical attractiveness",
      definition: "A factor in initial attraction, often linked in research to perceived health, vitality, and reproductive fitness.",
      icon: "eye"
    },
    {
      id: "disclosure",
      name: "Self-disclosure",
      definition: "The act of sharing personal thoughts and feelings with another person, which can build intimacy.",
      icon: "book-open"
    }
  ];

  function renderHeart() {
    const factorGrid = `
      <div class="pd-factor-grid pd-factor-grid--five">
        ${factors.map((factor, index) => `
          <article class="pd-factor-card" style="--factor-delay:${index * 55}ms">
            <div class="pd-factor-top"><span class="pd-factor-icon">${icon(factor.icon)}</span><span class="pd-factor-num">0${index + 1}</span></div>
            <h3>${factor.name}</h3>
            <p>${factor.definition}</p>
          </article>`).join("")}
      </div>`;

    const attachmentCards = [
      {
        name: "Secure attachment",
        clue: "Warm, consistent, emotionally available care.",
        tone: "secure",
        detail: "The child learns that connection is a safe place to return to. This is the style that develops when care is reliably warm and responsive."
      },
      {
        name: "Avoidant attachment",
        clue: "Care is unresponsive or emotionally distant.",
        tone: "avoidant",
        detail: "A child may learn to keep emotional distance and rely on themselves. The reviewer links this style to caregivers who are unresponsive or detached."
      },
      {
        name: "Anxious-ambivalent attachment",
        clue: "Care is inconsistent and hard to predict.",
        tone: "anxious",
        detail: "The child may become anxious about separation or unsure whether connection is safe. Inconsistent caregiving makes the pattern of closeness hard to trust."
      }
    ];

    const sections = [
      ui.section({
        id: "attraction",
        num: "01",
        eyebrow: "The pull",
        title: "Why we are drawn to people.",
        lede: "Attraction is not one thing. The reviewer names five factors that shape initial liking — and they often overlap in real life.",
        body: `${factorGrid}
          ${ui.callout("trap", "Don't blur nearness and likeness", "<p><strong>Propinquity is about nearness and repeated contact.</strong> Similarity is about shared values, interests, and backgrounds. If the scenario says “they sat together every day,” think propinquity. If it says “they agreed on what matters,” think similarity.</p>")}`
      }),
      ui.section({
        id: "stages",
        num: "02",
        eyebrow: "The sequence",
        title: "Lust → attraction → attachment.",
        lede: "The reviewer describes love as a sequence. Learn the first and final stages exactly; the middle stage connects them.",
        body: `
          <div class="pd-love-sequence" aria-label="Three stages of love">
            <div class="pd-love-stage pd-love-stage--lust"><span class="pd-love-num">01</span><span class="eyebrow">First</span><h3>Lust</h3><p>Driven by sex hormones such as testosterone and estrogen; associated with physical desire.</p><span class="tag">Physical desire</span></div>
            <div class="pd-love-arrow" aria-hidden="true">${icon("arrow-right")}</div>
            <div class="pd-love-stage pd-love-stage--attraction"><span class="pd-love-num">02</span><span class="eyebrow">Middle</span><h3>Attraction</h3><p>The pull toward a particular person. It is the bridge between physical desire and a lasting bond.</p><span class="tag">Focus</span></div>
            <div class="pd-love-arrow" aria-hidden="true">${icon("arrow-right")}</div>
            <div class="pd-love-stage pd-love-stage--attachment"><span class="pd-love-num">03</span><span class="eyebrow">Final</span><h3>Attachment</h3><p>A lasting bond, long-term commitment, and often building a life together.</p><span class="tag">Lasting bond</span></div>
          </div>
          ${ui.callout("key", "The exam's sequence", "<p><strong>Lust is first; attachment is final.</strong> Lust is associated with physical desire and hormones. Attachment is associated with a lasting bond and commitment. Do not swap those two descriptions.</p>")}`
      }),
      ui.section({
        id: "attachment",
        num: "03",
        eyebrow: "How connection is learned",
        title: "Three attachment styles.",
        lede: "Attachment describes the pattern of connection a child learns with a caregiver. The exam gives you the caregiving clue and asks for the style — or the reverse.",
        body: `
          <div class="pd-attachment-grid">
            ${attachmentCards.map((card, index) => `
              <article class="pd-attachment-card pd-attachment-card--${card.tone}" style="--factor-delay:${index * 60}ms">
                <span class="pd-attachment-marker">${icon(card.tone === "secure" ? "check-circle" : card.tone === "avoidant" ? "arrow-right" : "rotate")}</span>
                <h3>${card.name}</h3>
                <strong>${card.clue}</strong>
                <p>${card.detail}</p>
              </article>`).join("")}
          </div>
          ${ui.callout("memory", "Caregiver → child", "<p><strong>Warm and consistent → secure.</strong> Unresponsive or detached → avoidant. Inconsistent → anxious-ambivalent. Read the <em>pattern of care</em> before choosing the label.</p>")}`
      }),
      ui.section({
        id: "triangle",
        num: "04",
        eyebrow: "Sternberg",
        title: "Love has three sides.",
        lede: "The Triangular Theory of Love describes love through intimacy, passion, and commitment. The triangle is a model of components, not a scorecard for a relationship.",
        body: `
          <div class="pd-triad-wrap">
            <div class="pd-triad" aria-label="Sternberg's three components of love">
              <div class="pd-triad-node pd-triad-node--top"><span>${icon("heart")}</span><strong>Intimacy</strong><small>Closeness and connection</small></div>
              <div class="pd-triad-node pd-triad-node--left"><span>${icon("sparkles")}</span><strong>Passion</strong><small>Drive and attraction</small></div>
              <div class="pd-triad-node pd-triad-node--right"><span>${icon("target")}</span><strong>Commitment</strong><small>The choice to stay</small></div>
              <div class="pd-triad-line pd-triad-line--left" aria-hidden="true"></div>
              <div class="pd-triad-line pd-triad-line--right" aria-hidden="true"></div>
              <div class="pd-triad-line pd-triad-line--base" aria-hidden="true"></div>
            </div>
            <div class="pd-triad-copy">
              <div class="pd-triad-item"><b>Intimacy</b><span>The feeling of closeness, safety, and mutual understanding.</span></div>
              <div class="pd-triad-item"><b>Passion</b><span>The physical and emotional drive that draws people together.</span></div>
              <div class="pd-triad-item"><b>Commitment</b><span>The deliberate choice to maintain the relationship over time.</span></div>
            </div>
          </div>
          ${ui.scenarioLab({
            id: "heart-lab",
            title: "Heart Signals",
            description: "Seven scenarios across attraction, attachment, and Sternberg's triangle. Choose the best fit, then read the why.",
            badge: "Interactive lab",
            questions: LAB_QUESTIONS,
            doneText: "Lab complete. Name the five attraction factors without looking."
          })}
          ${ui.callout("note", "One honest caveat", "<p>Attraction factors are not a recipe, and attachment styles are not verdicts. They are patterns the reviewer asks you to recognise. People can grow, heal, and change how they connect.</p>")}`
      })
    ];

    return ui.lessonPage({
      lesson,
      title: "The heart in <em>connection</em>.",
      lede: "Why proximity, similarity, reciprocity, attractiveness, and self-disclosure pull people together — and how attachment and Sternberg's triangle explain what happens next.",
      intro: ui.callout("memory", "The one-line map", "<p><strong>Attraction gets you close. Attachment explains how closeness was learned. Sternberg names what love is made of.</strong> Keep the stages and the three components in separate mental drawers.</p>"),
      sections
    });
  }

  function bindHeart(root) {
    RS.bindQuickCheck(root, 2);
    RS.bindScenarioLab(root, "heart-lab");
  }

  RS.renderHeart = renderHeart;
  RS.bindHeart = bindHeart;
})();
