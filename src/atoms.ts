import { atom } from "recoil";
import { IPlaceDetail } from "./api";

export const isCalendarState = atom<boolean>({
  key: "isCalendarOpen",
  default: false,
});

export const isClickedState = atom<string | undefined>({
  key: "isClickedState",
  default: "",
});

export const isCardClickedState = atom<boolean>({
  key: "isCardClicked",
  default: false,
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
