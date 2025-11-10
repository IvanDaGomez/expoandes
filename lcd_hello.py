import json, os, time, requests, paho.mqtt.client as mqtt

try:
    from RPLCD.i2c import CharLCD
    lcd = CharLCD("PCF8574", 0x3f, port=0, cols=16, rows=2)
except Exception:
    lcd = None
    print("⚠️ LCD not found, running in console mode")

lcd.write_string("LCD Initialized")
LOCAL_BROKER = os.getenv("LOCAL_BROKER", "localhost")
FORWARD_BROKER = os.getenv("FORWARD_BROKER", "192.168.80.22")
BACKEND_URL = os.getenv("BACKEND_URL", "http://192.168.80.22:5000/lines/data")


def on_connect(client, _, __, rc):
    print(f"✅ Connected ({rc})")
    client.subscribe("lines/+/+")
    client.subscribe("lcd/display")

def handle_line(topic, payload):
    try:
        data = json.loads(payload)
    except json.JSONDecodeError:
        print(f"[!] Bad JSON: {payload}")
        return
    start, end = data.get("start"), data.get("end")
    train, line = data.get("ID", "?"), data.get("trainID", "?")
    diff  = (end - start) / 1000 if (start and end) else 0
    # mosquitto_pub -h localhost -t "lcd/display" -m "Hello ExpoAndes!"
    # mosquitto_pub -h localhost -t "lines/test/esp32" -m '{"ID":"T01","trainID":"A","start":1000,"end":4000}'

    print(f"{train} on {line} — Duration {diff:.2f}s")
    forward.publish(f"processed/lines/{train}/data", json.dumps(data))
    # try:
    #     requests.post(BACKEND_URL, json=data, timeout=3)
    # except Exception as e:
    #     print(f"[!] Backend error: {e}")

def print_on_lcd(message):
    if lcd:
        lcd.clear()
        lcd.write_string(message[:16])
        if len(message) > 16:
            lcd.crlf()
            lcd.write_string(message[16:32])
    else:
        print(f"[LCD] {message}")

def on_message(client, _, msg):
    topic, payload = msg.topic, msg.payload.decode()
    if topic.startswith("lines/"): handle_line(topic, payload)
    elif topic == "lcd/display": print_on_lcd(payload)
    else: print(f"[?] {topic}: {payload}")

client = mqtt.Client(client_id="pi_listener")
forward = mqtt.Client(client_id="pi_forwarder")

client.on_connect, client.on_message = on_connect, on_message

try:
    client.connect(LOCAL_BROKER)
    forward.connect(FORWARD_BROKER)
    client.loop_start()
    forward.loop_start()
    print("🚀 Listening... Ctrl+C to exit")
    while True: time.sleep(1)
except KeyboardInterrupt:
    print("👋 Stopping...")
finally:
    if lcd: lcd.clear()
    client.loop_stop(); forward.loop_stop()
