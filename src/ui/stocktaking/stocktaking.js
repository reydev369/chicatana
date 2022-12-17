const { ipcRenderer } = require('electron')


const btnReturnMenu = document.getElementById('btn-return-mainmenu');
const btnAdd = document.getElementById('btn-add-article');
const btnEdit = document.getElementById('btn-return-mainmenu');
const btnDelete = document.getElementById('btn-return-mainmenu');
const btnExit = document.getElementById('btn-exit');
const btnReturnStock = document.getElementById('return-stocktacking');
const btnSaveArticle = document.getElementById('btn-save-article');
const btnCancelSave = document.getElementById('btn-cancel-save');
const article = document.getElementById('addarticle');
const pieces = document.getElementById('pieces');
const price = document.getElementById('price');
const spnRsult = document.getElementById('result-add-article');
const tableArticles = document.getElementById('table-articles');
const inpEditName = document.getElementById('editarticle');
const inpEditPieces = document.getElementById('editpieces');
const inpEditPrice = document.getElementById('editprice');
const btnSaveEdit = document.getElementById('btn-save-edit');
let idArticleEdited = 0;

if(price && pieces){
    price.addEventListener('keypress', OnlyNumbers, false)
    pieces.addEventListener('keypress', OnlyNumbers, false)

}
if(inpEditPieces && inpEditPrice){
    inpEditPrice.addEventListener('keypress', OnlyNumbers, false)
    inpEditPieces.addEventListener('keypress', OnlyNumbers, false)

}

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
if(btnAdd){
    btnAdd.addEventListener('click', () => {
        ipcRenderer.send('add-new-article');
    })
}

if(btnReturnStock){
    btnReturnStock.addEventListener('click', () => {
        ipcRenderer.send('open-stocktacking');
        // console.log('click')
    })
}

if(btnCancelSave){
    btnCancelSave.addEventListener('click', () => {
        ipcRenderer.send('open-stocktacking');
        // console.log('click')
    })
}
if(btnSaveArticle && article && pieces && price){


    article.addEventListener('keyup', (e) =>{
        
        ipcRenderer.send('check-if-article-exist', article.value)
        console.log(article.value)
        
    })

    ipcRenderer.on('article-exist', (event, response) =>{
        spnRsult.hidden = false
        spnRsult.innerHTML = response

        if(response != ''){
            btnSaveArticle.hidden = true
        }else{
            btnSaveArticle.hidden = false
            spnRsult.hidden = true

        }
    })


    btnSaveArticle.addEventListener('click', () => {
        
        let articleObj = {name:article.value, pieces:pieces.value, price:price.value}
        
        ipcRenderer.send('save-article', articleObj);
        // console.log('click')
    })
}


function deleteProduct(id, nombre){

    let obj = {id:id, nombre:nombre}
        ipcRenderer.send('delete-article', obj);
   
}




ipcRenderer.on('article-edited',(event, response) => {
    console.log(response)
    
    response.forEach(Element => {
        if(inpEditName){
            inpEditName.value = Element.nombre;
        }
        if(inpEditPieces){
            inpEditPieces.value = Element.piezas;
    
        }
        if(inpEditPrice){
            inpEditPrice.value = Element.precio;
    
        }

        idArticleEdited = Element.id;
    })
    
})

ipcRenderer.on('result-add-article',(event, response) =>{
    spnRsult.hidden = false;
    spnRsult.innerHTML = response
    
    if(article && pieces){
    article.value = ''
    pieces.value = ''
    price.value = ''
}
    setTimeout(() => {
        spnRsult.hidden = true
        spnRsult.innerHTML = ''
        
    },5000)
  })

ipcRenderer.on('render-articles', (event,results) => {
    console.log(results)
    let template = "";
    const articles = results;
    let counter = 0;
    articles.forEach(element => {
        counter = counter +1;
        template+= `
        <tr>
        <td>${counter}</td>
        <td>${element.nombre}</td>
        <td>${element.piezas}</td>
        <td>$${element.precio}</td>
        <td><button class="btn-delete btn-edit-md btn btn-danger " onclick="deleteProduct('${element.id}','${element.nombre}')">Eliminar</button></td>
        <td><button class="btn-edit-md btn btn-secondary" onclick="editArticle('${element.id}')">Editar</button></td>
    </tr>
        `
        
    });
    tableArticles.innerHTML = template;
    
})


const cancelDelete = document.getElementById('cancel-delete');
const deleteConfirm = document.getElementById('delete-confirm');
const nameArticle = document.getElementById('article-name');
console.log('results')
ipcRenderer.on('article-name', (event, results) => {
    console.log(results)
})

if(cancelDelete){
    cancelDelete.addEventListener('click', () =>{
    ipcRenderer.send('cancel-delete')
})
}
if(deleteConfirm){
    deleteConfirm.addEventListener('click', () =>{
    ipcRenderer.send('confirm-delete')
})  

}
if(btnSaveEdit){
    // inpEditName.addEventListener('keyup', (e) =>{
    //     ipcRenderer.send('check-if-article-exist', inpEditName.value)
    //     console.log(inpEditName.value)
    // })

    // ipcRenderer.on('article-exist', (event, response) =>{
    //     spnRsult.innerHTML = response

    //     if(response != ''){
    //         btnSaveEdit.hidden = true
    //     }else{
    //         btnSaveEdit.hidden = false

    //     }
    // })

    btnSaveEdit.addEventListener('click', () =>{
        console.log('click edit')
        let articleUpdated = {id:idArticleEdited,nombre:inpEditName.value, piezas:inpEditPieces.value, precio:inpEditPrice.value}
        ipcRenderer.send('update-article', articleUpdated);
        console.log(articleUpdated)
       
        
    })
}

function OnlyNumbers(e){
    var key = window.event ? e.which : e.keyCode;
    if (key < 48 || key > 57) {
      e.preventDefault();
    }
  }

  function editArticle(id){
    ipcRenderer.send('edit-article', id);

}
