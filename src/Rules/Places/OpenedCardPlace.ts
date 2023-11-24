import { CardType, GeneralCard } from "../card-types";
import { BasicPlace } from ".";

export class OpenedCardsPlace<T extends GeneralCard> extends BasicPlace<T> {
  protected getCardInstance(id: number): T {
    return this.cardsCollection[id];
  }

  constructor(
    private prefix: CardType,
    private readonly cardsCollection: {
      [key: number]: T;
    },
    gameId: string
  ) {
    super();
    //makeAutoObservable(this);
    // makeAutoSavable(
    //   this,
    //   gameId,
    //   `openedCard_${prefix}`
    //   ["_cards" as any] /*, this.gameState.saveCondition*/
    // );
  }
}
