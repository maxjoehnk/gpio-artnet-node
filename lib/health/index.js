const { isMainThread, Worker } = require('worker_threads');
const { resolve } = require('path');

let worker;

function setup(config) {
    if (isMainThread) {
        startWorker(config);
    }
}

function emit(type, payload) {
    if (isMainThread && worker) {
        worker.postMessage({
            type,
            payload
        });
    }
}

function startWorker(config) {
    worker = new Worker(resolve(__dirname, './worker.js'), {
        workerData: config
    });
}

const MessageType = {
    ArtnetPacket: 0,
    PigpioAvailable: 1
};

module.exports = {
    setup,
    emit,
    MessageType
};