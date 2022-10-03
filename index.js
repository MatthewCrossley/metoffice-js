import { searchLocations } from "./metoffice.js"

async function main(){
    const args = process.argv.splice(2)

    if (args[0] === "location"){
        const location = await searchLocations(args.splice(1).join(""))
        console.log(location)
    }
}

await main()