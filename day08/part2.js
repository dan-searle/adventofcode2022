import { open } from 'node:fs/promises';

const file = await open('./input.txt');

const rows = [];

for await (const lineStr of file.readLines()) {
  rows.push([...lineStr].map((char) => Number(char)));
}

const rowCount = rows.length;
const colCount = rows[0].length;

console.log('rows & cols', rowCount, colCount);
// console.log(JSON.stringify(rows, null, 2));

const getScenicScore = (trees) => {
  // console.log('getScenicScore', trees);
  if (trees.length === 1) { // at edge
    // console.log('score', 1);
    return 0;
  }
  const thisTreeHeight = trees.shift();
  const firstTreeOfEqualOrGreaterHeight = trees.findIndex((height) => height >= thisTreeHeight);

  if (firstTreeOfEqualOrGreaterHeight === -1) {
    // console.log('score', trees.length);
    return trees.length;
  } else {
    // console.log('score', firstTreeOfEqualOrGreaterHeight + 1);
    return firstTreeOfEqualOrGreaterHeight + 1;
  }
}

const getTreeScenicScore = (colIndex, rowIndex) => {
  // console.log('getTreeScenicScore', rowIndex, colIndex);
  const hereToLeftEdge = rows[rowIndex].slice(0, colIndex + 1).reverse();
  const hereToRightEdge = rows[rowIndex].slice(colIndex);
  const hereToTopEdge = rows.slice(0, rowIndex + 1).map((cols) => cols[colIndex]).reverse();
  const hereToBottomEdge = rows.slice(rowIndex).map((cols) => cols[colIndex]);

  const left = getScenicScore(hereToLeftEdge);
  const right = getScenicScore(hereToRightEdge);
  const up = getScenicScore(hereToTopEdge);
  const down = getScenicScore(hereToBottomEdge);

  return {
    up,
    right,
    down,
    left,
    total: up * left * down * right,
  };
};

// console.log(getTreeScenicScore(2, 3));

let highestScore = 0;

rows.forEach((cols, rowIndex) => {
  cols.forEach((col, colIndex) => {
    const thisTreeScore = getTreeScenicScore(colIndex, rowIndex);
    highestScore = Math.max(highestScore, thisTreeScore.total);
  });
});

console.log('highestScore', highestScore);
