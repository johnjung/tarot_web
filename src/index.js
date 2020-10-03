const io = require('socket.io-client')

const urlParams = new URLSearchParams(window.location.search);

var room_id;
var cards;

// communicate with the server using a websocket.
const socket = io();

if (urlParams.get('room_id') !== null) {
  socket.emit(
    'open_viewer', 
    JSON.stringify({ room_id: urlParams.get('room_id')})
  );
} else {
  socket.emit('open_reader', JSON.stringify({}));
}

// get room id (reader view only.)
if (document.getElementById('room_id') !== null) {
  socket.on('get_room_id', function(msg) {
    room_id = JSON.parse(msg).room_id;
  
    document.getElementById('room_id').setAttribute(
      'href',
      '/view?room_id=' + room_id
    );
  });
}

// deal a new card click handler (reader view only.)
if (document.getElementById('deal_a_card') !== null) {
  document.getElementById('deal_a_card').addEventListener('click', function(e) {
    e.preventDefault();
    socket.emit(
      'deal_a_card', 
      JSON.stringify({
        room_id: room_id
      })
    );
  });
}

// get cards.
socket.on('get_cards', function(msg) {
  cards = JSON.parse(msg).cards;
  
  for (var i = 0; i < cards.length; i++) {
    document.getElementById('card_' + i).innerHTML = cards[i];
  };
});
