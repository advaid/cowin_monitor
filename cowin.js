function findVaccine() {
    
    alert('Activate Vaccine Tracker?')
    document.getElementById("status").innerHTML = 'Initilizing...'
    var district = document.getElementById("district").value;
    var dateObj = new Date(document.getElementById("date").value)
    var dd = dateObj.getDate()
    var mm =  dateObj.getMonth() + 1
    var yyyy = dateObj.getFullYear()
    var date = dd + "-" + mm + "-" + yyyy 
    var alarm = document.getElementById("alarm");
    document.getElementById("alarm").loop = true;
    // alarm.play();
    console.log('https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id='+district+'&date='+date)
    apiCalls(district, date)
    let inter = window.setInterval(apiCalls, 180000, district, date) 
}

function apiCalls(district, date){
    var now = new Date();
    var h = now.getHours();
    var m = now.getMinutes();
    var s = now.getSeconds();
    document.getElementById('time').innerHTML = h + ":" + m + ":" + s;
    document.getElementById("status").innerHTML = 'Scanning...'
    fetch('https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id='+district+'&date='+date,
    {
        method :'GET'
    })
    .then(response => response.json())
    .then(data => {
        //document.getElementById("res").innerHTML = JSON.stringify(data)
        console.log(data)
        if(data.centers.length == 0) {
            document.getElementById("status").innerHTML = 'No Results'
        }
        else{
            var breaker = 0
            for(i in data.centers) {
                console.log('Checking another center')
                if(data.centers[i].sessions.length > 0) { //center.pincode < 670101 && 
                    console.log('Center: ', data.centers[i])
                    for(session in data.centers[i].sessions) {
                        //data.centers[i].sessions[session].vaccine != "COVISHIELD"  && 
                        if(data.centers[i].sessions[session].available_capacity_dose1 > 0 && data.centers[i].sessions[session].min_age_limit == 18) { 
                            console.log('Dose 1 Vaccine Found')
                            alarm.play();
                            document.getElementById("status").innerHTML = 'Dose 1 Vaccine Found'
                            var node = document.createElement("LI");
                            var text = document.createTextNode(JSON.stringify(data.centers[i].sessions[session]))
                            node.appendChild(text)
                            document.getElementById("res").appendChild(node); 
                             breaker = 1
                             break;
                        }
                    }
                }
                if(breaker){
                     break;
                 }
            }
        }
    
    
    })
    .catch((e) => console.log('Cannot fetch now'))
    document.getElementById("status").innerHTML = 'Waiting... '
}
