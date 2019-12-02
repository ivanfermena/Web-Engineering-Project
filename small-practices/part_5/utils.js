/*
//      Ejercicio 1:
El objetivo es la implementación de un conjunto de funciones JavaScript 
haciendo uso de las funciones de orden superior sobre arrays. 
Todas estas funciones recibirán un array de tareas, donde cada tarea se representa mediante un objeto con tres propiedades:
una propiedad text que contiene el texto de la tarea.
una propiedad booleana done que indica si la tarea ha sido finalizada o no.
una propiedad tags, que es un array que contiene las etiquetas de la tarea.
La propiedad done es opcional y, si no se indica, se considera que tiene el valor false.
*/

//      Ejercicio 2:
//Esta función devuelve un array con los textos de aquellas tareas de la lista de tareas tasks que no estén finalizadas.
function getToDoTasks(listaTareas){
    return listaTareas.filter(t => t.done === undefined || t.done === false)
}

//console.log(getToDoTasks(listaTareas))

//Esta función devuelve un array que contiene las tareas del array tasks que contengan, en su lista de etiquetas, 
//la etiqueta pasada como segundo parámetro.
function findByTag(listaTareas, tag){
    return listaTareas.filter(t => t.tags.includes(tag))
}

//console.log(findByTag(listaTareas, "personal"))

//      Ejercicio 3:
//Esta función devuelve un array que contiene aquellas tareas del array tasks que 
//contengan al menos una etiqueta que coincida con una de las del array tags pasado como segundo parámetro.
function findByTags(tasks, tags){
    /*primer paso -> para cada tag de tags, se mapea sus resultados obteniendo varios arrays, en estos arrays
      habra duplicados. El siguiente paso en concatenar todos los arrays. El ultimo paso, reducir el array eliminando
      los duplicados*/
    return tags.map(tag => findByTag(tasks, tag))
    .reduce((ac,t) => ac.concat(t), [])
    .reduce((ac,t) => {
        if(!(ac.includes(t))){
            ac.push(t)
        }
        return ac
    }, [])
    
}

//console.log(findByTags(listaTareas,  ["personal", "practica"]))

//      Ejercicio 3:
//Esta función devuelve el número de tareas completadas en el array de tareas tasks pasado como parámetro.
function countDone(tasks){
    return tasks.reduce((ac,t) => {if(t.done){ac += 1} return ac}, 0)
}

//console.log(countDone(listaTareas))

//      Ejercicio 4:
/*Esta función recibe un texto intercalado con etiquetas, 
cada una de ellas formada por una serie de caracteres alfanuméricos precedidos por el signo @. 
Esta función debe devolver un objeto tarea con su array de etiquetas extraídas de la cadena texto. 
Por otra parte, el atributo text de la tarea resultante no debe contener 
las etiquetas de la cadena de entrada ni espacios en blanco de más.
*/
function createTask(texto){
    obj = {text: texto, tags: [] }
    obj.text = obj.text.split(" ").map(t => {
        if (/@\w+/.exec(t) != undefined){
            tag = t.substring(1)
            t = " "
            obj.tags.push(tag)
        }
        return t
    }).reduce((ac, v) => ac.concat(v, " "), "")

    obj.text = obj.text.replace(/\s+\S*$/, "")
    console.log(obj)
    return obj
}

module.exports = {
    getToDoTasks,
    findByTag,
    findByTags,
    countDone,
    createTask
}
