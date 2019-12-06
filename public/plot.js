const updateButton = document.getElementById('fetchData');
updateButton.addEventListener('click', () => {
    console.log("HEY");
    getTrackingData()
        .then(res => {
            console.log(res)
            document.getElementById('dataCollectingPlot').style.display = "none";
            TESTER = document.getElementById('tester');
            Plotly.newPlot(TESTER, [{
                x: res.data.map(d => d.X),
                y: res.data.map(d => d.Y)
            }], {
                margin: { t: 0 }
            });
        })
        .catch(err => {
            console.log(err);
            document.getElementById('dataCollectingPlot').style.display = "none";
        });

    async function getTrackingData() {
        document.getElementById('dataCollectingPlot').style.display = "block";
        const response = await fetch('/tracking');
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message)
        }
        return body;
    };
})