import {updateObj} from "../../Utils/obj";
import {getState} from "../../Utils/react";
import {DsynrFormOptions} from "./options";
import React from "react";
import {triggerFormControlChange} from "./control/events";
import {lf} from "../../Utils/debug";

const controlTypes = DsynrFormOptions.Form.Control.Types

/**
 * @description Check if the element has props.
 * @param el
 * @returns {boolean}
 */
export const hasProps = el => {
    return Object.keys(el.props).length > 0
}

/**
 * @description Checks if the component has react-components nested under it by checking the count of props.children.
 * @param props
 * @returns {boolean}
 */
export const hasChildrenReact = props => {
    return React.Children.count(props.children) > 1
}

/**
 * @description Checks if the component has any children under it.
 * To check if the component has react-components only use hasChildrenReact.
 * @param c
 * @returns {boolean}
 * @see hasChildrenReact
 */
export const hasChildren = c => {
    return Object.keys(c.props.children).length > 0
}

/**
 * @description Check if the provided component is a react-component or a DOM element.
 * @param c
 * @returns {boolean}
 */
export const isReactComp = c => {
    return typeof c.type === "object" //DOM element, if string
}

/**
 * @description Check if the control is of type Select.
 * @param control
 * @returns {boolean}
 * @see DsynrFormOptions.Form.Control.Types
 */
export const isFromControlTypeSelect = control => {
    return control.type === controlTypes.select
}

/**
 * @description Check if the control is of type DateTime.
 * @param control
 * @returns {boolean}
 * @see DsynrFormOptions.Form.Control.Types
 */
export const isFromControlTypeDateTime = control => {
    return control.type === controlTypes.dateTime
}

/**
 * @description Check if the control is of type Option (viz. checkbox, radio, switch).
 * @param control
 * @returns {boolean}
 * @see DsynrFormOptions.Form.Control.Types
 */
export const isFromControlTypeOption = control => {
    return control.type === controlTypes.checkbox
        || control.type === controlTypes.radio
        || control.type === controlTypes.switch
}

/**
 * @description Check if the control is of type Text (viz. text, textarea, email, number, password).
 * @param control
 * @returns {boolean}
 * @see DsynrFormOptions.Form.Control.Types
 * @see isFromControlTypeEmail
 */
export const isFromControlTypeText = control => {
    return control.type === controlTypes.text
        || control.type === controlTypes.textarea
        || control.type === controlTypes.email
        || control.type === controlTypes.number
        || control.type === controlTypes.password
}

/**
 * @description Check if the control is specifically of type Email.
 * @param control
 * @returns {boolean}
 * @see DsynrFormOptions.Form.Control.Types
 * @see isFromControlTypeText
 */
export const isFromControlTypeEmail = control => {
    return control.type === controlTypes.email
}

/**
 * @description Iterates recursively through all the children to populate a {}collection of available DsynrControls.
 * @param fid The form ID to associate the control with.
 * @param children A collection of components or DOM elements which need to be iterated over and scoop DsynrControls from.
 * @returns {{}}
 */
export const setupFormControls = (fid, children) => {

    // lf('setupFormControls.....', fid, children)
    let sectionControls = {}
    if (children !== undefined) {
        if (Array.isArray(children)) {
            children.map(child => {
                // lf('mapping...', child)
                sectionControls = {...sectionControls, ...setupFormControls(fid, child)}
            })
            // lf('isArray', sectionControls)
        } else if (typeof children === "object" && isFormControl(children)) {
            // lf(children, children.children, children.props.name, children.props, '-<<<<<<')
            sectionControls = {
                [children.props.cid]: children.props
            }
            // let sectionControl = sectionControls[children.props.cid]
            // sectionControl = updateObj(sectionControl, {fid: fid})
            // sectionControls = updateObj(sectionControls, {[children.props.cid]: sectionControl})
            // lf('isFormControl', sectionControls)
        } else if (typeof children !== "string" && hasProps(children)) {
            // lf('RECURSIVE >>> >> >', children, children.props)
            sectionControls = setupFormControls(fid, children.props.children)
        }
    }
    // lf('sectionControls :::: ', sectionControls)

    return sectionControls
}

