const resetButton = document.getElementById('reset');
resetButton.addEventListener('click', function(e) {

    function makeUL(array) {
        // Create the list element:
        var list = document.createElement('ul');

        for (var i = 0; i < array.length; i++) {
            // Create the list item:
            var item = document.createElement('li');
            // Set its contents:
            item.appendChild(document.createTextNode(array[i]));
            // Add it to the list:
            list.appendChild(item);
        }

        // Finally, return the constructed list:
        return list;
    }

    fetchPeripherals()
        .then(res => {
            console.log(res)
            document.getElementById('deviceList').innerHTML = ""; // <-- Clears the gif-btn div
            document.getElementById('deviceList').appendChild(makeUL(res.peripherals.map(p => p.address)));
        })
        .catch(err => console.log(err));

    async function fetchPeripherals() {
        const response = await fetch('/peripherals');
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message)
        }
        return body;
    };
});

const startButton = document.getElementById('start');
startButton.addEventListener('click', function(e) {
    fetch('/startAllRaw', { method: 'POST' })
        .then(function(response) {
            if (response.ok) {
                console.log(response);
                document.getElementById('dataCollecting').style.display = "block";
                return;
            }
            throw new Error('No peripherals.');
        })
        .catch(function(error) {
            console.log(error);
        });
});

const stopButton = document.getElementById('stop');
stopButton.addEventListener('click', function(e) {
    fetch('/stopAllRaw', { method: 'POST' })
        .then(function(response) {
            if (response.ok) {
                document.getElementById('dataCollecting').style.display = "none";
                return;
            }
            throw new Error('No peripherals.');
        })
        .catch(function(error) {
            console.log(error);
        });
});

const shutdownButton = document.getElementById('shutdown');
shutdownButton.addEventListener('click', function(e) {
    fetch('/shutdownAll', { method: 'POST' })
        .then(function(response) {
            if (response.ok) {
                return;
            }
            throw new Error('No peripherals.');
        })
        .catch(function(error) {
            console.log(error);
        });
});