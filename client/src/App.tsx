import type { Component } from "solid-js";
import { Routes, Route, Navigate } from "@solidjs/router";
import Login from "view/Login";
import Register from "view/Register";
import Main from "view/Main";
// import Card from "components/Card";
// import { generateCard } from "./utils/card";

const App: Component = () => {
  // const card = {
  //   color: 4,
  //   number: 1,
  //   type: 1,
  //   // action: 2,
  // };
  //
  // const newCard = generateCard(card);
  // console.log("newCard", newCard);

  const getPath = () => {
    //navigate is the result of calling useNavigate(); location is the result of calling useLocation().
    //You can use those to dynamically determine a path to navigate to
    return "/login";
  };
  return (
    <>
      <Routes>
        <Route path="/">
          <Navigate href={getPath} />
        </Route>
        <Route path="/" component={Main} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route
          path="/about"
          element={<div>This site was made with Solid</div>}
        />
      </Routes>
    </>
  );
};

export default App;
