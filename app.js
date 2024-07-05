function encriptar (){
    const acentos = /[á,é,í,ó,ú,Á,É,Í,Ó,Ú]/;
    if (/[A-Z0-9]/.test(document.getElementById('input-texto').value)) {
        alert('Por favor, ingrese solo letras minúsculas.');
    }else{
        if (acentos.test(document.getElementById('input-texto').value)){
            alert('Por favor no ingrese palabras con acento.')
        }else{
            var texto = document.querySelector("#input-texto").value;
            var textoCifrado = texto.replace(/e/gi, "enter").replace(/i/gi, "imes").replace(/a/gi, "ai")
                            .replace(/o/gi, "ober").replace(/u/gi, "ufat");
            document.querySelector("#msg").value = textoCifrado;
            document.querySelector("#input-texto").value;
        }
    }
}
    
document.querySelector("#btn-encriptar").onclick = encriptar; 

//////////////////////////////////////////////////////
function desencriptar (){ 
    var texto = document.querySelector("#input-texto").value; 
    var textoCifrado = texto.replace(/enter/gi, "e").replace(/imes/gi, "i").replace(/ai/gi, "a")
                       .replace(/ober/gi, "o").replace(/ufat/gi, "u");
    document.querySelector("#msg").value = textoCifrado; 
    document.querySelector("#input-texto").value;
}

document.querySelector("#btn-desencriptar").onclick = desencriptar; 

////////////////////////////////////////////////////////
function copiarPegar (){
    document.getElementById('input-texto').value = '';
    document.getElementById('input-texto').value = document.getElementById('msg').value;
    document.getElementById('msg').value = '';
}

document.querySelector('#btn-copy').onclick = copiarPegar;