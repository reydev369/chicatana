const { app, BrowserWindow, ipcMain, Notification, webContents, ipcRenderer } = require('electron');
const path = require('path');
let db = require("./database");
var moment = require('moment');

const { electron, send } = require('process');
const { on } = require('events');
// const {invalidLogin} = require('./ui/login/app');

let window;
let loginWindow
let objectRental = {}

function createHomeWindow() {
  window = new BrowserWindow({
    fullscreen: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false

    },
  });

  window.loadFile("src/ui/login/loginView.html");

}
function createLoginWindow() {
  loginWindow = new BrowserWindow({
    fullscreen : true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
  });

  loginWindow.loadFile("src/ui/login/loginView.html");
  //loginWindow.maximize();
}

function createStockWindow() {
  stockWindow = new BrowserWindow({
    fullscreen: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
  });

  stockWindow.loadFile("src/ui/stocktaking/stocktakinghome.html");
  //loginWindow.maximize();
}
function createAddStockWindow() {
  AddStockWindow = new BrowserWindow({
    fullscreen: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
  });

  AddStockWindow.loadFile("src/ui/stocktaking/addarticle.html");
  //loginWindow.maximize();
}

function createEditStockWindow() {
  EditStockWindow = new BrowserWindow({
    fullscreen: true,
    // titleBarStyle: 'hidden', 
    // resizable:false,
    // minimizable: false,
    //   maximizable: false,
    //   autoHideMenuBar: true,
    //   closable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,

    },
  });
  EditStockWindow.loadFile("src/ui/stocktaking/editarticle.html");
  //loginWindow.maximize();
}

function createDeleteDialogStockWindow() {
  deleteDialogWindow = new BrowserWindow({
    // fullscreen : true,
    center: true,
    titleBarStyle: 'hidden',
    resizable: false,
    transparent: true,
    frame: false,
    modal: true,
    parent: window,
    width: 500,
    height: 300,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,

    },
  });
  deleteDialogWindow.loadFile("src/ui/stocktaking/alertdelete.html");
  //loginWindow.maximize();
}

function createPayDialogWindow() {
  payDialogWindow = new BrowserWindow({
     
    
    center: true,
    titleBarStyle: 'hidden',
    resizable: false,
    transparent: true,
    frame: false,
    modal: true,
    parent: window,
    width: 500,
    height: 300,
    
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,

    },
  });
  payDialogWindow.loadFile("src/ui/rental/alertpay.html");
  //loginWindow.maximize();
}
app.whenReady().then(() => {
  createHomeWindow()
})

ipcMain.on('return-rental', (event, arg) => {
  window.loadFile("src/ui/returnrental/returnrental.html")


})
ipcMain.on('cash-closing', (event, arg) => {
  window.loadFile("src/ui/cashclosing/cashclosing.html")

})


ipcMain.on('return-mainmenu', (event, arg) => {
  window.loadFile("src/ui/home.html")

})

