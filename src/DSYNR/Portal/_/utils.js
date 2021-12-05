import {updateObj} from "../../Utils/obj";
import {getState} from "../../Utils/react";
import {DsynrPortalOptions} from "./options";
import React from "react";

// const controlTypes = DsynrPortalOptions.Control.Types

export const hasProps = el => {
    return Object.keys(el.props).length > 0
}

export const hasChildrenReact = props => {
    return React.Children.count(props.children) > 1
}

export const getPortal = (pid) => {
    // lf('getPortal', pid, getState('portals', pid))
    return getState('portals', pid) || false
}

export const updatePortalProp = (portal, propName, propVal) => {
    return updateObj(portal, {[propName]: propVal})
}

export const updateState = (state, propName, propVal) => {
    return updateObj(state, {[propName]: propVal})
}
