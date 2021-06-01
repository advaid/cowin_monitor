function findVaccine() {
    
    alert('Activate Vaccine Tracker?')
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
    let inter = window.setInterval(apiCalls, 120000, district, date) 
}

function apiCalls(district, date){
    document.getElementById("status").innerHTML = 'Scanning'
    fetch('https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id='+district+'&date='+date,
    {
        method :'GET'
    })
    .then(response => response.json())
    .then(data => {
        
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
                        
                        if(data.centers[i].sessions[session].available_capacity > 0) { //data.centers[i].sessions[session].vaccine != "COVISHIELD"  &&
                            console.log('Found Vaccine')
                            alarm.play();
                            document.getElementById("status").innerHTML = 'Vaccine Found'
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
    document.getElementById("status").innerHTML = 'Stalled'
}