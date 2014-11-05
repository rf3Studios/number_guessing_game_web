/*!
 * Number Guessing Game
 * https://github.com/rf3Studios/number_guessing_game_web
 *
 * Copyright 2014 Rich Friedel
 * Released under the MIT license
 */

// Array that will hold all the guesses
var theGuesses = [];

// The current number that is being guesses
var currentGuess;

var guessAmountMax;

var numPlaceTxt = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth",
                   "eleventh", "twelfth", "thirteenth", "fourteenth", "fifteenth", "sixteenth", "seventeenth",
                   "eighteenth", "nineteenth", "twentieth"];

var HIGHER = 0;
var LOWER = 1;

function startGame() {
    // Reset theGuess array
    while (theGuesses.length > 0) {
        theGuesses.pop();
    }

    // Reset the currentGuess
    currentGuess = 0;

    // Reset game UI
    $("#num-entry").css("display", "block");
    $("#num-content, #num-quest-btn-wrapper, #yes-btn, #no-btn, #higher-btn, #lower-btn, #reset-btn")
        .css("display", "none");

    $("#submit").off().on("click", function () {
        var startingNum = $("#start-num").val();
        var endingNum = $("#end-num").val();

        if (startingNum > 0 && (endingNum - startingNum) > 3) {
            $("#num-entry").css("display", "none");

            // Display the game
            $("#num-content").css("display", "block");
            $("#num-think").html("Think of a number that is between " + startingNum + " and " + endingNum);
            $("#ready-btn").css("display", "block").off().on("click", function () {
                // The maximum amount of guesses needed
                guessAmountMax = getMaxGuesses(endingNum);

                // Display the max amount of guesses needed
                $("#num-think").html("I am going to guess your number that is between "
                + startingNum
                + " and "
                + endingNum
                + " <br>AND<br> I'm going to do it in "
                + guessAmountMax
                + " guesses or less!!!");

                $("#num-bet-max-guesses").css("display", "block");
                $("#ready-btn").val("Are you ready for the magic???").off().on("click", function () {
                    $("#ready-btn").css("display", "none");
                    runGame(startingNum, endingNum);
                });
            });
        }
    });
}

function runGame(startNum, endNum, higherLowerState) {
    var lowNum = startNum;
    var highNum = endNum;

    // Get a number
    currentGuess = getGuessNumber(lowNum, highNum, higherLowerState);

    // Add it to the guesses array
    theGuesses.push(currentGuess);

    var guessNum = theGuesses.length - 1;

    if (guessAmountMax === theGuesses.length) {
        $("#num-think").html("Your number is...<br>" + currentGuess);
        $("#num-question").css("display", "none");
        $("#reset-btn").css("display", "block").off().on("click", function () {
            startGame();
        });
    } else {
        $("#num-think").html("Ok, my " + numPlaceTxt[guessNum] + " guess is... <br> " + currentGuess);

        $("#num-question, #num-quest-btn-wrapper").css("display", "block");

        $("#num-question").html("Is this correct?");

        $("#yes-btn").css("display", "block").off().on("click", function () {
            console.log("The number is " + currentGuess);
            $("#yes-btn, #no-btn, #num-question").css("display", "none");

            $("#reset-btn").css("display", "block").off().on("click", function () {
                console.log("Restart Game...");
                startGame();
            });

            var guessesTxt = " guesses!!!";

            if (Number(guessNum) + 1 === 1) {
                guessesTxt = " guess!!!";
            }

            $("#num-think").html("AH HAH! Your number is "
            + currentGuess
            + " and I found it in "
            + (Number(guessNum) + 1)
            + guessesTxt);
        });

        $("#no-btn").css("display", "block").off().on("click", function () {
            $("#yes-btn").css("display", "none");
            $("#no-btn").css("display", "none");

            // Ask if the number is higher or lower
            $("#num-question").html("Is your number HIGHER or LOWER than " + currentGuess + "?");

            $("#higher-btn").css("display", "block").off().on("click", function () {

                $("#higher-btn").css("display", "none");
                $("#lower-btn").css("display", "none");

                runGame(currentGuess, highNum, HIGHER);
            });
            $("#lower-btn").css("display", "block").off().on("click", function () {

                $("#higher-btn").css("display", "none");
                $("#lower-btn").css("display", "none");

                runGame(lowNum, currentGuess, LOWER);
            });
        });
    }
}

function getGuessNumber(lowNum, highNum, higherLowerState) {
    var guessNum = 0;
    var lowNumber = Number(lowNum);
    var highNumber = Number(highNum);

    // TODO: Need to fix this. The state is either on or off.
    if (higherLowerState === HIGHER || higherLowerState === LOWER) {
        guessNum = ((highNumber - lowNumber) / 2) + lowNumber;
    } else {
        guessNum = (highNumber - lowNumber) / 2;
    }

    return Math.ceil(guessNum);
}

/**
 * Figures out what the maximum guesses it will need to correctly identify the user's number
 *
 * @param num The largest number the user has chosen
 * @returns {number} The maximum amount of guesses
 */
function getMaxGuesses(num) {
    return Math.ceil(Math.log(Number(num)) / Math.log(2));
}