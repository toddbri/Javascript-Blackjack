var deck;
var dealerHand = [];
var playerHand = [];
var bets = new Bets();
var hands;
var playerHandIndex ;

function Bets(){
  this.pot = 500;
  this.bet =0;
  this.insuranceBet = 0;
  $('#bet').text(0);
  $('#pot').text('$' + this.pot);

}

Bets.prototype.updateAmounts = function (){
  $('#bet').text('$' + this.bet);
  $('#pot').text('$' + this.pot);
};

Bets.prototype.potAmount = function(){
  return this.pot;

};

Bets.prototype.enableDoubleDown = function () {
  $('#doubledown').removeClass('disabled');

};

Bets.prototype.disableDoubleDown = function() {
  $('#doubledown').removeClass('disabled');
};

Bets.prototype.doubleDown = function() {
  this.pot -= this.bet;
  this.bet += this.bet;
};

Bets.prototype.betAmount = function(){
  return this.bet;

};

Bets.prototype.disableDeal = function () {
  $('#deal-button').addClass('disabled');

};

Bets.prototype.buyInsurance = function () {
  this.insuranceBet = parseInt(this.bet/2);

};

Bets.prototype.hasInsurance = function () {
  return (this.insuranceBet >0);

};

Bets.prototype.addBet = function(amount){

    if (this.pot >= amount) {
      this.pot = this.pot - amount;
      this.bet = this.bet + amount;
      this.updateAmounts();
      $('#deal-button').removeClass('disabled');
    } else {
      notEnoughChips();
    }
};


Bets.prototype.winner = function(){
    this.pot += this.bet*2;
    this.bet = 0;
    this.updateAmounts();
    this.disableDeal();
};

Bets.prototype.loser = function (){
  this.bet = 0;
  this.updateAmounts();
  this.disableDeal();
};

Bets.prototype.push = function (){
  this.pot += this.bet;
  this.bet = 0;
  this.updateAmounts();
  this.disableDeal();
};

Bets.prototype.blackJackWinner = function(){
    this.pot += parseInt(this.bet*2.5);
    this.bet =0;
    this.updateAmounts();
    this.disableDeal();
};

Bets.prototype.updateOptions = function(){
  if (playerHand.numCards()===2){
    $('#doubledown').removeClass('disabled');
  } else {
    $('#doubledown').removeClass('disabled');
  }

};


//              Card Ojbect

function Card(value,suit){this.point = value; this.suit = suit;}

Card.prototype.getImageUrl = function(){
  var sundry = this.point;

  if (this.point === 1)  {sundry = 'ace';}
  if (this.point === 11) {sundry= 'jack';}
  if (this.point === 12) {sundry = 'queen';}
  if (this.point === 13) {sundry = 'king';}

  // return 'images/' + sundry + "_" + this.suit + ".png";
  return '<img src="deck/' + sundry + '_' + this.suit + '.png">';
};
//      Hands Object

function Hands(){
  this.hands = [];
}

Hands.prototype.getHand = function(index){
  return this.hands[index];

};

Hands.prototype.addHand = function(hand) {
  this.hands.push(hand);
};

Hands.prototype.numHands = function(){
  return this.hands.length;

};

Hands.prototype.allHandsComplete = function(){
  return this.hands.reduce(function(a,b){return a && b.isComplete();},true);

};


//            Hand Object

function Hand(name) {
  this.hand =[];
  this.doubledown = false;
  this.complete = false;
  this.name = name;
}

Hand.prototype.addCard = function(card){
  this.hand.push(card);
  hands[playerHandIndex]=this.hand;

};

Hand.prototype.secondCardIsAce = function(){
  return (this.hand[1].point === 1);

};

Hand.prototype.hasBlackJack = function(){
  return (this.hand.length === 2 && this.getPoints() === 21);
};


Hand.prototype.numCards = function(){
  return this.hand.length;

};

Hand.prototype.firstCard = function(){
  return this.hand[0];

};

Hand.prototype.markComplete = function(){
  this.complete = true;
  hands[playerHandIndex]=this.hand;
};

Hand.prototype.isComplete = function(){
  return this.complete;

};

Hand.prototype.doubleDown = function(){
  this.doubleDown = true;
};

