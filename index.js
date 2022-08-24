const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");
const Database = require('simple-json-db');
var bodyParser = require('body-parser')
const moment = require('moment')

//Middleware
app.use(bodyParser({
    limit: '50mb'
}));
app.use(express.static('public'))

app.use(cookieParser());

//Middleware


// Bases de datos
const dbUsuarios = new Database(__dirname + "/db/usuarios/index.json")
const dbPost_1 = new Database(__dirname + "/db/post/index.json")
const dbPost_2 = new Database(__dirname + "/db/copia_seguridad/index.json")
const db_id = new Database(__dirname + "/db/id/index.json")
const db_fotos = new Database(__dirname + "/db/fotos/index.json")
const db_allpost = new Database(__dirname + "/db/post/admin.json")

//Bases de datos
app.get('/admin.json', (req, res) => {
	res.sendFile(__dirname + '/db/post/admin.json')
})
app.get('/admin', (req, res) => {

    var cookie = getcookie(req);
    if (!db_id.has(cookie[0].split('=')[1])) {
        res.send("error")
    } else if (db_id.has(cookie[0].split('=')[1])) {
        res.sendFile(__dirname + '/public/admin.html')
    }
})
app.get('/admin/editor_2', (req, res) => {
    var cookie = getcookie(req);
    if (!db_id.has(cookie[0].split('=')[1])) {
        res.send("error")
    } else if (db_id.has(cookie[0].split('=')[1])) {
        res.sendFile(__dirname + '/public/admin_afterpost_editor.html')
    }

})
app.get('/admin/editor/', (req, res) => {
    var cookie = getcookie(req);
    if (!db_id.has(cookie[0].split('=')[1])) {
        res.send("error")
    } else if (db_id.has(cookie[0].split('=')[1])) {
        res.sendFile(__dirname + '/public/publicacion.html')
    }

})
app.get('/admin/metricas/', (req, res) => {
    var cookie = getcookie(req);
    if (!db_id.has(cookie[0].split('=')[1])) {
        res.send("error")
    } else if (db_id.has(cookie[0].split('=')[1])) {
        res.sendFile(__dirname + '/public/metricas.html')
    }

})
app.get('/admin/publicacion/', (req, res) => {
    var cookie = getcookie(req);
    if (!db_id.has(cookie[0].split('=')[1])) {
        res.send("error")
    } else if (db_id.has(cookie[0].split('=')[1])) {
        res.sendFile(__dirname + '/public/admin_posts.html')
    }

})

app.get('/adminlogin', (req, res) => {
    res.sendFile(__dirname + '/admin/login.html')
})
app.post('/log', (req, res) => {
    var user = req.body.user
    var pass = req.body.pass
    if (!user || !pass) {
        res.send("ERROR 404 USUARIO O CONTRASEÑA NO VÁLIDO.")
    } else if (user && pass) {
        var e_user = dbUsuarios.get(user)
        if (!e_user || e_user !== pass) {
            res.send("ERROR 404 USUARIO O CONTRASEÑA NO VÁLIDO.")
        } else if (e_user == pass) {
            const id = db_id.get(user)
            const img = db_fotos.get(user)
            res.cookie(user, id, {
                maxAge: 86400000, // Duración de 24h
                httpOnly: false,
                secure: true,
                sameSite: true,
            });
            res.cookie("pfp", img, {
                maxAge: 86400000, // Duración de 24h
                httpOnly: false,
                secure: false,
                sameSite: false,
            });

            res.redirect("/admin")
        }

    }
})
app.post('/publicar', (req, res) => {
var cookie = getcookie(req);
    if (!db_id.has(cookie[0].split('=')[1])) {
        res.send("No tienes permiso para entrar aqui.")
    } else if (db_id.has(cookie[0].split('=')[1])) {
        var generated_html = generateHTML(req.body.titulo2, 
																			req.body.entradilla2, req.body.texto2, 
																			req.body.image2, req.body.ytvideo, 
																			req.body.foto_autor, req.body.autor)
	
    var id_g = id(req.body.titulo2, req.body.autor)
	
    dbPost_1.set(id_g, generated_html)
			dbPost_2.set(id_g, generated_html)
			db_allpost.set(Math.random(), ` <tr>
                            <td><a href="/publicaciones/${id_g}">${req.body.titulo2}</a></td>
                            <td>${moment().format('L') }</td>
                            <td>${req.body.autor}</td>
                            <td>{Nº Visitas}</td>
                            <td><button id="btn-edit">Editar</button></td>
                        </tr>`)
    res.redirect("/publicaciones/" + id_g)
    }
    
})

app.get('/publicaciones/:id', (req, res) => {
var id = req.params.id
	if(!id || !dbPost_1.get(id) || !dbPost_2.get(id)){
		res.send(404)
	} else if (dbPost_1.get(id) || dbPost_2.get(id)){
		res.send(dbPost_1.get(id) || dbPost_2.get(id))
	}
})



function getcookie(req) {
    var cookie = req.headers.cookie;

    return cookie.split('; ');
}


