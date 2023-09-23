import { Route, Routes } from "react-router-dom";

import CommentList from "./components/CommentList";
import Config from "./components/Config";
import Header from "./components/Header";
import Redirection from "./components/Redirection";

export default function App() {
  return (
    <div>
      <Header />

      <Routes>
        <Route path="index" element={<CommentList />} />
        <Route path="config" element={<Config />} />
        <Route path="redirect" element={<Redirection />} />
      </Routes>
    </div>
  );
}
