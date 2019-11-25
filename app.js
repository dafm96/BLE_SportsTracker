var noble = require('noble');

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

function startRaw(peripheral) {
  peripheral.discoverServices(['ff30'], function (error, services) {
    var SmartLifeService = services[0];

    SmartLifeService.discoverCharacteristics(['ff35', 'ff38'], function (error, characteristics) {
      var stateCharacteristic = characteristics.find(c => c.uuid == 'ff35');

      stateCharacteristic.on('data', function (data, isNotification) {
        console.log(peripheral.address, "state: " + Array.prototype.slice.call(data, 0))
      });

      stateCharacteristic.subscribe(function (error) {
        console.log('state notification on');
      });

      stateCharacteristic.write(new Buffer([0x01]), true, function (error) {
        console.log('started RAW');
      });

      var rawCharacteristic = characteristics.find(c => c.uuid == 'ff38');
      rawCharacteristic.on('data', function (data, isNotification) {

        console.log(peripheral.address, "Raw: " + Array.prototype.slice.call(data, 0))
      });

      // to enable notify
      rawCharacteristic.subscribe(function (error) {
        console.log('raw notification on');
      });
    });
  })
}

function initializePeripheral(peripheral) {
  peripheral.discoverServices(['ff30'], function (error, services) {
    var SmartLifeService = services[0];

    SmartLifeService.discoverCharacteristics(['ff35', 'ff38'], function (error, characteristics) {
      var stateCharacteristic = characteristics.find(c => c.uuid == 'ff35');

      stateCharacteristic.subscribe(function (error) {
        console.log('state notification on');
      });
      var rawCharacteristic = characteristics.find(c => c.uuid == 'ff38');

      // to enable notify
      rawCharacteristic.subscribe(function (error) {
        console.log('raw notification on');
      });

    });
  })
}

noble.on('stateChange', function (state) {
  if (state === 'poweredOn') {
    noble.startScanning();
  } else {
    noble.stopScanning();
  }
});


noble.on('discover', function (peripheral) {
  var address = peripheral.address
  console.log(address)
  if (whitelist.includes(peripheral.address.toUpperCase())) {

    peripheral.on('connect', function () {
      console.log("Connected to ", address);
      //startRaw(this);
    });

    peripheral.on('disconnect', function () {
      console.log(address, 'disconnected');
    });

    peripheral.connect(function (error) {
      if (error) {
        console.log(error);
        return;
      }

      noble.startScanning();
      return;
    });
  }
})




/*

peripheral.connect(function (error) {

      peripherals.push(peripheral)
      console.log('connected to peripheral: ' + peripheral.uuid);
      peripheral.discoverServices(['ff30'], function (error, services) {
        var SmartLifeService = services[0];

        SmartLifeService.discoverCharacteristics(['ff35', 'ff38'], function (error, characteristics) {
          var stateCharacteristic = characteristics.find(c => c.uuid == 'ff35');

          stateCharacteristic.on('data', function (data, isNotification) {
            console.log("state: " + Array.prototype.slice.call(data, 0))
          });

          stateCharacteristic.subscribe(function (error) {
            console.log('state notification on');
          });

          stateCharacteristic.write(new Buffer([0x00]), true, function (error) {
            console.log('started RAW');
          });

          var rawCharacteristic = characteristics.find(c => c.uuid == 'ff38');
          rawCharacteristic.on('data', function (data, isNotification) {

            console.log("Raw: " + Array.prototype.slice.call(data, 0))
          });

          // to enable notify
          rawCharacteristic.subscribe(function (error) {
            console.log('raw notification on');
          });
        });
              });
    });
    */