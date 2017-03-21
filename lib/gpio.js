const d = require('debug')('gpio-artnet-node:gpio');
try {
    let { Gpio } = require('pigpio');
    module.exports = Gpio;
}catch (e) {
    d('pigpio is not available');
    class Gpio {
        constructor(port, options) {
            d('Creating Gpio Mock for Port', port);
            this._port = port;
            this._options = options;
        }

        pwmWrite(value) {
            d('PWM Write', this._port, value);
        }

        digitalWrite(value) {
            d('Digital Write', this._port, value);
        }
    }

    Gpio.OUTPUT = 'OUTPUT';
    module.exports = Gpio;
}
