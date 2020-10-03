const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

class TarotServer {
  static deck = [
    "The Fool",
    "The Magician",
    "The High Priestess",
    "The Empress",
    "The Emporer",
    "The Hierophant",
    "The Lovers",
    "The Chariot",
    "Justice",
    "The Hermit",
    "Wheel of Fortune",
    "Strength",
    "The Hanged Man",
    "Death",
    "Temperance",
    "The Devil",
    "The Tower",
    "The Star",
    "The Moon",
    "The Sun",
    "Judgement",
    "The World",
  ];

  constructor() {
    this.app = express();
    this.app.use(express.static("dist"));

    this.httpServer = http.createServer(this.app);

    this.io = socketIO(this.httpServer);

    this.readers = {};
  }

  start() {
    this.io.on("connection", (socket) => {
      socket.on("deal_a_card", () => {
        this.deal_a_card(socket);
      });

      socket.on("open_reader", () => {
        this.open_reader(socket);
      });

      socket.on("open_viewer", (msg) => {
        this.open_viewer(socket, JSON.parse(msg).room_id);
      });
    });

    // start server.
    this.httpServer.listen(3000, () => {
      console.log("listening on *:3000");
    });
  }

  deal_a_card(socket) {
    var r = this.readers[socket.id];
    if (r === undefined) {
      return;
    }

    if (r.cards.length < 3) {
      r.cards.push(
        r.deck.splice(Math.floor(Math.random() * r.deck.length), 1)[0]
      );
    }
    // should be able to send to a room- see https://socket.io/docs/emit-cheatsheet/.
    for (var v = 0; v < r.viewers.length; v++) {
      var viewer_id = r.viewers[v];
      this.io.sockets.sockets[viewer_id].emit(
        "get_cards",
        JSON.stringify({ cards: r.cards })
      );
    }
    socket.emit("get_cards", JSON.stringify({ cards: r.cards }));
  }

  open_reader(socket) {
    this.readers[socket.id] = {
      cards: [],
      deck: [].concat(TarotServer.deck),
      room_id: socket.id,
      viewers: [],
    };

    this.io
      .to(socket.id)
      .emit("get_room_id", JSON.stringify({ room_id: socket.id }));
    // something to clean up readers object.
  }

  open_viewer(socket, room_id) {
    this.readers[room_id].viewers.push(socket.id);
  }
}

new TarotServer().start();
