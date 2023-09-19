import { makeAutoObservable } from "mobx";
import {
  EngineeringCard,
  ResourcePrimitive,
  TerraformingCard,
} from "./card-types";
import { TableModel } from "./TableModel";

type playerResources = {
  [key in ResourcePrimitive | any]: number;
  //[key: any]: number;
};

export class ResourcesModel {
  // будет разделение на PLayerModel & GarbageModel

  public playerResources: playerResources = {
    fuel: 0,
    minerals: 0,
    "biotic materials": 0,
    machinery: 0,
    nanotechnologies: 0,
    "dark matter": 0,
  };

  public charterResource?: ResourcePrimitive;

  public garbageResources: playerResources = {
    fuel: 0,
    minerals: 0,
    "biotic materials": 0,
    machinery: 0,
    nanotechnologies: 0,
  };

  public tempGarbageResources: playerResources = {};
  // public tempPlayerResources: playerResources = {};
  /*
  resetGarbage = () => { //скорее всего не будет использоваться, было для ресета, пока оставлю
   
    for (let key in this.tempGarbageResources) {
      this.garbageResources[key] = this.tempGarbageResources[key];
    }
  };*/
  saveGarbage = () => {
    for (let key in this.garbageResources) {
      this.tempGarbageResources[key] = this.garbageResources[key];
    }
  };
  /**********Points************************************************************************** */
  public points = {
    round: 0,
    total: 0,
  };

  public engineeringMaps = {
    Start: {} as { [key: number]: number },
    Middle: {} as { [key: number]: number },
    FinishCounter: 0,
  };

  constructor(private readonly table: TableModel) {
    makeAutoObservable(this);
  }

  getResources = () => {
    this.dropResources();
    this.table.delivery.forEach((card) =>
      card.resources.forEach((res) => this.playerResources[res]++)
    );
    for (let key in this.playerResources) {
      if (this.garbageResources.hasOwnProperty(key)) {
        this.playerResources[key] -= this.garbageResources[key];
      }

      if (this.playerResources[key] < 0) this.playerResources[key] = 0;
    }
    this.charterResource && this.playerResources[this.charterResource]++;
    // this.savePlayerResources()//запасной вариант востановления ресурсов при ресете
  };

  addResource = (resource: ResourcePrimitive) => {
    this.charterResource = resource;
  };

  dropToGarbage = () => {
    for (let key in this.garbageResources) {
      this.garbageResources[key] = this.playerResources[key];
    }
    this.saveGarbage(); //сохранение состояния гаража в момент перехода на следующий раунд
  };

  dropResources = () => {
    for (let key in this.playerResources) {
      this.playerResources[key] = 0;
    }
  };
  /*
  savePlayerResources = () => {//запасной вариант востановления ресурсов при ресете
    for (let key in this.playerResources) {
      this.tempPlayerResources[key] = this.playerResources[key];
    }
  };
resetPlayerResources = () => {//запасной вариант востановления ресурсов при ресете
  for (let key in this.tempPlayerResources) {
    this.playerResources[key] = this.tempPlayerResources[key];
  }
}*/
  consumeResources = (resources: ResourcePrimitive[]) => {
    //потребление ресурсов
    resources.forEach((resource) => {
      this.playerResources[resource]--;
    });
  };

  canConsumeResources(resources: ResourcePrimitive[]) {
    // перевіряємо чи є в гравця кошти для виконання карти (списали /не зайшли в мінус?/повернули)
    this.consumeResources(resources);
    const hasNegativeValues = Object.values(this.playerResources).some(
      (value) => value < 0
    );
    resources.forEach((resource) => {
      this.gainResource(resource);
    });
    return !hasNegativeValues;
  }

  gainResource = (resource: ResourcePrimitive) => {
    this.playerResources[resource]++;
  };

  removeResourcesFromGarbage = (resource: ResourcePrimitive) => {
    this.garbageResources[resource] = 0;
  };

  calculateTotalPoints = () => {
    this.points.total += this.points.round;
  };

  calculateRoundPoints = (card: EngineeringCard | TerraformingCard) => {
    this.points.round += card.points || 0;
  };

  // resetPoints = () => {
  //   this.points.total = 0;
  // }; ...не нужен

  resetRoundPoints = () => {
    this.points.round = 0;
  };

  resetRoundState = () => {
    this.resetRoundPoints(); // был ресет всех очков, а надо только раунда
    this.resetEnergy(); // обнуляем счетчик энергии
    this.getResources();
  };

  //createEngineeringMap = (cards: any[]) => {//test is in DeliveryActionWindow
  createEngineeringMaps = (cards: EngineeringCard[]) => {
    if (cards.length === 0) return;
    const startArr: EngineeringCard[] = [];
    const continueArr: EngineeringCard[] = [];

    cards.forEach((card) => {
      if (card.connection === "start") startArr.push(card);
      if (card.connection === "continue") continueArr.push(card);
    });
    this.engineeringMaps.Start = startArr.reduce(
      (acc, card) => (acc[card.id] = 1) && acc,
      {} as { [key: number]: number }
    );
    this.engineeringMaps.Middle = continueArr.reduce(
      (acc, card) => (acc[card.id] = 0) || acc,
      {} as { [key: number]: number }
    );

    console.log(this.engineeringMaps.Start);
    console.log(this.engineeringMaps);
  };

  useCardConnection = (card: EngineeringCard) => {
    if (card.connection === "start") {
      this.setStartValueToZero(card);
      this.increaseEnergyAndMapValues();
    }
    if (card.connection === "continue") {
      this.decreaseMiddleValue(card);
    }
    if (card.connection === "end") {
      this.changeFinishCounter(-1);
    }
  };

  setStartValueToZero(card: EngineeringCard) {
    this.engineeringMaps.Start[card.id] = 0;
  }

  private increaseAllMiddleValues() {
    for (const key in this.engineeringMaps.Middle) {
      if (this.engineeringMaps.Middle.hasOwnProperty(key)) {
        this.engineeringMaps.Middle[key]++;
      }
    }
  }

  decreaseMiddleValue(card: EngineeringCard) {
    this.engineeringMaps.Middle[card.id]--;
  }

  changeFinishCounter(increment: number) {
    this.engineeringMaps.FinishCounter += increment;
  }

  /****Energy*************************************************************************** */

  public energy = 0;

  resetEnergy = () => {
    this.energy = 0;
  };

  increaseEnergy = () => {
    this.energy++;
  };

  increaseEnergyAndMapValues = () => {
    this.increaseEnergy();
    this.increaseAllMiddleValues();
    this.changeFinishCounter(1);
  };
}
