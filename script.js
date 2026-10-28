let gameboard = document.getElementById("board")
//each emoji should appear twice to form a pair
let originalcards=["🚓","🏍️","😊","🍎","🎈","🚀","🚂","🍒"];
let cards=[];
let paircount=4;
// variables to store the selected cards
let firstcard=null;
let secondcard=null;
// it is used to prevent clicking more cards
let lock=false;
// count of the variables in game
let moves=0;
let matches=0;
let seconds=0;
let score=100;

// variables to control duration
let timerstart=false;
let timerinterval=null;
let hidetimeout=null;
let movesdisplay=document.getElementById("moves");
let matchesdisplay=document.getElementById("matches");
let totalpairdisplay=document.getElementById("totalpairs");
let timerdisplay=document.getElementById("timer")
let scoredisplay=document.getElementById("score")
let restart=document.getElementById("restart");

// Load best score
let bestscore = Number(localStorage.getItem("bestScore")) || 0;

// Create best score display
let bestscoredisplay = document.createElement("p");

bestscoredisplay.innerHTML ='Best Score: <span id="bestscore">0</span>';

// Add it only if .starts exists
let stats = document.querySelector(".starts");

if (stats) {
    stats.appendChild(bestscoredisplay);
}

let bestvalue = document.getElementById("bestscore");

if (bestvalue) {
    bestvalue.innerHTML = bestscore;
}

// Create result message area
let resultmessage = document.createElement("div");

resultmessage.id = "resultmessage";
resultmessage.style.marginTop = "20px";
resultmessage.style.fontSize = "20px";
resultmessage.style.fontWeight = "bold";
resultmessage.style.color = "darkgreen";

gameboard.insertAdjacentElement("afterend", resultmessage);
// it is for difficulty
function changelevel(pairs){
    paircount=pairs;
    startgame();
}
//start a new game or restart
function startgame(){
    // to stop the old duration
    clearInterval(timerinterval);
    clearTimeout(hidetimeout);
// to reset the values
    moves=0;
    matches=0;
    seconds=0;
    score=100;
// duration reset
    timerstart=false;
    timerinterval=null;
    hidetimeout=null;

    firstcard=null;
    secondcard=null;
    lock=false;
// display the starting values in browser
    movesdisplay.innerHTML=moves;
    matchesdisplay.innerHTML=matches;
    totalpairdisplay.innerHTML=paircount;
    timerdisplay.innerHTML=seconds;
    scoredisplay.innerHTML=score;
    // display saved score
    bestvalue.innerHTML=bestscore
    // clear previous result
    resultmessage.innerHTML="";
// select emojis according to difficult
    let selectedcards=originalcards.slice(0,paircount);
    // duplicate the selected emojis
    cards=[...selectedcards,...selectedcards];
    //shuffle the cards
    cards.sort(function(){
        return Math.random()-0.5;
    });
    // remove the previous cards
    gameboard.innerHTML="";
    //set the number of columns
    gameboard.style.gridTemplateColumns="repeat(4,1fr)";
// create and display every card
for(let i=0;i<cards.length;i++){
    let card=document.createElement("div");
    card.className="card";
    // hide the emoji before it clicked
    card.innerHTML="?";
    card.style.color="red";
    // code get executed when ever it is clicked
    card.onclick=function () {
        // clicks are ignored which are not allowed
        if(lock||card===firstcard||card.classList.contains("matched")){
            return;
        }
        // timer get started when the first card clicked
            if(!timerstart){
                timerstart=true;
                timerinterval=setInterval(function(){
                    seconds++;
                    timerdisplay.innerHTML=seconds;
                },1000);
            }
            // shows the clicked emojis
        card.innerHTML=cards[i];
        // store the first selected card
        if(firstcard===null){
            firstcard=card;
        }else {
            // store the second selected card
            secondcard=card;
            // while checking for the cards the game board get locked
            lock=true;
            moves++;
            movesdisplay.innerHTML=moves;
            // checks wheather both emojis are same
             if(firstcard.innerHTML===secondcard.innerHTML){
                // keep matching card visible
            firstcard.classList.add("matched");
                secondcard.classList.add("matched");
                matches++;
                matchesdisplay.innerHTML=matches;
                // clear the selected cards 
                firstcard=null;
                secondcard=null;
                lock=false;
            } else{
                // hide unmatched cards after 1 sec
                hidetimeout=setTimeout(function(){
                    firstcard.innerHTML="?";
                    secondcard.innerHTML="?";
                    // clear the selected card
                    firstcard=null;
                    secondcard=null;
                    // allow the player to continue
                    lock=false;
                }, 1000);
            }
            // reduce the score as per the number of moves increased
            score=Math.max(0,100-(moves-1)*10);
            scoredisplay.innerHTML=score;
              // check wheather all pairs are matched
                 if(matches===paircount){
                   // stop timer when the game over
                   clearInterval(timerinterval);
                   if(score>bestscore){
                    bestscore=score;
                    localStorage.setItem("bestScore",bestscore);
                    bestvalue.innerHTML=bestscore
                   }
                   resultmessage.innerHTML="congratulations! you won!<br>"+"Moves: "+moves+"<br>"+"Time: "+seconds+"seconds<br>"+"score: "+score+"<br>"+"Best Score: "+bestscore;
                   // alert("congratulations! you won the game!\n"+"Moves:"+moves+"\n"+"Time:"+seconds+"seconds\n"+"score:"+score);
                let playagain=document.createElement("button");
                   playagain.innerHTML="Play Again";
                playagain.onclick=startgame;
                resultmessage.appendChild(document.createElement("br"));
                resultmessage.appendChild(playagain);
                }
        }
    };
    gameboard.appendChild(card);
}
}
restart.onclick=startgame;
startgame();