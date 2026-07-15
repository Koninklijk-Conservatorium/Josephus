type ScoreSpec = {
  source: string; // keyof typeof libraries;
  fileName?: string;
  entity: 'score';
  transforms: TransformSpec[]
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
  scoreRefs: number[];
  transforms: TransformSpec[]
  repr: ScoreRepr[];
  layout?: ScoreLayout;
  gui: JosephusGUI;
  items: number;
  events?: string[];
  description: string;
};


type TaskSpec = {
  scores: ScoreSpec[]; // List of scores, referred in fields using "#score/index".
  fields: FieldSpec[];
};

type ChallengeSpec = {
  tasks: TaskSpec[];
};

type ExamSpec = {
  $schema: string;
  challenges: ChallengeSpec[];
};
