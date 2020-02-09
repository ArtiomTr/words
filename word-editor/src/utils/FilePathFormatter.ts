export const formatFilePath = (inputPath: string): string => {
    if (inputPath.length === 0) return inputPath;
    let pointIndex = inputPath.lastIndexOf(".");
    if (pointIndex !== -1) {
        return inputPath.substring(0, pointIndex) + ".json";
    } else {
        return inputPath + ".json";
    }
}