/**
 * @description Check if the provided component/element/object/control is a DsynrControl.
 * @param control
 * @returns {boolean}
 */
export const isFormControl = control => {
    // lf(control.props,control.props.children,'.................control')
    return DsynrFormOptions.Form.Control.Types[control.props.type] !== undefined
}

/**
 * @description Get the recent-most formProps for the given form ID (aka fid) from the store.
 * @param fid The form ID whose props need to be fetched.
 * @returns {boolean} formProps if the form exists in the store or false.
 */
export const getForm = (fid) => {
    // lf('getForm', fid, getState('forms', fid))
    return getState('forms', fid) || false
}

/**
 * @description Get all the controls for the given fid from the store.
 * @param fid The form ID whose controls need to be fetched.
 * @returns {boolean} formControls if the form exists in the store or false.
 */
export const getFormControls = (fid) => {
    // lf('getFormControls', fid, getForm(fid).controls)
    return getForm(fid).controls || false
}

/**
 * @description Get the recent-most controlProps for the given control+form ID from the store.
 * @param fid The form ID whose control is being referred.
 * @param cid The control ID whose props need to be fetched.
 * @returns {boolean} controlProps if the form along with the requested control exists in the store or false.
 */
export const getFormControl = (fid, cid) => {
    // lf('getFormControl', fid, cid, getFormControls(fid)[cid])
    return getFormControls(fid)[cid] || false
}

/**
 * @description Update a single property of the form.
 * @param form The form whose prop needs to be updated.
 * @param propName Name of the property that needs to be updated.
 * @param propVal Value that needs to be set for the prop.
 * @returns {*}
 * @see updateObj
 */
export const updateForm = (form, propName, propVal) => {
    return updateObj(form, {[propName]: propVal})
}

/**
 * @description Update the whole control within the form.
 * @param form
 * @param control
 * @returns {*}
 * @see updateObj
 */
export const updateFormControls = (form, control) => {
    // lf('updateFormControls========',control)
    // lf('updateFormControls>>>>>>',o)
    return updateObj(form.controls, {[control.cid]: control})
}

/**
 * @description Update single prop of the control.
 * @param control
 * @param propName
 * @param propVal
 * @returns {*}
 * @see updateObj
 */
export const updateFormControlProp = (control, propName, propVal) => {
    // lf('updateFormControlProp..........',o)
    return updateObj(control, {[propName]: propVal})
}

/**
 * @description Update multiple props of the control.
 * @param control
 * @param props
 * @returns {*}
 * @see updateObj
 */
export const updateFormControlProps = (control, props) => {
    // lf('updateFormControlProps..........',props)
    return updateObj(control, props)
}

/**
 * @description Update the whole wizard.
 * @param form
 * @param wizard
 * @returns {*}
 * @see updateObj
 */
export const updateFormWizard = (form, wizard) => {
    return updateObj(form.wizard, wizard)
}

/**
 * @description Update the prop of wizard.
 * @param wizard
 * @param propName
 * @param propVal
 * @returns {*}
 * @see updateObj
 */
export const updateFormWizardProp = (wizard, propName, propVal) => {
    return updateObj(wizard, {[propName]: propVal})
}

/**
 * @description Set the default value for the control during its initialisation.
 * @param control
 * @see updateObj
 */
export const setInitialControlValue = control => {
    if (control.isVirgin && control.value !== control.defaultValue) {
        triggerFormControlChange(control, control.defaultValue, false)
    }
}

/**
 * @description Returns the ID of the portal for the corresponding fid.
 * @param fid
 * @returns {string}
 */
export const getFormNotificationId = fid => {
    return fid + 'Alert'
}