var availableCurrency = 100;

// de chipkleuren van laag naar hoog
var chipkleuren = ["#c73e04", "#1e4c97", "#981e37", "#00baed", "#e31a3d", "#0d854c"];
var kanNietMelding = "Je kan nu niks meer inzetten";
var kanWelMelding = "Je kan nu inzetten";

var playnumbers;
var gameover = false;

var clearall = document.getElementById('clearall');

var alleNummers = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];

var currentNumber;
var currentColor;
var evenOrOdd;

var ingezet = 0;
var gewonnenIngezet;
var gewonnen = 0;

var kanInzetten = true;

var startgame = document.getElementById('startgame');
var value = document.getElementById('value');
var values = document.getElementsByClassName('values');
var playableNumbers = document.getElementsByClassName('playnumbers');
var activeChip = document.getElementsByClassName('activeChip')[0];
var bal = document.getElementById('ball');
var spinner = document.getElementById('spinner');
var tablestate = document.getElementById('tablestate');
var timerbalk = document.getElementById('timerbalk');
var bottom = document.getElementById('bottom');

//audio files
var kaching = document.getElementById('kaching');
var aww = document.getElementById('aww');
var addChipSound = document.getElementById('addchip');
var takechip = document.getElementById('takechip');
var takeall = document.getElementById('takeall');
var dead = document.getElementById('dead');
var bgmusic = document.getElementById('bgmusic');


// hier worden de 36 vakken aangemaakt in de juiste volgorde met juiste classes
for (var j = 0; j < 3; j++) {
  for (var i = 0; i < 12; i++) {
    playnumbers = document.createElement("div");
    var number = i * 3 + 3 - j;
    playnumbers.innerHTML = number;
    playnumbers.classList.add("playnumbers", "n" + number);
    document.getElementById('othernumbers').appendChild(playnumbers);
    if (checkColors(number) == "black") {
      playnumbers.classList.add("blackBg");
    } else {
      playnumbers.classList.add("redBg");
    }
  }
}

// deze functie zorgt voor een random nummer, ook word er gekeken of welke kleiur het is en of het even of oneven is. Deze data word opgeslagen in een aantal vars.
function spin(randomnumber, rotation) {
  kanInzetten = false;
  tablestate.innerHTML = kanNietMelding;
  tablestate.style.color = "red";
  bal.style.transition = "0s";
  bal.style.transform = "";
  spinner.style.transition = "0s";
  spinner.style.transform = "";

  randomnumber = Math.floor(Math.random() * 37);
  rotation = 360 / 37 * randomnumber + 720;
  currentNumber = alleNummers[randomnumber];

  if (randomnumber == 0) {
    currentColor = "green";
  } else if (randomnumber % 2 == 0) { //alle even getallen
    currentColor = "black";
  } else {
    currentColor = "red";
  }

  if (currentNumber % 2 == 0) {
    evenOrOdd = "even";
  } else {
    evenOrOdd = "odd";
  }

  setTimeout(function() {
    bal.style.transition = "7s";
    bal.style.transform = "scale(1,1) rotate(" + rotation + "deg)";

    spinner.style.transition = "5.5s";
    spinner.style.transform = "scale(1,1) rotate(-1080deg)";
    setTimeout(function() {
      showHistory();
      bankCalc();
    }, 7000);
  }, 500);
}

// deze functie zorgt voor de geschiedenins
function showHistory() {
  var history = document.createElement("div");
  history.innerHTML = currentNumber;
  history.style.backgroundColor = currentColor;
  history.classList.add("history");
  document.getElementById('history').appendChild(history);
  if (document.getElementsByClassName('history').length > 5) {
    document.getElementsByClassName('history')[0].remove();
  }
}


