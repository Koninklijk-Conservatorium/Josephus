type ScoreSpec = {
  source: string; // keyof typeof libraries;
  fileName?: string;
  entity: 'score';
  // transforms: TransformSpec[]
};

type ScoreRepr = 'score' | 'audio' | 'label';
type ScoreLayout = 'full' | 'piano-staff' | 'single-staff';
type FieldType = 'legend' | 'question' | 'answer';
type JosephusGUI = 'display' | 'quiz' | 'connect' | 'order' | 'selection';

type FieldSpec = {
  type: FieldType;
  /**
   * Reference to scores loaded by task.
   */
  scoreRefs: number[]; // of length AT LEAST 1!
  transforms: TransformSpec[]
  repr: ScoreRepr[];
  layout?: ScoreLayout;
  gui: JosephusGUI;
  items: number | "all";
  events?: string[];
  description: string;
};

type TaskSpec = {
  scores: ScoreSpec[]; // List of scores, referred in fields using "#score/index".
  fields: FieldSpec[];
};

type ChallengeSpec = {
  category?: `#/categories/${ChallengeCategoryRef}`; // Referencing one of Exam's category.
  tasks: TaskSpec[];
};

type ChallengeCategoryRef = string

type ChallengeCategory = {
  label: string,
  instruction: string,
}

type ExamSpec = {
  $schema: string;
  title: "Music Theory Test" | string;
  instruction: "Choose a challenge to begin" | string;
  categories: {[key: ChallengeCategoryRef]: ChallengeCategory};
  challenges: ChallengeSpec[];
};
