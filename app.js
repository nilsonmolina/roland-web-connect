var BluetoothController = (function() {
  var dom = {
    table: document.getElementById('resultsTable'),
    button: document.getElementById('button'),
    widget: document.getElementById('widget')
  };

  var bindEvents = function() {
    dom.button.addEventListener('click', function() {
      beginPairing();
    });
  };
    
  function beginPairing(){
      
    navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: ['human_interface_device']
    })
    .then(device => {
      // Human-readable name of the device.
      outputResults(device.name);
      // Attempts to connect to remote GATT Server.
      return device.gatt.connect();
    })
    .then(server => {
      // Getting Human Interface Device Service...
      return server.getPrimaryService('human_interface_device');
    })
    .then(service => {
      // Getting Report Characteristic...
      return service.getCharacteristic('report');
    })
    .then(characteristic => {
      // Reading Report...
      return characteristic.readValue();
    })
    .then(value => {
      outputResults('all: ' + value);
      outputResults('the report is: ' + value.getUint8(0));
    })
    .catch(error => { outputResults(error); });
  };
    
//    .then(characteristic => {
//      // Set up event listener for when characteristic value changes.
//      characteristic.addEventListener('characteristicvaluechanged',
//                                  handleReportChanged);
//      // Reading Battery Level...
//      return characteristic.readValue();
//    })
    
//  function handleBatteryLevelChanged(event) {
//    let batteryLevel = event.target.value.getUint8(0);
//    console.log('Battery percentage is ' + batteryLevel);
//  }
    
  var outputResults = function(result) {
    var row = dom.table.getElementsByTagName('tbody')[0].insertRow(0);

    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);

    cell1.innerHTML = new Date().toLocaleString();
    cell2.innerHTML = result;
  };

  return {
    init: function() {
      bindEvents();
      setTimeout(function(){
          dom.widget.classList.toggle('hidden');
      }, 250);
    }
  };
})();

BluetoothController.init();
