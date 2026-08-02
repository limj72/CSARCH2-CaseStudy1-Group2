export const ReadPolicies = {
    LoadThrough: "LoadThrough",
    NonLoadThrough: "NonLoadThrough",
} as const;

export type ReadPolicy =
    typeof ReadPolicies[keyof typeof ReadPolicies];