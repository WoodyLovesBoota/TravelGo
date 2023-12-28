import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import City from "./Routes/City";
import Place from "./Routes/Place";
import Journey from "./Routes/Journeys";
import Summary from "./Routes/Summary";
import Date from "./Routes/Date";

import { collection, onSnapshot } from "firebase/firestore";
import { firebaseDB } from "./firebase/firebase";

const App = () => {
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
          <Route path="/summary" element={<Summary />}></Route>

          <Route path="/schedule" element={<Journey />}>
            <Route path="/schedule/:city" element={<Journey />} />
          </Route>
          <Route path="/place" element={<Place />}>
            <Route path="/place/:city" element={<Place />}></Route>
          </Route>
          <Route path="/city" element={<City />}></Route>
          <Route path="/" element={<Date />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
