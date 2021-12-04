import {DsynrFormOptions} from "../options";
import {formDataUpdate, formErrorsUpdate} from "../form/actions";
import {lf} from "../../../Utils/debug";
import {getFormControl, isFromControlTypeDateTime, isFromControlTypeEmail, isFromControlTypeOption, isFromControlTypeText} from "../utils";
import {isValidEmail} from "../../../Utils/misc";
import {triggerFormControlChange, triggerFormControlHighlight} from "./events";

/**
 * @description Prefer thunk actions, which are dispatchable from anywhere with ease.
 * Define only pure (non-thunk) actions in here for exceptional cases.
 * @type {{enlistControl: (function(*=): {payload: {control: *}, type: string}), updateControlProp: (function(*=, *=, *=): {payload: {val: *, prop: *, control: *}, type: string}), updateControlProps: (function(*=, *=): {payload: {control: *, props: *}, type: string})}}
 */
export const ControlActions = {
    enlistControl: control => {
        return {
            type: DsynrFormOptions.Form.Control.Actions.enlistControl,
            payload: {
                control: control,
            }
        }
    },

    /**
     * @description Update multiple properties of the control.
     * @param control The control (controlProps) which the props belong to.
     * @param props Key-value pair of the properties that need to be updated.
     * @returns {{payload: {control: *, props: *}, type: string}}
     */
    updateControlProps: (control, props) => {
        // lf('updateControlPropS...................', control, props)
        return {
            type: DsynrFormOptions.Form.Control.Actions.updateControlProps,
            payload: {
                control: control,
                props: props //{}
            }
        }
    },

    /**
     * @description Update a single property of the control.
     * @param control The control whose prop need to be updated.
     * @param propName Name of the property that need to be updated.
     * @param propVal Value to set for the specified propName.
     * @returns {{payload: {val: *, prop: *, control: *}, type: string}}
     */
    updateControlProp: (control, propName, propVal) => {
        // lf('updateControlProp...................', control, propName, propVal)
        return {
            type: DsynrFormOptions.Form.Control.Actions.updateControlProp,
            payload: {
                control: control,
                prop: propName,
                val: propVal,
            }
        }
    }
}

/**
 * @description Set controls' validity properties.
 * @param control
 * @param isValid Set false to display as an invalidated control.
 * @returns {(function(*): void)|*}
 */
export const formControlToggleValidity = (control, isValid = true) => {
    return function (dispatch) {
        dispatch(ControlActions.updateControlProps(control, {
            'isValid': isValid,
            'isInvalid': !isValid,
        }))
    }
}

/**
 * @description Neutralises the appearance of the control by unsetting isValid and isInvalid.
 * @param control
 * @returns {(function(*): void)|*}
 */
export const formControlNeutralise = control => {
    lf('formControlNeutralise.....................................................')
    return function (dispatch) {
        dispatch(ControlActions.updateControlProps(control, {
            'isValid': undefined,
            'isInvalid': undefined,
        }))
        triggerFormControlHighlight(getFormControl(control.fid, control.cid), false, false)
    }
}

/**
 * @description Show or hide the control.
 * @param control
 * @param isVisible Set false to hide.
 * @returns {(function(*): void)|*}
 */
export const formControlToggleVisibility = (control, isVisible = true) => {
    return function (dispatch) {
        dispatch(ControlActions.updateControlProp(control, 'isVisible', isVisible))
    }
}

/**
 * @description Validate the control based on its type and update formData or formErrors accordingly.
 * @param control
 * @returns {(function(*): void)|*}
 * @todo validate email if supplied when non-mandatory
 * @todo bug - form has errors on alternative char in email@domain(text untested?) field post email validation
 */
export const formControlValidate = (control) => {
    return function (dispatch) {

        let isValid = true

        //check regardless of isChanged
        if (control.isRequired) {
            if (isFromControlTypeText(control)) {
                if (control.defaultValue === '' && control.value === '') {
                    isValid = false
                } else if (isFromControlTypeEmail(control)) {
                    isValid = isValidEmail(control.value)
                }
            } else if (isFromControlTypeOption(control)) {
                if (control.defaultValue === false && control.checked === false) {
                    isValid = false
                }
            } else {
                isValid = control.value !== control.defaultValue || (isFromControlTypeOption(control) && control.defaultValue !== control.checked)
            }
        }

        if ((((control.defaultValue === '' || (isFromControlTypeOption(control) && control.defaultValue === false)) && !control.isChanged) || control.isChanged) && control.isValidationVisible) {
            if (isValid) {
                dispatch(formControlToggleValidity(control))
            } else {
                dispatch(formControlToggleValidity(control, false))
            }
        }

        control = getFormControl(control.fid, control.cid)

        if (control.isDefaultValueAllowed || (control.isChanged && isValid)) {
            dispatch(formDataUpdate(control))
            dispatch(formErrorsUpdate(control, true))
        } else {
            dispatch(formErrorsUpdate(control))
            dispatch(formDataUpdate(control, true))
        }

        if (!control.isValidationVisible && control.isChanged) {
            dispatch(formControlNeutralise(control))
        }
    }
}

/**
 * @warning This will set the value of the control directly without triggering change event. Do not use directly unless intentional.
 * @see formControlChange
 * @param control
 * @param value
 * @returns {(function(*): void)|*}
 */
export const formControlSetVal = (control, value) => {
    return function (dispatch) {
        dispatch(ControlActions.updateControlProp(control, 'value', value))
    }
}

/**
 * @warning This will reset the value of the control directly to its default value without triggering change event. Do not use directly unless intentional.
 * @see triggerFormControlChange
 * @param control
 * @returns {(function(*): void)|*}
 */
export const formControlSetDefaultVal = control => {
    return function (dispatch) {
        if (control.isVirgin) {
            if (isFromControlTypeDateTime(control)) {
                const dateTime = new Date()
                dispatch(ControlActions.updateControlProp(control, 'defaultValue', dateTime.toString()))
            } else {
                dispatch(ControlActions.updateControlProp(control, 'defaultValue', control.defaultValue === true))
            }
        }

        control = getFormControl(control.fid, control.cid)
        triggerFormControlChange(control, control.defaultValue, false)
    }
}

/**
 * @description Restores the value of the control to its defaultValue and neutralises its display (i.e. unsets isValid and isInvalid).
 * @param control
 * @param updateFormData Set false to reset the control without affecting the existing formData.
 * @returns {(function(*): void)|*}
 */
export const formControlReset = (control, updateFormData = true) => {
    // lf('formControlReset...................', control)
    return function (dispatch) {
        triggerFormControlChange(control, control.defaultValue, false)
        // dispatch(formControlSetDefaultVal(control))
        dispatch(formControlNeutralise(getFormControl(control.fid, control.cid)))
        // dispatch(ControlActions.updateControlProp(getFormControl(control.fid, control.cid), 'isChanged', false))
        if (updateFormData) {
            dispatch(formDataUpdate(control, true))
        }
    }
}

/**
 * @description Sets isVirgin to true
 * @param control
 * @returns {(function(*): void)|*}
 */
export const formControlVirginise = control => {
    return function (dispatch) {
        dispatch(ControlActions.updateControlProp(control, 'isVirgin', true))
    }
}