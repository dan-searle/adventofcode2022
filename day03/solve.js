import { open } from 'node:fs/promises';

const file = await open('./input.txt');

const getItemsInBothCompartments = (compartment1, compartment2) => {
  const inBoth = [...compartment1].filter((char) => compartment2.includes(char));

  return [...new Set(inBoth)];
}

const getPriority = (char) => {
  return 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(char) + 1;
}

let totalScore = 0;

// part 1
// for await (const rucksack of file.readLines()) {
//   const compartment1 = rucksack.slice(0, rucksack.length / 2);
//   const compartment2 = rucksack.slice(rucksack.length / 2);
//   const itemsInBothCompartments = getItemsInBothCompartments(compartment1, compartment2);
//
//   itemsInBothCompartments.forEach((item) => {
//     totalScore = totalScore + getPriority(item);
//   });
// }

// part 2
const rucksacks = [];

for await (const rucksack of file.readLines()) {
  rucksacks.push(rucksack);
}

const groups = [];
const groupSize = 3;
for (let i = 0; i < rucksacks.length; i += groupSize) {
  const group = rucksacks.slice(i, i + groupSize);
  groups.push(group);
}

const getItemsInAllThreeRucksacks = ([rucksack1, rucksack2, rucksack3]) => {
  const [first] = [...rucksack1].filter((char) => rucksack2.includes(char) && rucksack3.includes(char));

  return first;
}

groups.forEach((group) => {
  const groupCommonItem = getItemsInAllThreeRucksacks(group);

  totalScore = totalScore + getPriority(groupCommonItem);
});

// console.log('groups', groups);

console.log('totalScore', totalScore);
