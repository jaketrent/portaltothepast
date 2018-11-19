import Enquirer from 'enquirer'

const prompt = Enquirer.prompt

export default async function prompts() {
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

  const activityChoices = [
    {
      name: 'draw',
      value: 'draw',
      message: 'Draw a picture'
    },
    {
      name: 'conf',
      value: 'conf',
      message: 'Watch General Conference'
    },
    {
      name: 'game',
      value: 'game',
      message: 'Play a game'
    }
  ]
  const activityMessage = `
What activity do you want to do?

${choiceList(activityChoices)}
  `
  const activityPrompt = {
    type: 'input',
    name: 'activity',
    message: activityMessage,
    async validate(input, _question) {
      return validateInChoices(activityChoices, input)
    },
    async skip(state) {
      return !state.answers.standard
    }
  }

  const gameChoices = [
    { name: 'loom', message: 'Loom', value: 'loom' },
    { name: 'hf', message: 'Hidden Folks', value: 'hf' },
    { name: 'rime', message: 'RiME', value: 'rime' }
  ]
  const gamePrompt = {
    type: 'input',
    name: 'game',
    message: `
What game do you want to play?

${choiceList(gameChoices)}
`,
    async skip(state) {
      return !state.answers.standard || state.answers.activity !== 'game'
    },
    async validate(input, _question) {
      return validateInChoices(gameChoices, input)
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

function pad(arr, name, val) {
  const maxLen = arr.reduce(
    (max, el) => (el[name].length > max ? el[name].length : max),
    Number.NEGATIVE_INFINITY
  )
  const diffLen = maxLen - val.length
  const spaces = Array(diffLen)
    .fill(0)
    .reduce(space => space + ' ', '')
  return val + spaces
}

function choiceList(choices) {
  return choices
    .map((c, _, arr) => pad(arr, 'name', c.name) + ' - ' + c.message)
    .join('\n')
}

function validateInChoices(choices, input) {
  return choices.map(c => c.name).some(n => n === input)
}
