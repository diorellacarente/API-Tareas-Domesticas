// Importa las dependencias necesarias para el servidor
const express = require('express');  
const fs = require('fs'); 
const app = express();  

app.use(express.json());

function readJSON(file) {
    return JSON.parse(fs.readFileSync(file));
}

function writeJSON(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// CRUD para Miembros 
//  GET para obtener la lista de miembros
app.get('/miembros', (req, res) => {
    const miembros = readJSON('miembros.json');  // Lee el archivo miembros.json
    const miembrosActivos = miembros.filter(miembro => miembro.activo !== false); // Filtra solo los miembros activos
    res.json(miembrosActivos);  // Envia la lista de miembros como respuesta
});

// POST para agregar un nuevo miembro
app.post('/miembros', (req, res) => {
    const miembros = readJSON('miembros.json');  // Lee la lista actual de miembros
    const nuevoMiembro = req.body;  // Obtiene los datos del nuevo miembro del cuerpo de la solicitud
    miembros.push(nuevoMiembro);  // Agrega el nuevo miembro a la lista
    writeJSON('miembros.json', miembros);  // Guarda la lista actualizada en el archivo
    res.json({ message: 'Miembro agregado', miembro: nuevoMiembro });  // Envia confirmación
});

//  PUT para actualizar un miembro existente basado en su ID
app.put('/miembros/:id', (req, res) => {
    const id = parseInt(req.params.id, 10); 
    const miembros = readJSON('miembros.json');  
    const miembroIndex = miembros.findIndex(miembro => miembro.id === id);  
    
    if (miembroIndex === -1) {  
        return res.status(404).json({ message: 'Miembro no encontrado' });
    }

    miembros[miembroIndex] = { ...miembros[miembroIndex], ...req.body }; 
    writeJSON('miembros.json', miembros);  
    res.json({ message: 'Miembro actualizado', miembro: miembros[miembroIndex] });  
});

//  DELETE para eliminar un miembro basado en su ID
app.delete('/miembros/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);  
    const miembros = readJSON('miembros.json');  
    const miembroIndex = miembros.findIndex(miembro => miembro.id === id);  
    
    if (miembroIndex === -1) {  
        return res.status(404).json({ message: 'Miembro no encontrado' });
    }
    
    miembros[miembroIndex].activo = false;  
    writeJSON('miembros.json', miembros); 
    res.json({ message: 'Miembro desactivado' }); 
});

// CRUD para Tareas
//  GET para obtener la lista de tareas
app.get('/tareas', (req, res) => {
    const tareas = readJSON('tareas.json');  
    const tareasActivas = tareas.filter(tarea => tarea.activa !== false);
    res.json(tareasActivas); 
});

// POST para agregar una nueva tarea
app.post('/tareas', (req, res) => {
    const tareas = readJSON('tareas.json');  
    const nuevaTarea = req.body;  
    tareas.push(nuevaTarea); 
    writeJSON('tareas.json', tareas);  
    res.json({ message: 'Tarea agregada', tarea: nuevaTarea });
});

//PUT para actualizar una tarea existente basada en su ID
app.put('/tareas/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);  
    const tareas = readJSON('tareas.json');  
    const tareaIndex = tareas.findIndex(tarea => tarea.id === id); 
    
    if (tareaIndex === -1) {  // Si la tarea no existe, envia un error
        return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    tareas[tareaIndex] = { ...tareas[tareaIndex], ...req.body };  
    writeJSON('tareas.json', tareas);  
    res.json({ message: 'Tarea actualizada', tarea: tareas[tareaIndex] });  
});

// DELETE para eliminar una tarea basada en su ID
app.delete('/tareas/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);  
    const tareas = readJSON('tareas.json');  
    const tareaIndex = tareas.findIndex(tarea => tarea.id === id); 
    
    if (tareaIndex === -1) { 
        return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    tareas[tareaIndex].activa = false;
    writeJSON('tareas.json', tareas);  
    res.json({ message: 'Tarea desactivada' });  
});


const port = 3000;  
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

