#!/usr/bin/env node

import shell from 'shelljs'

import * as prompts from './prompts/index.mjs'
;(async function enter() {
  const outcome = await prompts.ask()
  console.log('outcome', outcome)

  if (outcome.activity === 'game') {
    shell.exec(prompts.game[outcome.game].command, { async: true })
  } else {
    shell.exec(prompts.activity[outcome.activity].command, { async: true })
  }
})()