Hand.prototype.getPoints = function(){
  var sumCards;
  var ace;
  var sortedHand = this.hand.slice(0).sort(function(a,b){return b.point - a.point;});
  var numberOfAces = this.hand.reduce(function(accum, card){
    if (card.point === 1 ){ ace = 1; } else {ace = 0;}
    return accum + ace;
  },0);

  sumCards = sortedHand.reduce(function(currentSum, card) {
      var tempCardPoint = card.point;
      // If face card - point value is 10
      if (card.point > 10) {
          tempCardPoint = 10;
      }
      if (card.point === 1){
        numberOfAces -=1;
        if (currentSum + 11 + numberOfAces > 21){
          tempCardPoint = 1;
        } else {
          tempCardPoint = 11;
        }
      }
     return currentSum + tempCardPoint;
  }, 0);
  return sumCards;
};



//                Deck Object
function Deck() {
  this.deck = [];
  // Loop over each point value
  for (var points = 1;  points < 14; points++) {
      var suits =['spades','hearts','clubs','diamonds'];
      // Loop over each suit
      for (var suit in suits) {
          // Add each suit as an object to deck array

          this.deck.push(new Card(points,suits[suit]));
      } // End suit for loop
  } // End point for loop
}

Deck.prototype.draw = function(targetHand) {
  console.log("entering deck.draw()");
  console.log("targetHand: " + targetHand);
  var cardObject;

  // Get random number from 1 to length of current deck
  var randomIndex = parseInt(Math.random() * (this.deck.length));
  // Get card object from deck at random index from line above
  cardObject = this.deck[randomIndex];
  console.log("type of deck: " + targetHand.name);
  if (targetHand.name === 'player') {
      targetHand.addCard(cardObject);
      hands[playerHandIndex]=targetHand;
      // Change card object into HTML tag and add to page
      // cardToPlay = getCardImageTag(cardObject);
      cardToPlay = cardObject.getImageUrl();
      $('#player-hand').append(cardToPlay);
  } else {
      dealerHand.addCard(cardObject);
      // Change card object into HTML tag and add to page
      cardToPlay = cardObject.getImageUrl();
      $('#dealer-hand').append(cardToPlay);
  }
    // Remove card object from random index location
    this.deck.splice(randomIndex, 1);

  console.log("leaving deck.draw()");
  return cardObject;
};


Deck.prototype.numCardsLeft = function() {
  return this.deck.length;

};

// Initial deal, deals 2 cards to player, 2 to dealer
function deal() {
    console.log("new deal");
    hands = new Hands();
    hands.addHand(new Hand('player'));
    playerHandIndex = 0;
    playerHand = hands.getHand(playerHandIndex);
    // If no card has been dealt yet, make a new deck
    if ( $('#player-hand').children().length === 0 ) {
        deck = new Deck();
    }

    // If card count gets below 16 at time of deal click, use new deck
    if (deck.numCardsLeft() <= 16) {
        deck = new Deck();
    }

    // Remove cards from table, reset player hands
    $('#player-hand').children().remove();
    $('#dealer-hand').children().remove();
    dealerHand = new Hand('dealer');

    // Deal 4 cards
    deck.draw(playerHand);
    deck.draw(dealerHand);
    $('#dealer-hand :first-child').attr('src', 'img/card.png');
    deck.draw(playerHand);

    deck.draw(dealerHand);
    // cheatCard = new Card(1,"diamonds");
    // dealerHand.addCard(cheatCard);
    // cardToPlay = cheatCard.getImageUrl();
    // $('#dealer-hand').append(cardToPlay);

    // Update score for player and clear dealer
    updatePlayerScore();
    $('#dealer-label').text('DEALER:');

    // Change message to play, disable deal button and enable other buttons
    $('#messages').html("<h2>LET'S PLAY</h2>");
    $('#deal-button').addClass('disabled');
    // $('#hit-button').removeClass('disabled');
    // $('#stand-button').removeClass('disabled');
    // $('.betting div:nth-child(1n+2):not(:last-child)').addClass('disabled');

    // if (bets.potAmount() >= bets.betAmount()){
    //   $('#doubledown').removeClass('disabled');
    // }
    //
    // //if dealers second card is Ace and they have funds to cover insurance then offer insurance
    // if(dealerHand.secondCardIsAce() && (bets.potAmount() >= parseInt(bets.betAmount()/2))){
    //   offerInsurance();
    // } else {
    //   // if insurance is not offered check if player has blackjack and if yes then move on to dealer turn
    //   if (playerHand.hasBlackJack()) {
    //     dealerTurn();
    //   }
    //
    // }

    console.log("Done with initial deal...calling processHands");
    processHands();

}

