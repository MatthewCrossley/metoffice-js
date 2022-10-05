import { getForecast, parseForecast, searchLocations } from "./metoffice.js"

async function main(){
    const searchLocation = process.argv.splice(2).join("")
    const location = await searchLocations(searchLocation)

    const forecast = await getForecast(location["id"])

    console.log(parseForecast(forecast))
}

await main()