import time
import RPi.GPIO as GPIO

GPIO.setmode(GPIO.BCM)
GPIO.setup(21,GPIO.IN)
GPIO.setup(20,GPIO.OUT)

soilSensor = 21
relayPin = 20
interval = 1
wateringTime = 0.5

try:
    while True:
        if (GPIO.input(soilSensor))==1:
            print('Dry')
            print(GPIO.input(soilSensor))
            (GPIO.output(relayPin,True))
            time.sleep(interval)
            (GPIO.output(relayPin,False))
            time.sleep(.50)
            (GPIO.output(relayPin,True))

        time.sleep(1)
        

finally:
    GPIO.cleanup()
        