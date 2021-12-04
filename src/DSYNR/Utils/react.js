import {updateObj} from "./obj";
import {STORE} from "../../_/store";

export const getState = (storeName, propName) => {
    return STORE.getState()[storeName][propName]
}

export const updateState = (state, propName, propVal) => {
    return updateObj(state, {[propName]: propVal})
}
