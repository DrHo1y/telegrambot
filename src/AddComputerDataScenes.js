const Scene = require('telegraf/scenes/base')
const kb = require('./keyboard')
const Markup = require('telegraf/markup')

class AddComputerDataScenes {
    setData() {
        this.Data = {}
    }
    GenNameScene() {
        const name = new Scene('PCname')
        name.enter(async (ctx) => {
            this.setData()
            await ctx.reply('Введите название ПК:', kb.addComputerScene)
        })
        name.command('cancel', async ctx => {
            await ctx.deleteMessage()
            ctx.reply('Выберите действие:', kb.computer)
            delete this.Data
            ctx.scene.leave()
            return
        })
        name.on('text', async (ctx) => {
            this.Data['name'] = ctx.message.text
            
            if (this.Data['name']) {
                await ctx.scene.enter('cpu')
            } else {
                await ctx.reply('Введены не корректные данные!')
                ctx.scene.reenter()
            }
        })
        return name
    }
    GenCpuScene() {
        const cpu = new Scene('cpu')
        cpu.enter(async (ctx) => {
            await ctx.reply('Введите модель процессора:', kb.addComputerScene)
        })
        cpu.command('cancel', ctx => {
            ctx.reply('Выберите действие:', kb.computer)
            delete this.Data
            ctx.scene.leave()
        })
        cpu.on('text', async (ctx) => {
            this.Data['cpu'] = ctx.message.text
            
            if (this.Data['cpu']) {
                await ctx.scene.enter('cpuSpeed')
            } else {
                await ctx.reply('Введены не корректные данные!')
                ctx.scene.reenter()
            }
        })
        return cpu
    }
    GenCpuSpeedScene() {
        const cpuSpeed = new Scene('cpuSpeed')
        cpuSpeed.enter(async (ctx) => {
            await ctx.reply('Введите тактовую частоту процессора:', kb.addComputerScene)
        })
        cpuSpeed.command('cancel', ctx => {
            ctx.reply('Выберите действие:', kb.computer)
            delete this.Data
            ctx.scene.leave()
        })
        cpuSpeed.on('text', async (ctx) => {
            this.Data['cpuSpeed'] = ctx.message.text
            
            if (this.Data['cpuSpeed']) {
                await ctx.scene.enter('gpu')
            } else {
                await ctx.reply('Введены не корректные данные!')
                ctx.scene.reenter()
            }
        })
        return cpuSpeed
    }
    GenGpuScene() {
        const gpu = new Scene('gpu')
        gpu.enter(async (ctx) => {
            await ctx.reply('Введите модель видеокарты:', kb.addComputerScene)
        })
        gpu.command('cancel', ctx => {
            ctx.reply('Выберите действие:', kb.computer)
            delete this.Data
            ctx.scene.leave()
        })
        gpu.on('text', async (ctx) => {
            this.Data['gpu'] = ctx.message.text
            
            if (this.Data['gpu']) {
                await ctx.scene.enter('ram')
            } else {
                await ctx.reply('Введены не корректные данные!')
                ctx.scene.reenter()
            }
        })
        return gpu
    }
    GenRamScene() {
        const ram = new Scene('ram')
        ram.enter(async (ctx) => {
            await ctx.reply('Введите объем ОЗУ:', kb.addComputerScene)
        })
        ram.command('cancel', ctx => {
            ctx.reply('Выберите действие:', kb.computer)
            delete this.Data
            ctx.scene.leave()
        })
        ram.on('text', async (ctx) => {
            this.Data['ram'] = ctx.message.text
            
            if (this.Data['ram']) {
                await ctx.scene.enter('rom')
            } else {
                await ctx.reply('Введены не корректные данные!')
                ctx.scene.reenter()
            }
        })
        return ram
    }
    GenRomScene() {
        const rom = new Scene('rom')
        rom.enter(async (ctx) => {
            await ctx.reply('Введите объем накопителя:', kb.addComputerScene)
        })
        rom.command('cancel', ctx => {
            ctx.reply('Выберите действие:', kb.computer)
            delete this.Data
            ctx.scene.leave()
        })
        rom.on('text', async (ctx) => {
            this.Data['rom'] = ctx.message.text
            
            if (this.Data['rom']) {
                await ctx.scene.enter('psu')
            } else {
                await ctx.reply('Введены не корректные данные!')
                ctx.scene.reenter()
            }
        })
        return rom
    }
    GenPsuScene() {
        const psu = new Scene('psu')
        psu.enter(async (ctx) => {
            await ctx.reply('Введите мощность блока питания:', kb.addComputerScene)
        })
        psu.command('cancel', ctx => {
            ctx.reply('Выберите действие:', kb.computer)
            delete this.Data
            ctx.scene.leave()
        })
        psu.on('text', async (ctx) => {
            this.Data['psu'] = ctx.message.text
            
            if (this.Data['psu']) {
                const text = `<b>Название:</b> ${this.Data['name']}\n<b>Модель процессора:</b> ${this.Data['cpu']}\n<b>Частота процессора:</b> ${this.Data['cpuSpeed']}\n<b>Видеокарта:</b> ${this.Data['gpu']}\n<b>Оперативная память:</b> ${this.Data['ram']}\n<b>Накопитель:</b> ${this.Data['rom']}\n<b>Блок питания:</b> ${this.Data['psu']}\n`
                const kb = require('./keyboard')
                await ctx.replyWithHTML(text, kb.addComputerScene)
                await ctx.scene.enter('complite')
            } else {
                await ctx.reply('Введены не корректные данные!')
                ctx.scene.reenter()
            }
        })
        return psu
    }
    GenCompliteScene() {
        const complite = new Scene('complite')
        complite.enter(async (ctx) => {
            await ctx.reply('Сохранить запись?', Markup.inlineKeyboard([
                Markup.callbackButton('Да', 'yes'),
                Markup.callbackButton('Нет', 'no')
            ]).extra()) 
        })
        complite.on('callback_query', async ctx => {
            if (ctx.callbackQuery.data == 'yes') {
                const { addPC } = require('./ComputerDB')
                await addPC(this.Data)
                await ctx.answerCbQuery()
                await ctx.reply('Запись сохранена!', kb.computer)
            } else {
                await ctx.answerCbQuery()
                await ctx.reply('Запись не сохранена...', kb.computer)
            }
            await ctx.deleteMessage()
            await ctx.scene.leave()
            delete this.Data
        })
        return complite
    }
}

module.exports = AddComputerDataScenes