// deze functie berekent je winst per ronde, hij kijkt naar de 37 getallen, kleur en even of oneven.
function bankCalc() {
  ingezet = 0;
  gewonnen = 0;
  for (var i = 0; i < playableNumbers.length; i++) {
    if (playableNumbers[i].firstElementChild) {
      ingezet = ingezet + parseInt(playableNumbers[i].firstElementChild.innerHTML);
      var activeChipOnPlayable = playableNumbers[i].innerText.replace(/[0-9]/g, '').replace(/\s/g, '');

      //check of je chip op rood of zwart ligt
      if (activeChipOnPlayable == currentColor) {
        gewonnenIngezet = parseInt(playableNumbers[i].firstElementChild.innerHTML);
        gewonnen = gewonnen + gewonnenIngezet * 2;
      }

      //check of je chip op even en oneven ligt
      if (activeChipOnPlayable == evenOrOdd) {
        gewonnenIngezet = parseInt(playableNumbers[i].firstElementChild.innerHTML);
        gewonnen = gewonnen + gewonnenIngezet * 2;
      }

      //check of je chip op rood of zwart ligt
      if (parseInt(playableNumbers[i].innerHTML) == currentNumber) {
        gewonnenIngezet = parseInt(playableNumbers[i].firstElementChild.innerHTML);
        gewonnen = gewonnen + gewonnenIngezet * 36;
      }
    }
  }
  if (gewonnen != 0) {
    kaching.play();
  } else {
    aww.play();
  }
  availableCurrency = availableCurrency + gewonnen;
  availableCurrencyChecker();
  keepCurrentBoard();
}

// deze functie kijkt of je je bord kan hergebruiken voor de volgende ronde.
function keepCurrentBoard() {
  if (ingezet < availableCurrency + 1) {
    availableCurrency = availableCurrency - ingezet;
    availableCurrencyChecker();
  } else {
    for (var i = 0; i < playableNumbers.length; i++) {
      if (playableNumbers[i].firstElementChild) {
        playableNumbers[i].firstElementChild.remove();
        ingezet = 0;
        availableCurrencyChecker();
      }
    }
  }
  kanInzetten = true;
  timerbalk.style.transition = "0s";
  timerbalk.style.width = "0%";
  setTimeout(function() {
    startTimer();
  }, 50);
}

//restart de timer als er nog punten over zijn.
function startTimer() {
  if (!gameover) {
    tablestate.innerHTML = kanWelMelding;
    tablestate.style.color = "green";
    timerbalk.style.transition = "12s";
    timerbalk.style.width = "100%";
    setTimeout(function() {
      spin();
    }, 12000);
  }
}

// hier word gekekekn welke kleuren de vakken hebben
function checkColors(n) {
  if (n <= 10 && n % 2 == 0) {
    return ("black");
  } else if (n >= 10 && n % 2 !== 0 && n <= 17) {
    return ("black");
  } else if (n >= 20 && n % 2 == 0 && n <= 28) {
    return ("black");
  } else if (n >= 28 && n % 2 !== 0) {
    return ("black");
  } else {
    return ("red");
  }
}

// deze functie checkt welke chips je wel en niet in mag zetten
function availableCurrencyChecker(totaal) {
  totaal = availableCurrency + ingezet;
  if (totaal == 0) {
    gameover = true;
    bgmusic.pause();
    dead.play();
  } else {
    for (var m = 0; m < values.length; m++) {
      if (values[m].innerHTML == "wis") {
        if (ingezet > 0) {
          values[m].classList.add("canuse");
        } else {
          values[m].classList.remove("canuse");
        }
      } else {
        if (availableCurrency + 1 <= values[m].innerHTML) {
          values[m].classList.remove("canuse");
        } else {
          values[m].classList.add("canuse");
        }
      }
    }
  }
  value.innerHTML = "Gestart met 100 Fiches.  <br><br>" + gewonnen + " Fiches gewonnen vorige ronde.<br>" + ingezet + " Fiches ingezet deze ronde. <br><br>" + availableCurrency + " Beschikbare fiches. <br>";
}