function processHands(){
  console.log("entering processHands()");
  playerHand = hands.getHand(playerHandIndex);

  $('#hit-button').removeClass('disabled');
  $('#stand-button').removeClass('disabled');
  $('.betting div:nth-child(1n+2):not(:last-child)').addClass('disabled');

  if (bets.potAmount() >= bets.betAmount()){
    $('#doubledown').removeClass('disabled');
  }

  //if dealers second card is Ace and they have funds to cover insurance then offer insurance
  if(dealerHand.secondCardIsAce() && (bets.potAmount() >= parseInt(bets.betAmount()/2))){
    offerInsurance();
  } else {
    // if insurance is not offered check if player has blackjack and if yes then move on to dealer turn
    if (playerHand.hasBlackJack()) {
      playerHand.markComplete();
      hands[playerHandIndex]= playerHand;

    }

  }

  if (hands.allHandsComplete()) {
    console.log("all hands are now complete so calling dealerTurn()");
    dealerTurn();}
  console.log("exiting processHands()");
}

function stand(){
  console.log("entering stand()");
  playerHand.markComplete();
  hands[playerHandIndex]= playerHand;

  if (hands.allHandsComplete()) {dealerTurn();}
  console.log("exiting stand()");
}

function continueAfterOfferingInsurance() {
  console.log("i'm continuing now that I have an insurance answer");
  // did player buy insurance?
  if (bets.insuranceBet > 0 ){
    console.log("player bought insurance");
    // they did buy insurance so if dealer has blackjack then pay out insurance wins
    if (dealerHand.hasBlackJack()){
      console.log("dealer has blackjack so paying out Insurance bet");
      bets.pot += 3* bets.insuranceBet;
      bets.insuranceBet = 0;
      bets.updateAmounts();
      dealerTurn();
    // they bought insurance but dealer doesn't have blackjack so they lose insurance bet and continue
    } else {
      console.log("dealer did NOT have blackjack so player loses insurance bet and plays on");
      bets.insuranceBet = 0;
    }

  // if player buys insurnace and dealer does NOT have blackjack then players loses insurance bet
  } else {

    if (playerHand.hasBlackJack()) {
      playerHand.markComplete();
      hands[playerHandIndex]= playerHand;
      processHands();
    }
  }

}

function flipHoleCard() {
    var holeCard = dealerHand.firstCard();
    var sundry = holeCard.point;
    if (holeCard.point === 1) {sundry = 'ace';}
    if (holeCard.point === 11) {sundry= 'jack';}
    if (holeCard.point === 12) {sundry = 'queen';}
    if (holeCard.point === 13) {sundry = 'king';}

    var holeCardSrc = 'deck/' + sundry + '_' + holeCard.suit + '.png';

    $('#dealer-hand :first-child').attr('src', holeCardSrc);
}

function doubleDown(){
  playerHand.doubleDown();
  deck.draw(playerHand);
  bets.doubleDown();
  updatePlayerScore();
  playerHand.markComplete();
  processHands();
}

// Player portion, deal card to player and calculate points after that hit
function hit() {
    console.log("entering hit()");
    $('#doubledown').addClass('disabled');
    //  Deal a card as player

    deck.draw(playerHand);
    updatePlayerScore();

    if (playerHand.getPoints() >= 21) {
        $('#hit-button').addClass('disabled');
        $('#stand-button').addClass('disabled');
        // $('#deal-button').removeClass('disabled');
        playerHand.markComplete();
        hands[playerHandIndex]= playerHand;
        processHands();
    }
    console.log("exiting hit()");
}

