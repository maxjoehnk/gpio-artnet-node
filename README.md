# gpio-artnet-node

# Example
```javascript
{
  "port": 6454, // Port to run Artnet Node on
  "universe": 0, // Artnet Universe to run on
  "ports": [
    { // Map GPIO Port 1 to DMX Address 1, PWM enabled
      "dmx": 1,
      "gpio": 1
    },
    { // Map GPIO Port 2 to DMX Addresses 2 and 3, PWM enabled
      "dmx": [2, 3],
      "gpio": 2
    },
    { // Map GPIO Port 3 to DMX Address 4, PWM enabled
      "dmx": 4,
      "gpio": {
        "port": 3,
        "pwm": true
      }
    },
    { // Map GPIO Port 4 with PWM and 5 and 6 without PWM to DMX Address 5
      "dmx": 5,
      "gpio": [
        4,
        {
          "port": 5,
          "pwm": false
        },
        {
          "port": 6
        }
      ]
    }
  ]
}  
```