// deze functie voegt chips toe aan de gekikte vakken of verwijdert ze. als er al een chip ligt dan word de value verhoogt
function addChip(clickedDiv) {
  if (activeChip.classList.contains("canuse")) {
    if (activeChip.innerHTML === "wis") {
      if (clickedDiv.getElementsByClassName('chip')[0]) {
        availableCurrency = availableCurrency + parseFloat(clickedDiv.getElementsByClassName('chip')[0].innerHTML);
        ingezet = ingezet - parseFloat(clickedDiv.getElementsByClassName('chip')[0].innerHTML);
        clickedDiv.getElementsByClassName('chip')[0].remove();
        takechip.currentTime = 0;
        takechip.play();
      }
    } else {
      if (clickedDiv.getElementsByClassName('chip')[0]) {
        var newChipValue = parseFloat(clickedDiv.getElementsByClassName('chip')[0].innerHTML) + parseFloat(activeChip.innerHTML);
        clickedDiv.getElementsByClassName('chip')[0].innerHTML = newChipValue;
        clickedDiv.getElementsByClassName('chip')[0].style.backgroundColor = setChipColor(newChipValue);
      } else {
        var chip = document.createElement("div");
        chip.classList.add("chip");
        chip.innerHTML = activeChip.innerHTML;
        chip.style.backgroundColor = setChipColor(chip.innerHTML);
        clickedDiv.appendChild(chip);
      }
      addChipSound.currentTime = 0;
      addChipSound.play();
      ingezet = ingezet + parseFloat(activeChip.innerHTML);
      availableCurrency = availableCurrency - activeChip.innerHTML;
    }
  }
  availableCurrencyChecker();
}

// deze functie verantert de kleir van het ingezette chip naarmate het getal hoger wordt.
function setChipColor(currentChipValue) {
  if (currentChipValue >= 50) {
    return ("#c73e04");
  } else if (currentChipValue >= 20) {
    return ("#1e4c97");
  } else if (currentChipValue >= 10) {
    return ("#981e37");
  } else if (currentChipValue >= 5) {
    return ("#00baed");
  } else if (currentChipValue >= 2) {
    return ("#e31a3d");
  } else {
    return ("#0d854c");
  }
}

//deze functie kijkt of er chips op het bord liggen, zo ja dan haalt die ze allmaal weg en geeft de punten terug
function clearBoard() {
  if (kanInzetten) {
    for (var i = 0; i < playableNumbers.length; i++) {
      if (playableNumbers[i].firstElementChild) {
        playableNumbers[i].firstElementChild.remove();
        availableCurrency = availableCurrency + ingezet;
        ingezet = 0;
        takeall.play();
        availableCurrencyChecker();
      }
    }
  }
}

// tijd voor event addEventListeners----------------------------------------------------------------------


//deze addEventListener start de game, deze is nodig om toestemming te krijgen om muziek te spelen op de achtergrond.
startgame.addEventListener("click", function() {
  availableCurrencyChecker();
    document.querySelector(".welkombg").style.display = "none";
    startTimer();
    bgmusic.play();
});

// hiermee clear je de hele kaart
clearall.addEventListener("click", clearBoard);

clearall.addEventListener("mouseenter", function() {
  clearall.style.transform = "scale(1.1)";
  clearall.style.backgroundColor = "rgba(255, 255, 255, 1)";
});
clearall.addEventListener("mouseleave", function() {
  clearall.style.transform = "scale(1)";
  clearall.style.backgroundColor = "rgba(255, 255, 255, .7)";
});

//keydown event om je bord te resetten met backspace.
window.addEventListener("keydown", function(e){
    if (e.keyCode === 8) {
      clearBoard();
    }
});

// Hier worden alle vakken klikbaar gemaakt
for (var i = 0; i < playableNumbers.length; i++) {
  playableNumbers[i].addEventListener("click", function() {
    if (kanInzetten) {
      addChip(this);
    }
  })
}

//deze for loop maakt alle inzet mogelijkheden clickbaar (onderaan het scherm).
for (var i = 0; i < values.length; i++) {
  values[i].addEventListener("click", function() {
    if (this.classList.contains("canuse")) {
      for (var p = 0; p < values.length; p++) {
        values[p].classList.remove("activeChip");
      }
      this.classList.add("activeChip");
      activeChip = this;
    }
  })
}

// disable elementen inspecteren
document.addEventListener('contextmenu', function(a) {
  a.preventDefault();
});
