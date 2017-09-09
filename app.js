var BluetoothController = (function() {
  var dom = {
    table: document.getElementById('resultsTable'),
    btnPair: document.getElementById('btnBluetooth'),
    btnConnect: document.getElementById('btnMidi'),
    widget: document.getElementById('widget')
  };
  var input, output;

  var bindDomEvents = function() {
    dom.btnPair.addEventListener('click', function() {
      beginPairing();
    });
    
    dom.btnConnect.addEventListener('click', function() {
      connectMidiDevice();
    });
  };
  
  var bindMidiEvents = function() {
    //Listen for note presses
    input.addListener('noteon', "all", function(e) {
        outputResults("note value: " + e.note.name + e.note.octave);
    });
    
    //Listen for device disconnection
    WebMidi.addListener('disconnected', function(e) {
      if(e.id === input.id){
        input.removeListener();
        WebMidi.removeListener();
        outputResults('disconnected!');
      } else {
        console.log('disconnected event fired, but not same id')
      }
    });
  };
    
  function enableWebMidi(){
    WebMidi.enable(function (err) {
      if (err) {
        outputResults("WebMidi could not be enabled: ", err);
      }      
    });
  };
  
  function connectMidiDevice() {
    if (WebMidi.inputs.length < 1){
      outputResults("No MIDI device found. Please connect one and try again.")
    } else {
      input = WebMidi.inputs[0];
      output = WebMidi.outputs[0];
      outputResults("connected to: " + input.name);
      bindMidiEvents();
    }
  };
    
  function beginPairing(){      
    navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalService: ['human_interface_device', 0x1812]
    })
    .then(device => {
      outputResults("successfully paired with: " + device.name);
      return device.gatt.connect();
    })
    .then(server => {
      // Getting Human Interface Device Service...
      return server.getPrimaryService(0x1812);
    })
    .then(service => {
      // Getting Protocol Mode...
      return service.getCharacteristic('protocol_mode');
    })
    .then(characteristic => {
      // Reading Report...
      return characteristic.readValue();
    })
    .then(value => {
      outputResults('all: ' + value);
      outputResults('the protocol mode is: ' + value.getUint8(0));
    })
    .catch(error => { outputResults(error); });
  };
    
  var outputResults = function(result) {
    var row = dom.table.getElementsByTagName('tbody')[0].insertRow(0);

    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);

    cell1.innerHTML = new Date().toLocaleString();
    cell2.innerHTML = result;
  };

  return {
    init: function() {
      bindDomEvents();
      enableWebMidi();
      setTimeout(function(){
          dom.widget.classList.toggle('hidden');
      }, 250);
    }
  };
})();

BluetoothController.init();
