var datosjson;
var infowindow = [];
var marcador = [];
var listaPaises = [];
var listaTipos = [];
var listaCiclos = [];
var ciclosGS = [];
var ciclosGM = [];
var ciclosProfes = [];
var paisGS = [];
var paisGM = [];
var paisProfes = [];

cargaDatos();
inicio();

function inicio() {

    llenarArrays();
    asignarEventos();
}

/* Cargamos el mapa */
function myMap() {
    infowindow = new google.maps.InfoWindow();
    var mapProp = {
        center: new google.maps.LatLng(49.3704187, 14.9236875),
        zoom: 4,
    };
    map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
}


/** Cargar json y parsear los datos */
function cargaDatos() {

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onload = function () {
        var datos = xmlhttp.responseText;
        datosjson = JSON.parse(datos);
    };
    xmlhttp.open("GET", "JS/JSON.json", false);
    xmlhttp.send();
}

/** Cargar los arrays con los datos del json */
function llenarArrays() {
    for (var item in datosjson) {
        if (!listaPaises.includes(datosjson[item].pais)) {
            listaPaises.push(datosjson[item].pais);
        }
        if (!listaTipos.includes(datosjson[item].tipo)) {
            listaTipos.push(datosjson[item].tipo);
        }
        if (!listaCiclos.includes(datosjson[item].ciclo)) {
            listaCiclos.push(datosjson[item].ciclo);
        }
        if (!ciclosGS.includes(datosjson[item].ciclo) && datosjson[item].tipo === "Grado Superior") {
            ciclosGS.push(datosjson[item].ciclo);
        }
        if (!ciclosGM.includes(datosjson[item].ciclo) && datosjson[item].tipo === "Grado Medio") {
            ciclosGM.push(datosjson[item].ciclo);
        }
        if (!ciclosProfes.includes(datosjson[item].ciclo) && datosjson[item].tipo === "Profesorado") {
            ciclosProfes.push(datosjson[item].ciclo);
        }
        if (!paisGS.includes(datosjson[item].pais) && datosjson[item].tipo === "Grado Superior") {
            paisGS.push(datosjson[item].pais);
        }
        if (!paisGM.includes(datosjson[item].pais) && datosjson[item].tipo === "Grado Medio") {
            paisGM.push(datosjson[item].pais);
        }
        if (!paisProfes.includes(datosjson[item].pais) && datosjson[item].tipo === "Profesorado") {
            paisProfes.push(datosjson[item].pais);
        }
    }
}

/**Generico para crear nodos*/
function generarNodo(tipo, texto, atributo, valores) {

    var nodoTexto;
    var nodoP = document.createElement(tipo);
    if (texto) {
        nodoTexto = document.createTextNode(texto);
        nodoP.appendChild(nodoTexto);
    }
    for (var i in atributo) {
        nodoP.setAttribute(atributo[i], valores[i]);
    }
    return nodoP;
}

/**Generico para borrar elementos */
function borrarTodos(elem) {

    var elements = document.getElementsByClassName(elem);

    while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}

/** Cargar eventos */
function asignarEventos() {
    document.getElementById("select").addEventListener("change", mostrarLosCiclos, false);
    document.getElementById("checkboxCicloPais").addEventListener("change", mostrarLosCiclos, false);
    document.getElementById("btnBuscar").addEventListener("click", asignarMarcadores, false);
    document.getElementById("btnLimpiar").addEventListener("click", myMap, false);

    //Marcar todos
    document.getElementById("btnMarcarTodo").addEventListener("click", function () {

        var todosLosCheckbox = document.getElementsByClassName("checkboxCiclosPaises");

        for (var i = 0; i < todosLosCheckbox.length; i++) {
            todosLosCheckbox[i].checked = true;

        }
    });

    //Desmarcar todos
    document.getElementById("btnDesmarcarTodo").addEventListener("click", function () {

        var todosLosCheckbox = document.getElementsByClassName("checkboxCiclosPaises");
        for (var i = 0; i < todosLosCheckbox.length; i++) {
            todosLosCheckbox[i].checked = false;
        }
    });

}

/* Imprimir checkboxs en el html dependiendo de las opciones escogidas */
function dibujarCheckBoxs(listaCheckbox) {
    borrarTodos("elecciones");
    borrarTodos("checkboxCiclosPaises");

    var divChecks = document.getElementById("checkboxGrupo");
    for (var i = 0; i < listaCheckbox.length; i++) {

        var span = generarNodo("span", listaCheckbox[i], ["class"], ["elecciones"]);
        var check = generarNodo("input", "", ["class", "type"], ["checkboxCiclosPaises", "checkbox"]);

        var br = generarNodo("br", "", [], []);
        divChecks.appendChild(span);
        span.appendChild(check);
        span.appendChild(br);
    }
}

