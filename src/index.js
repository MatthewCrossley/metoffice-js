import { getForecast, parseForecast, searchLocations } from "./metoffice.js"
import express from "express"

async function respondForecast(searchLocation){
    const location = await searchLocations(searchLocation)

    const forecast = await getForecast(location["id"])

    return parseForecast(forecast)
}

function main(){
    const app = express()
    const port = 3000

    app.get('/forecast', async (req, res) => {
        const location = req.query["location"]
        if (location === undefined){
            res.send("location undefined")
            return
        }
        res.send(JSON.stringify(await respondForecast(location)))
    })
    
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

main()