import type { Component } from "solid-js";
import Card from "components/Card";
import { generateCard } from "./utils/card";

const App: Component = () => {
  const card = {
    color: 4,
    number: 1,
    type: 1,
    // action: 2,
  } as Card;
  const newCard = generateCard(card);
  console.log("newCard", newCard);

  return (
    <div>
      <Card data={newCard} />
    </div>
  );
};

export default App;