/* Cargar los checkbox dependiendo de la seleccion del usuario */
function comprobarSeleccion(seleccion) {
    var escogido = document.getElementById("checkboxCicloPais").checked;

    if (!escogido) {

        if (seleccion === "Grado Superior") {

            dibujarCheckBoxs(ciclosGS);
        }
        if (seleccion === "Profesorado") {

            dibujarCheckBoxs(ciclosProfes);
        }
        if (seleccion === "Grado Medio") {

            dibujarCheckBoxs(ciclosGM);
        }
        if (seleccion === "Todos") {

            dibujarCheckBoxs(listaCiclos);
        }
    }

    if (escogido) {

        if (seleccion === "Grado Superior") {

            dibujarCheckBoxs(paisGS);
        }
        if (seleccion === "Profesorado") {

            dibujarCheckBoxs(paisProfes);
        }
        if (seleccion === "Grado Medio") {

            dibujarCheckBoxs(paisGM);
        }
        if (seleccion === "Todos") {

            dibujarCheckBoxs(listaPaises);
        }
    }
}

function mostrarLosCiclos() {
    comprobarSeleccion(document.getElementById("select").value);
}

/* Asignar los marcadores generados */
function asignarMarcadores() {
    var checked = document.getElementById("checkboxCicloPais").checked;
    var listaCheckbox = document.getElementsByClassName("elecciones");

    for (var i = 0; i < listaCheckbox.length; i++) {

        var spanActual = listaCheckbox[i].children;
        var estadoDelCheck = spanActual[0].checked;
        var textoSpan = listaCheckbox[i].textContent;
        var inputCiclo = document.getElementById("select").value;

        //Paises
        if (estadoDelCheck && checked) {

            for (var item in datosjson) {

                if (textoSpan === datosjson[item].pais && datosjson[item].tipo === inputCiclo) {

                    var texto =
                        '<div id="content">' +
                        '<div id="siteNotice">' +
                        '</div>' +
                        `<h1> ${datosjson[item].ciclo} </h1>` +
                        `<h2> ${datosjson[item].tipo} </h2>` +
                        '<div id="bodyContent">' +
                        `<p>En ${datosjson[item].pais}<br> ${datosjson[item].ciudad} ` +
                        '</div>' +
                        '</div>';

                    var ubicacion = new google.maps.LatLng(datosjson[item].X, datosjson[item].Y);
                    generarMarcadores(ubicacion, texto);
                }
            }

            //Nombres
        } else if (estadoDelCheck && !checked) {
            for (var item in datosjson) {

                if (textoSpan === datosjson[item].ciclo && datosjson[item].tipo === inputCiclo) {

                    var texto =
                        '<div id="content">' +
                        '<div id="siteNotice">' +
                        '</div>' +
                        `<h1> ${datosjson[item].ciclo} </h1>` +
                        `<h2> ${datosjson[item].tipo} </h2>` +
                        '<div id="bodyContent">' +
                        `<p>En ${datosjson[item].pais}<br> ${datosjson[item].ciudad} ` +
                        '</div>' +
                        '</div>';

                    var ubicacion = new google.maps.LatLng(datosjson[item].X, datosjson[item].Y);
                    generarMarcadores(ubicacion, texto);
                }
            }
        }
        //Ciclos
        if (estadoDelCheck && inputCiclo === "Todos" && !checked) {
            for (var item in datosjson) {
                if (textoSpan === datosjson[item].ciclo) {

                    var texto =
                        '<div id="content">' +
                        '<div id="siteNotice">' +
                        '</div>' +
                        `<h1> ${datosjson[item].ciclo} </h1>` +
                        `<h2> ${datosjson[item].tipo} </h2>` +
                        '<div id="bodyContent">' +
                        `<p>En ${datosjson[item].pais}<br> ${datosjson[item].ciudad} ` +
                        '</div>' +
                        '</div>';

                    var ubicacion = new google.maps.LatLng(datosjson[item].X, datosjson[item].Y);
                    generarMarcadores(ubicacion, texto);
                }

            }
        }
        
        if (estadoDelCheck && inputCiclo === "Todos" && checked) {
            for (var item in datosjson) {
                if (textoSpan === datosjson[item].pais) {
                    var texto =
                        '<div id="content">' +
                        '<div id="siteNotice">' +
                        '</div>' +
                        `<h1> ${datosjson[item].ciclo} </h1>` +
                        `<h2> ${datosjson[item].tipo} </h2>` +
                        '<div id="bodyContent">' +
                        `<p>En ${datosjson[item].pais}<br> ${datosjson[item].ciudad} ` +
                        '</div>' +
                        '</div>';

                    var ubicacion = new google.maps.LatLng(datosjson[item].X, datosjson[item].Y);
                    generarMarcadores(ubicacion, texto);
                }

            }
        }
    }
}

/* Crear marca en el mapa */
function generarMarcadores(posicion, html) {

    myMap()
    var nuevomarcador = new google.maps.Marker({
        position: posicion,
        map: map,
        title: html,
        animation: google.maps.Animation.BOUNCE,
    });

    nuevomarcador['infowindow'] = new google.maps.InfoWindow({
        content: html
    });

    google.maps.event.addListener(nuevomarcador, 'click', function () {

        this['infowindow'].open(map, this);

    });

    marcador.push(nuevomarcador);
}

