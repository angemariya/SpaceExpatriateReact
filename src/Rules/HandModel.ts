import { makeAutoObservable } from "mobx";
import { GeneralCard} from "../Rules/card-types";
import { makeAutoSavable } from "../Utils/makeAutoSavable";
import { GameState } from ".";
import { HandPlace } from "./Places/HandPlace";



export class HandModel {
  
  _cardsInHand = new HandPlace(this.gameState.cards, this.gameId)
  public tempDroppedCards: GeneralCard[] = [];
  
  constructor(
    private readonly gameState: GameState,
    private readonly gameId: string) {
    makeAutoObservable(this);
    makeAutoSavable(this, gameId, "hand", ["_cardsInHand" as any], this.gameState.saveCondition);
  }
  /*
  get cardsInHand(): readonly GeneralCard[] {
    return this._cardsInHand.map((cardId) => this.gameState.cards[cardId.type][cardId.id]);
  }
*/
  dropCard = (ind: number) => {
    const card = this._cardsInHand[ind];
    this._cardsInHand.splice(ind, 1);
    return this.gameState.cards[card.type][card.id];
  };
  
  
/*
  takeCard(card?: GeneralCard) {
    card && this._cardsInHand.push({id:card.id, type: card.type});
  }
*/
  
  // isInHand = (card: GeneralCard): boolean => {
  //   return this.cardsInHand.some(
  //     (handCard) => handCard.id === card.id && card.type === handCard.type
  //   );
  // };
}
