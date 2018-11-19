// @flow
import Enquirer from 'enquirer'
const prompt = Enquirer.prompt

/*::
type Choices = {
  [command: string]: {
    name: string,
    value: string,
    message: string,
    command: string
  }
}
*/

export const activity = {
  draw: {
    name: 'draw',
    value: 'draw',
    message: 'Draw a picture',
    command: 'echo "DRAW!"'
  },
  conf: {
    name: 'conf',
    value: 'conf',
    message: 'Watch General Conference',
    command: 'echo "CONF!"'
  },
  game: {
    name: 'game',
    value: 'game',
    message: 'Play a game',
    command: 'echo "GAME!"'
  }
}
export const game = {
  loom: {
    name: 'loom',
    message: 'Loom',
    value: 'loom',
    command: 'echo "LOOOM"'
  },
  hf: {
    name: 'hf',
    message: 'Hidden Folks',
    value: 'hf',
    command: 'echo "HIIIIDEN"'
  },
  rime: {
    name: 'rime',
    message: 'RiME',
    value: 'rime',
    command: 'echo "RIIIIME"'
  }
}
export async function ask() {
  const standardPrompt = {
    type: 'confirm',
    name: 'standard',
    message: `
Welcome, have you met the standard for access?
`
  }

  const namePrompt = {
    type: 'autocomplete',
    name: 'name',
    message: "What's your name?",
    limit: 1,
    suggest(input, choices) {
      return choices.filter(c =>
        c.message.toLowerCase().startsWith(input.toLowerCase())
      )
    },
    choices: ['Dad', 'Mom', 'Dallin', 'Mackenzie', 'Alaura', 'Benson', 'Eliza'],
    async skip(state) {
      return !state.answers.standard
    }
  }

  const activityMessage = `
What activity do you want to do?

${choiceList(activity)}
  `
  const activityPrompt = {
    type: 'input',
    name: 'activity',
    message: activityMessage,
    async validate(input, _question) {
      return validateInChoices(activity, input)
    },
    async skip(state) {
      return !state.answers.standard
    }
  }

  const gamePrompt = {
    type: 'input',
    name: 'game',
    message: `
What game do you want to play?

${choiceList(game)}
`,
    async skip(state) {
      return !state.answers.standard || state.answers.activity !== 'game'
    },
    async validate(input, _question) {
      return validateInChoices(game, input)
    }
  }

  const outcome = await prompt([
    standardPrompt,
    namePrompt,
    activityPrompt,
    gamePrompt
  ])

  return outcome
}

function pad(choices /*:::Choices*/, name /*:::string*/, val /*:::string*/) {
  const maxLen = Object.keys(choices).reduce(
    (max, key) =>
      choices[key][name].length > max ? choices[key][name].length : max,
    Number.NEGATIVE_INFINITY
  )
  const diffLen = maxLen - val.length
  const spaces = Array(diffLen)
    .fill(0)
    .reduce(space => space + ' ', '')
  return val + spaces
}

function choiceList(choices /*:::Choices*/) {
  return Object.keys(choices)
    .map(
      (k, _, arr) =>
        pad(choices, 'name', choices[k].name) + ' - ' + choices[k].message
    )
    .join('\n')
}

function validateInChoices(choices /*:::Choices*/, input) {
  return Object.keys(choices)
    .map(k => choices[k].name)
    .some(n => n === input)
}
