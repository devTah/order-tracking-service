// import namor from "namor";
import { Status } from "../constants";
import Chance from "chance";

const range = (len: any) => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const randomEnumKey = (enumeration: any) => {
  const keys = Object.keys(enumeration).filter((k) => !(Math.abs(Number.parseInt(k)) + 1));
  const enumKey = keys[Math.floor(Math.random() * keys.length)];
  return enumKey;
};

const randomEnumValue = (enumeration: any) => enumeration[randomEnumKey(enumeration)];

function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).getTime();
}

const newPerson = (i: number) => {
  const random = new Chance();
  //   const statusChance = Math.random();
  //   return {
  //     firstName: random.name(),
  //     lastName: random.name(),
  //     age: Math.floor(Math.random() * 30),
  //     visits: Math.floor(Math.random() * 100),
  //     progress: Math.floor(Math.random() * 100),
  //     status: statusChance > 0.66 ? "relationship" : statusChance > 0.33 ? "complicated" : "single",
  //   };
  return {
    id: i,
    status: randomEnumValue(Status),
    customerName: random.name(),
    riderName: random.name(),
    merchantName: random.name(),
    merchantAddress: random.address(),
    totalPrice: random.natural({ min: 1, max: 100000 }),
    updatedTime: i !== 1 ? randomDate(new Date(2016, 0, 1), new Date()) : new Date().getTime(),
    dishes: {
      name: random.name(),
      price: random.natural({ min: 1, max: 100000 }),
    },
  };
};

export default function makeData(...lens: any) {
  const makeDataLevel: any = (depth = 0) => {
    const len = lens[depth];
    return range(len)
      .map((d, i) => {
        return {
          ...newPerson(i),
          subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
        };
      })
      .sort((a, b) => {
        if (a.updatedTime < b.updatedTime) return 1;
        if (a.updatedTime > b.updatedTime) return -1;
        return 0;
      });
  };

  return makeDataLevel();
}
