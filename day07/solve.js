import { open } from 'node:fs/promises';

const file = await open('./input.txt');

const parseLine = (lineStr) => {
  const parts = lineStr.split(' ');

  if (parts[0] === '$') {
    return {
      command: parts[1],
      arg: parts[2],
    };
  } else if (parts[0] === 'dir') {
    return {
      type: 'dir',
      name: parts[1],
    };
  } else {
    return {
      type: 'file',
      name: parts[1],
      size: Number(parts[0]),
    }
  }
};

const sizes = {}
let cwdPath = [];

const addSize = (path, size) => {
  // console.log(`add ${size} to ${path.join('/')}`);
  const pathKey = path.join('/');
  if (!sizes[pathKey]) {
    sizes[pathKey] = 0;
  }
  // console.log(`size of ${pathKey} before`, sizes[pathKey]);
  sizes[pathKey] = sizes[pathKey] + size;
  // console.log(`size of ${pathKey} after`, sizes[pathKey]);
}

for await (const lineStr of file.readLines()) {
  const line = parseLine(lineStr);
  // console.log('line', line);

  if (line.command === 'cd') {
    if (line.arg === '..') {
      cwdPath.pop();
    } else {
      cwdPath.push(line.arg);
    }
  } else if (line.type === 'file') {
    // console.log('cwdPath', cwdPath);
    cwdPath.forEach((directory, i) => {
      const pathToHere = cwdPath.slice(0, i + 1);
      // console.log('pathToHere', pathToHere);
      addSize(pathToHere, line.size);
    });
  }
  // console.log('cwd after line', cwdPath.join('/'));
}

// console.log('sizes of directories', JSON.stringify(sizes, null, 2));

const directories = Object.entries(sizes).map(([path, size]) => ({ path, size }));

// console.log(JSON.stringify(directories, null, 2));

const totalDiskSpace = 70000000;
const unusedSpaceRequired = 30000000;
const totalUsedSpace = directories[0].size;
const currentAvailableSpace = totalDiskSpace - totalUsedSpace
const extraSpaceRequired = unusedSpaceRequired - currentAvailableSpace;

console.log('total used space', totalUsedSpace);
console.log('current available space', currentAvailableSpace);
console.log('extra space required', extraSpaceRequired);

const directoriesOfRequiredSize = directories
  .filter((dir) => dir.size >= extraSpaceRequired)
  .sort((a, b) => {
    if (a.size > b.size) {
      return 1;
    } else if (a.size < b.size) {
      return -1
    }
    return 0;
  });

console.log('directoriesOfRequiredSize', JSON.stringify(directoriesOfRequiredSize, null, 2));