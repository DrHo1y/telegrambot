const Markup = require('telegraf/markup')
const mkBtn = (text, query_name) => {
    return Markup.callbackButton(text, query_name)
}

const kb = {
    main: Markup.inlineKeyboard(
        [
            [mkBtn('Таблицы', 'tables'), mkBtn('Запросы', 'query')],
            [mkBtn('О программе', 'about'), mkBtn('Закрыть меню', 'leave')]
        ]
    ).extra(),
    tables: Markup.inlineKeyboard(
        [
            [mkBtn('Компьютеры', 'computer'), mkBtn('Партии', 'consignment')],
            [mkBtn('Реализаторы', 'distributor'), mkBtn('Производители', 'manufacturer')],
            [mkBtn('Назад', 'gohome')]
        ]
    ).extra(),
    computer: Markup.inlineKeyboard(
        [
            [mkBtn('Все записи', 'all'), mkBtn('Добавить', 'add')],
            [mkBtn('Назад', 'gotable')]
        ]
    ).extra(),
    computerChange: Markup.inlineKeyboard(
        [
            [mkBtn('Сохранить', 'save')],
            [mkBtn('Назад', 'all')]
        ]
    ).extra()
}


module.exports = {
    kb, mkBtn
}