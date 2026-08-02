export const SequenceTypes = {
    Sequential: "Sequential",
    MidRepeat: "MidRepeat",
    Random: "Random",
} as const;

export type SequenceType =
    typeof SequenceTypes[keyof typeof SequenceTypes];