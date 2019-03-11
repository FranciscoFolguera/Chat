
function dniCuentaOK() {

    if (cuentaOK() == true && dniOK() == true) {
        return true;
    } else {
        return false;
    }
}

//COMPROBAR NUMERO DE CUENTA
function cuentaOK() {
    //varibles var suma = 0;
    var ultimoNum = 0;
    var resto = 0;
    var ok = false;
    var suma = 0;
    var errorCu = document.getElementById("errCuenta");
    //obtener nCuenta
    var nCuenta = document.getElementById("cuenta").value;
    //suma 9 numeros
    for (var i = 0; i < nCuenta.length - 1; i++) {
        suma += parseInt(nCuenta[i]);
    }
    //preparacion
    ultimoNum = nCuenta[nCuenta.length - 1];
    resto = suma % 9;
    if (ultimoNum == resto && nCuenta.length == 10) {
        ok = true;

    } else {
        ok = false;
        errorCu.style.visibility = "visible";
        setTimeout(
                function () {
                    errorCu.style.visibility = "hidden";
                }
        , 2000);
    }
    return ok;
}

//COMPROBAR DNI
function dniOK() {
    //variables
    var dni = document.getElementById("dn1").value;
    var errorDn1 = document.getElementById("errDn1");
    var letras = Array("T", "R", "W", "A", "G", "M", "Y", "F", "P", "D", "X", "B", "N", "J", "Z", "S", "Q", "V", "H", "L", "C", "K", "E");
    var expreg = /\d{8}([A-Z]||[a-z]){1}/g;
    var ok = false;

    if (expreg.exec(dni)) {
        //coge numero de dni
        var numeroDni = dni.substring(0, 8);
        //resto entre 23
        var resto = numeroDni % 23;
        //letra correspondiente al resto
        var letra = letras[resto];
        //letra del final
        var letrafin = dni.substr(8, 1);
        //convertir a mayuscula
        letrafin = letrafin.toUpperCase();
        //comprobar que letra fin es igual a letra resultado de arrayLetra y posicion resto
        if (letrafin === letra) {
            ok = true;
        } else {
            ok = false;
            errorDn1.style.visibility = "visible";
            setTimeout(
                    function () {
                        errorDn1.style.visibility = "hidden";
                    }
            , 2000);
        }
    } else {
        ok = false;
        errorDn1.style.visibility = "visible";
        setTimeout(
                function () {
                    errorDn1.style.visibility = "hidden";
                }
        , 2000);
    }
    return ok;
}

