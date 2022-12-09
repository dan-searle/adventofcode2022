import { open } from 'node:fs/promises';

const file = await open('./input.txt');

const stacks = [];

let parsingStacks = true;

const moveCrate = (fromStack, toStack) => {
  // console.log(`moving from ${fromStack} to ${toStack}`);
  const crate = stacks[fromStack - 1].pop();
  stacks[toStack - 1].push(crate);
};

for await (const line of file.readLines()) {
  if (line === '') {
    parsingStacks = false;
    stacks.map((stack, i) => {
      console.log(`stack ${i+1}`, stack.join(''));
    });
    continue;
  }

  if (parsingStacks) {
    line.match(/.{1,4}/g).map((crateStr, i) => {
      const crate = crateStr.trim();
      if (crate !== '' && crate.includes('[')) {
        if (!Array.isArray(stacks[i])) {
          stacks[i] = [];
        }
        stacks[i].unshift(crate);
      }
    });
  } else {
    const [_, quantity, __, fromStack, ___, toStack] = line.split(' ');

    // part one
    // console.log(`move ${quantity} from ${fromStack} to ${toStack}`);
    // for (let i = 0; i < quantity; i++) {
    //   moveCrate(fromStack, toStack);
    // }

    // part two
    const cratesToMove = stacks[fromStack - 1].splice(-quantity, quantity);
    console.log('cratesToMove', cratesToMove);
    stacks[toStack - 1].push(...cratesToMove);
  }
}

stacks.map((stack, i) => {
  console.log(`stack ${i+1}`, stack.join(''));
});
