export const getRandomArrayItem = arr => {
    return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * @todo untested
 * @param obj
 * @param keyOnly
 * @returns {*}
 */
export const getRandomObjItem = (obj, keyOnly=false) => {
    let keys = Object.keys(obj);
    let key = getRandomArrayItem(keys)
    return keyOnly ? key : obj[keys[key]]
}
