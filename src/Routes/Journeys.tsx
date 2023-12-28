import { useRecoilState } from "recoil";
import { userState, tripState } from "../atoms";
import Header from "../Components/Header";
import AttractionScreen from "../Components/AttractionScreen";
import ScheduleScreen from "../Components/ScheduleScreen";

const Journey = () => {
  const [userInfo, setUserInfo] = useRecoilState(userState);
  const [currentTrip, setCurrentTrip] = useRecoilState(tripState);

  return (
    <>
      <Header now={3} />

      {userInfo[currentTrip].trips.map((city, index) => (
        <>
          <AttractionScreen destination={city.destination} />
          <ScheduleScreen destination={city.destination} />
        </>
      ))}
    </>
  );
};

export default Journey;
