import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import City from "./Routes/City";
import Search from "./Routes/Search";
import Place from "./Routes/Place";
import Overview from "./Routes/Overview";
import Review from "./Routes/Review";
import Map from "./Routes/Map";
import Journeys from "./Routes/Journeys";
import Path from "./Routes/Path";
import Home from "./Routes/Home";
import Summary from "./Routes/Summary";

const App = () => {
  return (
    <>
      <Router basename={process.env.PUBLIC_URL}>
        <Routes>
          <Route path="/summary/:title/:destination" element={<Summary />}></Route>
          <Route path="/journey/:title/:destination" element={<Journeys />}>
            <Route path="/journey/:title/:destination/:boardName" element={<Path />} />
            <Route path="/journey/:title/:destination/:place" element={<Journeys />}>
              <Route path="overview" element={<Overview />}></Route>
              <Route path="review" element={<Review />}></Route>
              <Route path="map" element={<Map />}></Route>
            </Route>
          </Route>
          <Route path="/travel/:title/:destination" element={<Place />}>
            <Route path="/travel/:title/:destination/:place" element={<Place />}>
              <Route path="overview" element={<Overview />}></Route>
              <Route path="review" element={<Review />}></Route>
              <Route path="map" element={<Map />}></Route>
            </Route>
          </Route>
          <Route path="/search/:title" element={<Search />}></Route>
          <Route path="/destination/:title" element={<City />}></Route>
          <Route path="/" element={<Home />}></Route>
        </Routes>
      </Router>
    </>
  );
};

export default App;
