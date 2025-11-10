#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

#define HALL_SENSOR_PIN  3  // change per board
#define DEVICE_ID "esp1"     // for the other ESP use "esp2"
#define MAGNET_COUNT 2
#define TRAIN_ID "J70"
const char *ssid = "FAMILIA-BAUTISTA-5G";
const char *password = "14020904";
const char *mqtt_server = "192.168.80.22";

WiFiClient espClient;
PubSubClient client(espClient);
StaticJsonDocument<200> data;

volatile bool prevStatus = false;
volatile unsigned long count = 0;
volatile unsigned long startTime = 0;



void setup_wifi() {
  Serial.print("Connecting to WiFi ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n✅ WiFi connected!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("🔄 Connecting to MQTT...");
    if (client.connect(DEVICE_ID)) {
      Serial.println("✅ connected");
    } else {
      Serial.print("❌ failed, rc=");
      Serial.print(client.state());
      Serial.println(" → retrying in 5s");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(HALL_SENSOR_PIN, INPUT);
  //setup_wifi();
  //client.setServer(mqtt_server, 1883);
}

void loop() {
  //if (!client.connected()) reconnect();
  //client.loop();
  int magnetValue = abs(digitalRead(HALL_SENSOR_PIN) - 1);
  
  if (magnetValue && !prevStatus) {
    if (count == 0) {
      startTime = millis();
    }
    prevStatus = true;
    count++;
  }
  else if (!magnetValue && prevStatus) {
    prevStatus = false;
    
  }
  Serial.printf("Magnet status: %d, prevStatus: %d, count: %d\n", magnetValue, prevStatus, count);
  if (MAGNET_COUNT == count) {
    count = 0;

    data.clear();
    data["ID"] = DEVICE_ID;
    data["trainID"] = TRAIN_ID;
    data["start"] = startTime;
    data["end"] = millis();
    char buffer[100];
    serializeJson(data, buffer);
    client.publish("home/sensors/data", buffer);
    Serial.print("📤 Sent: ");
    Serial.println(buffer);
  }

  delay(10);
}
