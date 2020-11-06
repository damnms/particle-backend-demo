/*********************************************************
* record microphone, write to serial
**********************************************************/
#include <stdio.h>

void apply_filter(double wave[]);
void ifSomeoneWasTalkingSendEvent();


void tabelle2();

 

#define FILTER_COUNT 17
#define FILTER_MITTELWERT FILTER_COUNT/2
double filter_value[] = {-0.06871842412524538,
0.030806641388861217,
0.04196636574643017,
0.0596784709979785,
0.08054585311515544,
0.1012312882292675,
0.11862582117408683,
0.13018226286688447,
0.13422859623430416,
0.13018226286688447,
0.11862582117408683,
0.1012312882292675,
0.08054585311515544,
0.0596784709979785,
0.04196636574643017,
0.030806641388861217,
-0.06871842412524538};
const int microphone = A0;



const int buttonPin = D5;
const int ledPin = D7;
const int recLength = 4096; // 2 hoch 13, 250 ms
const int abtastrate = recLength;
double wave[recLength];
unsigned long startTime;
unsigned long deltaTime;

 

int speaking = 0;


void setup() {
// A0: INPUT is the default pin mode. No config required
    pinMode(buttonPin, INPUT_PULLUP);
    pinMode(ledPin, OUTPUT);
    Particle.variable("speaking", speaking);
    Serial.begin(9600);
}


void tabelle2() {
    int summe = 0;
    double min = wave[0];
    double max = wave[0];
    for (int i = 0; i < recLength; i++) {
        summe = summe + wave[i];
        if (wave[i] < min) {
            min = wave[i];
        }
        if (wave[i] > max) {
            max = wave[i];
        }
    }
    double mittelwert = summe / recLength;
    double delta = (max - min) / 2;
    
    for (int i = 0; i < recLength; i++) {
        wave[i] = (wave[i] - mittelwert) / delta;
    }
}

 
void apply_filter() {
    int start = FILTER_MITTELWERT;
    double filtered_value = 0;
    
    for (int i = 0; i < FILTER_COUNT; i++) { 
        filtered_value = 0;
        if (i < FILTER_MITTELWERT + 1) continue;
        for (int f = FILTER_MITTELWERT + 1; f < FILTER_COUNT; f++) {
            filtered_value = filtered_value + wave[i] * filter_value[f];
        }
        for (int f = FILTER_MITTELWERT; f > 0; f--) {
            filtered_value = filtered_value + wave[i] * filter_value[f];
        }
        wave[i] = filtered_value;
    }
}

void loop() {
    
    int tmp = 0;
    
    for (int i = 0; i < recLength; i++) {
        tmp = analogRead(microphone);
        if (tmp < 900) {
            i--;
            continue;
        }
        wave[i] = tmp;
    }
    
    tabelle2();
    apply_filter();
    
    ifSomeoneWasTalkingSendEvent();
    delay(250);

}


void ifSomeoneWasTalkingSendEvent() {
    
    double x = 0;
    double sum = 0;
    
    //we send the speaking event and return if someone talks
    //if no one talks, we already know that if someone was talking before, we send the stopped speaking event!
    for(int i = 0; i < recLength; i++) {
        x = (wave[i]);
        if(x < 0) x = x * -1;
        sum += x;
    }
    
    double mean = sum / recLength; 
    
    
    if(speaking == 0) {
        if(mean > 0.23) {
            Particle.publish("speaking", "true");
            speaking = 1;
            delay(750);
            return;
        }
    } 
    
    
    if(speaking == 1) {
        speaking = 0;
        Particle.publish("speaking", "false");
        delay(750);
    }
    
    
}
