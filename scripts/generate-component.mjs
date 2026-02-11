#!/usr/bin/env node

import { createInterface } from "node:readline/promises";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const rl = createInterface({ input: process.stdin, output: process.stdout });

async function ask(question, defaultValue) {
  const suffix = defaultValue ? ` (${defaultValue})` : "";
  const answer = await rl.question(`${question}${suffix}: `);
  return answer.trim() || defaultValue || "";
}

async function askYesNo(question, defaultYes = true) {
  const hint = defaultYes ? "Y/n" : "y/N";
  const answer = await rl.question(`${question} [${hint}]: `);
  if (!answer.trim()) return defaultYes;
  return answer.trim().toLowerCase().startsWith("y");
}

async function askProps() {
  const props = [];
  console.log("\nDefine props (enter empty name to finish):");
  let i = 1;
  while (true) {
    const name = await ask(`  prop ${i} name`, "");
    if (!name) break;
    const type = await ask(`  prop ${i} type`, "string");
    const optional = await askYesNo(`  prop ${i} optional?`, false);
    props.push({ name, type, optional });
    i++;
  }
  return props;
}

function zodType(type, optional) {
  const map = {
    string: "z.string()",
    number: "z.number()",
    boolean: "z.boolean()",
  };
  let base = map[type] || `z.string()`;
  if (optional) base += ".optional()";
  return base;
}

function generateSchema(name, props) {
  const fields = props
    .map((p) => `  ${p.name}: ${zodType(p.type, p.optional)},`)
    .join("\n");
  return `const ${name[0].toLowerCase() + name.slice(1)}Schema = z.object({\n${fields}\n});`;
}

function generateStyles(name, hasStyles) {
  if (!hasStyles) return "";
  const varName = name[0].toLowerCase() + name.slice(1) + "Styles";
  return `const ${varName} = defineStyles((theme) => ({
  container: {
    padding: theme.spacing.md,
  },
}));`;
}

function generateComponent(name, props, hasStyles, hasEvents) {
  const schemaVar = name[0].toLowerCase() + name.slice(1) + "Schema";
  const stylesVar = name[0].toLowerCase() + name.slice(1) + "Styles";

  const ctxParams = ["props", "styles"];
  if (hasEvents) ctxParams.push("emit");

  const stylesOption = hasStyles ? `\n  styles: ${stylesVar},` : "";

  return `const ${name} = defineComponent({
  name: "${name}",
  schema: ${schemaVar},${stylesOption}
  render: function ${name}({ ${ctxParams.join(", ")} }) {
    return (
      <View style={styles.container}>
        <Text>${name}</Text>
      </View>
    );
  },
});`;
}

function generateRegistryLine(name) {
  return `  ${name},`;
}

function generateSpecExample(name, props) {
  const propsObj = props
    .map((p) => {
      const val =
        p.type === "string"
          ? `"example"`
          : p.type === "number"
            ? "0"
            : "false";
      return `      ${p.name}: ${val},`;
    })
    .join("\n");

  return `// Spec usage:
// ${name[0].toLowerCase() + name.slice(1)}: {
//   type: "${name}",
//   props: {
// ${propsObj}
//   },
// },`;
}

async function main() {
  console.log("Generate a new component\n");

  const name = await ask("Component name (PascalCase)");
  if (!name) {
    console.log("No name provided, exiting.");
    process.exit(0);
  }

  const category = await ask("Category: atom or molecule?", "atom");
  const hasStyles = await askYesNo("Add a style factory?", true);
  const hasEvents = await askYesNo("Handle events (press, action)?", false);
  const props = await askProps();

  console.log("\n--- Generated code ---\n");

  const schema = generateSchema(name, props);
  const styles = generateStyles(name, hasStyles);
  const component = generateComponent(name, props, hasStyles, hasEvents);
  const registryLine = generateRegistryLine(name);
  const specExample = generateSpecExample(name, props);

  const output = [
    `// --- Schema ---`,
    schema,
    "",
    hasStyles ? `// --- Styles ---` : null,
    hasStyles ? styles : null,
    hasStyles ? "" : null,
    `// --- Component ---`,
    component,
    "",
    `// --- Add to customRegistry ---`,
    `// ${registryLine}`,
    "",
    specExample,
  ]
    .filter((l) => l !== null)
    .join("\n");

  console.log(output);

  const shouldWrite = await askYesNo(
    "\nAppend schema + styles + component to registry.tsx?",
    false,
  );

  if (shouldWrite) {
    const registryPath = resolve("lib/json-render/registry.tsx");
    let content = readFileSync(registryPath, "utf-8");

    // Insert before "// ---------- Registry export ----------"
    const marker = "// ---------- Registry export ----------";
    const insertBlock = [
      "",
      `// --- ${name} (${category}) ---`,
      "",
      schema,
      hasStyles ? "" : null,
      hasStyles ? styles : null,
      "",
      component,
      "",
    ]
      .filter((l) => l !== null)
      .join("\n");

    content = content.replace(marker, insertBlock + marker);

    // Add to customRegistry object
    const registryObjEnd = /};\n\n\/\/ ---------- Custom action handlers/;
    content = content.replace(
      registryObjEnd,
      `${registryLine}\n};\n\n// ---------- Custom action handlers`,
    );

    writeFileSync(registryPath, content, "utf-8");
    console.log(`\nWrote to ${registryPath}`);
    console.log(`Added "${name}" to customRegistry.`);
    console.log(`\nRemember to:`);
    console.log(`  1. Fill in the render JSX`);
    console.log(`  2. Add imports if needed (View, Text, Pressable, etc.)`);
    console.log(`  3. Run: npx tsc --noEmit && yarn lint`);
  } else {
    console.log(
      "\nCopy the code above into lib/json-render/registry.tsx manually.",
    );
  }

  rl.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
