const each = require('lodash.foreach');
const Output = require('./output');
const d = require('debug')('gpio-artnet-node:association');

class Association {
    constructor(config) {
        if (Array.isArray(config.dmx)) {
            this.inputs = config.dmx
        }else {
            this.inputs = [config.dmx];
        }
        this.outputs = [];
        if (!Array.isArray(config.gpio)) {
            config.gpio = [config.gpio];
        }
        each(config.gpio, gpio => {
            if (typeof gpio === 'number') {
                gpio = {
                    port: gpio,
                    pwm: true
                };
            }
            this.outputs.push(new Output(gpio));
        });
    }

    handle(dmx, value) {
        if (this.inputs.includes(dmx)) {
            d(`Setting Dmx Port ${dmx} to ${value}`);
            this.write(value);
        }
    }

    write(value) {
        each(this.outputs, output => {
            output.write(value);
        });
    }
}


module.exports = Association;
