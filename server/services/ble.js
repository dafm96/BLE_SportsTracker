//TEST REBASE TO PI

var noble = require('noble');
//change min and max in leconn located in /node_modules/noble/lib/hci-socket/hci.js
var rawToAi = require('./rawToAi')
var fs = require('fs')

var fullList = []
var peripherals = [];
var whitelist = ['0C:B2:B7:39:97:B0',
    '20:C3:8F:D1:07:38',
    '20:C3:8F:D1:0B:20',
    '0C:B2:B7:39:99:7C',
    '0C:B2:B7:39:99:56',
    '0C:B2:B7:39:99:26',
    '0C:B2:B7:39:92:EA',
    '0C:B2:B7:39:99:13',
    '0C:B2:B7:39:9A:80',
    // '0C:B2:B7:39:99:65',
    '0C:B2:B7:39:9D:5D'
]

function bufferToByteArray(buffer) {
    return Array.prototype.slice.call(buffer, 0)
}

function getPeripherals() {
    return fullList;
}

function getPeripheral(peripheralAddress) {
    let peripheral = fullList.find(p => p.address === peripheralAddress);
    let activityTime = rawToAi.getActivityTime(peripheralAddress);

    return { peripheral, activityTime };
}

function MPUConfig(peripheralAddress) {
    let peripheral = peripherals.find(p => p.address === peripheralAddress)
    if (peripheral) {
        peripheral.discoverSomeServicesAndCharacteristics(['ff30'], ['ff3c'], function (error, services, characteristics) {
            var MPUCharacteristic = characteristics.find(c => c.uuid == 'ff3c');
            MPUCharacteristic.write(new Buffer([0x07, 0x00, 0x00, 0x08, 0x03, 0x03, 0x10]), true, function (error) {
                if (error) {
                    console.log(error)
                } else {
                    console.log('Changed MPU config')
                }
            })
        })
    }
}

function changeRate(peripheralAddress, rateMs) {
    let peripheral = peripherals.find(p => p.address === peripheralAddress)
    if (peripheral) {
        peripheral.discoverSomeServicesAndCharacteristics(['ff30'], ['ff3b'], function (error, services, characteristics) {
            var RateCharacteristic = characteristics.find(c => c.uuid == 'ff3b');
            RateCharacteristic.write(new Buffer([rateMs]), true, function (error) {
                if (error) {
                    console.log(error)
                } else {
                    console.log('Changed rate to ' + rateMs + 'ms')
                }
            })
        })
    }
}

function startRaw(peripheralAddress) {
    let peripheral = peripherals.find(p => p.address === peripheralAddress)
    let rep = fullList.find((p => p.address === peripheralAddress))
    if (peripheral) {
        peripheral.discoverSomeServicesAndCharacteristics(['ff30'], ['ff35', 'ff38'], function (error, services, characteristics) {
            var SmartLifeService = services[0];
            var stateCharacteristic = characteristics.find(c => c.uuid == 'ff35');
            var rawCharacteristic = characteristics.find(c => c.uuid == 'ff38');

            stateCharacteristic.write(new Buffer([0x01]), true, function (error) {
                console.log('Started RAW');
                rep.startedRaw = true;

                rawCharacteristic.on('data', function (data, isNotification) {
                    let outputs = [];
                    let arr = Array.prototype.slice.call(data, 0)
                    let ratio_ACC = (4.0 / 32767); //originally 4.0
                    let ratio_GYR = (1000.0 / 32767);

                    let nSample = ((arr[1] & 0xFF) << 8 | arr[0] & 0xFF);
                    let accX = 0;
                    let accY = 0;
                    let accZ = 0;
                    let gyrX = 0;
                    let gyrY = 0;
                    let gyrZ = 0;


                    for (let i = 0; i < 9; i++) {
                        let mov = (arr[2 * i + 3] & 0xFF) << 8 | arr[2 * i + 2] & 0xFF;
                        if (mov > 32767) {
                            mov = -(65534 - mov);
                        }
                        if (i == 0) {
                            accX = mov;
                            accX *= ratio_ACC;
                        } else if (i == 1) {
                            accY = mov;
                            accY *= ratio_ACC;
                        } else if (i == 2) {
                            accZ = mov;
                            accZ *= ratio_ACC;
                        } else if (i == 3) {
                            gyrX = mov;
                            gyrX *= ratio_GYR;
                        } else if (i == 4) {
                            gyrY = mov;
                            gyrY *= ratio_GYR;
                        } else if (i == 5) {
                            gyrZ = mov;
                            gyrZ *= ratio_GYR;
                        }
                    }

                    // outputs[0] = nSample * 0.02;
                    // outputs[1] = accX * 9.8;
                    // outputs[2] = accY * 9.8;
                    // outputs[3] = accZ * 9.8;
                    // outputs[4] = gyrX * Math.PI / 180;
                    // outputs[5] = gyrY * Math.PI / 180;
                    // outputs[6] = gyrZ * Math.PI / 180;
                    // let s = "" + outputs;
                    // let ai = rawToAi.convertRawToActivity(peripheralAddress, [outputs[1], outputs[2], outputs[3]]);
                    // logger.write("" + s.replace(/,/gi, ';') + ";" + peripheralAddress + "\n");
                    // console.log(peripheral.address, "Raw: " + Array.prototype.slice.call(data, 0))
                    nSample = nSample * 0.02;
                    accX = accX * 9.8;
                    accY = accY * 9.8;
                    accZ = accZ * 9.8;
                    gyrX = gyrX * Math.PI / 180;
                    gyrY = gyrY * Math.PI / 180;
                    gyrZ = gyrZ * Math.PI / 180;
                    let sample = {
                        nSample,
                        accX,
                        accY,
                        accZ,
                        gyrX,
                        gyrY,
                        gyrZ
                    };
                    rep.rawData.push(sample);
                });
            });
        })
    }
}

