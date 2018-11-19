#!/usr/bin/env node

import shell from 'shelljs'

import * as game from './game/index.mjs'

import prompts from './prompts/index.mjs'
;(async function enter() {
  const outcome = await prompts()
  console.log('outcome', outcome)

  if (outcome.activity === 'game') {
    shell.exec(game.commands[outcome.game], { async: true })
  }
})()
