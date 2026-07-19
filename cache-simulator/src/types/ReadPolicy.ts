export const ReadPolicy = {
    LoadThrough: "LoadThrough",
    NonLoadThrough: "NonLoadThrough",
} as const;

export type ReadPolicy =
    typeof ReadPolicy[keyof typeof ReadPolicy];