import { makeAutoObservable } from "mobx";
import { makeAutoSavable } from "../../Utils/makeAutoSavable";
import { ColonyCard } from "../card-types";

export class ColonyDeckModel {
  constructor(
    private readonly cardsDefinitions: { [key: number]: ColonyCard },
    gameId: string
  ) {
    makeAutoObservable(this);
    const isLoaded = makeAutoSavable(this, gameId, "colonyDeck", [
      "_activeCards" as any,
      "openedCards"]
    )
    if (!isLoaded) {
      this.initialize();
    }
  }

  private _activeCards: number[] = [];
  openedCards: (ColonyCard & { points: number })[] = [];

  initialize = () => {
    this._activeCards = Object.keys(this.cardsDefinitions);
    this.mixCards();
    this.openedCards = this._activeCards
      .splice(0, 3)
      .map((id) => ({ ...this.cardsDefinitions[id], points: 0 }));
  };

  openCard() {
    this.openedCards.forEach(el => el.points += (this.openedCards.length === 1 ? 2 : 1))
    if (this.openedCards.length >= 3) return

    const remainingCards = 3 - this.openedCards.length;
    const newCards = this._activeCards
      .splice(0, remainingCards)
      .map((id) => ({ ...this.cardsDefinitions[id], points: 0 }));
    this.openedCards.push(...newCards);
  }

  takeOpenedCard(ind: number) {
    const card = this.openedCards[ind];
    this.openedCards.splice(ind, 1);
    return card;
  }

  takeCard = (): ColonyCard => {
    const idOfCard = this._activeCards.pop()!;
    if (this._activeCards.length === 0) {
      //игра заканчивается, подсчитываются очки - метод нужен позже
    }
    return this.cardsDefinitions[idOfCard];
  };

  mixCards() {
    const result: number[] = [];
    const restCards = [...this._activeCards];

    while (restCards.length > 0) {
      const randomIndex = Math.floor(Math.random() * restCards.length);
      result.push(restCards[randomIndex]);
      restCards.splice(randomIndex, 1);
    }
    this._activeCards = result;
  }
}
