function showMessage(messageHTML) {
    $('#chat-box').append(messageHTML);
}

$(document).ready(function () {
    var websocket = new WebSocket("ws://" + host + ":8090/demo/php-socket.php");
    websocket.onopen = function (event) {
        var div = document.createElement("div");
        var txt = document.createTextNode("Se ha conecntado al chat");
        div.setAttribute("class", "conexion");
        //append
        div.appendChild(txt);
        var chat = document.getElementById("chat-box");
        chat.appendChild(div);
    };
    websocket.onmessage = function (event) {
        var Data = JSON.parse(event.data);
        console.log(Data);
        var div = document.createElement("div");
        var span = document.createElement("span");
        span.setAttribute("class", "nombre");

        var nombre = document.createTextNode(Data.usuario + ": ");
        span.appendChild(nombre);
        var txt = document.createTextNode(Data.mensaje);
        div.setAttribute("class", Data.tipo_mensaje);
        div.appendChild(span);
        div.appendChild(txt);
        
        var chat = document.getElementById("chat-box");
        chat.appendChild(div);


    };

    websocket.onerror = function (event) {
        
        
        var clase="error";
        var err="Error inesperado";
        createDivErr(clase,err);
    };
    websocket.onclose = function (event) {
        var clase="desconexion";
        var err="Conexión cerrada";
        createDivErr(clase,err);
    };

    $('#frmChat').on("submit", function (event) {
        event.preventDefault();
        $('#chat-user').attr("type", "hidden");
        //   $('#ayudaNombre').attr("type", "hidden");

        var messageJSON = {
            chat_user: $('#chat-user').val(),
            chat_message: $('#chat-message').val()
        };
        websocket.send(JSON.stringify(messageJSON));
        $('#chat-message').val('');
    });
});
function createDivErr(clase,err) {
    var div = document.createElement("div");
  
    var txt = document.createTextNode(err);
    div.setAttribute("class",clase);
   
    var chat = document.getElementById("chat-box");
    
    chat.appendChild(div);
}