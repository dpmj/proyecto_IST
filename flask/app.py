from flask import Flask, render_template, request, Response

app = Flask(__name__)

# Vector que almacena los usuarios que se han ido registrando
users = []


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/form_response", methods=["POST"])
def form_result():

    request_json = request.get_json()  # devuelve un tipo 'dict'
    users.append(request_json)  # Guardamos los datos en el vector

    # datos sacados por consola de Flask para demostrar que los tenemos
    print(f"\n\nNUEVO CLIENTE REGISTRADO:\n\n{request_json}\n\n")



    # Generar respuesta en el cliente
    return render_template("form_response.html", 
                           email=request_json["email"],
                           nombre=request_json["name"])


@app.after_request
def add_cors_headers(response):
    # Tras una request al servidor, enviar respuesta haciendo saber que el dominio acepta
    # peticiones. Esto se debe a una restricción de seguridad de los navegadores modernos,
    # evitando el error:
    # "Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote 
    # resource at X"

    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Headers', 'Cache-Control')
    response.headers.add('Access-Control-Allow-Headers', 'X-Requested-With')
    response.headers.add('Access-Control-Allow-Headers', 'Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST')
    
    return response
