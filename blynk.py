import BlynkLib
from dotenv import dotenv_values
from sense_hat import SenseHat
import time
import RPi.GPIO as GPIO

#load configuration values from .env file
config = dotenv_values(".env")

BLYNK_AUTH = config["blynkAuthToken"]
# initialize Blynk
blynk = BlynkLib.Blynk(BLYNK_AUTH)

#initialise SenseHAT
sense = SenseHat()
sense.clear()

relayPin = 20
GPIO.setmode(GPIO.BCM)
GPIO.setup(20,GPIO.OUT)

# register handler for virtual pin V1 write event
@blynk.on("V0")
def v3_write_handler(value):
    buttonValue=value[0]
    print(f'Current button value: {buttonValue}')
    if buttonValue=="1":
        (GPIO.output(relayPin,False))
    else:
        sense.clear()
        (GPIO.output(relayPin,True))


@blynk.on("V5")
def v4_write_handler(value):
    buttonValue=value[0]
    print(f'Current button value: {buttonValue}')
    if buttonValue=="1":
        (GPIO.output(relayPin,False))
        time.sleep(0.25)
        (GPIO.output(relayPin,True))
        buttonValue=="0"


soilSensor = 21
GPIO.setup(soilSensor, GPIO.IN)

#tmr_start_time = time.time()
# infinite loop that waits for event
while True:
    blynk.run()
    blynk.virtual_write(1, round(sense.temperature,2))
    blynk.virtual_write(2, round(sense.humidity,2))
    blynk.virtual_write(3, round(sense.pressure,2))
    if (GPIO.input(soilSensor))==0:
            print("Wet")
            blynk.virtual_write(4, "Wet")
    elif (GPIO.input(soilSensor))==1:
            print("Dry")
            blynk.virtual_write(4, "Dry")
        
    time.sleep(1)