ipcMain.on('new-rental', (event, arg) => {
  window.loadFile("src/ui/rental/rental.html")
  setTimeout(() => {
    getArticlesAvailable();

  }, 150)
})
ipcMain.on('open-pay-window', (event, total) => {
  console.log('open pay')
  createPayDialogWindow()
  
  payDialogWindow.show()
  payDialogWindow.webContents.send('return-total', total)
})
ipcMain.on('pay-success', (event, articles) => {
  console.log('art add: '+articles)
  // window.close();
  // createHomeWindow()

  window.loadFile("src/ui/rental/resumerental.html")
  payDialogWindow.close();
  createPayDialogWindow();
  payDialogWindow.loadFile("src/ui/rental/successfulregistration.html")
  payDialogWindow.show();
  
})
ipcMain.on('pay-success-to-loaded-account', (event, articles) => {
  console.log('art add: '+articles)
 

  window.loadFile("src/ui/rental/resumerental.html")
  createPayDialogWindow();
  payDialogWindow.loadFile("src/ui/rental/successfulregistration.html")
  payDialogWindow.show();

})
ipcMain.on('rental-ok', () => {
  window.setOpacity(1);
  payDialogWindow.close();

  setTimeout(() => {

  }, 1000);
})
ipcMain.on('articles-added', (event, obj) => {
  console.log(obj)

  newRental(obj)



})
ipcMain.on('articles-added-to-loaded-account', (event, obj) => {
  console.log(obj)

  newRentalLoadedToAccount(obj)



})
ipcMain.on('cancel-pay-window', (event) => {
  console.log('cancelpay')
  payDialogWindow.close();
  window.setOpacity(1);
});
ipcMain.on('member-change', (event, obj) => {
  console.log('changess:' + obj.change)
  console.log('pay:' + obj.pay)
  console.log('obje:' + obj)

  if(obj.payType == 'efectivo'){
    setTimeout(() => {
      window.webContents.send('return-change-on', obj)
  
  
  
    }, 1000);
  }else{
    setTimeout(() => {
      window.webContents.send('return-resume', obj)
  
  
  
    }, 1000);
  
   
  }
  

})



ipcMain.on('total', (event, total) => {
  console.log(total)
  setTimeout(() => {
    payDialogWindow.webContents.send('return-total', total)
  }, 300);
})



ipcMain.on('close-return-rental', (event, arg) => {
  payDialogWindow.close()
})

ipcMain.on('member-id', (event, id) => {
  let articles = Array()
  console.log(id)
  const sql = "SELECT * FROM socio WHERE numero_credencial = ?"
  db.query(sql, id, (error, results, fields) => {
    if (error) {
      console.log(error);
      window.webContents.send('member-id-response', 'El ID' + id + 'no pertenece a ningun socio')
      console.log('primero')
    } else {
      console.log('edited')

      window.webContents.send('member-id-response', results)

      const sql = "SELECT * FROM renta WHERE numero_socio = ? AND devuelto = ?"
      db.query(sql, [id, 0], (error, resultsArticles, fields) => {
        if(resultsArticles.length === 0){
          console.log('no mas articulos')

          window.webContents.send('articticles-to-return-response', articles)

        }
        if (error) {
          console.log(error);
          window.webContents.send('member-id-response', 'El ID' + id + 'no pertenece a ningun socio')

        } else {
          console.log('segundo')

          console.log('resultArt')
          console.log('artis:'+resultsArticles)

            if(!resultsArticles){
            }else{
              resultsArticles.forEach(element => {
                console.log('articles id');
                console.log(element.id_articulo)
                const sql = "SELECT * FROM articulo WHERE id = ?"
                db.query(sql, element.id_articulo, (error, resultsGetArticles, fields) => {
                  if (error) {
                    console.log(error);
                    window.webContents.send('member-id-response', 'El ID' + id + 'no pertenece a ningun socio')
    
                  } else {
                    console.log('tercero')

                    console.log('edited')
                    //console.log(resultsGetArticles)
                    articles.push(resultsGetArticles)
                    console.log('array articles')
                    console.log(articles)
                    window.webContents.send('articticles-to-return-response', articles)
                    
    
    
    
                  }
    
                });
              })
            }
          



        }
      });

    }
  });

})
// ipcMain.send('articles-to-rental',(event, obj )=>{
//   setTimeout(() => {
//     getArticles();

