/**
 *
 *  This script turns the selected types into JSON Schemas.
 *
 */
import { execSync } from 'node:child_process';
import ts from 'typescript';

function pascalToSnake(str: string) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLocaleLowerCase();
}

function makeSchemaPerExported(path: string) {
  const program = ts.createProgram([path], {});
  const checker = program.getTypeChecker();
  const sf = program.getSourceFile(path);

  if (!sf) {
    console.warn('Cannot create schemas from file. No such file:', path);
    return;
  }

  const symbol = checker.getSymbolAtLocation(sf);

  if (!symbol?.exports) {
    console.warn('Cannot create schemas from file:', path);
    return;
  }

  console.warn('📚 Josephus: building JSON Schema files...');

  // TO DO: schema versioning.

  for (let t of symbol.exports.keys()) {
    const typeName: string = t as string;
    console.log(typeName)
    if (!typeName.endsWith('Schema')) {
      continue;
    }
    const snakeName = pascalToSnake(typeName).replace(/-schema$/, '');
    // TO DO: error handling.
    execSync(
      `pnpm ts-json-schema-generator \\
      -f "" \\
      -e "all" \\
      -p "./src/**/*.d.ts" \\
      -i "${snakeName}" \\
      -t "${typeName}" \\
      -o "./schemas/${snakeName}.schema.json" \\
      --minify \\
    `,
      { stdio: 'inherit' },
    );
  }
  console.warn('📚 Josephus: successfully generated schemas!');
}

makeSchemaPerExported('./src/types/josephus-schemas.d.ts');
