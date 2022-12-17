
const { ipcRenderer } = require('electron')
var moment = require('moment');
const date = document.getElementById('date');
const msjOverMember = document.getElementById('info-message');
const msjNotArticles = document.getElementById('info-message-articles');


// Resume rental
const resumeDate = document.getElementById('resume-date');
const resumePayType = document.getElementById('resume-paytype');

const resumeNameMember = document.getElementById('resume-name-member');

const resumeIdMember = document.getElementById('resume-id-member');
const tableResume = document.getElementById('table-resume');
const resumeTotal = document.getElementById('resume-total');
const resumeReceived = document.getElementById('resume-received');
const resumeChange = document.getElementById('resume-change');
const btnResumeExit = document.getElementById('btn-resume-exit');






const cancelDelete = document.getElementById('cancel-delete');
const btnpayConfirm = document.getElementById('pay-confirm');

const btnReturnMenu = document.getElementById('btn-return-mainmenu');
const btnExit = document.getElementById('btn-exit');
const btnSearch = document.getElementById('btn-search');
const btnOk = document.getElementById('btn-ok');

const btnPay = document.getElementById('btn-pay');
const btnLoadToAccount = document.getElementById('btn-load-to-account');

const inpID = document.getElementById('searchPartner');
const inpPay = document.getElementById('inp-payment-received');

const slcArticle = document.getElementById('selectArticle');

const noData = document.getElementById('no-data');


const cardShow = document.getElementById('card-show');

const memberName = document.getElementById('member-name');
const memberID = document.getElementById('member-id');

const incompletePay = document.getElementById('incomplete');
const totalRental = document.getElementById('total-rental')
const tableArticles = document.getElementById('articles-to-rental');
let templateTableItems = '';
let articlesAvailables;
let member;
let memberN = '';
let memberExist = false;
let total = 0;
let change = 0;
let newChange = 0;
let data = {};
let articlesAdded = Array();
let dataMember;
ipcRenderer.on('render-rental-resume',(event, obj)=>{
    
    console.log('render:'+obj)
    if(resumeNameMember){
        resumeNameMember.innerHTML = 'Nombre:s'+ obj.nombre
    }
    
})

console.log('Resume rental')
if(btnReturnMenu){
    btnReturnMenu.addEventListener('click', () => {
        ipcRenderer.send('return-mainmenu');
    })
}

if(resumeIdMember && resumeNameMember){
    
}



if(btnExit){
    btnExit.addEventListener('click', () => {
        ipcRenderer.send('return-mainmenu');
    })
}

if(btnSearch && inpID){
    btnSearch.addEventListener('click', () => {
        if(!memberExist){
              
                
        }else{
            console.log('no existe')
        }
        
        ipcRenderer.send('member-id', inpID.value)
        ipcRenderer.send('member-id-to-return', inpID.value)

    })
    inpID.addEventListener('mouseover', (event) =>{
        msjOverMember.classList.add('animate__fadeIn')
        msjOverMember.hidden = false
    })
    inpID.addEventListener('mouseout', (event) =>{
       
        msjOverMember.hidden = true
    })
}






ipcRenderer.on('member-id-response', (event, response) =>{
    const memberResponse = response

    if(memberResponse.length > 0){
        
        noData.innerHTML = ''

        memberResponse.forEach(element => {
            member = element.numero_credencial;
            memberN = element.nombre;
            dataMember = {member, memberN}
            console.log(memberN)
            noData.hidden = true
            cardShow.hidden = false
            memberName.innerHTML = 'Nombre: '+element.nombre
            memberID.innerHTML = 'ID: '+element.numero_credencial       
           // inpID.value = ''                                              
        })
        memberExist = true
        console.log(response)
    }else{
        console.log('no hay')
        memberExist = false
        noData.hidden = false
        noData.innerHTML = 'El socio no existe'
        cardShow.hidden = true

        memberName.innerHTML = ''
        memberID.innerHTML = ''
    }
    
})

ipcRenderer.on('render-articles-available',(event, response) => {
    articlesAvailables = response;
    console.log(response)
    let template =' <option selected disabled value="first">Selecciona un artículo</option>'
    response.forEach(element =>{
        template += ` <option value="${element.id}">${element.nombre}</option>`
    })

    slcArticle.innerHTML = template
})

function OnlyNumbers(e){
    var key = window.event ? e.which : e.keyCode;
    if (key < 48 || key > 57) {
      e.preventDefault();
    }
  }
if(slcArticle){
    slcArticle.onchange = function () {
        slcArticle.classList.remove('border-red')
        msjNotArticles.hidden = true
        let article = articlesAvailables.find(item => item.id === parseInt(slcArticle.value)); 
        console.log()
        console.log(article.id)
        
        articlesAdded.push(article.id)
        templateTableItems += `   
        <tr>
        <td>${article.nombre}</td>
         <td>$${article.precio}</td>
         <td>${article.piezas}</td>
         
        </tr>
        `
        console.log('precio: '+article.precio)
        total += article.precio
        const inpPieces = document.getElementById('13');
        // console.log(inpPieces.value)
    
        if(inpPieces){
        }
    tableArticles.innerHTML = templateTableItems;
    slcArticle.defaultSelected = true
    console.log('total:' + total)
    totalRental.innerHTML = 'Total: $' + parseFloat(total);
    console.log(articlesAdded)
    }
}


