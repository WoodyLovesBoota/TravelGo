import { atom } from "recoil";
import { IPlaceDetail } from "./api";

export enum STATUS {
  "DEFAULT",
  "JOURNEYS",
}

export const navState = atom<STATUS>({
  key: "navState",
  default: STATUS.DEFAULT,
});

export const placeState = atom<string | undefined>({
  key: "place",
  default: "",
});

export const detailPlaceState = atom<string | undefined>({
  key: "detailPlace",
  default: "",
});

export const isCardClickedState = atom<boolean>({
  key: "isCardClicked",
  default: false,
});

export const destinationState = atom<IPlaceDetail | undefined>({
  key: "currentDestination",
  default: {
    formatted_address: "string",
    international_phone_number: "string",
    rating: 0,
    photos: [{ photo_reference: "string" }],
    geometry: {
      location: {
        lat: 0,
        lng: 0,
      },
    },
    name: "string",
    editorial_summary: { overview: "string" },
    reviews: {
      rating: 0,
      text: "string",
      relative_time_description: "string",
      author_name: "string",
    },
    place_id: "string",
  },
  effects: [
    ({ setSelf, onSet }: any) => {
      const savedValue = localStorage.getItem("currentDestination");
      if (savedValue !== null) setSelf(JSON.parse(savedValue));
      onSet((newValue: any, _: any, isReset: boolean) => {
        isReset
          ? localStorage.removeItem("currentDestination")
          : localStorage.setItem("currentDestination", JSON.stringify(newValue));
      });
    },
  ],
});

export const tripState = atom<string>({
  key: "currentTrip",
  default: "Trip1",
  effects: [
    ({ setSelf, onSet }: any) => {
      const savedValue = localStorage.getItem("currentTrip");
      if (savedValue !== null) setSelf(JSON.parse(savedValue));
      onSet((newValue: any, _: any, isReset: boolean) => {
        isReset
          ? localStorage.removeItem("currentTrip")
          : localStorage.setItem("currentTrip", JSON.stringify(newValue));
      });
    },
  ],
});

export const journeyState = atom<IJourneys>({
  key: "journey",
  default: { Journeys: [] },
  effects: [
    ({ setSelf, onSet }: any) => {
      const savedValue = localStorage.getItem("journey");
      if (savedValue !== null) setSelf(JSON.parse(savedValue));
      onSet((newValue: any, _: any, isReset: boolean) => {
        isReset
          ? localStorage.removeItem("journey")
          : localStorage.setItem("journey", JSON.stringify(newValue));
      });
    },
  ],
});

export const userState = atom<IUsers>({
  key: "user",
  default: { Trip1: { date: "", trips: [] } },
  effects: [
    ({ setSelf, onSet }: any) => {
      const savedValue = localStorage.getItem("users");
      if (savedValue !== null) setSelf(JSON.parse(savedValue));
      onSet((newValue: any, _: any, isReset: boolean) => {
        isReset
          ? localStorage.removeItem("users")
          : localStorage.setItem("users", JSON.stringify(newValue));
      });
    },
  ],
});

export const choiceState = atom<number>({
  key: "choice",
  default: 0,
});

export const startDateState = atom<string>({
  key: "startDate",
  default: "출발 날짜",
});

export const endDateState = atom<string>({
  key: "endDate",
  default: "도착 날짜",
});

interface IJourneys {
  [key: string]: IJourney[];
}

export interface IUsers {
  [name: string]: { date: string; trips: ITripDetails[] };
}

export interface IJourney {
  name: string | undefined;
  address: string | undefined;
  placeId: string | undefined;
  geo: { lat: number; lng: number };
  image: (string | undefined)[];
  overview: string | undefined;
  timestamp: number | undefined;
}

export interface ITripDetails {
  destination: IPlaceDetail | undefined;
  detail: ITripDetail;
}

interface ITripDetail {
  date: string;
  attractions: { [key: string]: (IJourney | undefined)[] };
  hotels: (IJourney | undefined)[];
  wtm: (string | undefined)[];
}
