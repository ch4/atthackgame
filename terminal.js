var NormalMode = function() {
  this.placesToHack_ = [];
  this.helpText_ =
    'This is the hacker game. To get the list of the devices' +
    ' you can hack use "list" or "l" command, to start hacking the ' +
    'device type "hack (or h) [device name]." To look at your score type "score (s)"';
  this.init();
};

NormalMode.prototype.init = function() {
  // TODO: Generate normal addresses
  for (var i = 0; i < 10; ++i) {
    this.placesToHack_[i] = new PlaceToHack();
  }
};

NormalMode.prototype.beginHacking = function(placeToHack) {
  state = 1 - state;
  hackingMode.init(placeToHack);
};

NormalMode.prototype.enterHit = function(command) {
  addNewCommandLine(command)
  if (command == 'help' || command == 'h') {
    addNewLine(this.helpText_);
  } else if (command == 'list' || command == 'l') {
    for (var i = 0; i < 10; ++i) {
      addNewLine(this.placesToHack_[i].toString());
    }
  } else if (command == 'clear' || command == 'c') { 
    clearCmd();
  } else if (command == 'score' || command == 's') {
    addNewLine("Your hacker score is: " + SCORE);
    addNewLine("Number successful attacks: " + NUM_SUCCESS);
    addNewLine("Number of attacks: " + (NUM_SUCCESS + NUM_FAIL));
  } else {
    var sp = command.split(" ");
    if (sp.length == 2 && 
       (sp[0] == 'hack' || sp[0] == 'h')) {
      var name = sp[1];
      var id = -1;
      for (var i = 0; i < 10; ++i) {
        if (this.placesToHack_[i].name === name) {
          id = i;
          break;
        }
      }
      if (id === -1) {
        addNewLine("Can not recognize name to hack! Try again.");
      } else {
        this.beginHacking(this.placesToHack_[id]);
        return;
      }
    } else {
      addNewLine(command + ": Command not found");
    }
  }
};

var normalMode = new NormalMode();
var hackingMode = new HackingMode();

var createNewPrompt = function() {
  var new_input = document.createElement('div');
  new_input.setAttribute('id', 'current-line');
  new_input.setAttribute('class', 'input-line');
  var inside1 = document.createElement('div');
  inside1.setAttribute('class', 'prompt');
  inside1.innerHTML = '$>';
  new_input.appendChild(inside1);
  var inside2 = document.createElement('input');
  inside2.setAttribute('class', 'cmdline');
  inside2.setAttribute('id', 'cmdline');
  new_input.appendChild(inside2);
  new_input.focus();
  return new_input;
}

var addNewLine = function(text) {
  var input = document.getElementById('current-line');
  input.parentNode.removeChild(input);
  var newPrompt = createNewPrompt();
  var line = document.createElement('div');
  line.innerHTML = text;
  line.setAttribute('class', 'input-line');
  document.getElementById('terminal').appendChild(line);
  document.getElementById('terminal').appendChild(newPrompt);
  document.getElementById('cmdline').focus();
};

var addNewCommandLine = function(text) {
  var input = document.getElementById('current-line');
  input.parentNode.removeChild(input);
  var newPrompt = createNewPrompt();
  var wrapper = document.createElement('div');
  wrapper.innerHTML = text;
  var line = document.createElement('div');
  var pr = document.createElement('div');
  pr.innerHTML = '$>';
  pr.setAttribute('class', 'prompt');
  line.setAttribute('class', 'input-line');
  line.appendChild(pr);
  line.appendChild(wrapper);
  document.getElementById('terminal').appendChild(line);
  document.getElementById('terminal').appendChild(newPrompt);
  document.getElementById('cmdline').focus();
};

var enterHitResolver = function(command) {
  if (state == 0) {
    normalMode.enterHit(command);    
  } else {
    hackingMode.enterHit(command);
  }
};

var clearCmd = function() {
  var element = document.getElementById('terminal');
  var par = element.parentNode;
  par.removeChild(element);
  element = document.createElement('div');
  element.setAttribute('id', 'terminal');
  par.appendChild(element);
  var line = createNewPrompt();
  document.getElementById('terminal').appendChild(line);
  document.getElementById('cmdline').focus();
};

var onEnterListener = function(e) {
  if (e.keyCode == 13) { // Enter
    var command = document.getElementById('cmdline').value;
    console.log('Command that was entered: ' + command);
    enterHitResolver(command);
  }
};

