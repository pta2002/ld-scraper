'use strict'
let request = require('request-promise')
let knex = require('knex')(require('./knexfile').development)

let length = 2359
let current = 0

function fetchGames(offset) {
  request(`https://api.ldjam.com/vx/node/feed/32802/cool+parent/item/game/compo+jam?limit=50&offset=${offset}`).then(body => {
    let json = JSON.parse(body)
    let ids = []
    json.feed.forEach((element) => {
      ids.push(element.id)
    });
    fetchGameInfo(ids)
    current += 50
    if (current < length)
      fetchGames(current)
  })
}

function fetchGameInfo(ids) {
  let authors = {}

  request(`https://api.ldjam.com/vx/node/get/${ids.join('+')}`).then(body => {
    let json = JSON.parse(body)
    json.node.forEach((element) => {
      knex('games').insert({
        id: element.id,
        event: element.subsubtype,
        name: element.name,
        path: element.path,
        body: element.body
      }).then(function(){})
      element.link.author.forEach((author) => authors[author] = element.id)
    })

    let author_ids = []
    for (let author in authors) author_ids.push(author)
    request(`https://api.ldjam.com/vx/node/get/${author_ids.join('+')}`).then(body => {
      let json = JSON.parse(body)
      json.node.forEach(author => {
        knex('users').insert({
          id: author.id,
          name: author.name,
          game_id: authors[author.id]
        }).then(function(){})
      })
    })
  })
}

knex.migrate.rollback()
  .then(() => { return knex.migrate.latest() })
  .then(() => fetchGames(0))
