type ScoreRepr = 'score' | 'audio' | 'label';

type ScoreExtractor = 'pitches' | 'segments' | 'chordsWithFermata';

type ScoreFeature = 'pitches' | 'durations' | 'accidentals' | 'articulations';

type ScoreLayout = 'full' | 'piano-staff' | 'single-staff';

type FieldType = 'legend' | 'question' | 'answer';
type JosephusGUI = 'display' | 'quiz' | 'connect' | 'order' | 'selection';

type FieldSpec = {
  type: FieldType;
  scoreRefs: number[]; // reference to scores loaded by task.
  extractor?: ScoreExtractor;
  filter: ScoreFeature[];
  repr: ScoreRepr[];
  layout?: ScoreLayout;
  gui: JosephusGUI;
  items: number;
  events?: string[];
  description: string;
};
