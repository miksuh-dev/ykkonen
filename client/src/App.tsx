import type { Component } from "solid-js";
import Card from "components/Card";
import { generateCard } from "./utils/card";

const App: Component = () => {
  const newCard = generateCard({
    color: 4,
    number: 1,
    type: 1,
    // action: 2,
  });
  console.log("newCard", newCard);

  return (
    <div>
      <Card data={newCard} />
    </div>
  );
};

export default App;
