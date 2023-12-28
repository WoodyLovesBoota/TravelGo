import axios from "axios";

const API_KEY = process.env.REACT_APP_GOOGLE_MAP_API_KEY;

const google_proxy = window.location.hostname === "localhost" ? "" : "/google_proxy";

export interface IGetPlaceResult {
  candidates: IPlaceDetail[];
  status: string;
}

export interface IAutoCompletePlaceDetail {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
  };
}

export interface IGetPlaceDetailResult {
  result: IPlaceDetail;
  status: string;
}

export interface IPlaceDetail {
  formatted_address: string;
  international_phone_number: string;
  rating: number;
  photos: { photo_reference: string | undefined }[];
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  name: string;
  editorial_summary: { overview: string };
  reviews: {
    rating: number;
    text: string;
    relative_time_description: string;
    author_name: string;
  };
  place_id: string;
}

export interface IGeAutoCompletePlacesResult {
  predictions: IAutoCompletePlaceDetail[];
  status: string;
}

export const getPlaceResult = async (keyword: string | undefined) => {
  return await axios
    .get(
      `${google_proxy}/maps/api/place/findplacefromtext/json?input=${keyword}&inputtype=textquery&fields=formatted_address%2Cplace_id%2Cphotos%2Cname%2Crating%2Cgeometry&key=${API_KEY}`
    )
    .then((res) => res.data);
};

export const getAutoCompletePlacesResult = async (
  keyword: string | undefined,
  location: string,
  radius: number
) => {
  return await axios
    .get(
      `${google_proxy}/maps/api/place/autocomplete/json?input=${keyword}&location=${location}&radius=${radius}&key=${API_KEY}`
    )
    .then((res) => res.data);
};

export const getPlaceDetailResult = async (id: string | undefined) => {
  return await axios
    .get(
      `${google_proxy}/maps/api/place/details/json?fields=name%2Crating%2Creviews%2Cinternational_phone_number%2Cformatted_address%2Ceditorial_summary%2Cgeometry%2Cphotos&language=ko&place_id=${id}&key=${API_KEY}`
    )
    .then((res) => res.data);
};
