const { isMainThread, parentPort, workerData } = require('worker_threads');
const express = require('express');
const { MessageType } = require('./index');

if (isMainThread) {
    throw new Error('Worker file started from main process');
}

const state = {
    pigpio: false,
    artnet: {
        port: workerData.port,
        universe: workerData.universe
    },
    writes: []
};

parentPort.on('message', msg => {
    switch (msg.type) {
        case MessageType.PigpioAvailable:
            pigpioAvailable(msg.payload);
            break;
        case MessageType.ArtnetPacket:
            artnetPacket(msg.payload);
            break;
    }
});

function pigpioAvailable(available) {
    state.pigpio = available;
}

function artnetPacket({ peer, universe, data }) {
    const write = {
        timestamp: Date.now(),
        peer: peer.address,
        universe,
        data: [...data]
    };
    state.writes.push(write);
}

function isHealthy() {
    return state.pigpio;
}

function getLastWrite() {
    const amountOfWrites = state.writes.length;
    if (amountOfWrites === 0) {
        return null;
    }
    return state.writes[amountOfWrites - 1];
}

const app = express();

app.get('/health', (req, res) => {
    const healthy = isHealthy();
    const lastWrite = getLastWrite();

    res.status(200);
    res.json({
        healthy,
        lastWrite
    });
    res.end();
});

app.get('/health/config', (req, res) => {
    res.status(200);
    res.json({
        artnet: state.artnet
    });
    res.end();
});

app.get('/health/history', (req, res) => {
    res.status(200);
    res.json(state.writes);
    res.end();
});

app.listen(workerData.health, () => console.log(`Health Api listening on 0.0.0.0:${workerData.health}`));
