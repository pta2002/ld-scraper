'use strict'
let irc = require('irc')
let knex = require('knex')(require('./knexfile').development)

let client = new irc.Client('irc.afternet.org', 'findbot', {
  channels: ['#ludumdare'],
})

client.addListener('message', (from, to, message) => {
  console.log(`${from} => ${to}: ${message}`)

  if (message.startsWith('~')) {
    // Turn into list of arguments
    let command = message.slice(1).split(' ')
    if (command[0] === 'find') {
      let looking_for

      if (command.length === 1) {
        looking_for = from
      } else {
        looking_for = command[1]
      }

      knex.select().from('users').where('users.name', '=', looking_for)
        .innerJoin('games', 'users.game_id', '=', 'games.id')
        .first()
        .then(game => {
          if (typeof game === 'undefined') {
            client.say(to, `${from}: Couldn't find any games by ${looking_for}`)
          } else {
            client.say(to, `${from}: "${game.name}" (${game.event}): https://ldjam.com${game.path}`)
          }
        })
    }
  }
})