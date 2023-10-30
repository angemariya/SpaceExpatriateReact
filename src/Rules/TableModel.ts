import { makeAutoObservable } from "mobx";
import {
  CardDefinition, SelectableEngineeringCard } from "./card-types";
import { DeliveryCard } from "../Rules/CardsModel/delivery";
import { EngineeringCard } from "../Rules/CardsModel/engineering";
import { MilitaryCard } from "../Rules/CardsModel/military";
import { TerraformingCard } from "../Rules/CardsModel/terraforming";
import { makeAutoSavable } from "../Utils/makeAutoSavable";

export class TableModel {
  constructor(gameId: string) {
    makeAutoObservable(this);
    makeAutoSavable(this, gameId, "table", [
      "delivery",
      "engineering",
      "terraforming",
      "military",
    ]);
  }

  delivery: (DeliveryCard & { isSelected: boolean })[] = [];
  engineering: SelectableEngineeringCard[] = [];
  terraforming: (TerraformingCard & { isSelected: boolean })[] = [];
  military: (MilitaryCard & { isSelected: boolean })[] = [];

  dropCards = (
    //очистить сброшенные карты со стола
    ...cards: (
      | DeliveryCard
      | EngineeringCard
      | TerraformingCard
      | MilitaryCard
    )[]
  ) => {
    this.delivery = this.delivery.filter((card) => !cards.includes(card));
    this.engineering = this.engineering.filter((card) => !cards.includes(card));
    this.terraforming = this.terraforming.filter(
      (card) => !cards.includes(card)
    );
    this.military = this.military.filter((card) => !cards.includes(card));
    return cards;
  };

  takeCard = (card: CardDefinition) => {
    this[card.type].push(card as any);
  };

  resetSelectedFlags = () => {
    this.delivery.forEach((card) => (card.isSelected = false));
    this.engineering.forEach((card) => (card.isSelected = false));
    this.terraforming.forEach((card) => (card.isSelected = false));
    this.military.forEach((card) => (card.isSelected = false));
  };

  toggleSelectedFlag = (card: CardDefinition) => {
    this[card.type].forEach((el) => {
      if (el.id === card.id) {
        el.isSelected = !el.isSelected;
      }
    });
  };

  isOnTable = (card: CardDefinition) => {
    return this[card.type].some((tableCard) => tableCard.id === card.id);
  };
}
