const API_KEY = process.env.REACT_APP_GOOGLE_MAP_API_KEY;

export const makeImagePath = (
  reference: string | undefined,
  maxWidth: number
) => {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${reference}&key=${API_KEY}`;
};
