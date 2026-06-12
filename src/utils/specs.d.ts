type ScoreSpec = {
  source: string; // keyof typeof libraries;
  fileName?: string;
  entity: 'score';
};

type ScoreRepr = 'score' | 'audio' | 'label';
type ScoreFeature = 'score' | 'pitches' | 'rhythms' | 'chords';
type ScoreLayout = 'full' | 'piano-staff' | 'single-staff';

type FieldType = 'legend' | 'question' | 'answer';
type JosephusGUI = 'display' | 'quiz' | 'connect' | 'order' | 'selection';

type FieldSpec = {
  type: FieldType;
  scores: string[]; // reference to scores loaded by task.
  repr: ScoreRepr[];
  features: ScoreFeature[];
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
  challenges: ChallengeSpec[];
};
