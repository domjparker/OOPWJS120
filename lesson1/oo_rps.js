const readline = require('readline-sync');

// const rules.validChoices = ['rock', 'paper', 'scissors', 'lizard', 'spock'];

let rules = {
  validChoices: {
    rock: ['rock', 'roc', 'ro', 'r'],
    paper: ['paper', 'pape', 'pap', 'pa', 'p'],
    scissors: ['scissors', 'scissor', 'scisso', 'sciss', 'scis', 'sci', 'sc'],
    lizard: ['lizard', 'lizar', 'liza', 'liz', 'li', 'l'],
    spock: ['spock', 'spoc', 'spo', 'sp'],
  },
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
    timesOpponentChose: 0,
    timesOpponentWon: 0,
    percentageOpponentWon: 0.00
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
    // movePreferences: {
    //   rock: 0,
    //   paper: 0,
    //   scissor: 0,
    //   lizard: 0,
    //   spock: 0
    // },

    calculateMovePreference(movePercentageWon) {
      if (movePercentageWon > 0.90) return 3;
      else if (movePercentageWon > 0.75) return 2;
      else if (movePercentageWon > 0.60) return 1;
      else return 0;
    }
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

        Object.keys(rules.validChoices).forEach(choiceKey => {
          if (rules.validChoices[choiceKey].includes(readlineInput)) {
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
        console.log(`Decide how many points it will take for a player ` +
          `to win the game. Choose a number: `);
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
      let keys = Object.keys(rules.validChoices);
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

    if (rules.winningChoices[humanMove].includes(computerMove)) return "human";
    else if (rules.winningChoices[computerMove].includes(humanMove)) return "computer";
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
    this.human.memory[this.computer.move]["timesOpponentChose"] += 1;
    this.computer.memory[this.human.move]["timesOpponentChose"] += 1;

    if (roundWinner === "human") {
      this.computer.memory[this.human.move]["timesOpponentWon"] += 1;
    } else if (roundWinner === "computer") {
      this.human.memory[this.computer.move]["timesOpponentWon"] += 1;
    }

    this.human.memory[this.computer.move]["percentageOpponentWon"] =
      this.human.memory[this.computer.move]["timesOpponentWon"] /
      this.human.memory[this.computer.move]["timesOpponentChose"];
    this.computer.memory[this.human.move]["percentageOpponentWon"] =
      this.computer.memory[this.human.move]["timesOpponentWon"] /
      this.computer.memory[this.human.move]["timesOpponentChose"];
    // if roundWinner is a tie, continue
  },

  displayScores() {
    console.log(`   |   Your Score: ${this.human.score}   |` +
      `   Computer Score: ${this.computer.score}   |\n` +
      `   ---------------------------------------------`);
  },

  displayHumanSuggestion() {
    // take percentageOpponentWon for each of the 5 choices, return list of choices as suggestions that would be preferable
    // let choiceFavorability = [
    //   ["rock", this.human.memory["rock"].percentageOpponentWon],
    //   ["paper", this.human.memory["paper"].percentageOpponentWon],
    //   ["scissors", this.human.memory["scissors"].percentageOpponentWon],
    //   ["lizard", this.human.memory["lizard"].percentageOpponentWon],
    //   ["spock", this.human.memory["spock"].percentageOpponentWon],
    // ].sort((a, b) => {
    //   if (a[1] > b[1]) {
    //     return -1;
    //   } else if (a[1] < b[1]) {
    //     return 1;
    //   }
    //   return 0;
    // });
    // return choiceFavorability.map(subArr => subArr[0]);
    console.log(`List of percentages for how often the computer wins when ` +
    `choosing each move: \n`);
    Object.keys(this.human.memory).forEach(key => {
      console.log(`   ${key} : ${this.human.memory[key]["percentageOpponentWon"] * 100}%`);
    });
  },

  displayOverallWinner(maxPoints) {
    if (this.human.score === maxPoints) {
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
        console.log(this.displayHumanSuggestion())
        this.human.chooseMove();
        this.computer.chooseMove();
        this.displayRoundMoves();
        let roundWinner = this.assessRoundWinner();
        this.displayRoundWinner(roundWinner);
        this.updateMemory(roundWinner);
        this.updateRoundWinnerScore(roundWinner);
        // console.log(this.human.memory); // remove later
        // console.log(this.computer.memory); // remove later
      }

      this.displayOverallWinner(maxPoints);
      if (!this.playAgain()) break;
      else this.resetScores();
    }

    this.displayGoodbyeMessage();
  },
};

// mainGamePlay method is called on the RPSGame
RPSGame.mainGamePlay();