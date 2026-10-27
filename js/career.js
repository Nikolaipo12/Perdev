/* ==========================================================================
   Personal Development Reviewer - Module 04: Career Compass
   ========================================================================== */
(() => {
  "use strict";

  const RS = window.RS;
  const { DATA, ui, icon } = RS;
  const lesson = DATA.lessons.find((item) => item.id === 4);

  const factors = [
    {
      id: "parental",
      label: "E1",
      name: "Parental pressure",
      definition: "Pressure from parents or guardians that can influence a young person's career choice.",
      icon: "home"
    },
    {
      id: "financial",
      label: "E2",
      name: "Financial constraints",
      definition: "Limits on available money that may affect access to education, training, or career opportunities.",
      icon: "calculator"
    },
    {
      id: "market",
      label: "E3",
      name: "Job market demand and supply",
      definition: "The availability of jobs and the demand for workers in particular fields.",
      icon: "chart"
    },
    {
      id: "location",
      label: "E4",
      name: "School location",
      definition: "The distance or accessibility of a school or training institution, which can affect educational choices.",
      icon: "compass"
    },
    {
      id: "peers",
      label: "E5",
      name: "Peer pressure",
      definition: "Influence from friends or classmates that may shape a person's academic or career decisions.",
      icon: "heart"
    },
    {
      id: "gender",
      label: "E6",
      name: "Gender bias",
      definition: "Unfair assumptions or expectations about which careers are suitable for people of a particular gender.",
      icon: "target"
    },
    {
      id: "language",
      label: "E7",
      name: "Language limitation",
      definition: "Difficulty with a language that may restrict access to certain courses, training, or job opportunities.",
      icon: "file-text"
    },
    {
      id: "academic",
      label: "E8",
      name: "Academic performance",
      definition: "A student's grades and school achievement, which can influence available educational and career paths.",
      icon: "award"
    }
  ];

  const LAB_QUESTIONS = [
    {
      prompt: "A student wants to study fine arts, but their parents insist on medicine and threaten to withdraw support. Which external factor is strongest?",
      options: ["Parental pressure", "Peer pressure", "Gender bias", "Financial constraints"],
      answer: 0,
      why: "Parental pressure is pressure from parents or guardians that can influence a young person's career choice."
    },
    {
      prompt: "A family cannot afford the tuition and travel costs for a private training programme. Which factor is most directly involved?",
      options: ["Financial constraints", "School location", "Job market demand and supply", "Academic performance"],
      answer: 0,
      why: "Financial constraints are limits on available money that may affect access to education, training, or career opportunities."
    },
    {
      prompt: "A student chooses a health-care course because hospitals in the region are actively hiring graduates. Which factor is this?",
      options: ["Job market demand and supply", "Peer pressure", "Parental pressure", "Language limitation"],
      answer: 0,
      why: "Job market demand and supply is about the availability of jobs and the demand for workers in particular fields."
    },
    {
      prompt: "A student chooses a nearby college because the only programme they want is a two-hour commute away. Which factor is this?",
      options: ["School location", "Financial constraints", "Peer pressure", "Gender bias"],
      answer: 0,
      why: "School location refers to the distance or accessibility of a school or training institution, which can affect educational choices."
    },
    {
      prompt: "A student enrols in the same strand as their close friends, even though they are unsure about the fit. Which factor is this?",
      options: ["Peer pressure", "Parental pressure", "Job market demand and supply", "Academic performance"],
      answer: 0,
      why: "Peer pressure is influence from friends or classmates that may shape academic or career decisions."
    },
    {
      prompt: "A student is told that engineering is “for boys” and caregiving is “for girls.” Which factor is this?",
      options: ["Gender bias", "Language limitation", "School location", "Peer pressure"],
      answer: 0,
      why: "Gender bias is unfair assumptions or expectations about which careers are suitable for people of a particular gender."
    },
    {
      prompt: "A student avoids a course because the entrance materials and interviews are only in a language they are still learning. Which factor fits best?",
      options: ["Language limitation", "Academic performance", "Gender bias", "Financial constraints"],
      answer: 0,
      why: "Language limitation is difficulty with a language that may restrict access to certain courses, training, or job opportunities."
    },
    {
      prompt: "A student's low grades close off some scholarship options, so they choose a different path. Which factor is this?",
      options: ["Academic performance", "Job market demand and supply", "Language limitation", "Parental pressure"],
      answer: 0,
      why: "Academic performance refers to a student's grades and school achievement, which can influence available educational and career paths."
    }
  ];

  function renderCareer() {
    const sections = [
      ui.section({
        id: "factors",
        num: "01",
        eyebrow: "The external forces",
        title: "Eight forces around a career choice.",
        lede: "These factors influence Filipino adolescents' career choices. They are external pressures and conditions — not labels for a student's worth or potential.",
        body: `
          <div class="pd-career-grid">
            ${factors.map((factor, index) => `
              <article class="pd-career-card" style="--factor-delay:${index * 45}ms">
                <div class="pd-career-top"><span class="pd-factor-icon">${icon(factor.icon)}</span><span class="pd-career-label">${factor.label}</span></div>
                <h3>${factor.name}</h3>
                <p>${factor.definition}</p>
              </article>`).join("")}
          </div>
          ${ui.callout("key", "The eight, in order", "<p><strong>E1 Parental pressure · E2 Financial constraints · E3 Job market demand and supply · E4 School location · E5 Peer pressure · E6 Gender bias · E7 Language limitation · E8 Academic performance.</strong> Count them on your fingers; the exam may give you a scenario and ask you to name the force.</p>")}`
      }),
      ui.section({
        id: "decide",
        num: "02",
        eyebrow: "Agency",
        title: "Name it, then choose.",
        lede: "Naming an external factor helps you see the pressure clearly. It does not make the choice for you. The goal is to separate what is shaping you from what you actually value.",
        body: `
          <div class="pd-decide-grid">
            <div class="pd-decide-card"><span class="pd-decide-num">01</span><h3>Name the force</h3><p>Is this mainly parental pressure, money, location, peers, gender bias, language, grades, or the job market?</p></div>
            <div class="pd-decide-card"><span class="pd-decide-num">02</span><h3>Check the evidence</h3><p>What do you actually know? A hunch about the job market is not the same as a verified demand for workers.</p></div>
            <div class="pd-decide-card"><span class="pd-decide-num">03</span><h3>Separate pressure from purpose</h3><p>Ask: “Would I still want this if no one were watching?” Then ask what support or constraints are real.</p></div>
            <div class="pd-decide-card"><span class="pd-decide-num">04</span><h3>Choose one next step</h3><p>Talk to a counselor, compare costs, visit a campus, ask about language support, or research the field. Small action beats frozen pressure.</p></div>
          </div>
          <div class="pd-agency">
            <div class="pd-agency-copy"><span class="eyebrow">The stance to take</span><h3>Externally shaped, still yours.</h3><p>External factors influence a career choice, but they do not erase agency. You can name a pressure without obeying it, and accept a constraint without letting it define your whole future.</p></div>
            <div class="pd-agency-list">
              <span>${icon("check")} “This pressure is real.”</span>
              <span>${icon("check")} “These are my options.”</span>
              <span>${icon("check")} “This is my next small step.”</span>
            </div>
          </div>
          ${ui.scenarioLab({
            id: "career-lab",
            title: "Name the Force",
            description: "Eight scenarios, one for each external factor. Name the force first; the explanation follows instantly.",
            badge: "Interactive lab",
            questions: LAB_QUESTIONS,
            doneText: "Lab complete. Cover the list and name all eight external factors from memory."
          })}
          ${ui.callout("trap", "Do not over-blame one factor", "<p>Real decisions rarely have one cause. A student may face financial constraints <em>and</em> parental pressure <em>and</em> a local job market that is changing. Choose the factor that the scenario makes <strong>most directly relevant</strong>, then acknowledge the overlap.</p>")}`
      })
    ];

    return ui.lessonPage({
      lesson,
      title: "Choosing a path <em>that fits</em>.",
      lede: "Eight external forces shape the career conversation for many Filipino adolescents. Naming them clearly is the first step toward choosing with agency.",
      intro: ui.callout("memory", "The one-line map", "<p><strong>External factors explain the weather; they do not write the whole story.</strong> Learn the eight forces, match the scenario to the strongest one, and remember the student still has a say.</p>"),
      sections
    });
  }

  function bindCareer(root) {
    RS.bindQuickCheck(root, 4);
    RS.bindScenarioLab(root, "career-lab");
  }

  RS.renderCareer = renderCareer;
  RS.bindCareer = bindCareer;
})();
