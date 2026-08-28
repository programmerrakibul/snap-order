export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const generateSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

export const uniqueSlug = (slug: string) => {
  const baseSlug = generateSlug(slug) || "untitled";

  return `${baseSlug}-${Date.now().toString(36)}`;
};