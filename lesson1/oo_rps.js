const readline = require('readline-sync');

let rules = {
  validChoices: {
    rock: ['rock', 'roc', 'ro', 'r'],
    paper: ['paper', 'pape', 'pap', 'pa', 'p'],
    scissors: ['scissors', 'scissor', 'scisso', 'sciss', 'scis', 'sci', 'sc'],
    lizard: ['lizard', 'lizar', 'liza', 'liz', 'li', 'l'],
    spock: ['spock', 'spoc', 'spo', 'sp'],
  },
  pointsToWin: null,
  winningChoices: {
    rock: ['scissors', 'lizard'],
    paper: ['rock', 'spock'],
    scissors: ['paper', 'lizard'],
    lizard: ['paper', 'spock'],
    spock: ['scissors', 'rock'],
  },

  advantageMoves: {
    rock: ['paper', 'spock'],
    paper: ['scissors', 'lizard'],
    scissors: ['rock', 'spock'],
    lizard: ['rock', 'scissors'],
    spock: ['lizard', 'paper'],
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
  };
}

//createHuman object
function createHuman() {
  let playerObject = createPlayer();

  let humanObject = {
    chooseMove() {
      while (true) {
        this.move = null;

        console.log('\n   Please make your choice (rock, paper, scissors, ' +
          'lizard, spock):\n');

        let readlineInput = readline.question().toLowerCase();

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
      let pointsToWin;
      while (true) {
        console.log(`   How many points will it take for a ` +
          `player to win the game? Choose a number: `);
        pointsToWin = Number(readline.question());
        if (!isNaN(pointsToWin)) break;
      }
      return pointsToWin;
    },
  };

  return Object.assign(playerObject, humanObject);
}

function createComputer() {
  let playerObject = createPlayer();

  let computerObject = {
    calculateMovePreference(movePercentageWon) {
      if (movePercentageWon > 0.90) return 2;
      else if (movePercentageWon > 0.60) return 1;
      else return 0;
    },

    useReasoning(compMemory) {
      let choiceAdvantage = [];
      Object.keys(compMemory).forEach(key => {
        let humanMoveWinAdvantage =
          this.calculateMovePreference(compMemory[key]["percentageOpponentWon"]);
        if (humanMoveWinAdvantage > 0) {
          let arrayToAdd =
            Array(humanMoveWinAdvantage).fill(rules.advantageMoves[key]);
          choiceAdvantage.push(arrayToAdd);
        }
      });
      return choiceAdvantage.flat(3);
    },

    chooseMove(advantageArray) {
      let keys = Object.keys(rules.validChoices).concat(advantageArray);
      this.move = keys[Math.floor(Math.random() * keys.length)];
    },
  };

  return Object.assign(playerObject, computerObject);
}

const RPSGame = {
  human: createHuman(),
  computer: createComputer(),
  roundCounter: 0,
  winPoints: null,
  roundWinner: null,

  displayWelcomeMessage() {
    console.clear();
    console.log(`   Welcome to Rock, Paper, Scissors, Lizard, Spock!\n` +
      `   This is a game of strategy and luck.\n` +
      `   The computer will remember your moves and try to outwit you,\n` +
      `   but the game will match the computer's advantage by assisting ` +
      `your memory as well.\n` +
      `   Let's Play!\n`);
  },

  displayScores() {
    console.log(`   |   Your Score: ${this.human.score}   |` +
      `   Computer Score: ${this.computer.score}   |\n` +
      `   ---------------------------------------------`);
  },

  displayRoundMoves() {
    console.log(`   You chose: ${this.human.move}`);
    console.log(`   Computer chose: ${this.computer.move}`);
  },

  displayRoundWinner() {
    if (this.roundWinner === "human") {
      console.log(`   YOU won this round because ${this.human.move} beats ` +
        `${this.computer.move}!\n`);
    } else if (this.roundWinner === "computer") {
      console.log(`   COMPUTER won this round because ${this.computer.move} ` +
        `beats ${this.human.move}!\n`);
    } else console.log(`   It was a TIE!\n`);
  },

  displayHumanSuggestion() {
    console.log(`   ASSISTED MEMORY: Percentages showing how often the ` +
      `computer currently wins when it chooses each move:`);
    Object.keys(this.human.memory).forEach(key => {
      console.log(`     ${key} : ` +
        `${this.human.memory[key]["percentageOpponentWon"] * 100}%`);
    });
  },

  displayRoundDetails() {
    console.clear();
    this.displayScores();
    this.displayRoundMoves();
    this.displayRoundWinner(this.roundWinner);
    this.displayHumanSuggestion();
  },

  assessRoundWinner() {
    let humanMove = this.human.move;
    let computerMove = this.computer.move;

    if (rules.winningChoices[humanMove].includes(computerMove)) return "human";
    else if (rules.winningChoices[computerMove].includes(humanMove)) {
      return "computer";
    } else return "tie";
  },

  updateMemory() {
    let huMemOfCompMove = this.human.memory[this.computer.move];
    let compMemoryOfHumMove = this.computer.memory[this.human.move];
    huMemOfCompMove["timesOpponentChose"] += 1;
    compMemoryOfHumMove["timesOpponentChose"] += 1;

    if (this.roundWinner === "human") {
      compMemoryOfHumMove["timesOpponentWon"] += 1;
    } else if (this.roundWinner === "computer") {
      huMemOfCompMove["timesOpponentWon"] += 1;
    }

    huMemOfCompMove["percentageOpponentWon"] =
      huMemOfCompMove["timesOpponentWon"] /
      huMemOfCompMove["timesOpponentChose"];
    compMemoryOfHumMove["percentageOpponentWon"] =
      compMemoryOfHumMove["timesOpponentWon"] /
      compMemoryOfHumMove["timesOpponentChose"];
    // if this.roundWinner is a tie, game will just continue
  },

  updateRoundWinnerScore() {
    if (this.roundWinner === "human") this.human.score += 1;
    else if (this.roundWinner === "computer") this.computer.score += 1;
  },

  playRound() {
    if (this.roundCounter > 0) {
      this.displayRoundDetails();
    }
    let computerReasonedAdvantage =
      this.computer.useReasoning(this.computer.memory);
    this.human.chooseMove();
    this.computer.chooseMove(computerReasonedAdvantage);
    this.roundWinner = this.assessRoundWinner();
    this.updateMemory();
    this.updateRoundWinnerScore();
    this.roundCounter += 1;
  },

  displayOverallWinner() {
    if (this.human.score === this.winPoints) {
      console.log('   You WON the overall Game!!!');
    } else {
      console.log('   You LOST! Computer won the overall game!!!');
    }
  },

  displayGoodbyeMessage() {
    console.log('   Thanks for playing Rock, Paper, Scissors. Goodbye.');
  },

  playAgain() {
    let answer;
    while (true) {
      console.log('   Would you like to play again? (y/n)');
      answer = readline.question().toLowerCase();
      if (answer[0] === 'y' || answer[0] === 'n') {
        break;
      }
    }
    return answer[0] === 'y';
  },

  resetRound() {
    this.human.score = 0;
    this.computer.score = 0;
    this.roundCounter = 0;
  },

  // method that contains our procedural code
  mainGamePlay() {
    this.displayWelcomeMessage();
    while (true) {
      this.winPoints = this.human.choosePointsToWin();
      while (this.human.score < this.winPoints && this.computer.score <
        this.winPoints) {
        this.playRound();
      }

      this.displayRoundDetails();
      this.displayOverallWinner();
      if (!this.playAgain()) break;
      else this.resetRound();
    }

    this.displayGoodbyeMessage();
  },
};

// mainGamePlay method is called on the RPSGame
RPSGame.mainGamePlay();