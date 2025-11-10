from flask import Flask, request, jsonify
from flask_mqtt import Mqtt
app = Flask(__name__)

# MQTT Configuration
app.config['MQTT_BROKER_URL'] = '192.168.80.22' # Change 
app.config['MQTT_BROKER_PORT'] = 1883
app.config['MQTT_KEEPALIVE'] = 60
app.config['MQTT_TLS_ENABLED'] = False


mqtt = Mqtt(app)

# Subscribe when connected
@mqtt.on_connect()
def handle_connect(client, userdata, flags, rc):
    print('✅ Connected to MQTT broker')
    mqtt.subscribe('lines/+/+')  # subscribe to your topic

# Handle received messages
@mqtt.on_message()
def handle_mqtt_message(client, userdata, message):
    topic = message.topic
    payload = message.payload.decode()
    print(f"📩 Received on {topic}: {payload}")

    # Example: store or process it
    # data = json.loads(payload)
    # ... process data, save to DB, etc.
    # mqtt.publish(topic, msg)

@app.route("/display", methods=["POST"])
def display_message():
    data = request.get_json()
    message = data.get("message", "")
    if message:
        mqtt.publish("lcd/display", message)
        return jsonify({"status": "Message sent to LCD"}), 200
    else:
        return jsonify({"error": "No message provided"}), 400
@app.route('/data', methods=['POST'])
def receive_data():
    try:
        data = request.get_json()
        velocidad = data.get("velocidad")  # km/h
        distancia = data.get("distancia_restante")  # km

        if velocidad is None or distancia is None:
            return jsonify({"error": "Faltan datos"}), 400
        if velocidad <= 0:
            return jsonify({"error": "Velocidad debe ser mayor a 0"}), 400

        # Calcular tiempo estimado en horas y convertir a minutos
        tiempo_llegada_horas = distancia / velocidad
        tiempo_llegada_min = tiempo_llegada_horas * 60

        return jsonify({
            "distancia_km": round(distancia, 2),
            "tiempo_llegada_min": round(tiempo_llegada_min, 2)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 400


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

