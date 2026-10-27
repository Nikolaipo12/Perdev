/* ============================================================
   Personal Development Reviewer - content data
   Source: Personal Development Reviewer, A.Y. 2025-2026
   42 glossary terms + 8 external career factors
   ============================================================ */
(() => {
  "use strict";

  const TERMS = [
    {
      id: "pd-01", n: 1, numberLabel: "01", term: "Language functions in the brain", lesson: 1,
      definition: "Paul Broca's research is associated with language production and with language functions in the brain."
    },
    {
      id: "pd-02", n: 2, numberLabel: "02", term: "Bipolar disorder", lesson: 3,
      definition: "A mental health condition involving episodes of significant mood changes, which may include elevated mood and depression."
    },
    {
      id: "pd-03", n: 3, numberLabel: "03", term: "Obsessive-Compulsive Personality Disorder (OCPD)", lesson: 3,
      definition: "A personality pattern marked by perfectionism, orderliness, and a strong need for control."
    },
    {
      id: "pd-04", n: 4, numberLabel: "04", term: "Father of Brain Dominance Technology", lesson: 1,
      definition: "Ned Hermann is known for developing the Hermann Brain Dominance Instrument and its four-quadrant model."
    },
    {
      id: "pd-05", n: 5, numberLabel: "05", term: "Parietal lobe", lesson: 1,
      definition: "A brain lobe that integrates sensory information and helps form a coherent perception of the world."
    },
    {
      id: "pd-06", n: 6, numberLabel: "06", term: "Compassion and emotional support", lesson: 3,
      definition: "Listening carefully, showing empathy, and supporting a grieving friend."
    },
    {
      id: "pd-07", n: 7, numberLabel: "07", term: "Be content and emotionally balanced", lesson: 3,
      definition: "Finding joy in simple daily experiences can reflect contentment and emotional balance."
    },
    {
      id: "pd-08", n: 8, numberLabel: "08", term: "Avoidant attachment", lesson: 2,
      definition: "An attachment style that may develop when a caregiver is unresponsive or detached, leading a child to keep emotional distance in relationships."
    },
    {
      id: "pd-09", n: 9, numberLabel: "09", term: "Anxious-ambivalent attachment", lesson: 2,
      definition: "An attachment style associated with inconsistent caregiving and possible separation anxiety or uncertainty about a caregiver's availability."
    },
    {
      id: "pd-10", n: 10, numberLabel: "10", term: "Triune Brain Theory", lesson: 1,
      definition: "A theory proposing that the brain can be understood as three interconnected systems."
    },
    {
      id: "pd-11", n: 11, numberLabel: "11", term: "Left and right hemispheres process different types of thinking", lesson: 1,
      definition: "A key idea of Roger Sperry's Split-Brain Theory; the hemispheres have specialized functions."
    },
    {
      id: "pd-12", n: 12, numberLabel: "12", term: "Frontal lobe", lesson: 1,
      definition: "A brain region involved in planning, decision-making, impulse control, and other executive functions."
    },
    {
      id: "pd-13", n: 13, numberLabel: "13", term: "Logical and analytical reasoning", lesson: 1,
      definition: "A thinking function commonly associated with the left hemisphere in Roger Sperry's split-brain theory."
    },
    {
      id: "pd-14", n: 14, numberLabel: "14", term: "Cerebellum", lesson: 1,
      definition: "A brain structure important for balance, coordination, and smooth movement."
    },
    {
      id: "pd-15", n: 15, numberLabel: "15", term: "Interpersonal", lesson: 1,
      definition: "A thinking preference associated with teamwork, relationships, communication, and interaction with others."
    },
    {
      id: "pd-16", n: 16, numberLabel: "16", term: "Personal relationship", lesson: 2,
      definition: "An emotional connection between two or more people formed through close interactions and commitment."
    },
    {
      id: "pd-17", n: 17, numberLabel: "17", term: "Analytical thinking", lesson: 1,
      definition: "The upper-left quadrant in Hermann's model, associated with logic, facts, and critical analysis."
    },
    {
      id: "pd-18", n: 18, numberLabel: "18", term: "Propinquity effect", lesson: 2,
      definition: "The tendency to like people we are physically or emotionally near, often because repeated interactions build familiarity."
    },
    {
      id: "pd-19", n: 19, numberLabel: "19", term: "Obsessive-Compulsive Disorder (OCD)", lesson: 3,
      definition: "A condition involving obsessions and/or compulsions; repetitive cleaning to reduce anxiety can be a sign."
    },
    {
      id: "pd-20", n: 20, numberLabel: "20", term: "Self-disclosure", lesson: 2,
      definition: "Sharing personal thoughts and feelings honestly; this communication process can help build intimacy."
    },
    {
      id: "pd-21", n: 21, numberLabel: "21", term: "School", lesson: 3,
      definition: "The stressor category that applies when a teenager worries about transferring schools."
    },
    {
      id: "pd-22", n: 22, numberLabel: "22", term: "Similarity", lesson: 2,
      definition: "A factor in attraction in which shared values, interests, and backgrounds can increase liking between people."
    },
    {
      id: "pd-23", n: 23, numberLabel: "23", term: "Mind map", lesson: 1,
      definition: "A diagram that organizes and represents ideas or information around a central topic."
    },
    {
      id: "pd-24", n: 24, numberLabel: "24", term: "Reciprocity", lesson: 2,
      definition: "The tendency to like people who show that they like us, reinforcing mutual attraction."
    },
    {
      id: "pd-25", n: 25, numberLabel: "25", term: "Acceptance", lesson: 3,
      definition: "A grief stage in which a person increasingly accepts the reality of a loss and becomes ready to move forward."
    },
    {
      id: "pd-26", n: 26, numberLabel: "26", term: "Bargaining", lesson: 3,
      definition: "A grief stage involving attempts to negotiate, make deals, or imagine ways to postpone or reverse a loss."
    },
    {
      id: "pd-27", n: 27, numberLabel: "27", term: "Four", lesson: 1,
      definition: "Hermann's model divides thinking preferences into four dominant quadrants."
    },
    {
      id: "pd-28", n: 28, numberLabel: "28", term: "Paul MacLean", lesson: 1,
      definition: "The proponent most associated with the Triune Brain Theory."
    },
    {
      id: "pd-29", n: 29, numberLabel: "29", term: "Lust", lesson: 2,
      definition: "The first stage of falling in love described in the exam; driven by sex hormones such as testosterone and estrogen and associated with physical desire."
    },
    {
      id: "pd-30", n: 30, numberLabel: "30", term: "Personality and emotions", lesson: 1,
      definition: "Functions associated with the frontal lobe, including aspects of personality, behavior, and emotional regulation."
    },
    {
      id: "pd-31", n: 31, numberLabel: "31", term: "Denial", lesson: 3,
      definition: "A grief response in which a person refuses to believe or accept a painful truth."
    },
    {
      id: "pd-32", n: 32, numberLabel: "32", term: "Physical attractiveness", lesson: 2,
      definition: "A factor in initial attraction, often linked in research to perceived health, vitality, and reproductive fitness."
    },
    {
      id: "pd-33", n: 33, numberLabel: "33", term: "Attachment", lesson: 2,
      definition: "The final stage of love in the exam's sequence, involving a lasting bond, long-term commitment, and often building a life together."
    },
    {
      id: "pd-34", n: 34, numberLabel: "34", term: "High-grief death", lesson: 3,
      definition: "A sudden, traumatic loss—such as a fatal car accident—that may trigger an intense emotional breakdown."
    },
    {
      id: "pd-35", n: 35, numberLabel: "35", term: "The main idea or topic", lesson: 1,
      definition: "The central image or center of a mind map represents the main subject being explored."
    },
    {
      id: "pd-36", n: 36, numberLabel: "36", term: "Secure attachment", lesson: 2,
      definition: "An attachment style that develops when a caregiver is warm, consistent, and emotionally available to a child."
    },
    {
      id: "pd-37", n: 37, numberLabel: "37", term: "Triangular Theory of Love", lesson: 2,
      definition: "Robert Sternberg's theory describing love through three components: intimacy, passion, and commitment."
    },
    {
      id: "pd-38", n: 38, numberLabel: "38", term: "Main topics linked to the central idea", lesson: 1,
      definition: "In a mind map, branches extend from the central idea and organize the main topics related to it."
    },
    {
      id: "pd-39", n: 39, numberLabel: "39", term: "Occipital lobe", lesson: 1,
      definition: "The brain lobe primarily responsible for processing visual information, including color and depth."
    },
    {
      id: "pd-40", n: 40, numberLabel: "40", term: "Sequential", lesson: 1,
      definition: "A thinking style focused on order, step-by-step tasks, planning, and checklists."
    },
    {
      id: "pd-41", n: 41, numberLabel: "41", term: "Distinguish reality from imagination", lesson: 3,
      definition: "Schizophrenia can affect a person's perception of reality and ability to distinguish real experiences from imagined ones."
    },
    {
      id: "pd-42", n: 42, numberLabel: "42", term: "Reading a road sign", lesson: 1,
      definition: "A task that relies heavily on visual processing, which is associated with the occipital lobe."
    },
    {
      id: "pd-e1", n: 43, numberLabel: "E1", term: "Parental pressure", lesson: 4,
      definition: "Pressure from parents or guardians that can influence a young person's career choice."
    },
    {
      id: "pd-e2", n: 44, numberLabel: "E2", term: "Financial constraints", lesson: 4,
      definition: "Limits on available money that may affect access to education, training, or career opportunities."
    },
    {
      id: "pd-e3", n: 45, numberLabel: "E3", term: "Job market demand and supply", lesson: 4,
      definition: "The availability of jobs and the demand for workers in particular fields."
    },
    {
      id: "pd-e4", n: 46, numberLabel: "E4", term: "School location", lesson: 4,
      definition: "The distance or accessibility of a school or training institution, which can affect educational choices."
    },
    {
      id: "pd-e5", n: 47, numberLabel: "E5", term: "Peer pressure", lesson: 4,
      definition: "Influence from friends or classmates that may shape a person's academic or career decisions."
    },
    {
      id: "pd-e6", n: 48, numberLabel: "E6", term: "Gender bias", lesson: 4,
      definition: "Unfair assumptions or expectations about which careers are suitable for people of a particular gender."
    },
    {
      id: "pd-e7", n: 49, numberLabel: "E7", term: "Language limitation", lesson: 4,
      definition: "Difficulty with a language that may restrict access to certain courses, training, or job opportunities."
    },
    {
      id: "pd-e8", n: 50, numberLabel: "E8", term: "Academic performance", lesson: 4,
      definition: "A student's grades and school achievement, which can influence available educational and career paths."
    }
  ];

  const LESSONS = [
    {
      id: 1,
      num: "01",
      route: "mind",
      tabLabel: "Mind",
      color: "teal",
      icon: "brain",
      kicker: "Module 01 - Brain & Thinking",
      title: "The Mind Behind the Person",
      short: "Mind & Brain",
      tagline: "Your brain is not one machine. It is a set of specialists that shape how you think, feel, and decide.",
      summary: "Explore the lobes, the two hemispheres, the Triune Brain, Herrmann's four thinking preferences, and the mind-map method for making ideas visible.",
      tags: ["Brain lobes", "Split-brain", "Triune Brain", "Hermann quadrants", "Mind maps"],
      minutes: 14,
      sections: [
        { id: "brain-map", label: "Your brain at work" },
        { id: "lobes", label: "Four lobes, four jobs" },
        { id: "hemispheres", label: "Two hemispheres" },
        { id: "triune", label: "The Triune Brain" },
        { id: "thinking", label: "Thinking preferences" },
        { id: "mind-maps", label: "Mind maps" },
        { id: "glossary", label: "Key terms" }
      ]
    },
    {
      id: 2,
      num: "02",
      route: "heart",
      tabLabel: "Heart",
      color: "indigo",
      icon: "heart",
      kicker: "Module 02 - Love & Connection",
      title: "The Heart in Connection",
      short: "Love & Attachment",
      tagline: "Attraction is a mix of timing, closeness, stories, and signals. Love is what we build from it.",
      summary: "Why we are drawn to people, how self-disclosure and attachment styles shape connection, and what Sternberg's three sides of love reveal.",
      tags: ["Attraction", "Attachment styles", "Self-disclosure", "Triangular love"],
      minutes: 12,
      sections: [
        { id: "attraction", label: "Why we are drawn" },
        { id: "stages", label: "Lust to attachment" },
        { id: "attachment", label: "Attachment styles" },
        { id: "triangle", label: "Sternberg's triangle" },
        { id: "glossary", label: "Key terms" }
      ]
    },
    {
      id: 3,
      num: "03",
      route: "grief",
      tabLabel: "Grief",
      color: "rust",
      icon: "heart-hand",
      kicker: "Module 03 - Grief & Mental Health",
      title: "Holding Grief, Naming the Mind",
      short: "Grief & Mental Health",
      tagline: "Loss changes the shape of daily life. Compassion begins with listening - and knowing when to seek help.",
      summary: "Grief responses, what supportive presence looks like, and clear distinctions between bipolar disorder, OCD, OCPD, and schizophrenia.",
      tags: ["Grief stages", "High-grief loss", "OCD vs OCPD", "Schizophrenia"],
      minutes: 13,
      sections: [
        { id: "grief-stages", label: "The shape of grief" },
        { id: "support", label: "How to support" },
        { id: "conditions", label: "Mental health distinctions" },
        { id: "glossary", label: "Key terms" }
      ]
    },
    {
      id: 4,
      num: "04",
      route: "career",
      tabLabel: "Career",
      color: "gold",
      icon: "compass",
      kicker: "Module 04 - Career Compass",
      title: "Choosing a Path That Fits",
      short: "Career Compass",
      tagline: "The career you choose is yours - but it is shaped by eight forces worth naming.",
      summary: "Eight external factors that influence Filipino adolescents' career choices - and how to separate pressure from purpose.",
      tags: ["8 external factors", "Parental pressure", "Job market", "Academic performance"],
      minutes: 10,
      sections: [
        { id: "factors", label: "The eight forces" },
        { id: "decide", label: "Name it, then choose" },
        { id: "glossary", label: "Key terms" }
      ]
    }
  ];

  const QUICK_CHECKS = {
    1: [
      {
        id: "m1",
        prompt: "A student recognizes a colorful road sign while driving. Which lobe is doing most of the visual processing?",
        options: ["Frontal lobe", "Parietal lobe", "Occipital lobe", "Cerebellum"],
        answer: 2,
        why: "The occipital lobe processes visual information such as color and depth. Reading a road sign is a classic example."
      },
      {
        id: "m2",
        prompt: "Paul MacLean is most closely associated with which idea?",
        options: ["Triune Brain Theory", "Split-brain theory", "The four attachment styles", "The five stages of grief"],
        answer: 0,
        why: "MacLean is the proponent most associated with the Triune Brain Theory, which describes three interconnected systems."
      },
      {
        id: "m3",
        prompt: "A learner loves checklists, deadlines, and a clear step-by-step plan. Which Herrmann preference is strongest?",
        options: ["Interpersonal", "Analytical", "Sequential", "Imaginative"],
        answer: 2,
        why: "Sequential thinking focuses on order, step-by-step tasks, planning, and checklists."
      }
    ],
    2: [
      {
        id: "h1",
        prompt: "Two classmates sit beside each other every day and gradually become friends. Which attraction factor is at work?",
        options: ["Propinquity", "Similarity", "Reciprocity", "Physical attractiveness"],
        answer: 0,
        why: "Propinquity is the tendency to like people we are physically or emotionally near, especially when repeated contact builds familiarity."
      },
      {
        id: "h2",
        prompt: "Which attachment style develops when a caregiver is warm, consistent, and emotionally available?",
        options: ["Secure attachment", "Avoidant attachment", "Anxious-ambivalent attachment", "No attachment style"],
        answer: 0,
        why: "Secure attachment develops when care is warm and consistent. The child learns that connection is a safe place to return to."
      },
      {
        id: "h3",
        prompt: "What are the three components in Sternberg's Triangular Theory of Love?",
        options: ["Lust, attraction, attachment", "Intimacy, passion, commitment", "Trust, honesty, time", "Propinquity, similarity, reciprocity"],
        answer: 1,
        why: "Sternberg describes love through intimacy, passion, and commitment. Lust, attraction, and attachment are the stages in the reviewer's sequence."
      }
    ],
    3: [
      {
        id: "g1",
        prompt: "A grieving student keeps saying, 'This cannot be happening. She will come back.' Which grief response is this?",
        options: ["Denial", "Bargaining", "Acceptance", "Compassion"],
        answer: 0,
        why: "Denial is the refusal to believe or accept a painful truth. It is a protective response, not a character flaw."
      },
      {
        id: "g2",
        prompt: "Which sentence best separates OCD from OCPD?",
        options: [
          "OCD is about perfectionism; OCPD is about handwashing.",
          "OCD involves obsessions and/or compulsions; OCPD is a broader personality pattern of perfectionism and control.",
          "They are two names for the same condition.",
          "OCD is only about cleaning; OCPD is only about order."
        ],
        answer: 1,
        why: "OCD is defined by obsessions and/or compulsions. OCPD is a personality pattern marked by perfectionism, orderliness, and a strong need for control."
      },
      {
        id: "g3",
        prompt: "Which condition is most associated with difficulty distinguishing real experiences from imagined ones?",
        options: ["Bipolar disorder", "OCPD", "Schizophrenia", "OCD"],
        answer: 2,
        why: "Schizophrenia can affect a person's perception of reality and their ability to distinguish what is real from what is imagined."
      }
    ],
    4: [
      {
        id: "c1",
        prompt: "A family cannot afford tuition for a private school. Which external factor is most directly involved?",
        options: ["Financial constraints", "Peer pressure", "Gender bias", "School location"],
        answer: 0,
        why: "Financial constraints limit access to education, training, and career opportunities because of available money."
      },
      {
        id: "c2",
        prompt: "A student chooses a course mainly because their close friends are enrolling in it. Which factor is this?",
        options: ["Parental pressure", "Peer pressure", "Academic performance", "Language limitation"],
        answer: 1,
        why: "Peer pressure is the influence of friends or classmates on academic and career decisions."
      },
      {
        id: "c3",
        prompt: "A student is told that a certain career is 'only for boys' or 'only for girls.' Which factor is this?",
        options: ["School location", "Financial constraints", "Gender bias", "Job market demand"],
        answer: 2,
        why: "Gender bias is the unfair assumption that certain careers are suitable only for people of a particular gender."
      }
    ]
  };

  const TEST = [
    {
      id: 1, lesson: 1, type: "mc",
      prompt: "Which researcher is associated with language production and language functions in the brain?",
      options: ["Paul Broca", "Roger Sperry", "Paul MacLean", "Ned Hermann"],
      answer: 0,
      why: "Paul Broca's research is associated with language production and language functions. Sperry studied split-brain processing, MacLean proposed the Triune Brain, and Hermann developed the four-quadrant model."
    },
    {
      id: 2, lesson: 1, type: "mc",
      prompt: "A student recognizes a colorful road sign. Which lobe is most directly responsible for processing what they see?",
      options: ["Frontal lobe", "Parietal lobe", "Occipital lobe", "Cerebellum"],
      answer: 2,
      why: "The occipital lobe primarily processes visual information, including color and depth. Reading a road sign is a visual task."
    },
    {
      id: 3, lesson: 1, type: "mc",
      prompt: "Which brain structure helps a dancer maintain balance and coordinate smooth movement?",
      options: ["Cerebellum", "Occipital lobe", "Parietal lobe", "Broca's area"],
      answer: 0,
      why: "The cerebellum is important for balance, coordination, and smooth movement."
    },
    {
      id: 4, lesson: 1, type: "mc",
      prompt: "Which lobe integrates sensory information to help form a coherent perception of the world?",
      options: ["Frontal lobe", "Parietal lobe", "Occipital lobe", "Cerebellum"],
      answer: 1,
      why: "The parietal lobe integrates sensory information and helps form a coherent perception of the world."
    },
    {
      id: 5, lesson: 1, type: "mc",
      prompt: "A teenager has trouble planning ahead and controlling impulses. Which lobe is most relevant to these executive functions?",
      options: ["Frontal lobe", "Occipital lobe", "Cerebellum", "Parietal lobe"],
      answer: 0,
      why: "The frontal lobe is involved in planning, decision-making, impulse control, and other executive functions. It is also linked to personality and emotional regulation."
    },
    {
      id: 6, lesson: 1, type: "mc",
      prompt: "Roger Sperry's split-brain work suggests that the left hemisphere is especially associated with which function?",
      options: ["Balance and coordination", "Visual processing", "Logical and analytical reasoning", "Attachment"],
      answer: 2,
      why: "Logical and analytical reasoning is commonly associated with the left hemisphere in split-brain theory. The hemispheres process different types of thinking."
    },
    {
      id: 7, lesson: 1, type: "mc",
      prompt: "Paul MacLean is best known for which theory?",
      options: ["Triune Brain Theory", "Triangular Theory of Love", "Split-brain theory", "Brain dominance technology"],
      answer: 0,
      why: "MacLean is the proponent most associated with the Triune Brain Theory, which describes the brain as three interconnected systems."
    },
    {
      id: 8, lesson: 1, type: "mc",
      prompt: "Ned Hermann's brain dominance model organizes thinking preferences into how many dominant quadrants?",
      options: ["Two", "Three", "Four", "Five"],
      answer: 2,
      why: "Hermann's model divides thinking preferences into four dominant quadrants. Analytical thinking is the upper-left quadrant."
    },
    {
      id: 9, lesson: 2, type: "mc",
      prompt: "The tendency to like someone simply because you are near them and see them often is called the ______.",
      options: ["Propinquity effect", "Reciprocity effect", "Similarity effect", "Attachment effect"],
      answer: 0,
      why: "Propinquity is the tendency to like people who are physically or emotionally near, often because repeated interactions build familiarity."
    },
    {
      id: 10, lesson: 2, type: "mc",
      prompt: "Shared values, interests, and backgrounds can increase liking between people. Which attraction factor is this?",
      options: ["Reciprocity", "Similarity", "Physical attractiveness", "Self-disclosure"],
      answer: 1,
      why: "Similarity is the attraction factor in which shared values, interests, and backgrounds increase liking."
    },
    {
      id: 11, lesson: 2, type: "mc",
      prompt: "When someone learns that another person likes them, they may begin to like that person more. This is ______.",
      options: ["Propinquity", "Similarity", "Reciprocity", "Attachment"],
      answer: 2,
      why: "Reciprocity is the tendency to like people who show that they like us, reinforcing mutual attraction."
    },
    {
      id: 12, lesson: 2, type: "mc",
      prompt: "Which factor is most connected to sharing personal thoughts and feelings honestly to build intimacy?",
      options: ["Physical attractiveness", "Propinquity", "Reciprocity", "Self-disclosure"],
      answer: 3,
      why: "Self-disclosure is the communication process of sharing personal thoughts and feelings honestly. It can help build intimacy."
    },
    {
      id: 13, lesson: 2, type: "mc",
      prompt: "In the sequence described in the reviewer, which stage of falling in love comes first?",
      options: ["Attachment", "Lust", "Commitment", "Intimacy"],
      answer: 1,
      why: "Lust is described as the first stage of falling in love. It is driven by sex hormones and associated with physical desire."
    },
    {
      id: 14, lesson: 2, type: "mc",
      prompt: "Which stage is described as a lasting bond, long-term commitment, and often building a life together?",
      options: ["Lust", "Attraction", "Attachment", "Infatuation"],
      answer: 2,
      why: "Attachment is the final stage in the reviewer's sequence. It involves a lasting bond and long-term commitment."
    },
    {
      id: 15, lesson: 2, type: "mc",
      prompt: "A child has a caregiver who is warm, consistent, and emotionally available. Which attachment style is most likely to develop?",
      options: ["Secure attachment", "Avoidant attachment", "Anxious-ambivalent attachment", "Disorganized attachment"],
      answer: 0,
      why: "Secure attachment develops when caregiving is warm, consistent, and emotionally available. The child learns that connection is safe."
    },
    {
      id: 16, lesson: 3, type: "mc",
      prompt: "A grieving student keeps repeating, 'There must be a mistake. She is coming back.' Which grief response is this?",
      options: ["Denial", "Bargaining", "Acceptance", "Compassion"],
      answer: 0,
      why: "Denial is a grief response in which a person refuses to believe or accept a painful truth."
    },
    {
      id: 17, lesson: 3, type: "mc",
      prompt: "A person says, 'If I had called that night, maybe things would be different.' Which grief stage does this suggest?",
      options: ["Denial", "Bargaining", "Acceptance", "Attachment"],
      answer: 1,
      why: "Bargaining involves attempts to negotiate, make deals, or imagine ways to postpone or reverse a loss. 'If only' thinking is a common sign."
    },
    {
      id: 18, lesson: 3, type: "mc",
      prompt: "Which grief stage involves gradually accepting the reality of a loss and becoming ready to move forward?",
      options: ["Denial", "Bargaining", "Acceptance", "Compassion"],
      answer: 2,
      why: "Acceptance is the stage in which a person increasingly accepts the reality of the loss and becomes ready to move forward."
    },
    {
      id: 19, lesson: 3, type: "mc",
      prompt: "A fatal car accident is used in the reviewer as an example of ______.",
      options: ["A school stressor", "A high-grief death", "A secure attachment", "A thinking preference"],
      answer: 1,
      why: "A sudden, traumatic loss such as a fatal car accident is described as a high-grief death. It may trigger an intense emotional breakdown."
    },
    {
      id: 20, lesson: 3, type: "mc",
      prompt: "A friend is grieving. Which response best reflects compassion and emotional support?",
      options: [
        "Tell them to move on because it has been a week.",
        "Compare their loss to a harder story you heard.",
        "Sit with them, listen carefully, and acknowledge their feelings.",
        "Avoid the topic so they do not get upset."
      ],
      answer: 2,
      why: "Compassion and emotional support mean listening carefully, showing empathy, and being steadily present. Advice and comparisons can make a grieving person feel unheard."
    },
    {
      id: 21, lesson: 3, type: "mc",
      prompt: "Which sentence correctly separates OCD from OCPD?",
      options: [
        "OCD is a personality pattern; OCPD is only about handwashing.",
        "OCD involves obsessions and/or compulsions; OCPD is a pattern of perfectionism, orderliness, and control.",
        "They are identical conditions with different names.",
        "OCD affects only children; OCPD affects only adults."
      ],
      answer: 1,
      why: "OCD is defined by obsessions and/or compulsions. OCPD is a broader personality pattern marked by perfectionism, orderliness, and a strong need for control."
    },
    {
      id: 22, lesson: 3, type: "mc",
      prompt: "Which condition involves episodes of significant mood change, including elevated mood and depression?",
      options: ["Bipolar disorder", "OCD", "OCPD", "Schizophrenia"],
      answer: 0,
      why: "Bipolar disorder involves episodes of significant mood change, which may include elevated mood and depression."
    },
    {
      id: 23, lesson: 3, type: "mc",
      prompt: "Which condition is most associated with difficulty distinguishing real experiences from imagined ones?",
      options: ["Bipolar disorder", "OCPD", "OCD", "Schizophrenia"],
      answer: 3,
      why: "Schizophrenia can affect a person's perception of reality and their ability to distinguish real experiences from imagined ones."
    },
    {
      id: 24, lesson: 4, type: "mc",
      prompt: "Parents insist that a student take a course the student does not want. Which external factor is most directly involved?",
      options: ["Parental pressure", "School location", "Language limitation", "Job market demand"],
      answer: 0,
      why: "Parental pressure is pressure from parents or guardians that can influence a young person's career choice."
    },
    {
      id: 25, lesson: 4, type: "mc",
      prompt: "A student cannot afford review fees and daily transportation. Which factor is this?",
      options: ["Peer pressure", "Financial constraints", "Academic performance", "Gender bias"],
      answer: 1,
      why: "Financial constraints are limits on available money that may affect access to education, training, or career opportunities."
    },
    {
      id: 26, lesson: 4, type: "mc",
      prompt: "A course has many graduates but very few open jobs. Which external factor does this describe?",
      options: ["School location", "Language limitation", "Job market demand and supply", "Parental pressure"],
      answer: 2,
      why: "Job market demand and supply refers to the availability of jobs and the demand for workers in particular fields."
    },
    {
      id: 27, lesson: 4, type: "mc",
      prompt: "A student chooses a nearby school because traveling to the city is too far and expensive. Which factor is this?",
      options: ["School location", "Peer pressure", "Gender bias", "Academic performance"],
      answer: 0,
      why: "School location refers to the distance or accessibility of a school or training institution, which can affect educational choices."
    },
    {
      id: 28, lesson: 4, type: "mc",
      prompt: "A student changes course plans because close friends choose a different program. Which factor is this?",
      options: ["Financial constraints", "Peer pressure", "Parental pressure", "Language limitation"],
      answer: 1,
      why: "Peer pressure is influence from friends or classmates that may shape academic or career decisions."
    },
    {
      id: 29, lesson: 4, type: "mc",
      prompt: "A student is told that engineering is 'not for girls.' Which external factor is this?",
      options: ["School location", "Job market demand", "Gender bias", "Academic performance"],
      answer: 2,
      why: "Gender bias is the unfair assumption or expectation that certain careers are suitable only for people of a particular gender."
    },
    {
      id: 30, lesson: 4, type: "mc",
      prompt: "A student avoids a scholarship that requires an English essay because they struggle with English. Which factor is this?",
      options: ["Parental pressure", "Financial constraints", "Academic performance", "Language limitation"],
      answer: 3,
      why: "Language limitation is difficulty with a language that may restrict access to courses, training, or job opportunities."
    },
    {
      id: 31, lesson: 4, type: "mc",
      prompt: "A student's grades limit the courses they can enroll in. Which external factor is most directly involved?",
      options: ["Gender bias", "Academic performance", "School location", "Peer pressure"],
      answer: 1,
      why: "Academic performance refers to grades and school achievement, which can influence available educational and career paths."
    }
  ];

  const DIAGNOSIS = [
    { items: "1-8", lesson: "Module 01", reread: "The Mind Behind the Person", fix: "Redraw the brain map from memory, then separate the four lobes and the two hemispheres.", page: "mind", section: "lobes" },
    { items: "9-15", lesson: "Module 02", reread: "The Heart in Connection", fix: "Name the five attraction factors, then walk through lust, attraction, and attachment again.", page: "heart", section: "attraction" },
    { items: "16-23", lesson: "Module 03", reread: "Holding Grief, Naming the Mind", fix: "Keep the grief responses separate from the four mental-health conditions. Use the comparison lab.", page: "grief", section: "conditions" },
    { items: "24-31", lesson: "Module 04", reread: "Choosing a Path That Fits", fix: "Match each career scenario to one of the eight external factors - not to a judgement about the student.", page: "career", section: "factors" }
  ];

  const CROSSWORD = {
    title: "Word Garden",
    intro: "Eight terms from all four modules. Type in the grid, use the clues, and watch each meaning bloom when a word is complete.",
    grid: [
      ".........F...",
      "....R....R...",
      "....E....O.B.",
      "S...C..DENIAL",
      "I.E.I....T.R.",
      "M.M.P....A.G.",
      "I.PARIETAL.A.",
      "L.A.O......I.",
      "ATTACHMENT.N.",
      "R.H.I......I.",
      "I.Y.T......N.",
      "T...Y......G.",
      "Y............"
    ],
    words: [
      {
        answer: "FRONTAL",
        row: 0,
        col: 9,
        dir: "down",
        clue: "This lobe handles planning, decision-making, impulse control, and other executive functions.",
        term: "Frontal lobe",
        definition: "A brain region involved in planning, decision-making, impulse control, and other executive functions."
      },
      {
        answer: "RECIPROCITY",
        row: 1,
        col: 4,
        dir: "down",
        clue: "People tend to like those who show that they like them back. Name this mutual pull.",
        term: "Reciprocity",
        definition: "The tendency to like people who show that they like us, reinforcing mutual attraction."
      },
      {
        answer: "BARGAINING",
        row: 2,
        col: 11,
        dir: "down",
        clue: "In grief, this sounds like 'If only I had...' - negotiating, making deals, or trying to reverse a loss.",
        term: "Bargaining",
        definition: "A grief stage involving attempts to negotiate, make deals, or imagine ways to postpone or reverse a loss."
      },
      {
        answer: "SIMILARITY",
        row: 3,
        col: 0,
        dir: "down",
        clue: "Shared values, interests, and backgrounds can increase liking. Name the attraction factor.",
        term: "Similarity",
        definition: "A factor in attraction in which shared values, interests, and backgrounds can increase liking between people."
      },
      {
        answer: "DENIAL",
        row: 3,
        col: 7,
        dir: "across",
        clue: "A grieving person refuses to believe or accept a painful truth. Which response is this?",
        term: "Denial",
        definition: "A grief response in which a person refuses to believe or accept a painful truth."
      },
      {
        answer: "EMPATHY",
        row: 4,
        col: 2,
        dir: "down",
        clue: "Part of compassion: listening carefully and feeling with a grieving friend.",
        term: "Compassion and emotional support",
        definition: "Listening carefully, showing empathy, and supporting a grieving friend."
      },
      {
        answer: "PARIETAL",
        row: 6,
        col: 2,
        dir: "across",
        clue: "This lobe integrates sensory information and helps form a coherent perception of the world.",
        term: "Parietal lobe",
        definition: "A brain lobe that integrates sensory information and helps form a coherent perception of the world."
      },
      {
        answer: "ATTACHMENT",
        row: 8,
        col: 0,
        dir: "across",
        clue: "The final stage of love: a lasting bond, long-term commitment, and often building a life together.",
        term: "Attachment",
        definition: "The final stage of love in the exam's sequence, involving a lasting bond, long-term commitment, and often building a life together."
      }
    ]
  };

  const GAMES = {
    mind: {
      key: "mind",
      num: "01",
      name: "Mind Maze",
      kicker: "Module 01 - Game",
      tagline: "Read the clue. Find the brain region.",
      description: "Ten rapid clues about lobes, hemispheres, thinking preferences, and mind maps. Pick the best answer before the clock runs out.",
      icon: "brain",
      color: "teal",
      duration: 90,
      pointsLabel: "mind points",
      questions: [
        { prompt: "Which lobe processes visual information such as color and depth?", options: ["Occipital lobe", "Frontal lobe", "Parietal lobe", "Cerebellum"], answer: 0, why: "The occipital lobe handles visual processing, including color and depth." },
        { prompt: "A gymnast keeps her balance on a beam. Which structure is doing much of this work?", options: ["Cerebellum", "Broca's area", "Occipital lobe", "Parietal lobe"], answer: 0, why: "The cerebellum is important for balance, coordination, and smooth movement." },
        { prompt: "Which lobe is linked to planning, decision-making, impulse control, and personality?", options: ["Frontal lobe", "Occipital lobe", "Parietal lobe", "Cerebellum"], answer: 0, why: "The frontal lobe supports executive functions and is also linked to personality and emotional regulation." },
        { prompt: "Which lobe integrates sensory information into a coherent picture of the world?", options: ["Parietal lobe", "Frontal lobe", "Occipital lobe", "Cerebellum"], answer: 0, why: "The parietal lobe integrates sensory information and helps form a coherent perception of the world." },
        { prompt: "Paul Broca's name is most closely tied to which function?", options: ["Language production", "Balance", "Visual depth", "Attachment"], answer: 0, why: "Broca's research is associated with language production and language functions in the brain." },
        { prompt: "In split-brain theory, which function is commonly associated with the left hemisphere?", options: ["Logical and analytical reasoning", "Visual processing", "Balance", "Grief"], answer: 0, why: "Logical and analytical reasoning is commonly associated with the left hemisphere in Sperry's split-brain theory." },
        { prompt: "Who is the key proponent of the Triune Brain Theory?", options: ["Paul MacLean", "Ned Hermann", "Roger Sperry", "Robert Sternberg"], answer: 0, why: "Paul MacLean is the proponent most associated with the Triune Brain Theory." },
        { prompt: "How many dominant quadrants are in Hermann's model?", options: ["Four", "Two", "Three", "Five"], answer: 0, why: "Hermann's model divides thinking preferences into four dominant quadrants." },
        { prompt: "A learner who loves checklists and step-by-step plans is showing which preference?", options: ["Sequential", "Interpersonal", "Analytical", "Imaginative"], answer: 0, why: "Sequential thinking focuses on order, step-by-step tasks, planning, and checklists." },
        { prompt: "In a mind map, what does the center usually represent?", options: ["The main idea or topic", "A random detail", "The final answer", "The author's name"], answer: 0, why: "The central image or center of a mind map represents the main subject being explored." }
      ]
    },
    heart: {
      key: "heart",
      num: "02",
      name: "Heart Signals",
      kicker: "Module 02 - Game",
      tagline: "Name the pull. Build the bond.",
      description: "Ten quick questions about attraction, the stages of love, attachment styles, and Sternberg's triangle. Trust the definition, not the butterfly.",
      icon: "heart",
      color: "indigo",
      duration: 90,
      pointsLabel: "heart points",
      questions: [
        { prompt: "Liking someone because you see them often is called ______.", options: ["Propinquity", "Similarity", "Reciprocity", "Attachment"], answer: 0, why: "The propinquity effect is the tendency to like people who are physically or emotionally near." },
        { prompt: "Shared values and interests make attraction more likely. Which factor is this?", options: ["Similarity", "Lust", "Propinquity", "Attachment"], answer: 0, why: "Similarity is the attraction factor involving shared values, interests, and backgrounds." },
        { prompt: "When someone likes you, you may like them more in return. This is ______.", options: ["Reciprocity", "Similarity", "Physical attractiveness", "Self-disclosure"], answer: 0, why: "Reciprocity is the tendency to like people who show that they like us." },
        { prompt: "Which factor is about sharing personal thoughts and feelings honestly?", options: ["Self-disclosure", "Reciprocity", "Propinquity", "Lust"], answer: 0, why: "Self-disclosure is sharing personal thoughts and feelings honestly, which can build intimacy." },
        { prompt: "Which factor is often linked to perceived health, vitality, and reproductive fitness?", options: ["Physical attractiveness", "Similarity", "Reciprocity", "Self-disclosure"], answer: 0, why: "Physical attractiveness is a factor in initial attraction, often linked to perceived health and vitality." },
        { prompt: "Which stage comes first in the reviewer's sequence of falling in love?", options: ["Lust", "Attachment", "Commitment", "Intimacy"], answer: 0, why: "Lust is the first stage, associated with physical desire and sex hormones." },
        { prompt: "Which stage involves a lasting bond and long-term commitment?", options: ["Attachment", "Lust", "Propinquity", "Similarity"], answer: 0, why: "Attachment is the final stage in the sequence, involving a lasting bond and commitment." },
        { prompt: "A warm, consistent, emotionally available caregiver is most likely to support which attachment style?", options: ["Secure attachment", "Avoidant attachment", "Anxious-ambivalent attachment", "No attachment"], answer: 0, why: "Secure attachment develops when a caregiver is warm, consistent, and emotionally available." },
        { prompt: "A detached or unresponsive caregiver may contribute to which attachment style?", options: ["Avoidant attachment", "Secure attachment", "Anxious-ambivalent attachment", "Triangular attachment"], answer: 0, why: "Avoidant attachment may develop when a caregiver is unresponsive or detached, leading a child to keep emotional distance." },
        { prompt: "Sternberg's Triangular Theory of Love names which three components?", options: ["Intimacy, passion, commitment", "Lust, attraction, attachment", "Propinquity, similarity, reciprocity", "Denial, bargaining, acceptance"], answer: 0, why: "Sternberg describes love through intimacy, passion, and commitment." }
      ]
    },
    life: {
      key: "life",
      num: "03",
      name: "Life Compass",
      kicker: "Modules 03-04 - Game",
      tagline: "Hold the human story. Read the forces.",
      description: "Ten scenarios about grief, mental-health distinctions, and the external factors that shape career choices. Answer with clarity and care.",
      icon: "compass",
      color: "rust",
      duration: 90,
      pointsLabel: "life points",
      questions: [
        { prompt: "A grieving student says, 'This is not real. She will come back.' Which response is this?", options: ["Denial", "Bargaining", "Acceptance", "Compassion"], answer: 0, why: "Denial is the refusal to believe or accept a painful truth." },
        { prompt: "A person keeps thinking, 'If I had called that night, everything would be different.' Which grief stage is this?", options: ["Bargaining", "Acceptance", "Denial", "Secure attachment"], answer: 0, why: "Bargaining involves negotiating, making deals, or imagining ways to reverse or postpone a loss." },
        { prompt: "Which grief stage involves accepting the reality of a loss and becoming ready to move forward?", options: ["Acceptance", "Denial", "Bargaining", "Lust"], answer: 0, why: "Acceptance is the stage in which a person increasingly accepts the reality of the loss." },
        { prompt: "A fatal car accident is used as an example of ______.", options: ["High-grief death", "A school stressor", "Secure attachment", "A thinking preference"], answer: 0, why: "A sudden, traumatic loss is described as a high-grief death and may trigger an intense emotional breakdown." },
        { prompt: "Which response best shows compassion to a grieving friend?", options: ["Listen carefully and acknowledge their feelings", "Tell them to move on", "Compare their loss to a worse story", "Avoid them until they are happy again"], answer: 0, why: "Compassion and emotional support mean listening carefully, showing empathy, and being steadily present." },
        { prompt: "Which pair is correct?", options: ["OCD = obsessions/compulsions; OCPD = perfectionism and control", "OCD = perfectionism; OCPD = compulsions only", "OCD and OCPD are the same condition", "OCD = mood episodes; OCPD = delusions"], answer: 0, why: "OCD involves obsessions and/or compulsions. OCPD is a personality pattern of perfectionism, orderliness, and control." },
        { prompt: "Which condition can make it hard to distinguish reality from imagination?", options: ["Schizophrenia", "OCPD", "Bipolar disorder", "OCD"], answer: 0, why: "Schizophrenia can affect a person's perception of reality and their ability to distinguish real from imagined experiences." },
        { prompt: "Parents insist on a course that the student does not want. Which factor is this?", options: ["Parental pressure", "Peer pressure", "School location", "Language limitation"], answer: 0, why: "Parental pressure is pressure from parents or guardians that can influence a young person's career choice." },
        { prompt: "A student cannot afford tuition or transportation. Which factor is this?", options: ["Financial constraints", "Gender bias", "Academic performance", "Job market demand"], answer: 0, why: "Financial constraints are limits on available money that affect access to education, training, or career opportunities." },
        { prompt: "A student chooses a nearby school because the city campus is too far. Which factor is this?", options: ["School location", "Peer pressure", "Parental pressure", "Language limitation"], answer: 0, why: "School location refers to the distance or accessibility of a school or training institution." }
      ]
    },
    crossword: {
      key: "crossword",
      type: "crossword",
      num: "04",
      name: "Word Garden",
      kicker: "All modules - Game",
      tagline: "Find the term. Meet its meaning.",
      description: "Eight terms from all four modules. Fill the crossword, and every completed word blooms with its exact definition.",
      icon: "grid",
      color: "gold",
      duration: 0,
      pointsLabel: "word points",
      questions: []
    }
  };

  const SEARCH_INDEX = [
    ...LESSONS.map((lesson) => ({
      title: lesson.title,
      page: lesson.route,
      section: "",
      label: `${lesson.num} - ${lesson.short} overview`,
      keywords: `${lesson.title} ${lesson.tagline} ${lesson.tags.join(" ")} personal development`
    })),
    ...LESSONS.flatMap((lesson) => lesson.sections.map((sectionItem) => ({
      title: sectionItem.label,
      page: lesson.route,
      section: sectionItem.id,
      label: `${lesson.num} - ${lesson.short}`,
      keywords: `${lesson.title} ${lesson.short} ${sectionItem.label}`
    }))),
    ...TERMS.map((term) => {
      const lesson = LESSONS.find((item) => item.id === term.lesson);
      return {
        title: term.term,
        page: lesson.route,
        section: "glossary",
        label: `${term.numberLabel} - ${lesson.short}`,
        keywords: `${term.definition} ${lesson.short} term definition`
      };
    }),
    { title: "Practice test", page: "practice", section: "", label: "31 items - full answer review", keywords: "exam quiz test recall check" },
    { title: "Cheat sheet", page: "cheat", section: "", label: "Last-minute recall", keywords: "print summary one page reviewer" }
  ];

  window.STUDY_DATA = {
    meta: {
      course: "Personal Development",
      chapter: "A.Y. 2025-2026",
      lessons: "Four modules",
      title: "Personal Development Reviewer",
      subtitle: "Know your mind, understand your heart, hold grief with care, and choose your path."
    },
    lessons: LESSONS,
    terms: TERMS,
    flashcards: TERMS.map((term) => ({
      id: term.id,
      term: term.term,
      definition: term.definition,
      lesson: term.lesson
    })),
    quickChecks: QUICK_CHECKS,
    test: TEST,
    diagnosis: DIAGNOSIS,
    searchIndex: SEARCH_INDEX,
    games: GAMES,
    crossword: CROSSWORD
  };
})();
