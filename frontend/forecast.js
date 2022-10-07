function getForLocation(){
    let locationSearch = document.forms[0].location.value;

    fetch(`http://localhost:3000/forecast?location=${locationSearch}`)
    .then(response => {
        response.text().then(text => {
            let result = ""
            let fc = JSON.parse(text)

            for (let day of Object.keys(fc)){
                console.log(`iter on ${day}`)
                result += `<h2>${day}</h2><br>`
                let weather = fc[day]
                for (let item of weather){
                    result += `<h4>${item["time"] / 60}:00</h4><p>`
                    for (let key of Object.keys(item)){
                        if (key === "time"){
                            continue
                        }
                        result += `${key}: ${item[key]}<br />`
                    }
                    result += "</p>"
                }
            }
            document.getElementById("results").innerHTML = result
            console.log("finish")
        })
    });
}