/**
 * Small RFC 4180-style CSV parser used by the protected bulk blog importer.
 * Handles quoted commas, escaped quotes and quoted line breaks.
 * @param {string} input
 * @returns {string[][]}
 */
export function parseCsv(input) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    if (quoted) {
      if (char === '"' && input[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
      continue;
    }
    if (char === '"') quoted = true;
    else if (char === ",") { row.push(field); field = ""; }
    else if (char === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else if (char !== "\r") field += char;
  }
  if (quoted) throw new Error("CSV contains an unclosed quoted field.");
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows.filter((values) => values.some((value) => value.trim()));
}