// Start Dealer portion and check winner scenarios
function dealerTurn() {
    console.log("entering dealerTurn()");
    var gameOver = false;
    var revealHoleCard = true;
    var playerPoints = playerHand.getPoints();
    var dealerPoints = dealerHand.getPoints();
    var playerHasBlackJack = playerHand.hasBlackJack();
    var dealerHasBlackJack = dealerHand.hasBlackJack();

    $('#doubledown').addClass('disabled');
    // if (playerPoints > 21 then game is over) {
    if (playerPoints > 21) {
        revealHoleCard = false;
        gameOver = true;
        $('#messages').html('<h2>PLAYER BUST</h2>');
        bets.loser();
    } else {
      flipHoleCard();
    }

    if (gameOver === false){
    // Player and Dealer blackjack scenarios
        if (playerHasBlackJack && dealerHasBlackJack){
          gameOver = true;
          $('#messages').html('<h2>PUSH</h2>');
          bets.push();
        } else if (playerHasBlackJack) {
          gameOver = true;
          $('#messages').html('<h2>PLAYER BLACKJACK</h2>');
          bets.blackJackWinner();
        } else if (dealerHasBlackJack){
          gameOver = true;
          $('#messages').html('<h2>DEALER BLACKJACK</h2>');
          bets.loser();
        }
    }


    if (gameOver === false){
        // At this point dealer takes cards until dealers has at least 17 points
        while (dealerPoints < 17){
          // dealCard('dealer');
          deck.draw('dealer');
          dealerPoints = dealerHand.getPoints();
        }
        // Now see who won
        if (dealerPoints < playerPoints) {
          $('#messages').html('<h2>PLAYER WINS</h2>');
          bets.winner();
        } else if (dealerPoints > 21) {
          $('#messages').html('<h2>DEALER BUSTS</h2>');
          bets.winner();
        } else if (dealerPoints === playerPoints) {
          $('#messages').html('<h2>PUSH</h2>');
          bets.push();
        } else {
          $('#messages').html('<h2>DEALER WINS</h2>');
          bets.loser();
        }
    }

    // Make deal button only active button
    // $('#deal-button').removeClass('disabled');
    $('#hit-button').addClass('disabled');
    $('#stand-button').addClass('disabled');
    $('.betting div:nth-child(1n+2):not(:last-child)').removeClass('disabled');
    // If Player went bust then don't reveal hole card
    if (revealHoleCard === true){
      updateDealerScore();
    }
    if (bets.potAmount() <= 5){
      outOfChips();
    }
}

// Changes score display
function updatePlayerScore() {
    // var playerPoints = calculatePoints(playerHand);
    var playerPoints = playerHand.getPoints();
    $('#player-label').text('PLAYER: ' + playerPoints);
}

function updateDealerScore() {
    // var dealerPoints = calculatePoints(dealerHand);
    var dealerPoints = dealerHand.getPoints();
    $('#dealer-label').text('DEALER: ' + dealerPoints);
}

function outOfChips(){
    swal({
      title: "You're Out of Chips!",
      text: "That's too bad. \n Do you want to play again?",
      imageUrl: "img/chip-2.png"
    },
      function(isConfirm){
        if (isConfirm) {
          bets = new Bets();
        }
    });
}

function offerInsurance(){
    console.log("offering them insurance");
    swal({
      title: "The Dealer May Have BlackJack!",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      allowOutsideClick: true,
      closeOnConfirm: true,
      closeOnCancel: true,
      text: "Do you want to buy insurance?",
      imageUrl: "img/chip-2.png"
    },
      function(isConfirm){
        if (isConfirm) {
          console.log("player wants insurance");
          bets.insuranceBet = parseInt(bets.betAmount()/2);
          bets.pot -= bets.insuranceBet;
          bets.updateAmounts();
          console.log("set insurance bet to: " + bets.insuranceBet);
          console.log("pot: " + bets.pot);
          console.log("bet: " + bets.bet);
          console.log("Insurance bet: " + bets.insuranceBet);
        }
        continueAfterOfferingInsurance();
    });
}

function notEnoughChips(){
    swal({
      title: "Insufficient Chips!",
      text: "You don't have enough chips for that.",
      imageUrl: "img/chip-2.png"
    });
}

function welcome() {
  swal({
    title: "Welcome to Blackjack!",
    text: "Table minimum is $5. Click any of the chips to start betting. \n Ready to play?",
    imageUrl: "img/chip.png"
  });
}

function getInsuranceAmount() {
  var questionText = "Enter Your Insurance Bet Amount (0 to " + parseInt(bets.betAmount()/2) + ")";
  console.log("I'm trying to get their amount");
  swal({
    title: "How much?",
    text: questionText,
    type: "input",
    showCancelButton: true,
    closeOnConfirm: false,
    animation: "slide-from-top",
    inputPlaceholder: "Write something"
  },
  function(inputValue){
    if (inputValue === false) return false;

    if (inputValue === "") {
      swal.showInputError("You need to write something!");
      return false;
    }

    // swal("Nice!", "You wrote: " + inputValue, "success");
  });
}

$(function () {

    // Button click event handlers
    $('#deal-button').click(deal);
    $('#deal-button').addClass('disabled');
    $('#hit-button').click(hit);

    $('#stand-button').click(stand);

    $('#five').click(function() {bets.addBet(5);});
    $('#ten').click(function() {bets.addBet(10);});
    $('#fifteen').click(function() {bets.addBet(15);});
    $('#fifty').click(function() {bets.addBet(50);});
    $('#doubledown').click(doubleDown);
    // welcome();



}); // End DOM Ready