if(inpID){
    inpID.addEventListener("keypress", OnlyNumbers, false);
    inpID.addEventListener("keypress",()=>{
        inpID.classList.remove('is-invalid')
        member = 0
    });
}

if(inpPay){
    inpPay.addEventListener("keypress", OnlyNumbers, false);
    inpPay.addEventListener("click", () =>{
        incompletePay.hidden = true

    })                         
}


if(cancelDelete){
    cancelDelete.addEventListener('click', () =>{
        console.log('88888')
    ipcRenderer.send('cancel-pay-window')
})
}

if(btnOk){
    btnOk.addEventListener('click', () =>{
        console.log('click ok')
        ipcRenderer.send('rental-ok')
    })
}

if(btnResumeExit){
    btnResumeExit.addEventListener('click', () => {
        ipcRenderer.send('return-mainmenu');
    })
}

if(btnPay){
    btnPay.addEventListener('click', () => {
        
        console.log('pay ')
        if(!member || member == 0){
            console.log(member)
            console.log('no hay id')
            inpID.classList.add('is-invalid')

        }else if(slcArticle.value == 'first'){
            console.log('no hay articulos')
            slcArticle.classList.add('border-red')
            msjNotArticles.hidden = false
        }
        else{
            
            
            ipcRenderer.send('open-pay-window', total)
            ipcRenderer.send('total',total)
             data = {articlesAdded:articlesAdded, total:total, member:member, change:newChange}
             ipcRenderer.send('articles-added', data)
             ipcRenderer.send('get-articles-rented',articlesAdded)

        }
        
    })
}
if(btnLoadToAccount){
    btnLoadToAccount.addEventListener('click', () => {
        
        if(!inpID.value || member == 0){
            console.log('no hay id')
            inpID.classList.add('is-invalid')

        } else if(slcArticle.value == 'first'){
            console.log('no hay articulos')
            slcArticle.classList.add('border-red')
            msjNotArticles.hidden = false
        }
        else{
            
            console.log('pay load')
            
             data = {articlesAdded:articlesAdded, total:total, member:member, change:newChange}
             ipcRenderer.send('articles-added-to-loaded-account', data)
             ipcRenderer.send('get-articles-rented',articlesAdded)
             let changePay = {total,payType:'Cargo a cuenta',memberN}
             ipcRenderer.send('member-change',changePay)
             ipcRenderer.send('pay-success-to-loaded-account')
             
        }
        
    })
}
ipcRenderer.on('return-total', (event, total) =>{

    if(btnpayConfirm){
        
        console.log(typeof total)
        
        let totaly = parseFloat(total)
        
        btnpayConfirm.addEventListener('click', () =>{
            let pay = parseFloat(inpPay.value)

            console.log(typeof pay)
            console.log('confirm pay')          
            console.log('value: '+pay)
            console.log('total:'+totaly)
            if(pay < totaly || !inpPay.value){
                incompletePay.hidden = false
                incompletePay.innerHTML = 'Falta dinero'
            }else{
                change = pay-totaly
                newChange = change
                let changePay = {change, pay,total,member,payType:'efectivo',memberN}
                ipcRenderer.send('member-change',changePay)
                ipcRenderer.send('data-member', dataMember);

                console.log('cambio: ' + (pay-totaly))
                ipcRenderer.send('pay-success',articlesAdded)

            }
            
    })  

    }
})


if(resumeChange &&resumeReceived && resumePayType && resumeTotal){
    ipcRenderer.on('return-change-on', (event,arg) =>{
        console.log(arg)
        resumeChange.innerHTML = 'Cambio:$'+ arg.change
        resumeReceived.innerHTML = 'Recibido:$'+ arg.pay
        resumePayType.innerHTML = 'Tipo de pago: '+ arg.payType
        date.innerHTML = 'Fecha: '+ moment().format('yyyy-M-DD');
        resumeTotal.innerHTML = 'Total:$'+ arg.total



    })
    
}
if(resumePayType && resumeTotal && date){
    ipcRenderer.on('return-resume', (event,arg) =>{
        console.log(arg)
        resumePayType.innerHTML = 'Tipo de pago: '+ arg.payType
        date.innerHTML = 'Fecha: '+ moment().format('yyyy-M-DD');
        resumeTotal.innerHTML = 'Total:$'+ arg.total

    })
    
}
if(tableArticles){
    ipcRenderer.on('render-article-table', (event, articles) =>{
        console.log(articles)
        // let temp = ''
        // articles.forEach(article =>{
        //     temp += `
        //     <tr>
        //     <td>${article.nombre}</td>
        //      <td>$${article.precio}</td>
             
        //     </tr>
        //     `
        // })
        // tableArticles.innerHTML = temp
    })
}