//   }, 150)
// })
ipcMain.on('open-dangered-window',(event, id) =>{
  
})
ipcMain.on('article-not-dangered',(e, data)=>{
  const sql = "UPDATE renta SET devuelto = ? WHERE id_articulo = ? "
  db.query(sql, [1, data.article], (error, results, fields) => {
    if (error) {
      console.log('error al devolver');
    } else {
      console.log('devuelto con exito');
    }
  });
  const sql2 = "UPDATE articulo SET piezas = (piezas + 1) WHERE id = ? "
  db.query(sql2, [data.article], (error, results, fields) => {
    if (error) {
      console.log('error al devolver');
    } else {
      console.log('articulo sumado ');
      payDialogWindow.close()
    }
  });
})
ipcMain.on('cancel-return-one',()=>{
  
  payDialogWindow.close()
})
ipcMain.on('cancel-reason-dangered',()=>{
  
  payDialogWindow.loadFile('src/ui/returnrental/alertarticledangered.html')
  
})
ipcMain.on('send-reason-dangered', (event, data) =>{
  console.log('reason:'+data.reason)
  console.log('article:'+data.article)
  const sql = "UPDATE renta SET devuelto = ? WHERE id_articulo = ? "
  db.query(sql, [1, data.article], (error, results, fields) => {
    if (error) {
      console.log('error al devolver');
    } else {
      console.log('devuelto con exito');
    }
  });
  const sql2 = "UPDATE articulo SET piezas = (piezas + 1), dañado = ?, motivo = ? WHERE id = ? "
  db.query(sql2, [1, data.reason, data.article], (error, results, fields) => {
    if (error) {
      console.log('error al devolver');
    } else {
      console.log('articulo sumado ');
      payDialogWindow.close()
    }
  });

})
ipcMain.on('article-dangered-reason', () =>{
  payDialogWindow.close()
  createPayDialogWindow()
  payDialogWindow.loadFile('src/ui/returnrental/alertreason.html')
  
})
ipcMain.on('id-member-to-send', (e, data) =>{
  console.log('id-member: '+data.member)
  createPayDialogWindow()
  payDialogWindow.loadFile('src/ui/returnrental/alertarticledangered.html')
  payDialogWindow.show()
  setTimeout(() => {
    payDialogWindow.webContents.send('get-member-id',data)
  }, 1000);
})
ipcMain.on('id-member-to-resend', (e, data) =>{
  
  setTimeout(() => {
    payDialogWindow.webContents.send('get-member-id',data)
  }, 1000);
})
ipcMain.on('return-article-id', (event, id) => {
  const sql = "UPDATE renta SET devuelto = ? WHERE id_articulo = ? "
  db.query(sql, [1, id], (error, results, fields) => {
    if (error) {
      console.log('error al devolver');
    } else {
      console.log('devuelto con exito');
    }
  });
  const sql2 = "UPDATE articulo SET piezas = (piezas + 1) WHERE id = ? "
  db.query(sql2, [id], (error, results, fields) => {
    if (error) {
      console.log('error al devolver');
    } else {
      console.log('articulo sumado ');
    }
  });
})

ipcMain.on('return-all-articles', (event, articles) => {

  articles.forEach(elem => {
    elem.forEach(element => {
      const sql = "UPDATE renta SET devuelto = ? WHERE id_articulo = ?"
      db.query(sql, [1, element.id], (error, results, fields) => {
        if (error) {
          console.log('error al devolver articulos');
        } else {

          payDialogWindow.loadFile("src/ui/returnrental/successreturnarticles.html")
          window.reload()
          window.setOpacity(1)
          // window.loadFile("src/ui/returnrental/returnrental.html")

          console.log('devueltos con exito');
        }
      });
      const sql2 = "UPDATE articulo SET piezas = (piezas + 1) WHERE id = ? "
  db.query(sql2, [element.id], (error, results, fields) => {
    if (error) {
      console.log('error al devolver');
    } else {
      console.log('articulo sumado ');
    }
  });
    })
  })


})

