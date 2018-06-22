var watchId = null;
var readings = [];
var table = document.getElementById("table-content");

function getCoordinates() {
    if (navigator.geolocation) {
        console.log('called');
        this.watchId = navigator.geolocation.watchPosition(currentPosition, error_callback, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 5000,
            frequency: 10,
            distanceFilter: 1
        });
    } else {
        alert("Your browser does not support GeoLocation");
    }
}

function currentPosition(pos) {
    //console.log('location success', locationDiv);
    this.readings.push({
        Time: getTimeFromTimestamp(pos.timestamp),
        Latitude: pos.coords.latitude,
        Longitude: pos.coords.longitude
    });

    // document.getElementById("table-content").appendChild(
    //     "<tr>" +
    //         "<td>"+getTimeFromTimestamp(pos.timestamp)+"</td>"+
    //         "<td>"+pos.coords.latitude+"</td>"+
    //         "<td>"+pos.coords.longitude+"</td>"+
    //     "</tr>"
    // );

    document.getElementById("location").innerHTML = "<br /> Latitude: " + pos.coords.latitude + "<br/>" + "Longitude: " + pos.coords.longitude + "<br/>" + "Time: " + getTimeFromTimestamp(pos.timestamp);
}

function error_callback(err) {
    document.getElementById("error").innerHTML = "Error: " + err.message;
}

function clearWatch() {
    if (this.watchID !== null) {
        navigator.geolocation.clearWatch(this.watchID);
        this.watchID = null;
        alert('Tracking stopped. please restart browser to start...');
    }
}

function pad(num) {
    return ("0" + num).slice(-2);
}

function getTimeFromTimestamp(timestamp) {
    var date = new Date(timestamp);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    return pad(hours) + ":" + pad(minutes) + ":" + pad(seconds)
}

function convertArrayOfObjectsToCSV(data = null) {  
    var result, ctr, keys, columnDelimiter, lineDelimiter, data;

    if (data == null || !data.length) {
        return null;
    }

    columnDelimiter =  ',';
    lineDelimiter =  '\n';

    keys = Object.keys(data[0]);

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    data.forEach(function(item) {
        ctr = 0;
        keys.forEach(function(key) {
            if (ctr > 0) result += columnDelimiter;

            result += item[key];
            ctr++;
        });
        result += lineDelimiter;
    });

    return result;
}


function downloadCSV() {  
    var data, filename, link;
    var csv = convertArrayOfObjectsToCSV(this.readings);
    if (csv == null) return;

    filename = 'export.csv';

    if (!csv.match(/^data:text\/csv/i)) {
        csv = 'data:text/csv;charset=utf-8,' + csv;
    }
    data = encodeURI(csv);

    link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', filename);
    link.click();
}


getCoordinates();

