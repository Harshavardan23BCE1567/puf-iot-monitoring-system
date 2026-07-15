// ======================================================================
// FINAL PUF RING OSCILLATOR DEMO - Muthuram's Project
// Using GPIO4 (D4) for analog input from ring oscillator
// LED on GPIO2, Buzzer on GPIO5
// ======================================================================

#define ADC_PIN       15       
#define LED_PIN       2       // Your red LED (with 10k resistor - dim but works)
#define BUZZER_PIN    4       // Your active buzzer

#define NUM_SAMPLES   1000    // More samples = better uniqueness
#define HIGH_THRESHOLD 180    // Tune based on your max (~350-370)

void setup() {
  Serial.begin(115200);
  delay(1500);  // Give time for serial monitor to open
  Serial.println("\n=====================================");
  Serial.println("   PUF RING OSCILLATOR - FINAL DEMO   ");
  Serial.println("   Muthuram - Low-Cost Hardware PUF   ");
  Serial.println("=====================================\n");

  pinMode(LED_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);
  noTone(BUZZER_PIN);

  // Quick startup beep & flash to confirm hardware
  tone(BUZZER_PIN, 1200, 200);
  digitalWrite(LED_PIN, HIGH);
  delay(300);
  digitalWrite(LED_PIN, LOW);
  delay(1000);
}

void loop() {
  long totalSum = 0;
  int highCount = 0;

  // Fast sampling of the oscillator
  for (int i = 0; i < NUM_SAMPLES; i++) {
    int val = analogRead(ADC_PIN);
    totalSum += val;
    if (val > HIGH_THRESHOLD) highCount++;
    delayMicroseconds(6);   // Fast sampling - adjust if needed (4-10 µs)
  }

  // Create simple unique key
  long rawKey = totalSum + (highCount * 15LL);  // Weighted sum
  String pufKey = String(rawKey, HEX);          // Convert to hex
  pufKey.toUpperCase();
  if (pufKey.length() > 8) pufKey = pufKey.substring(0, 8);  // Short 32-bit key

  float avg = (float)totalSum / NUM_SAMPLES;
  float highPct = (float)highCount / NUM_SAMPLES * 100.0;

  // Print results
  Serial.print("Samples: ");
  Serial.print(NUM_SAMPLES);
  Serial.print(" | Avg: ");
  Serial.print(avg, 1);
  Serial.print(" | High%: ");
  Serial.print(highPct, 1);
  Serial.print("% | PUF Key (hex): 0x");
  Serial.println(pufKey);

  // Feedback: Good key → nice pattern (3 beeps + blinks)
  if (highPct > 35 && highPct < 50) {   // Your observed stable range
    Serial.println("→ GOOD KEY DETECTED - AUTHENTIC DEVICE");
    for (int i = 0; i < 3; i++) {
      tone(BUZZER_PIN, 1800 + i*300, 150);  // Rising tone
      digitalWrite(LED_PIN, HIGH);
      delay(180);
      digitalWrite(LED_PIN, LOW);
      delay(80);
    }
  } 
  // Bad/unstable → short low tone
  else {
    Serial.println("→ UNSTABLE READING (retry power cycle)");
    tone(BUZZER_PIN, 400, 600);
    digitalWrite(LED_PIN, HIGH);
    delay(600);
    digitalWrite(LED_PIN, LOW);
  }

  delay(3000);  // Wait 3 seconds before next measurement
}