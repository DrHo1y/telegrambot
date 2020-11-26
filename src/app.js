//Config
const config = require('config')
//


//MongoDB
const startMongo = require('./startMongoDB')
const URI = config.get('mongoURI')
startMongo(URI)
//


//Telegraf
const Telegraf = require('telegraf')
const TOKEN = config.get('token')
const {
    Stage,
    session
} = Telegraf
const bot = new Telegraf(TOKEN)
//


//Scenes
const AddComputerDataScenes = require('./AddComputerDataScenes')
const PCScene = new AddComputerDataScenes()
const nameScene = PCScene.GenNameScene()
const cpuScene = PCScene.GenCpuScene()
const cpuSpeedScene = PCScene.GenCpuSpeedScene()
const gpuScene = PCScene.GenGpuScene()
const ramScene = PCScene.GenRamScene()
const romScene = PCScene.GenRomScene()
const psuScene = PCScene.GenPsuScene()
const compliteScene = PCScene.GenCompliteScene()
//

const MainMenu = require('./test')
const mainMenuObj = new MainMenu()
const menuScene = mainMenuObj.MenuScene()
const testScene = require('./sceneGenerator')

//Middleware
const stage = new Stage([testScene, menuScene, nameScene, cpuScene, cpuSpeedScene, gpuScene, ramScene, romScene, psuScene, compliteScene])
bot.use(session())
bot.use(stage.middleware())
//


//Keyboard and buttons
const kb = require('./keyboard')
const btn = require('./keyboard-buttons')
//

const { getAllPC } = require('./ComputerDB')


bot.start(ctx => {
    ctx.replyWithHTML(`Привет <i>${ctx.from.first_name}</i>!\nВыбери действие:`, kb.home)
    console.log(ctx.from.first_name)
})


//keyboard handler
bot.hears(btn.homeBtn.allTab, ctx => {
    ctx.reply('Выберите таблицу', kb.allTable)
})
bot.hears(btn.allTableBtn.goHome, ctx => ctx.reply('Выберите действие', kb.home))
bot.hears(btn.allTableBtn.computer, ctx => ctx.reply('Выберите действие', kb.computer))
bot.hears(btn.goAllTable, ctx => ctx.reply('Выберите таблицу', kb.allTable))
bot.hears(btn.computerBtn.showAllData, async ctx => {
    const result = await getAllPC()
    await ctx.replyWithHTML(result, kb.computer)
})
bot.hears(btn.computerBtn.addData, async ctx => {
    ctx.scene.enter('PCname')
})
//


bot.hears('Об программе', ctx => {
    const text = `<i>Это телеграм бот для работы с базой данных!</i>\n<b>Автор:</b> Валентин Р. \n<b>Группа:</b> 491\n<b>Вариант:</b> 18\n<code>Необходим для сдачи практики</code>)`
    ctx.replyWithHTML(text, kb.home) //tg://user?id=747406692
})
bot.help(ctx => {
    const text = `Введите /menu чтобы попробовать тестовое меню, хех приниципе как и все приложение).`
    ctx.reply(text)
})


//Error Handler
bot.catch((err, ctx) => {
    console.log(`Ooops, encountered an error for ${ctx.updateType}`, err)
})
//

bot.command('test', async ctx => {
    await ctx.scene.enter('complite')
})
bot.command('menu', async ctx => {
    ctx.deleteMessage()
    await ctx.scene.enter('menu')
})

bot.command("testscene", (ctx) => ctx.scene.enter("super-wizard"))


bot.on('callback_query', async ctx => await ctx.answerCbQuery())

console.log('boot has been started')
bot.launch()