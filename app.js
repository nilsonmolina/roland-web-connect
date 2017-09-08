var BluetoothController = (function() {
  var dom = {
    table: document.getElementById('resultsTable'),
    button: document.getElementById('button'),
    widget: document.getElementById('widget')
  };

  var bindEvents = function() {
    dom.button.addEventListener('click', function() {
//      beginPairing();
        navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: ['generic_access']
    }).then(device => {
      // Human-readable name of the device.
      console.log(device.name);

      // Attempts to connect to remote GATT Server.
      return device.gatt.connect();
      })
    .then(server => { /* ... */ })
    .catch(error => { console.log(error); });
    });
  };
    
  function beginPairing(){
    navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: ['generic_access']
    }).then(device => {
      // Human-readable name of the device.
      console.log(device.name);

      // Attempts to connect to remote GATT Server.
      return device.gatt.connect();
      })
    .then(server => { /* ... */ })
    .catch(error => { console.log(error); });
  }

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
