//Prefer thunk actions, which are dispatchable from anywhere with ease.
// Define only pure (non-thunk) actions in here for exceptional cases.
import {DsynrPortalOptions} from "./options";

export const PortalActions = {
    enlistPortal: portal => {
        return {
            type: DsynrPortalOptions.Actions.enlistPortal,
            payload: {
                portal: portal,
            }
        }
    },
    updatePortalProp: (portal, propName, propVal) => {
        return {
            type: DsynrPortalOptions.Actions.updatePortalProp,
            payload: {
                portal: portal,
                prop: propName,
                val: propVal,
            }
        }
    }
}

export const portalInitialise = portal => {
    return function (dispatch) {
        dispatch(PortalActions.enlistPortal(portal))
    }
}

export const portalToggleVisibility = (portal, isVisible = true) => {
    return function (dispatch) {
        dispatch(PortalActions.updatePortalProp(portal, 'isVisible', isVisible))
    }
}

export const portalExited = (portal, onExited) => {
    return function (dispatch) {
        dispatch(PortalActions.updatePortalProp(portal, 'onExited', onExited))
    }
}

export const portalEntered = (portal, onEntered) => {
    return function (dispatch) {
        dispatch(PortalActions.updatePortalProp(portal, 'onEntered', onEntered))
    }
}

export const portalBodyUpdate=(portal, body)=>{
    return function (dispatch) {
        dispatch(PortalActions.updatePortalProp(portal, 'body', body))
    }
}