import { Predictions } from "../models/Prediction"

export const PredictionsMapper = (predictions: any): Predictions[] => {
    let predictionsToReturn: Predictions[] = [];
    predictions.forEach((prediction: any) => {
        const mappedPrediction: Predictions = {
            bbox: prediction[0].bbox,
            class: prediction[0].class,
            score: prediction[0].score * 100
        }        
        predictionsToReturn.push(mappedPrediction)
    });

    return predictionsToReturn;
}