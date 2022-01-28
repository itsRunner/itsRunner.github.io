/*
    Blackjack made by itsRunner
*/

'use strict';

const
    allCards = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "Q", "A", "K", "J"],
    deck = [],
    cards = [],
    cardTypes = ["s", "h", "c", "d"];

const
    mainMenu = document.querySelector('.gameStart'),
    startButton = document.querySelector(".btnStart"),
    behindCard = document.getElementById('behindCard'),
    frontCard = document.getElementById('frontCard'),
    mainGame = document.querySelector('.pokerTable'),
    dealerBG = document.querySelector('.dealer'),
    playerBG = document.querySelector('.player'),
    dealerCards = document.querySelector('.dealerCards'),
    playerCards = document.querySelector('.playerCards'),
    dealerScore = document.querySelector('.dealerScore'),
    playerScore = document.querySelector('.playerScore'),
    btnRestart = document.getElementById('btnRestart'),
    btnHit = document.getElementById('btnHit'),
    btnHold = document.getElementById('btnHold'),
    allButtons = document.querySelector('.buttons'),
    scores = document.querySelector('.scores'),
    gameTextForPlayer = document.querySelector('.gameTextForPlayer'),
    textForPlayer = document.querySelector('.textForPlayer');

let
    pCards = [],
    dCards = [],
    started,
    pPoints,
    dPoints,
    fCard,
    dealCount,
    gameState;

let
    tempTimeout,
    dealTimer;

const init = () =>
{
    resetVars();
    mainGame.classList.add('hidden');

    randomLogoCards();
}
init();

function resetVars()
{
    deck.length = 0;
    cards.length = 0;

    createDeck();
    
    pCards.length = 0;
    dCards.length = 0;

    started = 0;
    pPoints = 0;
    dPoints = 0;

    fCard = 0;

    dealCount = 0;
    gameState = 1;

    playerScore.textContent = 0;
    dealerScore.textContent = 0;

    playerBG.style.backgroundColor = "transparent";
    dealerBG.style.backgroundColor = "transparent";

    gameTextForPlayer.classList.add('hidden');
}

function randomLogoCards()
{
    let 
        c = 0;
        
    c = randomEx(cards.length - 2);
    
    behindCard.src = `assets/cards/${cards[c]}.png`;
    frontCard.src = `assets/cards/${cards[++c]}.png`;
}

function randomEx(maxNum) 
{
    return Math.floor(Math.random() * maxNum);
}

function createDeck()
{
    let 
        count = 0,
        crntType = 0;

    for(let i = 0; i !== allCards.length; ++i)
    {
        for(let t = 0; t !== cardTypes.length; ++t)
        {
            deck.push(allCards[i] + cardTypes[t]);
        }
    }
    shuffleDeck();
}

function shuffleDeck()
{
    let 
        ranCard = 0,
        tempCards = [... deck],
        tempCount = 0;

    while(++ tempCount <= deck.length)
    {
        ranCard = randomEx(tempCards.length);

        cards.push(tempCards[ranCard]);
        tempCards.splice(ranCard, 1);
    }
}

function dealCards()
{
    let 
        dealCount = 0,
        c = 0;

        dealTimer = setInterval(() =>
        {
            c = cards.length - 1;
            switch(dealCount)
            {
                case 0:
                case 2:
                {
                    playerCards.insertAdjacentHTML("beforeend", `<img src="assets/cards/${cards[c]}.png">`);
                    
                    pCards.push(cards[c]);
                    addPoints(true, c);
                    break;
                }
                case 1: // Dealer
                {
                    dealerCards.insertAdjacentHTML("beforeend", `<img src="assets/cards/${cards[c]}.png">`);
                    
                    dCards.push(cards[c]);
                    addPoints(false, c);
                    break;
                }
                case 3: // Dealer
                {
                    dealerCards.insertAdjacentHTML("beforeend", '<img src="assets/cards/fd.png" id="face-down">');
                    
                    dCards.push(cards[c]);
                    addPoints(false, c, true);
                    break;
                }
                default:
                {
                    clearInterval(dealTimer);
                    toggleButtons(false);
                }
            }
            ++dealCount;
        },
        750
    );
}

