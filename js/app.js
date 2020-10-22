 // MODELO DE DATOS
 let mis_peliculas_iniciales = [
    {titulo: "Superlópez",   director: "Javier Ruiz Caldera", "miniatura": "files/superlopez.png"},
    {titulo: "Jurassic Park", director: "Steven Spielberg", "miniatura": "files/jurassicpark.png"},
    {titulo: "Interstellar",  director: "Christopher Nolan", "miniatura": "files/interstellar.png"}
 ];
 let mis_peliculas;
 let url;

//PRIMITIVAS AJAX
 const postAPI = async (url_inic, mis_peliculas_iniciales) => {
    let response = await fetch( url_inic,
        {   method: 'POST',
            headers: { "Content-Type": "application/json", },
            body: JSON.stringify(mis_peliculas_iniciales),
        });
    return (await response.json()).uri;    
 }
 const getAPI = async (url) => {
    let response = await fetch(url);
    return await response.json();   
 }
 const updateAPI = async (url, mis_peliculas) => {
    let response = await fetch( url, 
        {   method: 'PUT',
            headers: { "Content-Type": "application/json", },
            body: JSON.stringify(mis_peliculas),
        });
    return await response.json();    
 }

//VISTAS
 const indexView = (peliculas) => {
     let i=0, view = "";
     while(i < peliculas.length) {
       view += `
        <div class="movie">
          <div class="movie-img">
            <img class="show" data-my-id="${i}" src="${peliculas[i].miniatura}" 
            onerror="this.src='files/placeholder.png'"/>
          </div>
          <div class="title">
            ${peliculas[i].titulo || "<em>Sin título</em>"}
          </div>
          <div class="actionsp">
            <button class="show" data-my-id="${i}">ver</button>
            <button class="edit" data-my-id="${i}">editar</button>                
            <button class="delete" data-my-id="${i}">borrar</button>
          </div>
        </div>`;
       i++;
     };
     view += `<div class="actions">
        <button class="reset">reiniciar</button>
        <button class="new">añadir</button>
      </div>`;
     return view;
 }

 const editView = (i, pelicula) => {
    return `<fieldset><legend>
      <h2>Editar Película</h2></legend>
      <div class="field">
        Título <br>
        <input  type="text" id="titulo" 
        placeholder="Título" value="${pelicula.titulo}">
      </div>
      <div class="field">
        Director <br>
        <input  type="text" id="director" 
        placeholder="Director" value="${pelicula.director}">
      </div>
      <div class="field">
        Miniatura <br>
        <input  type="text" id="miniatura" 
        placeholder="URL de la miniatura" 
        value="${pelicula.miniatura}">
      </div>
      <div class="actions">
        <button class="update" data-my-id="${i}">Actualizar</button>
        <button class="index">Volver</button>
      </div></fieldset>`;
 }

 const showView = (pelicula) => {
    return `<fieldset><legend>Detalles</legend>
      <p id="details">La película <strong>${pelicula.titulo}</strong>
      fue dirigida por <strong>${pelicula.director}</strong>.</p>
      <div class="actionsv">
        <button class="index">Volver</button>
      </div></fieldset>`;
 }

 const newView = () => {
    return `<fieldset> 
    <legend><h2>Crear Película</h2></legend>
      <div class="field">
        Título <br>
        <input  type="text" id="titulo" placeholder="Título">
      </div>
      <div class="field">
        Director <br>
        <input  type="text" id="director" placeholder="Director">
      </div>
      <div class="field">
        Miniatura <br>
        <input  type="text" id="miniatura" placeholder="URL de la miniatura">
      </div>
      <div class="actionsv">
        <button class="create">Crear</button>
        <button class="index">Volver</button>
      </div></fieldset>`;
 }

 // CONTROLADORES 
 const initContr = async () => {
     try {
         url = localStorage.getItem('url') || await postAPI('https://jsonstorage.net/api/items', mis_peliculas_iniciales);
         localStorage.setItem('url', url);
         mis_peliculas = await getAPI(url);
         indexContr();
     } catch (e) {document.getElementById('main').innerHTML = "Error: '${e}'"};     
 }

 const indexContr = async () => {
     mis_peliculas = await getAPI(url);
     document.getElementById('main').innerHTML = indexView(mis_peliculas);
 }

 const showContr = (i) => {
     document.getElementById('main').innerHTML = showView(mis_peliculas[i]);
 }

 const newContr = () => {
     document.getElementById('main').innerHTML = newView();
 }

 const createContr = async () => {
     mis_peliculas.push({titulo: document.getElementById('titulo').value,
                        director: document.getElementById('director').value,
                        miniatura: document.getElementById('miniatura').value,});
     await updateAPI(url, mis_peliculas);
     indexContr();                   
 }

 const editContr = (i) => {
     document.getElementById('main').innerHTML = editView(i,  mis_peliculas[i]);
 }

 const updateContr = async (i) => {
     mis_peliculas[i].titulo   = document.getElementById('titulo').value;
     mis_peliculas[i].director = document.getElementById('director').value;
     mis_peliculas[i].miniatura = document.getElementById('miniatura').value;
     await updateAPI(url, mis_peliculas);
     indexContr();
 }

 const deleteContr = async (i) => {
     if(confirm("¿Está seguro de que desea eliminar esta película?")) {
        mis_peliculas.splice(i,1);
        await updateAPI(url, mis_peliculas);
     }
     indexContr();
 }

 const resetContr = async () => {
     mis_peliculas = [...mis_peliculas_iniciales];
     await updateAPI(url, mis_peliculas);
     indexContr();
 }

 // ROUTER de eventos
 const matchEvent = (ev, sel) => ev.target.matches(sel)
 const myId = (ev) => Number(ev.target.dataset.myId)

 document.addEventListener('click', ev => {
     if      (matchEvent(ev, '.index'))  indexContr  ();
     else if (matchEvent(ev, '.edit'))   editContr   (myId(ev));
     else if (matchEvent(ev, '.update')) updateContr (myId(ev));
     else if (matchEvent(ev, '.show')) showContr (myId(ev));
     else if (matchEvent(ev, '.new')) newContr ();
     else if (matchEvent(ev, '.create')) createContr ();
     else if (matchEvent(ev, '.delete')) deleteContr (myId(ev));
     else if (matchEvent(ev, '.reset')) resetContr ();     
 })
 
 
 // Inicialización        
 document.addEventListener('DOMContentLoaded', initContr);