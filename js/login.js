
function logIn(){
    var usuario=document.getElementById("usuario").value;
    var password=document.getElementById("password").value;

    var usuarios = [
        {
            user:"Juan",
            pass:"0000"
        },
        {
            user:"Amparo",
            pass:"1111"
        },
        {
            user:"Alejandro",
            pass:"2222"
        },
        {
            user:"David",
            pass:"3333"
        },
        {
            user:"Francisco",
            pass:"4444"
        }
    ]
    var j= 0;
    for(var i = 0; i < usuarios.length; i++){
        if(usuario==usuarios[i].user && password==usuarios[i].pass){
            window.location="index.html";
            
    }

}
    
}

