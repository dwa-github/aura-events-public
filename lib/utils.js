// lib/utils.js
export const snakeToCamel = (str) =>
  str
    .toLowerCase()
    .replace(/([_][a-z])/g, (group) => group.toUpperCase().replace("_", ""))

export const transformRow = (row) => {
  if (!row) return null
  const newRow = {}
  for (const key in row) {
    newRow[snakeToCamel(key)] = row[key]
  }
  return newRow
}

export const transformRows = (rows) => {
  if (!Array.isArray(rows)) return []
  return rows.map(transformRow)
}

export const generateSlug = (text) => {
  if (!text) return ""
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
}
