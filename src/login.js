const { ipcRenderer } = require('electron')

let btnlogin;
let email; 
let password;
let novalid;


  email = document.getElementById("username")
  password = document.getElementById("password")
  btnlogin = document.getElementById("btninto")
  novalid = document.getElementById("novalid");
  
  btnlogin.onclick = function(){
    
    const obj = {email:email.value, password:password.value }
    // ipcRenderer.invoke('login', obj).then((result) => {
    // if(result == undefined){
       
        ipcRenderer.send('logintest',obj)
        
        

      // }

      
    // })

    
  }

  ipcRenderer.on('logintest-reply',(event, response) =>{
    novalid.innerHTML = response
  })
 
 


  

