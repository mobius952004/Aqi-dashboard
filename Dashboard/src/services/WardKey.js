export const normalizeWardName = (name = "") =>
  name.replace(/\s+/g, " ").trim().toUpperCase()
