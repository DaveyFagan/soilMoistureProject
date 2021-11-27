import RPi.GPIO as GPIO
import time
from sense_hat import SenseHat

sense = SenseHat()
sense.clear()
green = (0, 255, 0)
red = (255,0,0)
white = (255,255,255)

soilSensor = 21
GPIO.setmode(GPIO.BCM)
GPIO.setup(soilSensor, GPIO.IN)

try:
    while True:
        if (GPIO.input(soilSensor))==0:
            print("Wet - Plant has enough water")
            sense.clear(green)
            #sense.show_message("Plant has enough water!", text_colour = white, back_colour = green)
        elif (GPIO.input(soilSensor))==1:
            print("Dry - Plant needs water")
            sense.clear(red)
            #sense.show_message("Plant needs water!", text_colour = white, back_colour = red)
        time.sleep(.25)

finally:
    GPIO.cleanup()
