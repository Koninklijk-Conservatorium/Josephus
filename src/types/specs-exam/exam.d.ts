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
