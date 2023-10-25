import { HandModel } from "../Rules/HandModel";
import { DeckManager } from "./DeckManager";
import { TableModel } from "./TableModel";
import { makeAutoObservable } from "mobx";
import { RoundManager } from "./RoundManager";
import { ActionManager } from "./ActionManager";
import { ResourcesModel } from "./ResourcesModel";
import { createContext, useContext } from "react";
import { ColonyManager } from "./Colony/ColonyManager";
import { ColonyDeckModel } from "./Colony/ColonyDeckModel";
import { colonyCards } from "./Colony/colony-cards";
import { ModalManager } from "./ModalManager";

export class GameState {
  constructor(public readonly gameId: string = "") {
    makeAutoObservable(this);
  }

  hand = new HandModel(this.gameId);
  decks = new DeckManager(this.gameId);
  colonyDeck = new ColonyDeckModel(colonyCards, this.gameId);
  table = new TableModel(this.gameId);
  modal = new ModalManager();
  round = new RoundManager(this.decks, this.hand, this.colonyDeck, this.gameId);
  resources = new ResourcesModel(this.table, this.modal, this.gameId);
  colony = new ColonyManager(this, this.gameId, this.table, this.resources, this.colonyDeck, this.hand, this.decks);
  action = new ActionManager(this.decks, this.table, this.round, this.hand, this.resources, this.gameId, this.colony, this.colonyDeck, this.modal);
}

const gameStateContext = createContext(new GameState())
export const { Provider } = gameStateContext;
export const useGameState = () => useContext(gameStateContext);
