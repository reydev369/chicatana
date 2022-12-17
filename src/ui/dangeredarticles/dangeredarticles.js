
const { ipcRenderer } = require('electron')

console.log('dangered ariticles')
const btnReturnMenu = document.getElementById('btn-return-mainmenu');
const btnExit = document.getElementById('btn-exit');
const tableArticles = document.getElementById('table-articles');


if(btnReturnMenu){
    btnReturnMenu.addEventListener('click', () => {
        ipcRenderer.send('return-mainmenu');
    })
}

if(btnExit){
    btnExit.addEventListener('click', () => {
        ipcRenderer.send('return-mainmenu');
    })
}

ipcRenderer.on('render-dangered-articles', (event,results) => {
    console.log(results)
    let template = "";
    const articles = results;
    let counter = 0;
    articles.forEach(element => {
        counter = counter +1;
        if(element.motivo != null ){
            
        template+= `
        <tr>
        <td>${counter}</td>
        <td>${element.nombre}</td>
        <td>$${element.precio}</td>
        <td>${element.motivo}</td>
    </tr>
        `
        }else{
    
            template+= `
            <tr>
            <td>${counter}</td>
            <td>${element.nombre}</td>
            <td>$${element.precio}</td>
            <td>Sin motivo</td>
        </tr>
            `
        }
        
        
    });
    tableArticles.innerHTML = template;
    
})