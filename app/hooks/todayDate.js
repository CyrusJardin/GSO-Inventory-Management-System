export function TodayDate ( inputDate ) {
    const currentDate = new Date();
  
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; 
    const currentDay = currentDate.getDate();
    
    const inputYear = new Date(inputDate).getFullYear();
    const inputMonth = new Date(inputDate).getMonth() + 1;
    const inputDay = new Date(inputDate).getDate();
    
    return (
        currentYear === inputYear &&
        currentMonth === inputMonth &&
        currentDay === inputDay
    )
}

export function isDateThisMonth(inputDate) {
    const currentDate = new Date();
    
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; 
    
    const inputYear = new Date(inputDate).getFullYear();
    const inputMonth = new Date(inputDate).getMonth() + 1;
    
    return currentYear === inputYear && currentMonth === inputMonth;
}

export function getWeeklyStocks(sampleArr) {
    const currentDate = new Date()
    const currentDay = currentDate.getDay()
    currentDate.setDate(currentDate.getDate() - currentDay)
    
    const currentWeekCosts = new Array(7).fill(0)
    
    sampleArr.forEach(item => {
        const itemDate = new Date(item.createdAt)
        
        if (itemDate >= currentDate && itemDate < new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000)) {
            const dayIndex = itemDate.getDay()
            currentWeekCosts[dayIndex] += item.total_cost
        }
    })
    return currentWeekCosts
}

export function getWeeklyRelease(sampleArr) {
    const currentDate = new Date()
    const currentDay = currentDate.getDay()
    currentDate.setDate(currentDate.getDate() - currentDay)
    
    const currentWeekRelease = new Array(7).fill(0)
    
    sampleArr.forEach(item => {
        const itemDate = new Date(item.createdAt)
        
        if (itemDate >= currentDate && itemDate < new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000)) {
            const dayIndex = itemDate.getDay()
            const total_cost = item.quantity * item?.inventory?.unit_cost
            currentWeekRelease[dayIndex] += total_cost
        }
    })
    return currentWeekRelease
}

export function getMonthlyStock(sampleArr) {
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()

    const currentMonthStock = new Array(12).fill(0)

    for (let index = 0; index < currentMonthStock.length; index++) {
        sampleArr.forEach(item => {
            if(currentYear == new Date(item?.createdAt).getFullYear() && new Date(item?.createdAt).getMonth() == index) {
                currentMonthStock[index] += item?.total_cost
            }
        })
    }
    return currentMonthStock
}

export function getMonthlyRelease(sampleArr) {
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()

    const currentMonthRelease = new Array(12).fill(0)

    for (let index = 0; index < currentMonthRelease.length; index++) {
        sampleArr.forEach(item => {
            if(currentYear == new Date(item?.createdAt).getFullYear() && new Date(item?.createdAt).getMonth() == index) {
                const total_cost = item?.quantity * item?.inventory?.unit_cost
                currentMonthRelease[index] += total_cost
            }
        })
    }
    return currentMonthRelease
}