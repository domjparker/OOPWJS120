const readline = require('readline-sync');

//createPlayer factory function
function createPlayer() {
  return {
    move: null,
    score: 0,
  };
}

//createHuman object
function createHuman() {
  let playerObject = createPlayer();

  let humanObject = {
    choose() {
      let choice;

      while (true) {
        console.log('Please choose rock, paper, scissors, lizard, spock:');
        choice = readline.question();
        if (['rock', 'paper', 'scissors', 'lizard', 'spock'].includes(choice)) break;
        console.log('Sorry, invalid choice.');
      }

      this.move = choice;
    },
  };

  return Object.assign(playerObject, humanObject);
}

function createComputer() {
  let playerObject = createPlayer();

  let computerObject = {
    choose() {
      const choices = ['rock', 'paper', 'scissors', 'lizard', 'spock'];
      let randomIndex = Math.floor(Math.random() * choices.length);
      this.move = choices[randomIndex];
    },
  };

  return Object.assign(playerObject, computerObject);
}

// let compare = function(move1, move2) {

// };
let rules = {
  pointsToWin: 1,
  winningChoices: {
    rock: ['scissors', 'lizard'],
    paper: ['rock', 'spock'],
    scissors: ['paper', 'lizard'],
    lizard: ['paper', 'spock'],
    spock: ['scissors', 'rock'],
  }
};

const RPSGame = {
  human: createHuman(),
  computer: createComputer(),

  displayWelcomeMessage() {
    console.log(`Welcome to Rock, Paper, Scissors!\n` +
      `The first player to win 5 times will win the game.\n` +
      `Let's Play!`);
  },

  choosePointsToWin() {
    let maxPointChoice;
    while (true) {
      console.log(`Decide on a winning amount of points for the game. Choose a number: `);
      maxPointChoice = readline.question();
      if (!isNaN(maxPointChoice)) break;
    }
    return maxPointChoice;
  },

  assessRoundWinner() {
    let humanMove = this.human.move;
    let computerMove = this.computer.move;

    console.log(`You chose: ${this.human.move}`);
    console.log(`Computer chose: ${this.computer.move}`);

    if (rules.winningChoices[humanMove].includes(computerMove)) {
      this.human.score += 1;
      console.log("You Win this round!");
    } else if (rules.winningChoices[computerMove].includes(humanMove)) {
      console.log("Computer Wins this round!");
      this.computer.score += 1;
    } else {
      console.log("This round is a tie!");
    }
  },

  displayScore() {
    console.log(`Your Score: ${this.human.score} \n` +
    `Computer Score: ${this.computer.score}`);
  },

  // updateScore() {
  //   if (this.human)
  // }

  displayOverallWinner() {
    if (this.human.score === 5) {
      console.log('You WON the overall Game!!!');
    } else console.log('You LOST! Computer won the overall game!!!');
  },

  displayGoodbyeMessage() {
    console.log('Thanks for playing Rock, Paper, Scissors. Goodbye.');
  },

  playAgain() {
    let answer;
    while (true) {
      console.log('Would you like to play again? (y/n)');
      answer = readline.question();
      if (answer.toLowerCase()[0] === 'y' || answer.toLowerCase()[0] === 'n') break;
    }
    return answer.toLowerCase()[0] === 'y';
  },

  resetScores() {
    this.human.score = 0;
    this.computer.score = 0;
  },

  // method that contains our procedural code
  mainGamePlay() {
    this.displayWelcomeMessage();
    let maxPoints = this.choosePointsToWin();
    while (true) {
      while (this.human.score < maxPoints && this.computer.score < maxPoints) {
        this.human.choose();
        this.computer.choose();
        this.assessRoundWinner();
        this.displayScore();
      }

      this.displayOverallWinner();
      if (!this.playAgain()) break;
      else this.resetScores();
    }

    this.displayGoodbyeMessage();
  },
};

// mainGamePlay method is called on the RPSGame
RPSGame.mainGamePlay();