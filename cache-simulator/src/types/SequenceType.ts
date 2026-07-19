export const SequenceType = {
    Sequential: "Sequential",
    MidRepeat: "MidRepeat",
    Random: "Random",
} as const;

export type SequenceType =
    typeof SequenceType[keyof typeof SequenceType];