import Board from "./Board";
import Center from "./Center";
import Hand from "./Hand";
import useGameData from "./useGameData";

const Solo = () => {
  const { gameState } = useGameData();

  return (
    <>
      {gameState.state === "ready" && (
        <div>
          <Board />
          <Hand />
          <Center card={gameState().centerCard} />
        </div>
      )}
    </>
  );
};

export default Solo;
