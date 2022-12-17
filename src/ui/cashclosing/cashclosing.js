const { ipcRenderer } = require('electron')
var moment = require('moment');
const btnReturnMenu = document.getElementById('btn-return-mainmenu');
const btnExit= document.getElementById('exit-cash-closing');
const btnMakeCashClosing = document.getElementById('make-cash-closing');
const totalGet = document.getElementById('total-get');
const date = document.getElementById('date');
const containerCash = document.getElementById('container-cash-closin');

let totalCash = 0;
if(btnExit){
    btnExit.addEventListener('click', () => {
        ipcRenderer.send('return-mainmenu');
    })
}

if(btnReturnMenu){
    btnReturnMenu.addEventListener('click', () => {
        ipcRenderer.send('return-mainmenu');
    })
}

if(btnExit){
    btnExit.addEventListener('click', () => {
        console.log('btn-exit')
    })
}
if(btnMakeCashClosing){
    btnMakeCashClosing.addEventListener('click', () => {
        ipcRenderer.send('get-rents');
       console.log( totalGet.text)
    })
}

ipcRenderer.on('total-cash', (event, total) =>{
    containerCash.hidden = false;
    totalCash = total
    console.log(totalCash)
    totalGet.innerHTML = 'Total: $'+ total
    setTimeout(() => {
        event.sender.send('total-obtained',total)
    }, 10000);
    date.innerHTML = 'Fecha: '+ moment().format('yyyy-M-DD');
})