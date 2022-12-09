import { open } from 'node:fs/promises';

const file = await open('./input.txt');

const totalCaloriesByElf = [];
let currentElfCalories = 0;
let elfNumber = 1;

for await (const line of file.readLines()) {
  // console.log(line);
  if (line === '') {
    totalCaloriesByElf.push({
      elf: elfNumber,
      calories: currentElfCalories,
    });
    currentElfCalories = 0;
    elfNumber += 1;
  } else {
    currentElfCalories += Number(line);
  }
}

totalCaloriesByElf.sort((a, b) => {
  if (a.calories < b.calories) {
    return -1;
  } else if (a.calories < b.calories) {
    return 1;
  }

  return 0;
})

// console.log('totalCaloriesByElf', JSON.stringify(totalCaloriesByElf, null, 2));

const topThreeElves = totalCaloriesByElf.slice(-3);

console.log('total calories carried by the three elves with the most calories', topThreeElves.reduce((total, elf) => total = total + elf.calories, 0));