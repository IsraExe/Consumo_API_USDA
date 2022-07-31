import fetch from 'node-fetch'
import environmentVariables from '../environmentVariables.js'

const KEY = environmentVariables.KEY 
const baseURL = environmentVariables.baseURL

const findRecentYears = async () => {

    const url = `${baseURL}/datareleasedates`
    const options = {
        method: 'GET',
        mode: 'cors',
        headers: {
            'content-type': 'application/json',
            'api_key': KEY
        }
    }

    const data = await (await fetch(url, options)).json()

    const getRecentYears = new Set([])

    let i = 0
    while (i < data.length) {
        const year = data[i].marketYear
        getRecentYears.add(year)
        i++
    }

    const mostRecentYears = Array.from(getRecentYears).slice(0, 7)

    return mostRecentYears
    // getCommodityAndYear(mostRecentYears)
}

export default findRecentYears