const readline = require('readline-sync');
const VALID_CHOICES = {
  rock: ['rock', 'roc', 'ro', 'r'],
  paper: ['paper', 'pape', 'pap', 'pa', 'p'],
  scissors: ['scissors', 'scissor', 'scisso', 'sciss', 'scis', 'sci', 'sc'],
  lizard: ['lizard', 'lizar', 'liza', 'liz', 'li', 'l'],
  spock: ['spock', 'spoc', 'spo', 'sp'],
};
// const VALID_CHOICES = ['rock', 'paper', 'scissors', 'lizard', 'spock'];

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

// function calculateMoveWinPercentage() {

// }

function createMoveMemory() {
  return {
    timesChosen: 0,
    timesWon: 0,
    percentageWon: 0.00
  };
}

//createPlayer factory function
function createPlayer() {
  return {
    move: null,
    score: 0,
    memory: {
      rock: createMoveMemory(),
      paper: createMoveMemory(),
      scissors: createMoveMemory(),
      lizard: createMoveMemory(),
      spock: createMoveMemory(),
    },
  };
}

//createHuman object
function createHuman() {
  let playerObject = createPlayer();

  let humanObject = {
    chooseMove() {
      while (true) {
        this.move = null;

        console.log('Please choose rock, paper, scissors, lizard, spock:\n');

        let readlineInput = readline.question();

        Object.keys(VALID_CHOICES).forEach(choiceKey => {
          if (VALID_CHOICES[choiceKey].includes(readlineInput)) {
            this.move = choiceKey;
          }
        });
        if (this.move !== null) break;
        else console.log('Sorry, invalid choice.');
      }
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
  };

  return Object.assign(playerObject, humanObject);
}

function createComputer() {
  let playerObject = createPlayer();

  let computerObject = {
    chooseMove() {
      let keys = Object.keys(VALID_CHOICES);
      this.move = keys[Math.floor(Math.random() * keys.length)];
    },
  };

  return Object.assign(playerObject, computerObject);
}

const RPSGame = {
  human: createHuman(),
  computer: createComputer(),

  displayWelcomeMessage() {
    console.clear();
    console.log(`Welcome to Rock, Paper, Scissors, Lizard, Spock!\n` +
      `This is a game of strategy and luck.\n` +
      `Let's Play!\n`);
  },

  displayRoundMoves() {
    console.log(`You chose: ${this.human.move}`);
    console.log(`Computer chose: ${this.computer.move}`);
  },

  assessRoundWinner() {
    let humanMove = this.human.move;
    let computerMove = this.computer.move;

    if (rules.winningChoices[humanMove].includes(computerMove)) return "computer";
    else if (rules.winningChoices[computerMove].includes(humanMove)) return "human";
    else return "tie";
  },

  displayRoundWinner(roundWinner) {
    if (roundWinner === "human") {
      console.log(`YOU won this round because ${this.human.move} beats ` +
      `${this.computer.move}!`);
    } else if (roundWinner === "computer") {
      console.log(`COMPUTER won this round because ${this.computer.move} ` +
      `beats ${this.human.move}!`);
    } else console.log(`It was a TIE!`);
  },

  updateRoundWinnerScore(roundWinner) {
    if (roundWinner === "human") this.human.score += 1;
    else if (roundWinner === "computer") this.computer.score += 1;
  },

  updateMemory(roundWinner) {
    this.human.memory[this.human.move]["timesChosen"] += 1;
    this.computer.memory[this.computer.move]["timesChosen"] += 1;

    if (roundWinner === "human") {
      this.human.memory[this.human.move]["timesWon"] += 1;
    } else if (roundWinner === "computer") {
      this.computer.memory[this.computer.move]["timesWon"] += 1;
    }

    this.human.memory[this.human.move]["percentageWon"] =
    this.human.memory[this.human.move]["timesWon"] /
    this.human.memory[this.human.move]["timesChosen"];
    this.computer.memory[this.computer.move]["percentageWon"] =
    this.computer.memory[this.computer.move]["timesWon"] /
    this.computer.memory[this.computer.move]["timesChosen"];
    // if roundWinner is a tie, continue
  },

  displayScores() {
    console.log(`   |   Your Score: ${this.human.score}   |` +
    `   Computer Score: ${this.computer.score}   |\n` +
    `   ---------------------------------------------`);
  },

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
    while (true) {
      let maxPoints = this.human.choosePointsToWin();
      while (this.human.score < maxPoints && this.computer.score < maxPoints) {
        // console.clear();
        this.displayScores();
        this.human.chooseMove();
        this.computer.chooseMove();
        this.displayRoundMoves();
        let roundWinner = this.assessRoundWinner();
        this.displayRoundWinner(roundWinner);
        this.updateMemory(roundWinner);
        this.updateRoundWinnerScore(roundWinner);
        console.log(this.human.memory); // remove later
        console.log(this.computer.memory); // remove later
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