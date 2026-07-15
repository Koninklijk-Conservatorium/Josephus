/**
 * Those type serve as basis for all the schema-relevant parts of Josephus.
 *
 * It is only used to generate JSON Schema needed to run Josephus components
 * (e.g. specifications for tasks, challenges, exams, libraries definitions etc).
 */

// TO DO: Brand '$schema'.

export type JosephusScoreSchema = ScoreSpec & { $schema: string };
export type JosephusFieldeSchema = FieldSpec & { $schema: string };
export type JosephusTaskSchema = TaskSpec & { $schema: string };
export type JosephusChallengeSchema = ChallengeSpec & { $schema: string };
export type JosephusExamSchema = ExamSpec & { $schema: string };

export type JosephusLibrarySchema = JosephusLibrary & { $schema: string };
