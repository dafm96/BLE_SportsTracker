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

function startRaw(peripheralAddress) {
  let peripheral = peripherals.find(p => p.peripheral.address === peripheralAddress)
  if (peripheral) {
    peripheral.stateCharacteristic.write(new Buffer([0x01]), false, function (error) {
      console.log('Started RAW');
    });
  }
}

function idle(peripheralAddress) {
  let peripheral = peripherals.find(p => p.peripheral.address === peripheralAddress)
  if (peripheral) {

    peripheral.stateCharacteristic.write(new Buffer([0x00]), false, function (error) {
      console.log('Stopped RAW');
    });
  }
}

noble.on('stateChange', function (state) {
  if (state === 'poweredOn') {
    noble.startScanning();
  } else {
    noble.stopScanning();
  }
});

noble.on('scanStart', function() {
  console.warn('Scan started');
});

noble.on('scanStop', function() {
  console.warn('Scan stopped');
});


noble.on('discover', function (peripheral) {
  var address = peripheral.address
  console.log(address)
  if (whitelist.includes(peripheral.address.toUpperCase()) && peripheral.state === 'disconnected') {

    peripheral.on('connect', function () {
      console.log("Connected to ", address);
      let p = {
        peripheral
      }
      peripheral.discoverSomeServicesAndCharacteristics(['ff30'], ['ff35', 'ff38', 'ff3c'], function (error, services, characteristics) {
        var SmartLifeService = services[0];
        p.service = SmartLifeService

        var stateCharacteristic = characteristics.find(c => c.uuid == 'ff35');

        // stateCharacteristic.subscribe(function (error) {
        //   console.log('state notification on');
        // });
        var rawCharacteristic = characteristics.find(c => c.uuid == 'ff38');

        // to enable notify
        // rawCharacteristic.subscribe(function (error) {
        //   console.log('raw notification on');
        // });

        rawCharacteristic.on('data', function (data, isNotification) {
          console.log(peripheral.address, "Raw: " + Array.prototype.slice.call(data, 0))
        });

        var MPUCharacteristic = characteristics.find(c => c.uuid == 'ff3c');
        // MPUCharacteristic.write(new Buffer([0x07, 0x00, 0x00, 0x08, 0x03, 0x03, 0x10]), true, function (error) {
        //   if(error){
        //     console.log(error)
        //   }
        //   console.log('Changed MPU');
        // });
        
        p.stateCharacteristic = stateCharacteristic
        p.rawCharacteristic = rawCharacteristic
        peripherals.push(p)
      });
    })
    //startRaw(this);

    peripheral.on('disconnect', function (error) {
      if (error) {
        console.log(error);
      }
      else{
      console.log(address, 'disconnected');
      }
    });

    peripheral.connect(function (error) {
      if(error){
        console.log(error);
      }
    });

  }
})

var exports = module.exports = { peripherals, startRaw, idle };