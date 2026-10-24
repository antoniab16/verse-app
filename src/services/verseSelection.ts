export function normalizeReference(reference: string) {
  return reference.trim().replace(/\s+/g, ' ').toLowerCase();
}

export function chooseRandomReference(
  references: string[],
  seenReferences: Set<string>,
) {
  const unseenReferences = references.filter(
    (reference) => !seenReferences.has(normalizeReference(reference)),
  );
  const availableReferences = unseenReferences.length > 0 ? unseenReferences : references;

  if (availableReferences.length === 0) return undefined;

  return availableReferences[Math.floor(Math.random() * availableReferences.length)];
}

export function parseSeenReferences(value: string | string[] | undefined) {
  if (!value) return new Set<string>();

  try {
    const parsed = JSON.parse(Array.isArray(value) ? value[0] : value);
    return new Set(
      Array.isArray(parsed)
        ? parsed
            .filter((item): item is string => typeof item === 'string')
            .map(normalizeReference)
        : [],
    );
  } catch {
    return new Set<string>();
  }
}
