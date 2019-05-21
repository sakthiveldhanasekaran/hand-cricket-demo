// toss to decide whose turn to play
// 3 buttons %odd% %even% %let_opponent_choose%
// p1 choose = odd p2 choose = even
// 7 buttons 1,2,3,4,5,6,stroke
// if p1 choose any of the above we will add that with the p2 choosen value and find whether it's odd or even
// if p wins he will be shown two options/button bat or bowl
// if p chooses bat his score starts to add up each turn of the game - matching if both the players are equal so the p gets out
// then the next p will get his turn if he cross the target he wins or loose

"use strict";

var scorePlayer = 0,
    scoreBot = 0,
    playerC = '',
    botC = '',
    tossFlag = false,
    playerPlaying = false,
    botPlaying = false,
    playerPlayed = false,
    botPlayed = false,
    inningsBreak = 0,
    currentRandomNumber = 0,
    victoryMessage = '';

function restart() {
    scorePlayer = 0;
    scoreBot = 0;
    playerC = '';
    botC = '';
    tossFlag = false;
    playerPlaying = false;
    botPlaying = false;
    playerPlayed = false;
    botPlayed = false;
    inningsBreak = 0;
    currentRandomNumber = 0;
    victoryMessage = '';
}

function summary(msg) {
    document.querySelector('.restart').addEventListener('click', function() {
        restart();
        document.querySelector('.summary').classList.add('hide');
        document.querySelector('.toss-option-scene').classList.remove('hide');
    });
    document.querySelector('.play-scene').classList.add('hide');
    document.querySelector('.summary').classList.remove('hide');
    document.querySelector('.match-summary').textContent = 'Match ' + msg;
}

function addScore(el, currentRandomNumber) {
    if (playerPlaying) {
        scorePlayer += parseInt(el.dataset.value);
        document.querySelector('.player-score').textContent = scorePlayer;
        if (scorePlayer > scoreBot && botPlayed) {
            alert('won');
            summary('won');
        } else if (scorePlayer < scoreBot && botPlayed && playerPlayed) {
            alert('lost');
            summary('lost');
        }
    } else {
        scoreBot += currentRandomNumber;
        document.querySelector('.bot-score').textContent = scoreBot;
        if (scoreBot > scorePlayer && playerPlayed) {
            alert('lost');
            summary('lost');
        } else if (scoreBot < scorePlayer && playerPlayed && botPlayed) {
            alert('won');
            summary('won');
        }
    }


}

function randomNumber(range) {
    return Math.round(Math.random() * range);
}

function oddOrEven(value) {
    return value % 2 === 0 ? "even" : "odd";
}

function attachEventHandler(ele, tossFlag) {
    if (tossFlag) {
        ele.childNodes.forEach(function (el) {
            if (el.nodeName === "BUTTON")
                el.addEventListener('click', function () {
                    if (oddOrEven(parseInt(this.dataset.value) + randomNumber(6)) === botC) {
                        // console.log('bot won the toss!');
                        window.alert('bot won the toss!');
                        setTimeout(function () {
                            document.querySelector('.toss-call-scene').classList.add('hide');
                            document.querySelector('.toss-final-scene').classList.remove('hide');
                            document.querySelector('.toss-final-scene').childNodes.forEach(function (el) {
                                if (el.nodeName === "BUTTON")
                                    el.disabled = true;
                            });
                            setTimeout(function () {
                                botPlaying = randomNumber(1) === 0 ? true : false;
                                if (!botPlaying)
                                    playerPlaying = true;
                                tossFlag = false;
                                play(tossFlag);
                            });
                        }, 2000);
                    } else {
                        // console.log('player won the toss!');
                        window.alert('player won the toss!');
                        setTimeout(function () {
                            document.querySelector('.toss-call-scene').classList.add('hide');
                            document.querySelector('.toss-final-scene').classList.remove('hide');
                            document.querySelector('.toss-final-scene').childNodes.forEach(function (el) {
                                if (el.nodeName === "BUTTON")
                                    el.addEventListener('click', function () {
                                        if (this.dataset.value === "bat") {
                                            playerPlaying = true;
                                        } else {
                                            botPlaying = true;
                                        }
                                        tossFlag = false;
                                        play(tossFlag);
                                    });
                            });
                        }, 2000);
                    }
                });
        });
    } else {
        ele.childNodes.forEach(function (el) {
            if (el.nodeName === "BUTTON")
                el.addEventListener('click', function () {
                    currentRandomNumber = randomNumber(6);
                    document.querySelector('.player-run').textContent = parseInt(el.dataset.value);
                    document.querySelector('.bot-run').textContent = currentRandomNumber;
                    if (parseInt(this.dataset.value) === currentRandomNumber) {
                        inningsBreak++;
                        playerPlaying = !playerPlaying;
                        botPlaying = !botPlaying;
                        playerPlayed = playerPlayed ? true : !playerPlaying;
                        botPlayed = botPlayed ? true : !botPlaying;
                        if (scorePlayer < scoreBot && botPlayed && playerPlayed) {
                            alert('lost');
                            summary('lost');
                        } else if (scorePlayer > scoreBot && botPlayed && playerPlayed) {
                            alert('won');
                            summary('won');
                        } else if (scorePlayer === scoreBot && botPlayed && playerPlayed) {
                            alert('tie');
                            summary('tied');
                        }

                        if (playerPlaying) {
                            document.querySelector('.player-playing').classList.remove('hide');
                            document.querySelector('.bot-playing').classList.add('hide');
                        } else {
                            document.querySelector('.bot-playing').classList.remove('hide');
                            document.querySelector('.player-playing').classList.add('hide');
                        }
                        alert('wicket!');
                    } else {
                        addScore(this, currentRandomNumber);
                    }
                });
        });
    }
}

function play(tossFlag) {
    if (tossFlag) {
        attachEventHandler(document.querySelector('.toss-call-scene'), tossFlag);
    } else {
        attachEventHandler(document.querySelector('.play-scene'), tossFlag);
        document.querySelector('.toss-final-scene').classList.add('hide');
        document.querySelector('.play-scene').classList.remove('hide');
    }

    if (playerPlaying) {
        document.querySelector('.player-playing').classList.remove('hide');
    } else {
        document.querySelector('.bot-playing').classList.remove('hide');
    }

}

function toss() {
    // console.log(this);
    switch (this.dataset.value) {
        case 'odd':
            playerC = this.dataset.value;
            break;
        case 'even':
            playerC = this.dataset.value;
            break;
        case 'idk':
            botC = randomNumber(1) === 0 ? "even" : "odd";
            break;
    }

    // console.log('player choose: ' + playerC, 'bot choose: ' + botC);
    document.querySelector('.toss-option-scene').classList.add('hide');
    document.querySelector('.toss-call-scene').classList.remove('hide');
    tossFlag = true;
    play(tossFlag);
}

document.querySelector('.toss-option-scene').childNodes.forEach(function (el) {
    if (el.nodeName === "BUTTON")
        el.addEventListener('click', toss);
});