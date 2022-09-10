import type { Component } from "solid-js";
import Card from "components/Card";
import { generateCard } from "./utils/card";

const App: Component = () => {
  const card = {
    color: 1,
    number: 4,
    type: 1,
    // action: 4,
  };

  const newCard = generateCard(card);
  console.log("newCard", newCard);

  return (
    <div>
      <Card data={newCard} />
    </div>
  );
};

export default App;
