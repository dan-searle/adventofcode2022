import { open } from 'node:fs/promises';

const file = await open('./input.txt');

const moves = [];

for await (const lineStr of file.readLines()) {
  const [direction, amountStr] = lineStr.split(' ');
  const amount = Number(amountStr);

  moves.push(...Array(amount).fill(direction));
}

const ropeLength = 10;
const rope = Array(ropeLength).fill(null).map((_, id) => ({ x: 0, y: 0, id }));

const getNewPosition = ({ x, y, id }, direction) => {
  switch (direction) {
    case 'R':
      return { x: x + 1, y, id };
    case 'L':
      return { x: x - 1, y, id };
    case 'U':
      return { x, y: y + 1, id };
    case 'D':
      return { x, y: y - 1, id };
    default:
      return { x, y, id };
  }
};

const getNewFollowerPosition = (leader, follower) => {
  let xDiff = Math.abs(leader.x - follower.x);
  let yDiff = Math.abs(leader.y - follower.y);

  // no need to move
  if (xDiff <= 1 && yDiff <= 1) {
    return follower;
  }
  // horizontal move only
  if (xDiff > 1 && yDiff === 0) {
    return leader.x > follower.x
      ? { x: follower.x + 1, y: follower.y, id: follower.id }
      : { x: follower.x - 1, y: follower.y, id: follower.id };
  }
  // vertical move only
  if (yDiff > 1 && xDiff === 0) {
    return leader.y > follower.y
      ? { x: follower.x, y: follower.y + 1, id: follower.id }
      : { x: follower.x, y: follower.y - 1, id: follower.id };
  }
  // diagonal move
  if (yDiff > xDiff) {
    return {
      x: leader.x > follower.x ? follower.x + 1 : follower.x - 1,
      y: leader.y > follower.y ? follower.y + 1 : follower.y - 1,
      id: follower.id,
    };
  } else {
    return {
      x: leader.x > follower.x ? follower.x + 1 : follower.x - 1,
      y: leader.y > follower.y ? follower.y + 1 : follower.y - 1,
      id: follower.id,
    };
  }
};

const visualize = () => {
  const gridLeft = -10;
  const gridRight = 25;
  const gridTop = -10;
  const gridBottom = 25;

  for (let row = gridTop; row <= gridBottom; row++) {
    let lineStr = '';
    for (let col = gridLeft; col <= gridRight; col++) {
      const atThisPosition = rope
        .filter(({ x, y }) => x === col && y === row)
        .sort((a, b) => {
          if (a.id < b.id) {
            return -1;
          } else if (a.id > b.id) {
            return 1;
          } else {
            return 0;
          }
        });

      if (atThisPosition.length > 0) {
        lineStr = lineStr + atThisPosition[0].id;
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

  // move the head of the rope
  rope[0] = getNewPosition(rope[0], direction);

  // move each part of the tail in turn
  for (let i = 1; i < ropeLength; i++) {
    rope[i] = getNewFollowerPosition(rope[i-1], rope[i]);
  }

  visualize();

  const tailPositionKey = `${rope[ropeLength - 1].x},${rope[ropeLength - 1].y}`;

  if (!positionsOccupiedByTail[tailPositionKey]) {
    positionsOccupiedByTail[tailPositionKey] = 0;
  }
  positionsOccupiedByTail[tailPositionKey]++;
});

console.log('---');
// console.log('positionsOccupiedByTail', JSON.stringify(positionsOccupiedByTail, null, 2));
console.log('total:', Object.keys(positionsOccupiedByTail).length);
