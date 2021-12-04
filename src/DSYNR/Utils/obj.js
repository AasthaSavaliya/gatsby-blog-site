import {l, lf} from "./debug";
import {stringify} from "querystring";

/**
 * Set (or add if non-existent) an object key/prop.
 * @param attr Name of the attribute/key/prop.
 * @param val Value of the attribute/key/prop.
 * @param obj The object which the key needs to be appended to.
 * @returns {*} The updated (and mutated) object.
 * @see updateObj
 */
export const setObjAttr = (attr, val, obj) => {
    lf('setObjAttr', attr, val, obj)
    obj[attr] = val;
    return obj;
}

/**
 * Get an array of all the keys(first-level only) of an object.
 * @param obj
 * @returns {string[]}
 */
export const getObjKeys = obj => {
    return Object.keys(obj)
}

/**
 * @description Check if the given object has a specific attribute (or key).
 * @param attrName Name of the attribute or key to check for.
 * @param obj The object to search in for the key.
 * @returns {boolean}
 */
export const objHasAttr = (attrName, obj) => {
    lf('objHasAttr', attrName, obj)
    if (!obj.hasOwnProperty(attrName)) {
        l(`INVALID KEY :: ${attrName}`, obj);
        throw new Error(`INVALID KEY :: ${attrName}`);
    }
    return true;
}

/**
 * @description Merge two objects to generate an updated copy of the old object without mutating it.
 * @param oldObject The object that needs to be updated.
 * @param newValues The values which the object should be updated to.
 * @returns {*} A copy of the supplied object with updated values.
 * @example Among other uses, very helpful in updating Redux states.
 * updateObj(state, {propName: propVal})
 * @see setObjAttr
 */
export const updateObj = (oldObject, newValues) => {
    return Object.assign({}, oldObject, newValues)
}

export const updateItemInArr = (array, itemId, updateItemCallback) => {
    const updatedItems = array.map(item => {
        if (item.id !== itemId) {
            // Since we only want to update one item, preserve all others as they are now
            return item
        }

        // Use the provided callback to create an updated item
        return updateItemCallback(item)
    })

    return updatedItems
}

/**
 * @description Convert a JSON object to a query string for use in URLs.
 * @param jsonObj The object in JSON format.
 * @returns {string} Query string generated from the object.
 */
export const obj2query = (jsonObj) => {
    return stringify(jsonObj)
}