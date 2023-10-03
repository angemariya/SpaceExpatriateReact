import styles from "./Table.module.scss";
import { TableModel } from "../../Rules/TableModel";
import { observer } from "mobx-react-lite";
import { Card } from "../../components/Card";
import { ActionManager } from "../../Rules/ActionManager";
import { RoundManager } from "../../Rules/RoundManager";
import { ResourcesModel } from "../../Rules/ResourcesModel";
import { useState } from "react";
import { CardDefinition, ColonyCard } from "../../Rules/card-types";
import { ResetButton } from "../../components/ResetButton";

interface TableProps {
  model: TableModel;
  round: RoundManager;
  action: ActionManager;
  resources: ResourcesModel;
}

export const Table = observer((props: TableProps) => {
  const [selectedCards, setSelectedCards] = useState([] as CardDefinition[]);

  const handleClick = (card: Exclude<CardDefinition, ColonyCard>) => {
    props.action.activateCardOnTable(card) &&
      setSelectedCards([...selectedCards, card]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.cardsContainer}>
        {props.model.delivery.map((card, ind) => (
          <Card
            key={ind}
            {...card}
            isSelected={selectedCards.includes(card)}
            onClick={() => handleClick(card)}
          />
        ))}
      </div>
      <div className={styles.cardsContainer}>
        {props.model.engineering.map((card, ind) => (
          <Card
            key={ind}
            {...card}
            isSelected={selectedCards.includes(card)}
            isAvailable={
              props.round.phase === "delivery" &&
              props.round.step === "performing"
            }
            onClick={() => handleClick(card)}
          />
        ))}
      </div>
      <div className={styles.cardsContainer}>
        {props.model.terraforming.map((card, ind) => (
          <Card
            key={ind}
            {...card}
            isSelected={selectedCards.includes(card)}
            isAvailable={
              props.round.phase === "delivery" &&
              props.round.step === "performing"
            }
            onClick={() => handleClick(card)}
          />
        ))}
      </div>
      <div className={styles.cardsContainer}>
        {props.model.military.map((card, ind) => (
          <Card
            key={ind}
            {...card}
            isSelected={selectedCards.includes(card)}
            onClick={() => handleClick(card)}
          />
        ))}
      </div>
      {props.round?.step === "performing" && (
        <div className={styles.end} onClick={props.action.tryNext}>
          End the round
        </div>
      )}
      <div className={styles.round}>{"Round: " + props.round.current}</div>
      {/*  {(["delivery", "engineering", "terraforming", "military"] as const).map(el => 
        <div className={styles.cardsContainer}>
        {props.model[el].map((card, ind) => (
          <Card key={ind} {...card} 
          {}
          isSelected={props.action.cardsToDrop.includes(card)}
           onClick={()=>props.action.activateCardsOnTable(card)}/>
        ))}
      </div>
      )}*/}

      {/*buttons*/}
      {props.round.step === "performing" && selectedCards.length > 0 && (
        <ResetButton action={props.action} />
      )}
      {props.round.phase === "delivery" &&
        props.round.step === "performing" && (
          <ResetButton action={props.action} />
        )}
      {props.round.step === "performing" && selectedCards.length >= 3 && (
        <button
          className={styles.confirmButton}
          onClick={props.action.tryNext} //обнулить useState в пустой массив
        >
          Confirm
        </button>
      )}

      {props.round.step === "performing" && (
        <button
          className={styles.giveUpButton}
          onClick={props.action.tryNext} //обнулить useState в пустой массив
        >
          End turn
        </button>
      )}
    </div>
  );
});
