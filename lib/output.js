const Gpio = require('./gpio');
const d = require('debug')('gpio-artnet-node:output');

class Output {
    constructor(config) {
        this.config = config;
        this.gpio = new Gpio(config.port, {
            mode: Gpio.OUTPUT
        });
    }

    write(value) {
        if (this.config.pwm) {
            value = Math.min(255, Math.max(0, value));
            d(`Writing ${value} to ${this.config.port}`);
            this.gpio.pwmWrite(value);
        }else {
            value = Math.min(1, Math.max(0, value));
            d(`Writing ${value} to ${this.config.port}`);
            this.gpio.digitalWrite(value);
        }
    }
}

module.exports = Output;