function addPoints(player = true, c, hidden = false)
{
    let 
        temp = 0;
    
    // Calculate the points..
    let num = cards[c];
    let rNum = num.slice(0, -1);

    switch(rNum)
    {
        case 'A':
        {
            if(player)
            {
                if((pPoints + 11) > 21)
                    temp = 1;
                else
                    temp = 11;
            }
            else
            {
                if((dPoints + 11) > 21)
                    temp = 1;
                else
                    temp = 11;
            }
            break;
        }
        case 'Q':
        case 'K':
        case 'J':
        {
            temp = 10;
            break;
        }
        default:
        {
            temp = Number(rNum);
            break;
        }
    }
    cards.pop();

    if(player)
    {
        pPoints += temp;
        playerScore.textContent = pPoints;
    }
    else
    {
        if(hidden)
        {
            fCard = temp;
        }
        else
        {
            dPoints += temp;
            dealerScore.textContent = dPoints;
        }
    }
}

function toggleButtons(toggle = true)
{
    if(allButtons.classList.contains('hidden'))
    {
        if(!toggle)
            allButtons.classList.remove('hidden')
    }
    else
    {
        if(toggle)
            allButtons.classList.add('hidden')
    }
}

//
//  Buttons =>
//

startButton.addEventListener("click", function() // starts the game..
    {
        mainGame.classList.remove('hidden');
        mainMenu.classList.add('hidden');

        dealCards();
    }
);

btnHold.addEventListener("click", function() // hold cards
    {
        if(gameState)
        {
            if(pPoints > 16)
            {
                turnDealerCard();
                toggleButtons(true);
            }
        }
    }
);

btnHit.addEventListener("click", function() // hit
    {
        if(gameState)
            hitCard();
    }
);
btnRestart.addEventListener("click", function() // restart
    {
        clearInterval(dealTimer);

        while(dealerCards.firstChild) 
            dealerCards.removeChild(dealerCards.firstChild);

        while(playerCards.firstChild)
            playerCards.removeChild(playerCards.firstChild);

        resetVars();
        dealCards();
        
        toggleButtons(true);
    }
);

function hitCard()
{
    let 
        c = cards.length - 1;
        
    playerCards.insertAdjacentHTML("beforeend", `<img src="assets/cards/${cards[c]}.png">`);
    
    pCards.push(cards[c]);
    addPoints(true, c);

    if(pPoints > 21)
    {
        endGame("You bust! Dealer wins.");
        dealerBG.style.backgroundColor = "green";
    }
    toggleButtons(false);
}

function turnDealerCard()
{
    const fdCard = document.getElementById('face-down');

    fdCard.src = `assets/cards/${dCards[1]}.png`;

    dPoints += fCard;
    dealerScore.textContent = dPoints;

    if(dPoints < pPoints)
        dealCard();
    else
        checkWinner();
}

function checkWinner()
{
    if(dPoints > 21)
    {
        endGame("Dealer busts. You win!");
        
        playerBG.style.backgroundColor = "green";
    }
    else if(pPoints > 21)
    {
        endGame("You bust! Dealer wins.");
        
        dealerBG.style.backgroundColor = "green";
    }
    else if(dPoints > pPoints)
    {
        endGame("Dealer wins!");
        
        dealerBG.style.backgroundColor = "green";
    }
    else if(pPoints > dPoints)
    {
        endGame("You win!");
        
        playerBG.style.backgroundColor = "green";
    }
    else if(pPoints == 21 && dPoints == 21)
    {
        endGame("Draw! No-one wins.");
        
        playerBG.style.backgroundColor = "green";
        dealerBG.style.backgroundColor = "green";
    }
    else if(pPoints == 20 && dPoints == 20)
    {
        endGame("Push! No-one wins.");
        
        playerBG.style.backgroundColor = "green";
        dealerBG.style.backgroundColor = "green";
    }
    toggleButtons(false);
}

function dealCard()
{
    dealTimer = setInterval(() =>
        {
            let 
                c = cards.length - 1;
        
            dealerCards.insertAdjacentHTML("beforeend", `<img src="assets/cards/${cards[c]}.png">`);
            
            dCards.push(cards[c]);
            addPoints(false, c);

            if(dPoints > pPoints)
            {
                checkWinner();
                clearInterval(dealTimer);
            }
            else if(dPoints == 20 && pPoints == 20)
            {
                checkWinner();
                clearInterval(dealTimer);
            }
            else if(dPoints > 21)
            {
                checkWinner();
                clearInterval(dealTimer);
            }
            else if(dPoints == 21 && pPoints == 21)
            {
                checkWinner();
                clearInterval(dealTimer);
            }
        },
    750
    );
}

function endGame(text)
{
    textForPlayer.textContent = text;

    gameTextForPlayer.classList.remove('hidden');
    gameState = 0;
}