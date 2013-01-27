var state = 0;

var PlaceToHack = function(name, diff) {
  this.name = name;
  this.difficulty = diff;
  this.password = this.generatePassword();
};

PlaceToHack.prototype.hasInString = function(s, c) {
  for (var i = 0; i < s.length; ++i) {
    if (s[i] == c) {
      return true;
    }
  }
  return false;
};

PlaceToHack.prototype.getRandC_ = function(pass, diff) {
  var cc = String.fromCharCode(99 + Math.floor(Math.random() * 15));
  var id = 0;
  var times = 0;
  while (this.hasInString(pass, cc)) {
    cc = String.fromCharCode(id + 1 + 99);
    ++id;
    if (cc == 'z') id = -1;
    ++times;
    if (times > 100) {
      return '';
      break;
    }
  }
  return cc;
};

PlaceToHack.prototype.generatePassword = function() {
  if (this.difficulty < 3) {
    return "qwerty";
  }
  var len = Math.floor(Math.random() * 5) + this.difficulty + 3;
  var pass = '';
  for (var i = 0; i < len; ++i) {
    pass += this.getRandC_(pass, this.difficulty);
  }
  return pass;
};

PlaceToHack.prototype.toString = function() {
  return "name: " + this.name + "  |  difficulty: " + this.difficulty;
}

var HackingMode = function() {
  this.helpText_ =
    'You are about to hack this guy! Try to find the password. You know the length of the password and after each try you see the number of right characters that stand on the correct places and also the number of the right characters that stand on the incorrect place. Find the password. To exit the hacking mode type "q". To look how many attepts do you have press "a".';
};

HackingMode.prototype.stopHacking = function(score) {
  state = 1 - state;
  normalMode.init();
  normalMode.addScore(score);
};

HackingMode.prototype.loadingHacking = function() {
  addNewLine('Spy program is running...');
  var pass = this.passToGuess_;
  window.setTimeout(
    function() {
      addNewLine('Connection stable...');
      window.setTimeout(
        function() {
          addNewLine('The password length is ' + pass.length);
        }, 2000        
      )
    }, 1000                
  )
};

HackingMode.prototype.init = function(placeToHack) {
  this.passToGuess_ = placeToHack.password;
  this.successScore_ = this.passToGuess_ * placeToHack.difficulty * Math.floor(Math.random() * 5);
  this.negativeScore_ = this.passToGuess_ * placeToHack.difficulty * Math.floor(Math.random() * 5);
  this.attempts_ = 20;
  if (PlaceToHack.difficulty >= 3) this.attempts_ -= 5;
  this.loadingHacking();
};

HackingMode.prototype.getNumberCorrect_ = function(word) {
  var result = 0;
  for (var i = 0; i < word.length; ++i) {
    if (word[i] == this.passToGuess_[i]) {
      ++result;
    }
  }
  return result;
}

HackingMode.prototype.getNumberCorrectOnWrongPlaces_ = function(word) {
  var result = 0;
  for (var i = 0; i < word.length; ++i) {
    for (var j = 0; j < this.passToGuess_.length; ++j) {
      if (i != j) {
        if (word[i] == this.passToGuess_[j]) {
          ++result;
        }
      }
    }
  }
  return result;
}

HackingMode.prototype.enterHit = function(command) {
  addNewCommandLine(command)
  if (command == 'h') {
    addNewLine(this.helpText_);  
  } else if (command == 'q') {
    this.stopHacking(0);
  } else if (command == 'a') {
    addNewLine('You have ' + this.attempts_ + ' attempts.');
  } else {
    var word = command.split(' ')[0];
    if (word.length > this.passToGuess_.length) {
      word = word.substr(this.passToGuess_length);
    }
    var numberCorrect = this.getNumberCorrect_(word);
    var numberCorrectOnWrongPlaces = this.getNumberCorrectOnWrongPlaces_(word);
    if (numberCorrect == word.length) {
      addNewLine("You are in! Processing getting information... Done!");
      this.stopHacking(50);
    } else if (this.attempts_ == 1) {
      addNewLine("Out of the attempts! You losing the hacker score!");
      this.stopHacking(-50);
    } else if (Math.floor(Math.random() * 1000) % 32 == 0) {
      addNewLine("You have been found! It is better to get out of here!");
      this.stopHacking(0);
    } else {
      addNewLine("Correct characters on the correct places: " + numberCorrect);
      addNewLine("Correct characters on the incorrect places: " + numberCorrectOnWrongPlaces);
      --this.attempts_;
    }
  }
};
