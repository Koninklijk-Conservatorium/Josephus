import { MEIQuery } from "./MEIQuery";

export interface MEITransformClass {
  transform(mei: MEIDocument): MEIDocument;
}

export abstract class MEITransform extends MEIQuery implements MEITransformClass {
  abstract transform(mei: MEIDocument): MEIDocument;
}
