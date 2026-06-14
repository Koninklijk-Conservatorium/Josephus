*Specs* are the truth source files for some of the Josephus JSON Schemas.

All the `.d.ts` files in this directory contain typing information
for the JSON Schema files of the Josephus `exam`, `field` and `score` specs
used in our API.

To update all the schemas:
1) modify relevant `.d.ts` types
2) run `pnpm make-schemas` to create JSON Schema files in `src/schemas/dist`.

Note:
- do not use types existing outside this directory: this will clutter the schemas.