var noble = require('noble');
//change min and max in leconn located in /node_modules/noble/lib/hci-socket/hci.js
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
  '0C:B2:B7:39:99:65']

function bufferToByteArray(buffer) {
  return Array.prototype.slice.call(buffer, 0)
}

function MPUConfig(peripheralAddress) {
  let peripheral = peripherals.find(p => p.address === peripheralAddress)
  if (peripheral) {
    peripheral.discoverSomeServicesAndCharacteristics(['ff30'], ['ff35', 'ff38', 'ff3c'], function (error, services, characteristics) {
      var MPUCharacteristic = characteristics.find(c => c.uuid == 'ff3c');
      MPUCharacteristic.write(new Buffer([0x07, 0x00, 0x00, 0x08, 0x03, 0x03, 0x10]), true, function (error) {
        if (error) {
          console.log(error)
        }
        else {
          console.log('Changed MPU config')
        }
      })
    })
  }
}

function startRaw(peripheralAddress) {
  let peripheral = peripherals.find(p => p.address === peripheralAddress)
  peripheral.discoverSomeServicesAndCharacteristics(['ff30'], ['ff35', 'ff38', 'ff3c'], function (error, services, characteristics) {
    var SmartLifeService = services[0];
    var stateCharacteristic = characteristics.find(c => c.uuid == 'ff35');
    var rawCharacteristic = characteristics.find(c => c.uuid == 'ff38');

    stateCharacteristic.write(new Buffer([0x01]), true, function (error) {
      console.log('Started RAW');

      // to enable notify
      rawCharacteristic.subscribe(function (error) {
        console.log('raw notification on');
      });

      rawCharacteristic.on('data', function (data, isNotification) {
        console.log(peripheral.address, "Raw: " + Array.prototype.slice.call(data, 0))
      });
    });
  })
}

function idle(peripheralAddress) {
  let peripheral = peripherals.find(p => p.address === peripheralAddress)
  if (peripheral) {
    peripheral.discoverSomeServicesAndCharacteristics(['ff30'], ['ff35', 'ff38', 'ff3c'], function (error, services, characteristics) {
      var SmartLifeService = services[0];
      var stateCharacteristic = characteristics.find(c => c.uuid == 'ff35');
      var rawCharacteristic = characteristics.find(c => c.uuid == 'ff38');

      stateCharacteristic.write(new Buffer([0x00]), true, function (error) {
        console.log('Stopped RAW');
        rawCharacteristic.unsubscribe((error) => {
          if (error) {
            console.log("idle " + error)
          }
        })
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

    peripheral.on('connect', function () {
      console.log(address, 'connected');
      peripherals.push(peripheral);
      MPUConfig(address)
    })


    peripheral.on('disconnect', function () {
      console.log(address, 'disconnected');
      peripherals.filter(p => p !== peripheral)
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

var exports = module.exports = { peripherals, startRaw, idle };