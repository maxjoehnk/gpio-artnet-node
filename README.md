# gpio-artnet-node

# Example
```javascript
{
  "port": 6454,
  "universe": 0,
  "ports": [
    {
      "dmx": 1,
      "gpio": 1
    },
    {
      "dmx": [2, 3],
      "gpio": 2
    },
    {
      "dmx": 4,
      "gpio": {
        "port": 3,
        "pwm": true
      }
    },
    {
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
