import { open } from 'node:fs/promises';

const file = await open('./input.txt');

const deDupeString = (string) => {
  return [...new Set(string)].join('');
}

const markerLength = 14;

for await (const line of file.readLines()) {
  for (let i = 0; i < line.length; i++) {
    const chars = line.substring(i, i + markerLength);
    const isMarker = chars === deDupeString(chars);
    if (isMarker) {
      console.log('marker starts at ', i);
      break;
    }
  }
}