app.listen(3000, () => console.log('Servidor iniciado en el puerto 3000'))









function id(titulo, autor) {
    t = titulo.replace(/ /g, "-");
	a = autor.replace(/ /g, "-")


    return encodeURIComponent(t + "-" + "by" + "-" + a)
}




function generateHTML(titulo, entradilla, texto, imagen, video, foto_autor, autor, css) {
    console.log("EL VIEODP:_" + video)
    if (!video.startsWith("https")) {
        const html = `<!DOCTYPE html>
<html lang="es">
<head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="/post.css">
        <title>DTuristeo</title>
</head>
<body>
    <header>
        <h2 class="logo"></h2>
        <div class="righSide">
            <!--No se si dejarlo o poner así PREGUNTAR-->
        
        
        <div class="btns menuToggle">
            <ion-icon class="ham" name="menu-outline"></ion-icon>
            <ion-icon class="x" name="close-outline"></ion-icon>
        </div>
        </div>
        <ul>
          <li><a href="#">Inicio</a></li>
          <li><a href="#">Misión</a></li>
          <li><a href="#">About Us</a></li>
          <li><a href="#">Contacto</a></li>
          
  </ul>
  
    </header>
    

    <!--Nav-->

    <ul class="navigation">
      <li><a href="#">Inicio</a></li>
      <li><a href="#">Misión</a></li>
      <li><a href="#">About Us</a></li>
      <li><a href="#">Contacto</a></li>
      
    </ul>





    <!--Scrip Hamburger-->
    <script type="module" src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"></script>
    <script nomodule src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"></script>

  
    <script>

      
      let menuToggle = document.querySelector('.menuToggle')
      let body = document.querySelector('body')
      let navigation = document.querySelector('.navigation')
       
      menuToggle.onclick = function(){
          menuToggle.classList.toggle('active')
          navigation.classList.toggle('active')
      }
  </script>




<div class="sec" id="sec_1">
   
    <h2>
            ${titulo}
    </h2>
    <!--Entradilla-->
    <p>
    ${entradilla}
    </p>

    <!--Imagen-->
    <div class="parent">
    <img class="imagenpost" src="${imagen}" alt="imagen_dtouristeo">
    </div>

    <!--Post-->
    <p>
    ${texto}
    </p>
    <div class="container-editor">

        <img class= "editor-foto" src="${foto_autor}" alt="">
       <!--<div class="editor-foto">Hola</div>-->
        <div class="nombre-editor">
            <h3>${autor}</h3>
            <span class="redactado">Redactado por</span>
        </div>
        
            
       
    </div>
</div>




     
   
    
</body>
</html>`
        return html;
    } else {
        const html2 = `<!DOCTYPE html>
<html lang="es">
<head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="/post.css">
        <title>DTuristeo</title>
</head>
<body>
    <header>
        <h2 class="logo"></h2>
        <div class="righSide">
            <!--No se si dejarlo o poner así PREGUNTAR-->
        
        
        <div class="btns menuToggle">
            <ion-icon class="ham" name="menu-outline"></ion-icon>
            <ion-icon class="x" name="close-outline"></ion-icon>
        </div>
        </div>
        <ul>
          <li><a href="#">Inicio</a></li>
          <li><a href="#">Misión</a></li>
          <li><a href="#">About Us</a></li>
          <li><a href="#">Contacto</a></li>
          
  </ul>
  
    </header>
    

    <!--Nav-->

    <ul class="navigation">
      <li><a href="#">Inicio</a></li>
      <li><a href="#">Misión</a></li>
      <li><a href="#">About Us</a></li>
      <li><a href="#">Contacto</a></li>
      
    </ul>





    <!--Scrip Hamburger-->
    <script type="module" src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"></script>
    <script nomodule src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"></script>

  
    <script>

      
      let menuToggle = document.querySelector('.menuToggle')
      let body = document.querySelector('body')
      let navigation = document.querySelector('.navigation')
       
      menuToggle.onclick = function(){
          menuToggle.classList.toggle('active')
          navigation.classList.toggle('active')
      }
  </script>




<div class="sec" id="sec_1">
   
    <h2>
            ${titulo}
    </h2>
    <!--Entradilla-->
    <p>
    ${entradilla}
    </p>

    <!--Imagen-->
    <div class="parent">
    <img class="imagenpost" src="${imagen}" alt="imagen_dtouristeo">
    </div>

    <!--Post-->
    <p>
    ${texto}
    </p>
   <div class="parent-button">

        <input class="button" type="button" onclick="location.href='${video}'" value="Video de Youtube">
    </div>
    <div class="container-editor">

        <img class= "editor-foto" src="${foto_autor}" alt="">
       <!--<div class="editor-foto">Hola</div>-->
        <div class="nombre-editor">
            <h3>${autor}</h3>
            <span class="redactado">Redactado por</span>
        </div>
        
            
       
    </div>
</div>




     
   
    
</body>
</html>`
        return html2;
    }

}