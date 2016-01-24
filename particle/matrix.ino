#include "neopixel/neopixel.h"
#include "MQTT/MQTT.h"

#define PIXEL_PIN D2
#define PIXEL_TYPE WS2812B

uint16_t pixelCount = 0;
uint16_t matrixWidth = 0;
uint16_t matrixHeight = 0;
Adafruit_NeoPixel* strip = NULL;


MQTT client("m20.cloudmqtt.com", 19793, callback);

void setup() {
   
    client.connect("m20.cloudmqtt.com","toor", "2HLV3g2jNiB252o");
    
    if (client.isConnected()) {
        client.subscribe("command/configure");
        client.subscribe("command/setPixel");
        client.subscribe("command/setMatrix");
        client.subscribe("command/setSize");
        
        client.publish("/setup","");
    }
}

void loop() {
    if (client.isConnected())
        client.loop();
    delay(100);
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
    else if(String("command/setSize").equals(topic))
       setSize(message);
}

void setPixel(String &command){
    
    if(pixelCount == 0)
        return;
    
    int args[4];
    parseCommand(command, args);
    strip->setPixelColor(args[0], strip->Color(args[1],args[2],args[3]));
    client.publish("callback/setPixel", command);
}

void setMatrix(String &command){
    
    if(pixelCount == 0)
        return;
        
    int args[pixelCount*4];
    parseCommand(command, args);
    for(int n=0; n< sizeof(command); n+=4)
        strip->setPixelColor(args[n], strip->Color(args[n+1],args[n+2],args[n+3]));
    client.publish("callback/setMatrix", command);
}

void setSize(String &command){
    int args[2];
    parseCommand(command, args);
    
    if(matrixWidth == args[0] && matrixHeight == args[1])
        return;
    
    matrixWidth = args[0];
    matrixHeight = args[1];
    pixelCount = args[0]*args[1];
    
    strip = new Adafruit_NeoPixel(pixelCount, PIXEL_PIN, PIXEL_TYPE);
    
    strip->begin();
    strip->show();
    
    client.publish("callback/setSize", command);
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



