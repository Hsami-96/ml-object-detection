type BoundingBox = [number, number, number, number];

export type Predictions = {
    bbox: BoundingBox;
    class: string;
    score: number;
};