const { Server } = require('artnet-node');
const { stat, readFile, writeFile } = require('fs');
const each = require('lodash.foreach');
const get = require('lodash.get');
const program = require('commander');
const d = require('debug')('gpio-artnet-node');
const package = require('../package.json');
const Association = require('./association');

let server;
let associations = [];

program
    .version(package.version)
    .option('--config <file>', 'Config path')
    .parse(process.argv);

init();

function loadFile(path) {
    d('Loading File', path);
    return new Promise((resolve, reject) => {
        stat(path, (err, stats) => {
            if (err) {
                console.warn(err);
                return reject(err);
            }
            if (stats.isFile()) {
                readFile(path, 'utf8', (err, data) => {
                    try {
                        d('Parsing File Content');
                        let config = JSON.parse(data);
                        d('File loaded');
                        return resolve(config);
                    }catch (ex) {
                        console.error(ex);
                        return reject(ex);
                    }
                });
            }else {
                return reject();
            }
        });
    });
}

function setupPorts(config) {
    if (config.ports) {
        each(config.ports, association => {
            associations.push(new Association(association));
        });
    }
    return config;
}

function init() {
    loadFile(program.config || 'config.json')
        .then(setupPorts)
        .then(config => {
            d('listening on port', config.port)
            server = Server.listen(config.port, (data, peer) => {
                d('Incoming Message from peer', peer.address);
                handleMessage(data, config);
            });
        })
        .catch(err => {
            console.error(err);
            process.exit(1)
        });
}

function handleMessage(msg, config) {
    if (msg.universe === config.universe) {
        for (let i = 0; i < msg.data.length; i++) {
            let value = msg.data.readUInt8(i);
            each(associations, association => association.handle(i + 1, value));
        }
    }
}