ipcMain.on('alert-return-all-articles', (event, articles) => {
  createPayDialogWindow()
  

  payDialogWindow.show()
  payDialogWindow.loadFile("src/ui/returnrental/alertreturnall.html")

  setTimeout(() => {
    payDialogWindow.webContents.send('articles-resend', articles)

  }, 1000);
})
ipcMain.on('add-new-article', (event, arg) => {
  window.loadFile("src/ui/stocktaking/addarticle.html")

})
ipcMain.on('edit-article', (event, id) => {
  window.loadFile("src/ui/stocktaking/editarticle.html")

  setTimeout(() => {
    const sql = "SELECT * FROM articulo WHERE id = ?"
    db.query(sql, id, (error, results, fields) => {
      if (error) {
        console.log('edited-error')
        console.log(error);
      } else {
        console.log('edited')

        event.sender.send('article-edited', results)
      }
    });



  }, 200);
})

ipcMain.on('update-article', (event, arg) => {
  console.log('updating...')
  console.log(arg);
  let { nombre, piezas, precio, id } = arg


  const sql = "UPDATE articulo SET nombre = ?, piezas = ?, precio = ? WHERE id = ?"
  db.query(sql, [nombre, piezas, precio, id], (error, results, fields) => {
    if (error) {
      console.log('error al agregar');
      event.sender.send('result-add-article', '❌ Falló al editar artículo')
    } else {
      event.sender.send('result-add-article', '✅ Artículo editado con exito')

    }
  });

})

ipcMain.on('open-stocktacking', (event, arg) => {

  window.loadFile("src/ui/stocktaking/stocktakinghome.html")
  setTimeout(() => {
    getArticles();

  }, 200)



})
ipcMain.on('delete-article', (event, arg) => {
  setTimeout(() => {
    let { id, nombre } = arg;
    console.log('deleting article...')
    
    createDeleteDialogStockWindow();
    deleteDialogWindow.webContents.send('article-name', nombre);


    deleteDialogWindow.center();
    deleteDialogWindow.show()
    console.log(nombre)

    ipcMain.on('cancel-delete', (event) => {

      deleteDialogWindow.close();
      window.setOpacity(1);
    });



    ipcMain.on('confirm-delete', (event) => {

      deleteDialogWindow.close();
      window.setOpacity(1);
      const sql = "DELETE FROM articulo WHERE id = ?"
      db.query(sql, id, (error, results, fields) => {
        if (error) {
          console.log(error);
        } else {
          getArticles();
        }
      });
    })


  }, 100);
})

ipcMain.on('close-app', (evt, arg) => {
  // app.quit();
  // window.close()
  // createLoginWindow()
  // loginWindow.show();
  window.loadFile('src/ui/login/loginView.html')
})

ipcMain.on('save-article', (event, obj) => {
  setTimeout(() => {
    console.log('saving article...')

    const { name, pieces, price } = obj

    
    const sql = "INSERT INTO articulo (nombre, piezas, precio) VALUES (?, ?, ?)"
    db.query(sql, [name, pieces, price], (error, results, fields) => {
      if (error) {
        console.log('error al agregar');
        event.sender.send('result-add-article', '❌ Falló al agregar artículo')
      } else {
        event.sender.send('result-add-article', '✅ Artículo añadido con exito')

      }


    })
  }, 200)
})

ipcMain.on('dangered-articles', (event, obj) => {
  window.loadFile("src/ui/dangeredarticles/dangeredarticles.html")
  setTimeout(() => {
    getDangeredArticles();
  }, 300)

})
ipcMain.on('get-articles-rented', (event, articles) => {
  console.log('articles-addd' + articles)
  articles.forEach(id_article => {
    const sql = "SELECT * FROM articulo WHERE id = ? AND piezas"
    db.query(sql, id_article, (error, results, fields) => {
      if (error) {
        console.log('edited-error')
        console.log(error);
      } else {
        console.log('articles-rented: ' + results)
        setTimeout(() => {
          window.webContents.send('render-article-table', results)

        }, 1000);
      }
    });
  })
})
ipcMain.on('logintest', (event, obj) => {
  setTimeout(() => {
    console.log('GOOD finshed!')

    const { email, password } = obj

    const sql = "SELECT * FROM empleado WHERE username=? AND password=?"
    db.query(sql, [email, password], (error, results, fields) => {
      if (error) { console.log(error); }

      if (results.length > 0) {
        event.sender.send('logintest-reply', 'Bienvenido')
        
        // createHomeWindow()
        // window.show()
        // loginWindow.close()
        
        window.loadFile('src/ui/home.html')

      } else {
        event.sender.send('logintest-reply', 'Usuario y/o contraseña incorrectos')
      }

    });

    // Send reply to a renderer

  }, 200)
})


