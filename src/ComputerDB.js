const PC = require('./models/computer')

const getAllPC = async () => {
    try {
        let text = ``
        const data = await PC.find({})
        data.map((el, i) => {
            text += `№ ${i+1}\n<b>Название:</b> ${el.name}\n<b>Модель процессора:</b> ${el.cpu}\n<b>Частота процессора:</b> ${el.cpuSpeed}\n<b>Видеокарта:</b> ${el.gpu}\n<b>Оперативная память:</b> ${el.ram}\n<b>Накопитель:</b> ${el.rom}\n<b>Блок питания:</b> ${el.psu}\n\n`
        })
        return text
    } catch (err) {
        console.log(err.message)
    }
}

const addPC = async (obj) => {
    if (obj) {
        const data = new PC(obj)
        try {
            await data.save()
        } catch (e) {
            console.log(e)
        }
    }
}
module.exports = {
    getAllPC,
    addPC
}