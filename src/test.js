const Scene = require('telegraf/scenes/base')
const { kb, mkBtn } = require('./test-tools')
const PC = require('./models/computer')
const Markup = require('telegraf/markup')

class MainMenu {
    async MainMenuHandler(ctx) {
        switch (ctx.callbackQuery.data) {
            case 'tables': {
                await ctx.reply('Таблицы:', kb.tables)
                break
            }
            case 'query': {
                await ctx.reply('--Не работает(--', kb.main)
                break
            }
            case 'about': {
                const text = `<i>Это телеграм бот для работы с базой данных!</i>\n<b>Автор:</b> Валентин Р.\n<b>Группа:</b> 491\n<b>Вариант:</b> 18\nНеобходим для сдачи практики)`
                await ctx.replyWithHTML(text, kb.main)
                break
            }
            case 'leave': {
                await ctx.reply('Для повторного вызова меню используйте команду /menu')
                break
            }

        }
    }
    async TableMenuHandler(ctx) {
        switch (ctx.callbackQuery.data) {
            case 'gohome': {
                await ctx.reply('Меню:', kb.main)
                break
            }
            case 'computer': {
                await ctx.reply('Таблица Компьютеры', kb.computer)
                break
            }
        }
    }
    async ComputerMenuHandler(ctx) {
        switch (ctx.callbackQuery.data) {
            case 'all': {
                try {
                    const { text, kbr } = await this.InitAllPCMenu()
                    await ctx.replyWithHTML(text, kbr)
                } catch (e) {
                    console.log(`ComputerMenuHandler - ERROR: ${e.message}\n\n ${e}`)
                }
            }
                break
            case 'gotable': {
                await ctx.reply('Меню:', kb.tables)
                break
            }

        }
    }
    async OnePcHandler(ctx) {
        if (ctx.callbackQuery.data == 'gopc') {
            await ctx.reply('Таблица Компьютеры:', kb.computer)
        }
        const swTrigger = ctx.callbackQuery.data
        if (swTrigger[0] == '{') {

            const res = JSON.parse(swTrigger)
            if (res.data) {
                const key = res['data'].split('-')
                if (key[0] + key[1] == 'pcdata') {
                    try {
                        await ctx.replyWithHTML(this.AllPcData[key[2]], this.MakeKeyboar(key[2]))
                    } catch (e) {
                        console.log(e.message)
                    }

                }
            }

            if (res.operation == 'changepc') {
                const editKeyboard = await this.FindPcById(res.id)
                await ctx.reply('Выберите поле для изменения', editKeyboard)
            }
            //Дописать логику для кнопок удалить и изменить!!
        }
    }


