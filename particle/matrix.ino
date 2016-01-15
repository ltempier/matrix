#include "MQTT/MQTT.h"
#include "neopixel/neopixel.h"

#define PIXEL_PIN D2
#define PIXEL_TYPE WS2812B

uint16_t MATRIX_WIDTH = 40;
uint16_t MATRIX_HEIGHT = 40;

Adafruit_NeoPixel strip = Adafruit_NeoPixel(MATRIX_HEIGHT*MATRIX_HEIGHT, PIXEL_PIN, PIXEL_TYPE);
MQTT client("m20.cloudmqtt.com", 19793, callback);

void setup() {
    strip.begin();
    strip.show();

    client.connect("m20.cloudmqtt.com","toor", "2HLV3g2jNiB252o");
    if (client.isConnected()) {
        client.subscribe("command/configure");
        client.subscribe("command/setPixel");
        client.subscribe("command/setMatrix");
    }
}

void loop() {
    if (client.isConnected())
        client.loop();
    delay(1000);
}

void callback(char* topic, byte* payload, unsigned int length) {
    char p[length + 1];
    memcpy(p, payload, length);
    p[length] = NULL;
    String message(p);

    if(String("command/setPixel").equals(topic))
        setPixel(message);
    else if(String("command/setMatrix").equals(topic))
        setMatrix(message);
}

void setPixel(String &command){
    int args[4];
    parseCommand(command, args);
    strip.setPixelColor(args[0], strip.Color(args[1],args[2],args[3]));
}

void setMatrix(String &command){
    int args[MATRIX_WIDTH*MATRIX_HEIGHT*3];
    parseCommand(command, args);
    for(int i=0; i< sizeof(args); i+=3)
        strip.setPixelColor(i/3, strip.Color(args[i],args[i+1],args[i+2]));
}

void configure(String &command){
    int args[2];
    parseCommand(command, args);
}

void parseCommand(String &command, int* args){
    int numArgs = 0;
    int beginIdx = 0;
    int idx = command.indexOf(",");
    while (idx != -1 && numArgs < sizeof(args)){
        String arg = command.substring(beginIdx, idx);
        if(arg.length() > 0)
            args[numArgs++] = arg.toInt();
        beginIdx = idx + 1;
        idx = command.indexOf(",", beginIdx);
    }
    String lastArg = command.substring(beginIdx);
    if(lastArg.length() > 0)
            args[numArgs++] = lastArg.toInt();
}