ipcMain.on('get-rents', (event) => {
  setTimeout(() => {
    getTotalCashClosing();

  }, 300);
})


ipcMain.on('total-obtained', (event, total) => {
  console.log('total obtained:' + total)
    // const sql = 'SELECT * FROM articulo WHERE nombre = ?'
    // db.query(sql, nombre, (error, results, fields) => {
    //   if(error){
    //     event.sender.send('there-is-not-article')
    //   }else{
    //     event.sender.send('article-exist','El articulo ya existe')
    //   }
    // })
})

ipcMain.on('check-if-article-exist', (event, nombre) =>{
  console.log(nombre)
  const sql = 'SELECT * FROM articulo WHERE nombre = ?'
  db.query(sql, nombre, (error, results, fields) => {
    if(results.length === 0){
      window.webContents.send('article-exist','')


    }else{
      window.webContents.send('article-exist','El articulo ya existe')
    }
  })
})
function getArticles() {
  db.query('SELECT * FROM articulo', (error, results, fields) => {
    if (error) {
      console.log(error);
    } else {
      window.webContents.send('render-articles', results);

      console.log(results);
      console.log('enviado')
    }
  })
}
function getArticlesAvailable() {
  db.query('SELECT * FROM articulo WHERE piezas > 0', (error, results, fields) => {
    if (error) {
      console.log(error);
    } else {
      setTimeout(() => {
        window.webContents.send('render-articles-available', results);

      }, 100);

      console.log(results);
      console.log('enviado')
    }
  })
}
function getDangeredArticles() {
  db.query(' SELECT * FROM articulo WHERE dañado = 1', (error, results, fields) => {
    if (error) {
      console.log(error);
    } else {
      window.webContents.send('render-dangered-articles', results);
      console.log(results);
      console.log('enviado')
    }
  })
}
function deleteArticle(id) {

}

function getMember(id) {

}

