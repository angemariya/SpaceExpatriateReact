import { makeAutoObservable } from "mobx";
import { DeckModel } from "./DeckModel";
import { GameState } from ".";

export class DeckManager {
  constructor(
    private readonly gameState: GameState,
    private readonly gameId: string
  ) {
    makeAutoObservable(this);
  }

  delivery = new DeckModel("delivery", this.gameState.cards.delivery, this.gameId, this.gameState);
  engineering = new DeckModel("engineering", this.gameState.cards.engineering, this.gameId, this.gameState);
  terraforming = new DeckModel("terraforming", this.gameState.cards.terraforming, this.gameId, this.gameState);
  military = new DeckModel("military", this.gameState.cards.military, this.gameId, this.gameState);

  // dropCards = (...cards:BasicCard[]) => {
  //   cards.forEach((card) => this[card.type].dropCards(card));
  // };

  //this._tempDropCards.cards.forEach(card => this.deck[card.type].dropCards(card))
  
  // isInDeck = (card: GeneralCard) => {
  //   return this[card.type].findCard(card);
  // };

}