    async InitAllPCMenu() {
        try {
            const data = await PC.find({}).catch(err => {
                console.log(`InitAllPcMenu Error ${err.message}`)
            })
            this.AllPcButtons = []
            this.AllPcData = []
            let first = ``
            data.map((el, i) => {
                this.AllPcData = [...this.AllPcData, `<b>Название:</b> ${el.name}\n<b>Модель процессора:</b> ${el.cpu}\n<b>Частота процессора:</b> ${el.cpuSpeed}\n<b>Видеокарта:</b> ${el.gpu}\n<b>Оперативная память:</b> ${el.ram}\n<b>Накопитель:</b> ${el.rom}\n<b>Блок питания:</b> ${el.psu}\n<b>Цена:</b> ${el.cost}\n\n`]
                this.AllPcButtons = [...this.AllPcButtons, { text: `${i + 1}`, callback_data: JSON.stringify({ data: `pc-data-${i}`, id: el._id }) }]
                if (i == 0) {
                    first = el._id
                }
            })
            // Первая ининциализация контента + клавиатуры
            const keyboard = Markup.inlineKeyboard(
                [
                    [
                        mkBtn(`[ ${this.AllPcButtons[0].text} ]`, this.AllPcButtons[0].callback_data),
                        mkBtn(this.AllPcButtons[1].text, this.AllPcButtons[1].callback_data),
                        mkBtn(this.AllPcButtons[2].text, this.AllPcButtons[2].callback_data),
                        mkBtn(`${this.AllPcButtons[3].text} ›`, this.AllPcButtons[3].callback_data),
                        mkBtn(`${this.AllPcButtons[this.AllPcButtons.length - 1].text} »`, this.AllPcButtons[this.AllPcButtons.length - 1].callback_data)
                    ],
                    [
                        mkBtn('Изменить', JSON.stringify({ operation: 'changepc', id: first })),
                        mkBtn('Удалить', JSON.stringify({ operation: 'removepc', id: first }))
                    ],
                    [mkBtn('К таблице Компьютеры', 'gopc')]
                ]
            ).extra()
            return {
                text: this.AllPcData[0],
                kbr: keyboard
            }
            //
        } catch (e) {
            console.log(e.message)
        }
    }
    MakeKeyboar(activeBtn) {
        const arr = []
        const button = this.AllPcButtons
        activeBtn = Number(activeBtn)
        const activeObj = mkBtn(`[ ${button[activeBtn].text} ]`, button[activeBtn].callback_data)
        switch (activeBtn) {
            case 0: {
                arr.push(activeObj)
                for (let i = 1; i <= 2; i++) {
                    arr.push(mkBtn(button[i].text, button[i].callback_data))
                }
                arr.push(mkBtn(`${button[3].text} ›`, button[3].callback_data))
                arr.push(mkBtn(`${button[button.length - 1].text} »`, button[button.length - 1].callback_data))
                break
            }
            case 1:
            case 2:
                arr.push(mkBtn(button[0].text, button[0].callback_data))
                for (let i = 1; i <= 2; i++) {
                    if (i == activeBtn) {
                        arr.push(activeObj)
                    } else {
                        arr.push(mkBtn(button[i].text, button[i].callback_data))
                    }
                }
                arr.push(mkBtn(`${button[3].text} ›`, button[3].callback_data))
                arr.push(mkBtn(`${button[button.length - 1].text} »`, button[button.length - 1].callback_data))
                break
            case button.length - 3:
            case button.length - 2:
                arr.push(mkBtn(`« ${button[0].text}`, button[0].callback_data))
                arr.push(mkBtn(`‹ ${button[button.length - 4].text}`, button[button.length - 4].callback_data))
                for (let i = button.length - 3; i <= button.length - 2; i++) {
                    if (i == activeBtn) {
                        arr.push(activeObj)
                    } else {
                        arr.push(mkBtn(button[i].text, button[i].callback_data))
                    }
                }
                arr.push(mkBtn(button[button.length - 1].text, button[button.length - 1].callback_data))
                break
            case button.length - 1: {
                arr.push(mkBtn(`« ${button[0].text}`, button[0].callback_data))
                arr.push(mkBtn(`‹ ${button[button.length - 4].text}`, button[button.length - 4].callback_data))
                for (let i = button.length - 3; i <= button.length - 2; i++) {
                    arr.push(mkBtn(button[i].text, button[i].callback_data))
                }
                arr.push(activeObj)
                break
            }
            default: {
                arr.push(mkBtn(`« ${button[0].text}`, button[0].callback_data))
                arr.push(mkBtn(`‹ ${button[activeBtn - 1].text}`, button[activeBtn - 1].callback_data))
                arr.push(activeObj) //activeBtn ›
                arr.push(mkBtn(`${button[activeBtn + 1].text} ›`, button[activeBtn + 1].callback_data))
                arr.push(mkBtn(`${button[button.length - 1].text} »`, button[button.length - 1].callback_data))
            }
        }
        const currId = JSON.parse(button[activeBtn].callback_data)
        return Markup.inlineKeyboard(
            [
                arr,
                [
                    mkBtn('Изменить', JSON.stringify({ operation: 'changepc', id: currId.id })),
                    mkBtn('Удалить', JSON.stringify({ operation: 'removepc', id: currId.id }))
                ],
                [mkBtn('К таблице Компьютеры', 'gopc')]
            ]
        ).extra()

    }

    async FindPcById(id) {
        let newKeyBoard = ''
        try {
            const res = await PC.findById(id)
            newKeyBoard = Markup.inlineKeyboard(
                [
                    [mkBtn(`Название: ${res.name}`, 'pcname')],
                    [mkBtn(`Модель процессора: ${res.cpu}`, 'pccpu')],
                    [mkBtn(`Частота процессора: ${res.cpuSpeed}`, 'pccpuspeed')],
                    [mkBtn(`Видеокарта: ${res.gpu}`, 'pcgpu')],
                    [mkBtn(`Оперативная память: ${res.ram}`, 'pcram')],
                    [mkBtn(`Накопитель: ${res.rom}`, 'pcrom')],
                    [mkBtn(`Блок питания: ${res.psu}`, 'pcpsu')],
                    [mkBtn(`Цена: ${res.cost}`, 'pccost')],
                    [mkBtn('Назад', 'all')]
                ]
            ).extra()
        } catch (err) {
            console.log(err.message)
            newKeyBoard = Markup.inlineKeyboard([[mkBtn('Назад', 'all')]]).extra()
        }

        return newKeyBoard
    }

    // EditPcHandler(ctx) {

    // }

    MenuScene() {
        const menu = new Scene('menu')
        menu.enter(async ctx => {
            await ctx.reply('Меню:', kb.main)
        })
        menu.on('callback_query', async ctx => {
            ctx.deleteMessage()
            this.MainMenuHandler(ctx)
            this.TableMenuHandler(ctx)
            this.ComputerMenuHandler(ctx)
            this.OnePcHandler(ctx)
        })
        return menu
    }
}
module.exports = MainMenu