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
        console.log('Please choose rock, paper, scissors:');
        choice = readline.question();
        if (['rock', 'paper', 'scissors'].includes(choice)) break;
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
      const choices = ['rock', 'paper', 'scissors'];
      let randomIndex = Math.floor(Math.random() * choices.length);
      this.move = choices[randomIndex];
    },
  };

  return Object.assign(playerObject, computerObject);
}

// let compare = function(move1, move2) {

// };

const RPSGame = {
  human: createHuman(),
  computer: createComputer(),

  displayWelcomeMessage() {
    console.log(`Welcome to Rock, Paper, Scissors!\n` +
      `The first player to win 5 times will win the game.\n` +
      `Let's Play!`)
  },

  displayRoundWinner() {
    let humanMove = this.human.move;
    let computerMove = this.computer.move;

    console.log(`You chose: ${this.human.move}`);
    console.log(`Computer chose: ${this.computer.move}`);

    if ((humanMove === 'rock' && computerMove === 'scissors') ||
      (humanMove === 'paper' && computerMove === 'rock') ||
      (humanMove === 'scissors' && computerMove === 'paper')) {
      console.log("You Win this round!");
    } else if ((computerMove === 'rock' && humanMove === 'scissors') ||
      (computerMove === 'paper' && humanMove === 'rock') ||
      (computerMove === 'scissors' && humanMove === 'paper')) {
      console.log("Computer Wins this round!");
    } else {
      console.log("This round is a tie!");
    }
  },

  // updateScore() {
  //   if (this.human)
  // }

  displayOverallWinner() {
    if (this.human.score === 5) {
      console.log('You WON the overall Game!!!');
    } else console.log('You LOST! Computer won the overall game!!!')
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

  // method that contains our procedural code
  play() {
    this.displayWelcomeMessage();
    while (true) {
      while (this.human.score < 5 && this.computer.score < 5) {
        this.human.choose();
        this.computer.choose();
        this.updateScore();
        this.displayRoundWinner();
      }

      this.displayOverallWinner();
      if (!this.playAgain()) break;
    }

    this.displayGoodbyeMessage();
  },
};

// play method is called on the RPSGame
RPSGame.play();