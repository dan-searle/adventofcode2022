import { open } from 'node:fs/promises';

const file = await open('./input.txt');

const getShape = (letter) => {
  switch (letter) {
    case "A":
      return 'rock';
    case "B":
      return 'paper';
    default:
      return 'scissors';
  }
};

const getResponseShape = (challengeShape, letter) => {
  // X lose, Y draw, Z win
  if (letter === 'Y') {
    return challengeShape;
  }

  if (challengeShape === 'rock') {
    if (letter === 'X') {
      return 'scissors';
    } else {
      return 'paper';
    }
  }

  if (challengeShape === 'paper') {
    if (letter === 'X') {
      return 'rock';
    } else {
      return 'scissors';
    }
  }

  if (challengeShape === 'scissors') {
    if (letter === 'X') {
      return 'paper';
    } else {
      return 'rock';
    }
  }
};

const getShapeScore = (shape) => {
  if (shape === 'rock') {
    return 1;
  }
  if (shape === 'paper') {
    return 2;
  }
  if (shape === 'scissors') {
    return 3;
  }
};

const getOutcomeScore = (challenge, response) => {
  if (response === 'rock' && challenge === 'scissors') {
    return 6;
  }
  if (response === 'scissors' && challenge === 'paper') {
    return 6;
  }
  if (response === 'paper' && challenge === 'rock') {
    return 6;
  }
  if (response === challenge) {
    return 3;
  }
  return 0;
};

const getTotalScore = (challenge, response) => getShapeScore(response) + getOutcomeScore(challenge, response);

let totalScore = 0;

for await (const line of file.readLines()) {
  const [ challengeLetter, responseLetter ] = line.split(' ');

  const challengeShape = getShape(challengeLetter);
  const responseShape = getResponseShape(challengeShape, responseLetter);

  totalScore += getTotalScore(challengeShape, responseShape);
}

console.log('totalScore', totalScore);