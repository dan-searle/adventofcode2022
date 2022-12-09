import { open } from 'node:fs/promises';

const file = await open('./input.txt');

const parseRange = (range) => {
  const [start, end] = range.split('-');

  return {
    start: Number(start),
    end: Number(end),
  };
}

const doRangesFullyOverlap = (range1, range2) => {
  const { start: range1start, end: range1end } = parseRange(range1);
  const { start: range2start, end: range2end } = parseRange(range2);

  if (range1start <= range2start && range1end >= range2end) {
    return true;
  }
  if (range2start <= range1start && range2end >= range1end) {
    return true;
  }
  return false;
};


let fullyOverlappingRangeCount = 0;

for await (const line of file.readLines()) {
  const [range1, range2] = line.split(',');

  if (doRangesFullyOverlap(range1, range2)) {
    fullyOverlappingRangeCount += 1;
  }
}

console.log('fullyOverlappingRangeCount', fullyOverlappingRangeCount);

const doRangesOverlap = (range1, range2) => {
  const { start: range1start, end: range1end } = parseRange(range1);
  const { start: range2start, end: range2end } = parseRange(range2);

  if (range1start <= range2start && range1end >= range2start) {
    return true;
  }
  if (range2start <= range1start && range2end >= range1start) {
    return true;
  }
  return false;
};

let overlappingRangeCount = 0;

for await (const line of file.readLines()) {
  const [range1, range2] = line.split(',');

  if (doRangesOverlap(range1, range2)) {
    overlappingRangeCount += 1;
  }
}

console.log('overlappingRangeCount', overlappingRangeCount);