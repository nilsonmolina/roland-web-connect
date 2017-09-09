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
      optionalServices: ['generic_access']
    }).then(device => {
      // Human-readable name of the device.
      console.log(device.name);
      outputResults(device.name);
      // Attempts to connect to remote GATT Server.
      return device.gatt.connect();
      })
    .then(server => { /* ... */ })
    .catch(error => { console.log(error); });
  }
    
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
