import { open } from 'node:fs/promises';

const file = await open('./input.txt');

const moves = [];

for await (const lineStr of file.readLines()) {
  const [direction, amountStr] = lineStr.split(' ');
  const amount = Number(amountStr);

  moves.push(...Array(amount).fill(direction));
}

let head = { x: 0, y: 0 };
let tail = { x: 0, y: 0 };

const getNewHeadPosition = ({ x, y }, direction) => {
  switch (direction) {
    case 'R':
      return { x: x + 1, y };
    case 'L':
      return { x: x - 1, y };
    case 'U':
      return { x, y: y + 1 };
    case 'D':
      return { x, y: y - 1 };
    default:
      return { x, y };
  }
};

const getNewTailPosition = (h, t) => {
  let xDiff = Math.abs(h.x - t.x);
  let yDiff = Math.abs(h.y - t.y);

  // no need to move
  if (xDiff <= 1 && yDiff <= 1) {
    return t;
  }
  // horizontal move only
  if (xDiff > 1 && yDiff === 0) {
    return h.x > t.x
      ? { x: t.x + 1, y: tail.y }
      : { x: t.x - 1, y: tail.y };
  }
  // vertical move only
  if (yDiff > 1 && xDiff === 0) {
    return h.y > t.y
      ? { x: t.x, y: tail.y + 1 }
      : { x: t.x, y: tail.y - 1 };
  }
  // diagonal move
  if (yDiff > xDiff) {
    return {
      x: h.x > t.x ? t.x + 1 : t.x - 1,
      y: h.y > t.y ? t.y + 1 : t.y - 1,
    };
  } else {
    return {
      x: h.x > t.x ? t.x + 1 : t.x - 1,
      y: h.y > t.y ? t.y + 1 : t.y - 1,
    };
  }
};

const visualize = () => {
  const gridLeft = 0;
  const gridRight = 5;
  const gridTop = 0;
  const gridBottom = 4;

  for (let row = gridTop; row <= gridBottom; row++) {
    let lineStr = '';
    for (let col = gridLeft; col <= gridRight; col++) {
      if (head.x === col && head.y === row) {
        lineStr = lineStr + 'H';
      } else if (tail.x === col && tail.y === row) {
        lineStr = lineStr + 'T';
      } else {
        lineStr = lineStr + '.';
      }
    }
    console.log(lineStr);
  }
};

const positionsOccupiedByTail = {};

moves.forEach((direction, i) => {
  console.log(`--- step ${i} ---`);
  // console.log('head position', head);
  head = getNewHeadPosition(head, direction);
  // console.log('head position after move', direction, head);

  // console.log('tail position', tail);
  tail = getNewTailPosition(head, tail);
  // console.log('tail position after move', tail);

  // visualize();

  const tailPositionKey = `${tail.x},${tail.y}`;

  if (!positionsOccupiedByTail[tailPositionKey]) {
    positionsOccupiedByTail[tailPositionKey] = 0;
  }
  positionsOccupiedByTail[tailPositionKey]++;
});

console.log('---');
console.log('positionsOccupiedByTail', JSON.stringify(positionsOccupiedByTail, null, 2));
console.log('total:', Object.keys(positionsOccupiedByTail).length);
