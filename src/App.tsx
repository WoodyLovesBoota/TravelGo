import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import City from "./Routes/City";
import Search from "./Routes/Search";
import Place from "./Routes/Place";
import Overview from "./Routes/Overview";
import Review from "./Routes/Review";
import Map from "./Routes/Map";
import Journey from "./Routes/Journeys";
// import Home from "./Routes/Home";
import Summary from "./Routes/Summary";
import Date from "./Routes/Date";
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { firebaseDB } from "./firebase/firebase";
import { useRecoilState } from "recoil";
import { userState } from "./atoms";
import AttractionScreen from "./Components/AttractionScreen";
import ScheduleScreen from "./Components/ScheduleScreen";

const App = () => {
  const [userInfo, setUserInfo] = useRecoilState(userState);

  // useEffect(() => {
  //   onSnapshot(collection(firebaseDB, "destination"), (snapshot) => {
  //     const postsArr = snapshot.docs.map((eachDoc) => {
  //       return Object.assign(eachDoc.data(), { id: eachDoc.id });
  //     });
  //     const sortedArr = postsArr.sort((a: any, b: any) => {
  //       return b.timestamp - a.timestamp;
  //     });
  //     // return console.log(sortedArr[sortedArr.findIndex((e) => e.id === "userDestination")]);
  //     return setUserInfo({
  //       Trip1: sortedArr[sortedArr.findIndex((e) => e.id === "userDestination")]["Trip1"],
  //     });
  //   });
  // });

  return (
    <>
      <Router basename={process.env.PUBLIC_URL}>
        <Routes>
          <Route path="/summary/:title/:destination" element={<Summary />}></Route>

          <Route path="/travel/:destination" element={<Place />}>
            <Route path="/travel/:destination/:place" element={<Place />}>
              <Route path="overview" element={<Overview />}></Route>
              <Route path="review" element={<Review />}></Route>
              <Route path="map" element={<Map />}></Route>
            </Route>
          </Route>
          <Route path="/search/:title" element={<Search />}></Route>
          <Route path="/schedule" element={<Journey />}>
            <Route path="/schedule/:city" element={<Journey />} />
          </Route>
          <Route path="/place" element={<Place />}>
            <Route path="/place/:city" element={<Place />}>
              <Route path="/place/:city/:place" element={<Place />}>
                <Route path="overview" element={<Overview />}></Route>
                <Route path="review" element={<Review />}></Route>
                <Route path="map" element={<Map />}></Route>
              </Route>
            </Route>
          </Route>
          <Route path="/city" element={<City />}></Route>
          <Route path="/" element={<Date />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
