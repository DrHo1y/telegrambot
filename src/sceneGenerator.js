//const Scene = require('telegraf/scenes/base')
const Markup = require('telegraf/markup')
const WizardScene = require('telegraf/scenes/wizard')
// const Composer = require('telegraf/composer')


// const stepHandler = new Composer()
// stepHandler.action('next', (ctx) => {
//     ctx.reply('Step 2. Via inline button')
//     return ctx.wizard.next()
// })
// stepHandler.command('next', (ctx) => {
//     ctx.deleteMessage()
//     ctx.reply('Step 2. Via command')
//     return ctx.wizard.next()
// })
// stepHandler.use((ctx) => ctx.replyWithMarkdown('Press `Next` button or type /next'))

const superWizard = new WizardScene('super-wizard',
    (ctx) => {
        ctx.reply('Step 1', Markup.inlineKeyboard([
            Markup.urlButton('❤️', 'http://telegraf.js.org'),
            Markup.callbackButton('➡️ Next', 'next')
        ]).extra())
        return ctx.wizard.next()
    },
    (ctx) => {
        ctx.reply('Step 3')
        return ctx.wizard.next()
    },
    (ctx) => {
        ctx.reply('Step 4')
        return ctx.wizard.next()
    },
    (ctx) => {
        ctx.reply('Done')
        return ctx.scene.leave()
    }
)

module.exports = superWizard