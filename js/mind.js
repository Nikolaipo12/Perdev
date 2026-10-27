/* ==========================================================================
   Personal Development Reviewer - Module 01: Mind & Brain
   ========================================================================== */
(() => {
  "use strict";

  const RS = window.RS;
  const { DATA, ui, icon, esc } = RS;
  const lesson = DATA.lessons.find((item) => item.id === 1);

  const LAB_QUESTIONS = [
    {
      prompt: "A student plans the week, chooses priorities, and stops themselves from scrolling instead of studying. Which region is doing the most executive work?",
      options: ["Frontal lobe", "Parietal lobe", "Occipital lobe", "Cerebellum"],
      answer: 0,
      why: "The frontal lobe is involved in planning, decision-making, impulse control, and other executive functions."
    },
    {
      prompt: "A dancer adjusts her posture mid-spin and keeps her balance. Which specialist is most directly at work?",
      options: ["Cerebellum", "Occipital lobe", "Frontal lobe", "Broca's area"],
      answer: 0,
      why: "The cerebellum coordinates balance, posture, and smooth movement."
    },
    {
      prompt: "You notice the colour, shape, and depth of a road sign as you approach it. Which lobe processes that visual information?",
      options: ["Occipital lobe", "Parietal lobe", "Frontal lobe", "Cerebellum"],
      answer: 0,
      why: "The occipital lobe handles visual information. The reviewer uses reading a road sign as an example."
    },
    {
      prompt: "A patient understands what is said but has great difficulty producing fluent speech. Which idea is most closely associated with this?",
      options: ["Paul Broca and language functions in the brain", "Roger Sperry and split-brain theory", "Paul MacLean and the Triune Brain", "Ned Hermann and brain dominance"],
      answer: 0,
      why: "Paul Broca's research is associated with language production and with language functions in the brain."
    },
    {
      prompt: "A learner loves checklists, deadlines, and a clear step-by-step plan. Which Herrmann preference is strongest?",
      options: ["Sequential", "Interpersonal", "Analytical", "Imaginative"],
      answer: 0,
      why: "Sequential thinking focuses on order, step-by-step tasks, planning, and checklists."
    },
    {
      prompt: "A student is trying to combine information from their eyes, ears, and sense of touch into one coherent picture. Which lobe is especially important for that integration?",
      options: ["Parietal lobe", "Frontal lobe", "Occipital lobe", "Cerebellum"],
      answer: 0,
      why: "The parietal lobe integrates sensory information and helps form a coherent perception of the world."
    }
  ];

  function renderMind() {
    const brainMap = `
      <div class="pd-brain-board" aria-label="Four brain regions and their jobs">
        <div class="pd-brain-board-head"><span class="eyebrow">The brain as a team</span><span class="tag">4 specialists</span></div>
        <div class="pd-brain-grid">
          <div class="pd-brain-tile"><span class="pd-brain-icon">${icon("target")}</span><span class="pd-brain-label">Frontal</span><strong>Plan + decide</strong><p>Priorities, impulse control, executive functions.</p></div>
          <div class="pd-brain-tile"><span class="pd-brain-icon">${icon("layers")}</span><span class="pd-brain-label">Parietal</span><strong>Sense + integrate</strong><p>Pulls sensory information into coherent perception.</p></div>
          <div class="pd-brain-tile"><span class="pd-brain-icon">${icon("eye")}</span><span class="pd-brain-label">Occipital</span><strong>See + interpret</strong><p>Visual information: colour, depth, a road sign.</p></div>
          <div class="pd-brain-tile"><span class="pd-brain-icon">${icon("chart")}</span><span class="pd-brain-label">Cerebellum</span><strong>Balance + coordinate</strong><p>Posture, smooth movement, physical timing.</p></div>
        </div>
      </div>`;

    const lobeTable = ui.table(
      ["Region", "The exam signal", "Everyday example"],
      [
        ["<strong>Frontal lobe</strong>", "Planning, decision-making, impulse control, executive functions", "Choosing a study plan instead of a distraction"],
        ["<strong>Parietal lobe</strong>", "Integrates sensory information into coherent perception", "Making sense of touch, sound, and space together"],
        ["<strong>Occipital lobe</strong>", "Visual information", "Reading a road sign; noticing colour and depth"],
        ["<strong>Cerebellum</strong>", "Balance and coordination", "Catching a cup or holding a dancer's posture"]
      ]
    );

    const sections = [
      ui.section({
        id: "brain-map",
        num: "01",
        eyebrow: "Orientation",
        title: "Your brain is a team, not a single switch.",
        lede: "Different regions specialise in different jobs. The exam usually gives you a behaviour and asks which specialist is doing the work.",
        body: `${brainMap}
          ${ui.callout("key", "Read for the verb", "<p><strong>Plan, decide, stop an impulse → frontal.</strong> Integrate the senses → parietal. See → occipital. Balance and coordinate → cerebellum. The verb in the question is your best clue.</p>")}`
      }),
      ui.section({
        id: "lobes",
        num: "02",
        eyebrow: "Brain geography",
        title: "Four lobes, four jobs.",
        lede: "The frontal, parietal, occipital, and temporal lobes are the four main lobes. The reviewer's glossary also asks you to know the cerebellum — a structure, not a lobe.",
        body: `${lobeTable}
          <div class="pd-mini-grid">
            <div class="pd-mini-card"><span class="pd-mini-index">A</span><h3>Not the same as the cerebellum</h3><p>The cerebellum is a structure behind the brain stem. It coordinates movement and balance; it is not one of the four main lobes.</p></div>
            <div class="pd-mini-card"><span class="pd-mini-index">B</span><h3>Language lives in the brain</h3><p>Broca's research is associated with language production and other language functions. Do not confuse Broca with Sperry, MacLean, or Herrmann.</p></div>
          </div>
          ${ui.callout("trap", "Exam trap", "<p>A question can name a lobe but describe a <em>different</em> job. Match the description first, then choose the label. For example, “planning” belongs to the frontal lobe even if the word “brain” is used vaguely.</p>")}`
      }),
      ui.section({
        id: "hemispheres",
        num: "03",
        eyebrow: "Split-brain theory",
        title: "Two hemispheres, specialised functions.",
        lede: "Roger Sperry's split-brain work is the key idea here: the hemispheres have specialised functions. The reviewer specifically highlights logical and analytical reasoning as a left-hemisphere example.",
        body: `
          <div class="pd-split">
            <div class="pd-split-side pd-split-left"><span class="eyebrow">Left hemisphere</span><h3>Logical + analytical</h3><p>Use this when a question asks where logical and analytical reasoning is emphasised. It is a <em>function example</em>, not a personality label.</p><span class="tag">Reasoning</span><span class="tag">Analysis</span></div>
            <div class="pd-split-line" aria-hidden="true"></div>
            <div class="pd-split-side pd-split-right"><span class="eyebrow">Right hemisphere</span><h3>Also specialised</h3><p>The reviewer's key wording is that the hemispheres have specialised functions. The two sides work together; do not turn “left” or “right” into a fixed identity.</p><span class="tag">Specialised</span><span class="tag">Connected</span></div>
          </div>
          ${ui.callout("note", "Keep it precise", "<p><strong>Split-brain theory is associated with Roger Sperry.</strong> The exact glossary idea is that the left and right hemispheres process different types of thinking and have specialised functions. Logical and analytical reasoning is the left-side example in the reviewer.</p>")}`
      }),
      ui.section({
        id: "triune",
        num: "04",
        eyebrow: "A model, not three separate brains",
        title: "The Triune Brain Theory.",
        lede: "Paul MacLean is associated with the Triune Brain Theory. The reviewer defines it as a model describing three interconnected systems.",
        body: `
          <div class="pd-layer-stack" aria-label="Three interconnected systems in the Triune Brain model">
            <div class="pd-layer pd-layer--one"><span>System 1</span><strong>Basic survival</strong><p>Often described as the most ancient layer. It is a metaphor for automatic, protective responses.</p></div>
            <div class="pd-layer pd-layer--two"><span>System 2</span><strong>Emotion + memory</strong><p>Often linked to the limbic system. Feelings and threat detection colour experience.</p></div>
            <div class="pd-layer pd-layer--three"><span>System 3</span><strong>Thinking + planning</strong><p>The newest layer is often associated with the neocortex and complex reasoning.</p></div>
          </div>
          <div class="pd-layer-note"><b>Exam-safe wording:</b> three interconnected systems. The layers are commonly taught as reptilian, limbic, and neocortical, but the glossary's required idea is the interconnected model — not three isolated brains.</div>
          ${ui.callout("memory", "Name lock", "<p><strong>MacLean → Triune → three interconnected systems.</strong> If an option says “three separate brains,” it is too strong. The systems interact.</p>")}`
      }),
      ui.section({
        id: "thinking",
        num: "05",
        eyebrow: "Herrmann Brain Dominance Instrument",
        title: "Four preferences, not four boxes.",
        lede: "Ned Hermann is associated with the four-quadrant model. Most people have a mix of preferences; the labels describe tendencies, not fixed limits.",
        body: `
          <div class="pd-quadrants">
            <div class="pd-quadrant pd-quadrant--analytical"><span class="pd-quadrant-code">A · Upper left</span><h3>Analytical</h3><p>Logic, facts, critical analysis, and clear reasoning.</p></div>
            <div class="pd-quadrant pd-quadrant--sequential"><span class="pd-quadrant-code">B · Lower left</span><h3>Sequential</h3><p>Order, step-by-step tasks, planning, and checklists.</p></div>
            <div class="pd-quadrant pd-quadrant--interpersonal"><span class="pd-quadrant-code">C · Lower right</span><h3>Interpersonal</h3><p>Teamwork, relationships, feelings, and communication.</p></div>
            <div class="pd-quadrant pd-quadrant--imaginative"><span class="pd-quadrant-code">D · Upper right</span><h3>Imaginative</h3><p>Big-picture thinking, possibilities, visuals, and fresh ideas.</p></div>
          </div>
          ${ui.scenarioLab({
            id: "mind-lab",
            title: "Brain Map Match",
            description: "Read each scenario, name the specialist, and get an explanation immediately. Six quick retrievals.",
            badge: "Interactive lab",
            questions: LAB_QUESTIONS,
            doneText: "Lab complete. Cover the table and say the four lobe jobs from memory."
          })}
          ${ui.callout("key", "The four-quadrant clue", "<p><strong>Analytical = logic.</strong> Sequential = order and steps. Interpersonal = people. Imaginative = big picture and possibilities. When two options sound plausible, choose the one that matches the <em>main behaviour</em> in the scenario.</p>")}`
      }),
      ui.section({
        id: "mind-maps",
        num: "06",
        eyebrow: "Make thinking visible",
        title: "A mind map starts in the middle.",
        lede: "The reviewer defines a mind map as a visual tool that starts with the main idea or topic in the centre. Main topics link to it, and branches hold the details.",
        body: `
          <div class="pd-mindmap">
            <span class="pd-mind-branch pd-mind-branch--one">Main topic</span>
            <span class="pd-mind-branch pd-mind-branch--two">Details</span>
            <span class="pd-mind-branch pd-mind-branch--three">Example</span>
            <div class="pd-mind-core"><span class="eyebrow">Centre</span><strong>Main idea or topic</strong></div>
            <span class="pd-mind-branch pd-mind-branch--four">Evidence</span>
            <span class="pd-mind-branch pd-mind-branch--five">Question</span>
          </div>
          <div class="pd-steps">
            <div class="pd-step"><span>01</span><h3>Put the idea in the centre</h3><p>Name the topic in a few words. Do not start with a paragraph.</p></div>
            <div class="pd-step"><span>02</span><h3>Add the main topics</h3><p>Link the big branches that belong directly to the central idea.</p></div>
            <div class="pd-step"><span>03</span><h3>Grow the details</h3><p>Add examples, evidence, and questions at the ends of the branches.</p></div>
          </div>
          ${ui.callout("note", "Why it works", "<p>A mind map forces you to show the <strong>relationship</strong> between ideas. The centre is the main topic; the branches are the main topics linked to it; the smaller twigs hold details. If everything is the same size, it is a list — not a map.</p>")}`
      })
    ];

    return ui.lessonPage({
      lesson,
      title: "The mind behind <em>the person</em>.",
      lede: "Four brain regions, two hemispheres, three interconnected systems, four thinking preferences, and one visual tool for making it all fit.",
      intro: ui.callout("memory", "The one-line map", "<p><strong>Brain regions tell you what is happening. Hemispheres tell you how thinking is specialised. Herrmann tells you how you prefer to work. Mind maps show how the ideas connect.</strong> Read the module once, then use the lab to retrieve it.</p>"),
      sections
    });
  }

  function bindMind(root) {
    RS.bindQuickCheck(root, 1);
    RS.bindScenarioLab(root, "mind-lab");
  }

  RS.renderMind = renderMind;
  RS.bindMind = bindMind;
})();
