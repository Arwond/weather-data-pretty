const GOOGLE_SHEETS_JSON_URL = "https://script.google.com/macros/s/AKfycbx1SgDH33eWMDWywwaObK7-uFkfw4UE2I5H9dAfaxG7xKWslwkXziq9QYrOMWekLfpI/exec";

async function fetchWeatherData() {
    const response = await fetch(GOOGLE_SHEETS_JSON_URL);
    const data = await response.json();
    const sheetData = data.WeatherData || [];

    // Generate Table
    let tableHTML = "<tr><th>Timestamp</th><th>Temperature (°C)</th><th>Wind Speed (m/s)</th><th>Wind Direction</th></tr>";
    sheetData.forEach(row => {
        tableHTML += `<tr>
            <td>${row.Timestamp}</td>
            <td>${row.Temperature}</td>
            <td>${row["Wind Speed (m/s)"]}</td>
            <td>${row["Wind Direction"]}</td>
        </tr>`;
    });
    document.getElementById("weatherTable").innerHTML = tableHTML;

    // Generate Chart
    const labels = sheetData.map(row => row.Timestamp);
    const tempData = sheetData.map(row => row.Temperature);
    const windSpeedData = sheetData.map(row => row["Wind Speed (m/s)"]);
    const windDirectionData = sheetData.map(row => row["Wind Direction"]);

    new Chart(document.getElementById("weatherChart"), {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                { label: "Temperature (°C)", data: tempData, borderColor: "red", fill: false },
                { label: "Wind Speed (m/s)", data: windSpeedData, borderColor: "blue", fill: false }
            ]
        },
        options: {
            responsive: true,
            tooltips: {
                callbacks: {
                    afterLabel: function(tooltipItem, data) {
                        return "Wind Direction: " + windDirectionData[tooltipItem.index];
                    }
                }
            }
        }
    });
}

fetchWeatherData();
