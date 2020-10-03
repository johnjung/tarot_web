# Tarot Server

This is a small project to learn node and socket.io. Originally inspired by the
Superflux [Instant
Archetypes](https://superflux.in/index.php/and-now-for-something-completely-different/#)
tarot deck, this is a small node server for doing three card "readings" online.

Get the code:
```console
$ git clone https://github.com/johnjung/tarot_server.git
```

Build the site and start the server:
```console
$ npm install
$ npm run dev
$ node src/server.js
```
Then visit localhost:3000 to view the site in a web browser.

## TO-DO
- set up socket.io rooms to manage messages for specific groups of users.
- set up rooms for one or more people to receive readings.
- clean up rooms and connections that are no longer being used.
- improve the UI with an introductory screen.
- add front end design.