function newRental(obj) {


  let fecha = moment().format('yyyy-M-DD:hh:mm:ss');

  console.log(fecha)
  const { articlesAdded, total, member, change } = obj

  objectRental = obj
  const sql = "INSERT INTO pago (importe, status) VALUES (?, ?)"
  db.query(sql, [total, 'pagado'], (error, results, fields) => {
    if (error) {
      console.log(error)
      console.log('error al agregar');
    } else {
      console.log('pago añadido ')

      console.log(results.insertId)

      articlesAdded.forEach(id_articulo => {
        const sql2 = "INSERT INTO renta (fecha, id_articulo, numero_socio, pago,devuelto) VALUES (?, ?, ?, ?,?)"
        db.query(sql2, [fecha, id_articulo, member, results.insertId, 0], (error, results, fields) => {
          if (error) {
            console.log(error)
            console.log('error al agregar');
          } else {
            console.log('renta añadida ')

            console.log(results.insertId)

            const sql2 = "SELECT * FROM articulo WHERE id = ?"
            db.query(sql2, [id_articulo], (error, article, fields) => {
              if (error) {
                console.log(error)
                console.log('No hay articulo');
              } else {
                article.forEach(art => {
                  const sql2 = "INSERT INTO resguardo (fecha, cantidad, socio, articulo) VALUES (?, ?, ?, ?)"
                  db.query(sql2, [fecha, art.precio, member, id_articulo], (error, results, fields) => {
                    if (error) {
                      console.log(error)
                      console.log('error al agregar');
                    } else {
                      console.log('everythin allrigth')
                    }
                  })

                })




              }
            })

            const sql3 = "UPDATE articulo SET piezas = (piezas - 1) WHERE id = ?"
            db.query(sql3, [id_articulo], (error, article, fields) => {
              if (error) {
                console.log(error)
                console.log('No hay articulo');
              } else {
                console.log('articulo update');

              }
            })
          }
        })
      })

    }


  });

}
function newRentalLoadedToAccount(obj) {


  let fecha = moment().format('yyyy-M-DD:hh:mm:ss');

  console.log(fecha)
  const { articlesAdded, total, member, change } = obj

  objectRental = obj
  const sql = "INSERT INTO pago (importe, status) VALUES (?, ?)"
  db.query(sql, [total, 'pendiente'], (error, results, fields) => {
    if (error) {
      console.log(error)
      console.log('error al agregar');
    } else {
      console.log('pago añadido ')

      console.log(results.insertId)

      articlesAdded.forEach(id_articulo => {
        const sql2 = "INSERT INTO renta (fecha, id_articulo, numero_socio, pago,devuelto) VALUES (?, ?, ?, ?,?)"
        db.query(sql2, [fecha, id_articulo, member, results.insertId, 0], (error, results, fields) => {
          if (error) {
            console.log(error)
            console.log('error al agregar');
          } else {
            console.log('renta añadida ')

            console.log(results.insertId)

            const sql2 = "SELECT * FROM articulo WHERE id = ?"
            db.query(sql2, [id_articulo], (error, article, fields) => {
              if (error) {
                console.log(error)
                console.log('No hay articulo');
              } else {
                article.forEach(art => {
                  const sql2 = "INSERT INTO resguardo (fecha, cantidad, socio, articulo) VALUES (?, ?, ?, ?)"
                  db.query(sql2, [fecha, art.precio, member, id_articulo], (error, results, fields) => {
                    if (error) {
                      console.log(error)
                      console.log('error al agregar');
                    } else {
                      console.log('resguado hecho')
                      const sql3 = "INSERT INTO pagare (fecha, interes, importe, concepto,socio) VALUES (?, ?, ?, ?,?)"
                          db.query(sql3, [fecha, 5, art.precio, `renta de ${art.nombre}`, member], (error, results, fields) => {
                            if (error) {
                              console.log(error)
                              console.log('error al hacer pagaré');
                            } else {
                              console.log('Pagaré hecho');
                            }
                          })
                    }
                  })

                  
                })
                




              }
            })

            const sql3 = "UPDATE articulo SET piezas = (piezas - 1) WHERE id = ?"
            db.query(sql3, [id_articulo], (error, article, fields) => {
              if (error) {
                console.log(error)
                console.log('No hay articulo');
              } else {
                console.log('articulo update');

              }
            })
          }
        })
      })

    }


  });

}


function renderRentalResume(obj) {

}
function returnRental() {

}

function getTotalCashClosing() {
  let currentDate = moment().format('yyyy-M-DD:00:00:00');
  let postCurrentDate = moment().format('yyyy-M-DD:11:59:59');

  console.log(currentDate)
  const sql2 = "SELECT pago FROM renta WHERE fecha >= ? AND fecha <= ?"
  db.query(sql2, [currentDate, postCurrentDate], (error, results, fields) => {
    if (error) {
      console.log(error)
      console.log('error al agregar');
    } else {

      let totalGet = getTotalCash(results)


    }
  })

}

function getTotalCash(results) {


  if (results) {
    let totalCash = 0;
    results.forEach(element => {
      const sql2 = "SELECT importe FROM pago WHERE id = ?"
      db.query(sql2, [element.pago], (error, results, fields) => {
        if (error) {
          console.log(error)
          console.log('error al agregar');
        } else {
          results.forEach(elem => {
            totalCash += elem.importe

            console.log(totalCash)
            window.webContents.send('total-cash', totalCash)

          })

        }

      })

    })

  }

}