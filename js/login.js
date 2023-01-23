
var attempt = 3;

function logIn(){
    var usuario_con_espacios=document.getElementById("usuario").value;// variable introducida como usuario en la pantalla html
    usuario = usuario_con_espacios.trim(); // quita los espacios por si el usuario es introducido correctamente pero con espacios al principio o al final
    //console.log(usuario);
    var password=document.getElementById("password").value;// variable introducida como contraseña en la pantalla html

    var usuarios = [//objeto json para almacenar usuario y contraseña emparejados
        {
            user:"Juan",
            pass:"00000000"
        },
        {
            user:"Amparo",
            pass:"11111111"
        },
        {
            user:"Alejandro",
            pass:"22222222"
        },
        {
            user:"David",
            pass:"33333333"
        },
        {
            user:"Francisco",
            pass:"44444444"
        }
    ]

    var j= 0;
        if(password.length < 8){// comprueba que la contraseña contenga minimo 8 caracteres
            attempt --;
            alert ("Minimun length for the password is 8 characters, you have left "+attempt+" attenmpt");
            
            if( attempt == 0){//comprueba que queden intentos
                document.getElementById("usuario").disabled = true;
                document.getElementById("password").disabled = true;
                document.getElementById("boton").disabled = true;       
        }
            return false;
        }else{
                for(var i = 0; i < usuarios.length; i++){//bucle para comprobar que la contraseña y el usuario concuerdan
                    if(usuario==usuarios[i].user && password==usuarios[i].pass){
                        alert ("Login successfully");
                        window.location="index.html";
                        return false;
                }else{
                    attempt --;
                    alert("You have left "+attempt+" attempt;");
                        if( attempt == 0){//comprueba que queden intentos
                            document.getElementById("usuario").disabled = true;
                            document.getElementById("password").disabled = true;
                            document.getElementById("boton").disabled = true;
                            
                    }
                    return false;
                }
            }
        }  
}

function mostrar(){
    var tipo = document.getElementById("password");

    if(tipo.type == "password"){
        tipo.type = "text";
    }else{
        tipo.type = "password";
    }
}