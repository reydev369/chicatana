
const { ipcRenderer } = require('electron')
const msjOverMember = document.getElementById('info-message');
const MessageNoArticles = document.getElementById('message-no-articles');

const noData = document.getElementById('no-data');
const btnReturnAll = document.getElementById('btn-return-all');
let articles;
const btnSearch = document.getElementById('btn-search');
const btnOk = document.getElementById('btn-ok');

const inpID = document.getElementById('searchPartner');
const memberName = document.getElementById('member-name');
const memberID = document.getElementById('member-id');
const cardShow = document.getElementById('card-show');

const btnReturnMenu = document.getElementById('btn-return-mainmenu');
const tableArticles = document.getElementById('articles-to-return');

// alert window one return
const cancelReturnOne = document.getElementById('btn-cancel-return-one');


// alert window
const cancelReturn = document.getElementById('cancel-return');
const confirmReturn = document.getElementById('return-confirm');

const btnDangered = document.getElementById('btn-dangered');
const btnNotDangered = document.getElementById('btn-not-dangered');

// alertreason
const btnCancelReason = document.getElementById('btn-cancel-reason');
const btnReason = document.getElementById('btn-reason');
const inpReason = document.getElementById('inp-reason');



let memberId = 0
if(btnOk){
    btnOk.addEventListener('click', () =>{
        
    ipcRenderer.send('close-return-rental')
})
}


if(cancelReturn){
    cancelReturn.addEventListener('click', () =>{
        console.log('88888')
    ipcRenderer.send('cancel-pay-window')
})
}


if(btnReturnMenu){
    btnReturnMenu.addEventListener('click', () => {
        ipcRenderer.send('return-mainmenu');
    })
}

if(btnSearch && inpID){
    btnSearch.addEventListener('click', () => {
        tableArticles.innerHTML = ''
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
    inpID.addEventListener("keypress", OnlyNumbers, false);
    
}


console.log('member from file'+memberId)
ipcRenderer.on('member-id-response', (event, response) =>{
    const memberResponse = response

    if(memberResponse.length > 0){
        
        noData.innerHTML = ''

        memberResponse.forEach(element => {
            cardShow.hidden = false
            memberName.innerHTML = 'Nombre: '+element.nombre
            memberID.innerHTML = 'ID: '+element.numero_credencial       
           // inpID.value = ''                                              
        })
        console.log(response)
    }else{
        console.log('no hay')
        noData.innerHTML = 'El socio no existe'
        cardShow.hidden = true
        MessageNoArticles.hidden = true
        memberName.innerHTML = ''
        memberID.innerHTML = ''
    }
    
})

ipcRenderer.on('articticles-to-return-response', (event,response)=>{
    console.log('res'+response)
    
    let template =''
    
        articles = response;
        btnReturnAll.hidden = false
        MessageNoArticles.hidden = true

        response.forEach(elem => {

            console.log('resii'+elem)

       elem.forEach(element => {
        console.log('reso'+element)
        template += `
        <tr>
        <td>${element.nombre}</td>
        <td>$${element.precio}</td>
        <td><button class="btn-edit-md btn btn-secondary" onclick="returnArticle(${element.id})">Devolver</button>
    </tr>
   
        `
    });
    });
    tableArticles.innerHTML = template;
    if(response.length === 0){
        btnReturnAll.hidden = true
        MessageNoArticles.hidden = false
    }
    
    
    
})
console.log('return rental')


function returnArticle (id){
    console.log('returnproducto: '+id)
    
    //console.log(inpID.value)
    // ipcRenderer.send('member-id-to-return', inpID.value)
    //ipcRenderer.send('return-article-id',id)
     
    ipcRenderer.send('id-member-to-send',{member:inpID.value, article:id})
    // ipcRenderer.send('return-article-id',id)

}


if(btnReturnAll){
    btnReturnAll.addEventListener('click',()=>{
        ipcRenderer.send('alert-return-all-articles',articles);
    })
}
ipcRenderer.on('articles-resend',(event, articles) =>{

if(confirmReturn){

    confirmReturn.addEventListener('click', () =>{
        console.log('confirm')
        ipcRenderer.send('return-all-articles',articles);
            
        

    })
}

        })

//cancel return one
if(cancelReturnOne){
    cancelReturnOne.addEventListener('click', () =>{
        ipcRenderer.send('cancel-return-one')
    })
}

// modal motivo
if(btnCancelReason){
    btnCancelReason.addEventListener('click',()=>{
        ipcRenderer.send('cancel-reason-dangered')
    })
}

ipcRenderer.on('get-member-id',(e,data)=>{
    console.log('id member:'+data)
    if(btnDangered){
        btnDangered.addEventListener('click', () =>{
            ipcRenderer.send('id-member-to-resend',data)
            ipcRenderer.send('article-dangered-reason')
            
        })
    }
    if(btnNotDangered){
    
            btnNotDangered.addEventListener('click', () =>{
                console.log('no')
                ipcRenderer.send('article-not-dangered',data)
                ipcRenderer.send('member-id', data.member)
                
        })
        
    }
    if(btnReason && inpReason){
        btnReason.addEventListener('click',()=>{
    
            ipcRenderer.send('send-reason-dangered', {reason:inpReason.value,article:data.article})
            ipcRenderer.send('member-id', data.member)
        })
    }

    
})

function OnlyNumbers(e){
    var key = window.event ? e.which : e.keyCode;
    if (key < 48 || key > 57) {
      e.preventDefault();
    }
  }