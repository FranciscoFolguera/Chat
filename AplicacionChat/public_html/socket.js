function showMessage(messageHTML) {
    $('#chat-box').append(messageHTML);
}

$(document).ready(function () {
    var websocket = new WebSocket("ws://" + host + ":8090/demo/php-socket.php");
    websocket.onopen = function (event) {
        showMessage("<div class='chat-connection-ack'>Connection is established!</div>");
    };
    websocket.onmessage = function (event) {
        var Data = JSON.parse(event.data);
        var div = document.createElement("div");
        var txt = document.createTextNode(Data.mensaje);
        div.setAttribute("class", Data.tipo_mensaje);
        div.appendChild(txt);
        var chat = document.getElementById("chat-box");
        chat.style.color="red";
        chat.appendChild(div);
          //showMessage(div);
          console.log(div);
//        console.log(Data);
//       
//        showMessage("<div class='" + Data.message_type + "'>Bieeeeeen" + Data.message + "</div>");

    };

    websocket.onerror = function (event) {
        showMessage("<div class='error'>Problem due to some Error</div>");
    };
    websocket.onclose = function (event) {
        showMessage("<div class='chat-connection-ack'>Connection Closed</div>");
    };

    $('#frmChat').on("submit", function (event) {
        
        event.preventDefault();
        $('#chat-user').attr("type", "hidden");
        var messageJSON = {
            chat_user: $('#chat-user').val(),
            chat_message: $('#chat-message').val()
        };
        websocket.send(JSON.stringify(messageJSON));
         $('#chat-message').val('');
    });
});
