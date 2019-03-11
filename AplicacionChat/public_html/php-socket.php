<?php

set_time_limit(0);
define('HOST_NAME', "localhost");
define('PORT', "8090");
$null = NULL;

require_once("class.chathandler.php");
$chatHandler = new ChatHandler();

//Crea el socket servidor
$socketResource = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
//Se puede reutilizar la ip local
socket_set_option($socketResource, SOL_SOCKET, SO_REUSEADDR, 1);

socket_bind($socketResource, 0, PORT);
socket_listen($socketResource);

//Hace un array donde se van a guardar los sockets
//El primer socket del array es el del servidor
//Cada vez que se establezca una conexión se introducirá el socket correspondiente
//en este array
$clientSocketArray = array($socketResource);
while (true) {
    //Crea una copia del array de sockets
    $newSocketArray = $clientSocketArray;
    //Checkea a ver si ha cambiado algún socket
    socket_select($newSocketArray, $null, $null, 0, 10);

    if (in_array($socketResource, $newSocketArray)) {
        //Acepta una conexión del socket servidor y devuelve un socket con esa conexión
        $newSocket = socket_accept($socketResource);
        //Mete el socket nuevo en el array de sockets de clientes
        $clientSocketArray[] = $newSocket;

        //Lee 1024 bytes de la petición del cliente para coger la cabecera
        $header = socket_read($newSocket, 1024);
        
        //Escribe el apretón de manos en el nuevo socket
        $chatHandler->doHandshake($header, $newSocket, HOST_NAME, PORT);
        
        //Le introduce un socket y devuelve en el segundo parámetro el host/puerto (podría devolver una ruta de sistema de archivos UNIX)
        socket_getpeername($newSocket, $client_ip_address);
        
        //Crea el mensaje de conexión nueva
        
        ////MIRAR AQUI, CON EL GETPEERNAME SE PUEDE COGER EL IP ADRESS
        //MIRAR EN SEND QUE EN EL FOR HAGA ESO Y SOLO MANDE UN MENSAJE CUANDO LA IP ADRESS SEA X
        $connectionACK = $chatHandler->newConnectionACK($client_ip_address);

        $chatHandler->send($connectionACK);

        $newSocketIndex = array_search($socketResource, $newSocketArray);
        unset($newSocketArray[$newSocketIndex]);
    }

    foreach ($newSocketArray as $newSocketArrayResource) {
        //socket_recv devuelve un número de bytes recibidos o false si da error
        //Solo sigue el loop si se ha recibido al menos un byte de información
        while (socket_recv($newSocketArrayResource, $socketData, 1024, 0) >= 1) {
            $socketMessage = $chatHandler->unseal($socketData);
            $messageObj = json_decode($socketMessage);

            $chat_box_message = $chatHandler->createChatBoxMessage($messageObj->chat_user, $messageObj->chat_message);
            $chatHandler->send($chat_box_message);
            //Brake 2 saca la ejecución del while y del for
            break 2;
        }

        $socketData = @socket_read($newSocketArrayResource, 1024, PHP_NORMAL_READ);
        
        //Si se ha desconectado
        if ($socketData === false) {
            socket_getpeername($newSocketArrayResource, $client_ip_address);
            $connectionACK = $chatHandler->connectionDisconnectACK($client_ip_address);
            $chatHandler->send($connectionACK);
            $newSocketIndex = array_search($newSocketArrayResource, $clientSocketArray);
            unset($clientSocketArray[$newSocketIndex]);
        }
    }
}
socket_close($socketResource);
