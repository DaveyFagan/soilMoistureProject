import paho.mqtt.client as mqtt
from urllib.parse import urlparse
import sys
import time
from sense_hat import SenseHat
import logging
from dotenv import dotenv_values
import RPi.GPIO as GPIO

#Initialise SenseHAT
sense = SenseHat()
sense.clear()

green = (0, 255, 0)
red = (255,0,0)
white = (255,255,255)
soilSensor = 21
GPIO.setmode(GPIO.BCM)
GPIO.setup(soilSensor, GPIO.IN)

#load MQTT configuration values from .env file
config = dotenv_values(".env")

#configure Logging
logging.basicConfig(level=logging.INFO)

# Define event callbacks for MQTT
def on_connect(client, userdata, flags, rc):
    logging.info("Connection Result: " + str(rc))

def on_publish(client, obj, mid):
    logging.info("Message Sent ID: " + str(mid))

mqttc = mqtt.Client(client_id=config["clientId"])

# Assign event callbacks
mqttc.on_connect = on_connect
mqttc.on_publish = on_publish

# parse mqtt url for connection details
url_str = sys.argv[1]
print(url_str)
url = urlparse(url_str)
base_topic = url.path[1:]

# Configure MQTT client with user name and password
mqttc.username_pw_set(config["username"], config["password"])
# Load CA certificate for Transport Layer Security
mqttc.tls_set("./broker.thingspeak.crt")

#Connect to MQTT Broker
mqttc.connect(url.hostname, url.port)
mqttc.loop_start()

#Set Thingspeak Channel to publish to
topic = "channels/"+config["channelId"]+"/publish"

def soilMoistureGraphValue():
    while True:
        if (GPIO.input(soilSensor))==0:
            return 2
        elif (GPIO.input(soilSensor))==1:
            return -2
        time.sleep(.25)

# Publish a message to temp every 15 seconds
while True:

    try:
        temp=round(sense.temperature,2)
        pressure=round(sense.pressure,2)
        humidity=round(sense.humidity,2)
        soilMoisture=soilMoistureGraphValue()

        payload=f"field1={temp}&field2={humidity}&field3={pressure}&field4={soilMoisture}"
        mqttc.publish(topic, payload)
        time.sleep(int(config["transmissionInterval"]))
    except:
        logging.info('Interrupted')
        sys.exit(0)




        