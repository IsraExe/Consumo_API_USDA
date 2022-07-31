import checkIfFolderExists from './config/checkIfFolderExist.js'
import findRecentYears from './services/findRecentYears.js'
import getCommodityAndYear from './services/getCommodityAndYear.js'

(async () => {
    checkIfFolderExists()
    const recentYears = await findRecentYears()
    getCommodityAndYear(recentYears)
})()