var messages;

messages = document.createElement('div');
document.body.appendChild(messages);

function appendMessage(s) {
  var line = document.createElement('div');
  line.textContent = s;
  messages.appendChild(line);
}

var host = 'irc.mozilla.org';
var port = 6667;

var nick = 'okcjs_demo';
var ident = 'okcjs_demo';
var name = 'OKCJSDemo';

var buffer = '';

var socket = navigator.mozTCPSocket.open(host, port, {binaryType: 'string'});
socket.onerror = function (e) { appendMessage('socket error: ' + e.data); };
socket.onopen = function () {
  socket.send('NICK ' + nick + '\r\n');
  socket.send('USER ' + ident + ' ' + host + ' demo : ' + name + '\r\n');
};
socket.ondata = function (e) {
  buffer += e.data;
  var lines = buffer.split('\n');
  buffer = lines.pop();

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].replace(/\r$/, '');
    appendMessage(line);

    if (line.indexOf('PING ') === 0) {
      socket.send('PONG ' + line.substr(5) + '\r\n');
    }
  }
};