function convertToCSV(arr) {
    const array = [Object.keys(arr[0])].concat(arr)

    return array.map(it => {
        return Object.values(it).toString()
    }).join('\n')
}

function idle(peripheralAddress) {
    let peripheral = peripherals.find(p => p.address === peripheralAddress)
    let rep = fullList.find((p => p.address === peripheralAddress))
    if (peripheral) {
        peripheral.discoverSomeServicesAndCharacteristics(['ff30'], ['ff35'], function (error, services, characteristics) {
            var SmartLifeService = services[0];
            var stateCharacteristic = characteristics.find(c => c.uuid == 'ff35');
            stateCharacteristic.write(new Buffer([0x00]), true, function (error) {
                console.log('Stopped RAW');
                rep.startedRaw = false;
                let filename = 'log_' + new Date().toISOString().slice(0, 19) + '_' + rep.address + '.csv';
                var logger = fs.createWriteStream('./logs/' + filename, {
                    flags: 'a' // 'a' means appending (old data will be preserved)
                })
                //console.log(convertToCSV(rep.rawData))
                logger.write("" + convertToCSV(rep.rawData).replace(/,/gi, ';') + "\n");
                rep.rawData = [];
            });
        })
    }
}

function shutdown(peripheralAddress) {
    let peripheral = peripherals.find(p => p.address === peripheralAddress)
    if (peripheral) {
        peripheral.discoverSomeServicesAndCharacteristics(['ff30'], ['ff35'], function (error, services, characteristics) {
            var SmartLifeService = services[0];
            var stateCharacteristic = characteristics.find(c => c.uuid == 'ff35');

            stateCharacteristic.write(new Buffer([0x0A]), true, function (error) {
                console.log('Shutdown ' + peripheralAddress);
            });
        })
    }
}

noble.on('stateChange', function (state) {
    if (state === 'poweredOn') {
        noble.startScanning();
    } else {
        noble.stopScanning();
    }
});

noble.on('scanStart', function () {
    console.warn('Scan started');
});

noble.on('scanStop', function () {
    console.warn('Scan stopped');
});


noble.on('discover', function (peripheral) {
    var address = peripheral.address
    console.log(address)
    if (whitelist.includes(peripheral.address.toUpperCase()) && peripheral.state === 'disconnected') {

        peripheral.once('connect', function () {
            console.log(address, 'connected');
            fullList.push({
                address: peripheral.address,
                connected: true,
                startedRaw: false,
                rawData: []
            })
            peripherals.push(peripheral);
            //MPUConfig(address)
            peripheral.discoverSomeServicesAndCharacteristics(['ff30'], ['ff35', 'ff37', 'ff38', 'ff3c', 'ff3b'], function (error, services, characteristics) {
                var SmartLifeService = services[0];
                var stateCharacteristic = characteristics.find(c => c.uuid == 'ff35');
                var buttonCharacteristic = characteristics.find(c => c.uuid == 'ff37');
                var rawCharacteristic = characteristics.find(c => c.uuid == 'ff38');
                var MPUCharacteristic = characteristics.find(c => c.uuid == 'ff3c');
                var RateCharacteristic = characteristics.find(c => c.uuid == 'ff3b');
                MPUCharacteristic.write(new Buffer([0x07, 0x00, 0x00, 0x08, 0x03, 0x03, 0x10]), true, function (error) {
                    if (error) {
                        console.log(error)
                    } else {
                        console.log('Changed MPU config')
                    }
                })

                RateCharacteristic.write(new Buffer([20]), true, function (error) {
                    if (error) {
                        console.log(error)
                    } else {
                        console.log('Changed rate to ' + 20 + 'ms')
                    }
                })

                // to enable notify
                rawCharacteristic.subscribe(function (error) {
                    console.log('raw notification on');
                });

                stateCharacteristic.subscribe(function (error) {
                    console.log('state notification on');
                });

                buttonCharacteristic.subscribe(function (error) {
                    console.log('button notification on');
                });

                // stateCharacteristic.on('data', function(data, isNotification) {
                //     console.log(data)
                // })
                // buttonCharacteristic.on('data', function(data, isNotification) {
                //     console.log(data)
                // })
                // rawCharacteristic.on('data', function(data, isNotification) {
                //     console.log(data)
                // })
            })
        })


        peripheral.once('disconnect', function () {
            console.log(address, 'disconnected');
            peripherals = peripherals.filter(p => { return p.address !== peripheral.address })
            fullList = fullList.filter(p => { return p.address !== peripheral.address })
        });

        peripheral.connect(function (error) {
            if (error) {
                console.log(error);
            }

            noble.startScanning();
            return;
        });

    }
})

function tracking(callback) {
    //TODO grab device/player and session?
    let out = '';
    let error = false;
    //TODO instead of saving the raw data to file, save to DB
    var spawn = require('child_process').spawn,
        ls = spawn('octave', ['./services/inertial_pdr.m',
            './logs/' + filename //TODO fix filename
        ]);

    ls.stdout.on('data', function (data) {
        out += data.toString();
    });

    ls.stderr.on('data', function (data) {
        console.log('stderr: ' + data.toString());
        if (data.toString().includes('error'))
            error = true;
    });

    ls.on('exit', function (code) {
        console.log('child process exited with code ' + code.toString());
        if (error || out == '') {
            return callback("Error in tracking algorithm");
        }
        else {
            if (IsJsonString(out)) {
                return callback(null, out);
            }
            else {
                return callback("Error in tracking algorithm(data)");

            }
        }
    });
}

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        console.log(e);
        return false;
    }
    return true;
}

module.exports = { getPeripherals, getPeripheral, startRaw, idle, shutdown, tracking };