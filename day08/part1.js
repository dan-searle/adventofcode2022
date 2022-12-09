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

const determineVisibility = (trees) => {
  const thisTreeHeight = trees.pop();

  const higherTreesInFront = trees.filter((height) => {
    return height >= thisTreeHeight;
  });

  return higherTreesInFront.length === 0;
}

const treeIsVisible = (colIndex, rowIndex) => {
  // edges are always visible
  if (colIndex === 0 || colIndex === colCount-1 || rowIndex === 0 || rowIndex === rowCount -1) {
    return true;
  }
  const leftEdgeToHere = rows[rowIndex].slice(0, colIndex + 1);
  const rightEdgeToHere = rows[rowIndex].slice(colIndex).reverse();
  const topEdgeToHere = rows.slice(0, rowIndex + 1).map((cols) => cols[colIndex]);
  const bottomEdgeToHere = rows.slice(rowIndex).map((cols) => cols[colIndex]).reverse();

  return (
    determineVisibility(leftEdgeToHere) ||
    determineVisibility(rightEdgeToHere) ||
    determineVisibility(topEdgeToHere) ||
    determineVisibility(bottomEdgeToHere)
  );
};

let totalVisibleTrees = 0;

rows.forEach((cols, rowIndex) => {
  cols.forEach((col, colIndex) => {
    if (treeIsVisible(colIndex, rowIndex)) {
      totalVisibleTrees++;
    }
  });
});

console.log('totalVisibleTrees', totalVisibleTrees);
