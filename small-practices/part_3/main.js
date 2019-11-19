const mysql = require("mysql")

const daoUser = require("./DAOUsers")
const daoTask = require("./DAOTasks")
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "tareas"
})

function cb_isUserCorrect(err, result){
   if (err) {
       console.log(err.message);
   } else if (result) {
       console.log("Usuario y contraseña correctos");
   } else {
       console.log("Usuario y/o contraseña incorrectos");
   }
}

//dao = new daoUser(pool)

//dao.isUserCorrect("rossini@printnoli.espana", "1234", cb_isUserCorrect);

//dao.getUserImageName("rossini@printnli.espana", console.log)

dao = new daoTask(pool)
dao.getAllTasks("rossini@printnoli.espana", console.log)

/*let task = {
    text: "texto de la pregunta",
    done: 0,
    tags: ["Deportes","Estudios"]
}s

dao.insertTask("rossini@printnoli.espana", task, console.log)*/

//dao.markTaskDone(10, console.log)

//dao.deleteCompleted("rossini@printnoli.espana", console.log)