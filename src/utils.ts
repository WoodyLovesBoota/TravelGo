const API_KEY = process.env.REACT_APP_GOOGLE_MAP_API_KEY;

export const makeImagePath = (reference: string | undefined, maxWidth: number) => {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${reference}&key=${API_KEY}`;
};

export const daysSinceSpecificDate = (
  [year, month, day]: number[],
  [endY, endM, endD]: number[]
) => {
  const currentDate: Date = new Date(endY, endM - 1, endD);
  const specificDate: Date = new Date(year, month - 1, day);
  const timeDiff: number = currentDate.getTime() - specificDate.getTime();
  const daysDiff: number = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  return daysDiff;
};
