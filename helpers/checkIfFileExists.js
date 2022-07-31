import fs from 'fs'

const checkIfFileExists = (marketYear, commodityCode) => {
    try {
        fs.readFileSync(`./data/${marketYear}+${commodityCode}.json`)
    } catch (error) {
        fs.createWriteStream(`./data/${marketYear}+${commodityCode}.json`)
    }
}

export default checkIfFileExists