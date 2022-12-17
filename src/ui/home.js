const { ipcRenderer } = require('electron')

console.log('menuuu')

const btnRental = document.getElementById('btn-rental');
const btnReturn = document.getElementById('btn-return');
const btnDanger = document.getElementById('btn-danger');
const btnStock = document.getElementById('btn-stocktacking');
const btnCashClosing = document.getElementById('btn-cash-closing');
const btnCloseApp = document.getElementById('btn-close');


btnCloseApp.addEventListener('click', () =>{
    ipcRenderer.send('close-app');
})

btnStock.addEventListener('click', () =>{
    ipcRenderer.send('open-stocktacking');
})

btnDanger.addEventListener('click', () => {
    ipcRenderer.send('dangered-articles')
})

btnRental.addEventListener('click', () => {
    ipcRenderer.send('new-rental')
})
btnCashClosing.addEventListener('click', () => {
    ipcRenderer.send('cash-closing')
})
btnReturn.addEventListener('click', () => {
    ipcRenderer.send('return-rental')
})
