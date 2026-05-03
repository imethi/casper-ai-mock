import { Scenario } from "@/lib/types";

export const scenarios: Scenario[] = [
  {
    id: "academic-integrity",
    title: "Academic Integrity Dilemma",
    category: "Ethics",
    free: true,
    scenario:
      "You notice a classmate in a competitive program repeatedly asking others for almost identical wording during take-home assignments. One day, they ask you to share your full response, saying they are under family pressure to maintain a scholarship.",
    question:
      "How would you respond in the moment, and what factors would you consider before deciding whether to report the behavior?"
  },
  {
    id: "clinic-confidentiality",
    title: "Healthcare Confidentiality vs Safety",
    category: "Healthcare",
    free: true,
    scenario:
      "You are volunteering at a clinic front desk. A 16-year-old patient privately tells you they are afraid their older sibling may be misusing prescription medication at home but begs you not to tell anyone.",
    question:
      "How would you respond to the patient, and what steps would you take while respecting confidentiality and safety?"
  },
  {
    id: "team-conflict",
    title: "Team Conflict",
    category: "Collaboration",
    free: true,
    scenario:
      "A teammate has stopped contributing to a group project. Other members want to remove their name from the final submission, but you learn they may be dealing with a serious family issue.",
    question:
      "How would you handle this situation with your group and the teammate?"
  },
  {
    id: "workplace-bias",
    title: "Workplace Bias",
    category: "Professionalism",
    free: true,
    scenario:
      "During a volunteer shift, you hear another volunteer make a dismissive comment about a patient’s background. The patient appears uncomfortable but says nothing.",
    question:
      "What would you do in the moment and afterward?"
  },
  {
    id: "paid-mock",
    title: "Paid Mock Scenario",
    category: "Full Feedback",
    free: false,
    scenario:
      "You are shadowing in a clinic and notice that a busy staff member skips a step in the intake process. The patient does not appear harmed, but the step is part of the clinic’s safety protocol.",
    question:
      "How would you respond while balancing patient safety, hierarchy, and professionalism?"
  }
];
