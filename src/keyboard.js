const Markup = require('telegraf/markup')
const btn = require('./keyboard-buttons')
module.exports = {
    home:
        Markup.keyboard(
            [
                [btn.homeBtn.allTab, btn.homeBtn.querry],
                [btn.homeBtn.about]
            ]
        ).resize().extra(),
    allTable:
        Markup.keyboard(
            [
                [btn.allTableBtn.computer, btn.allTableBtn.consignment],
                [btn.allTableBtn.distributor, btn.allTableBtn.manufacturer],
                [btn.allTableBtn.goHome]
            ]
        ).resize().extra(),
    computer: 
        Markup.keyboard(
            [
                [btn.computerBtn.showAllData, btn.computerBtn.addData],
                [btn.computerBtn.changeData, btn.computerBtn.removeData],
                [btn.goAllTable]
            ]
        ).resize().extra(),
    addComputerScene: 
        Markup.keyboard([[btn.cancelBtn]]).resize().extra()
}