import {STORE} from "../../../../_/store";
import {ControlActions, formControlNeutralise, formControlToggleValidity} from "./actions";
import {lf} from "../../../Utils/debug";
import {getFormControl, isFromControlTypeDateTime, isFromControlTypeEmail, isFromControlTypeOption, isFromControlTypeText} from "../utils";
import {isValidEmail} from "../../../Utils/misc";
import {formDataUpdate, formErrorsUpdate} from "../form/actions";

/**
 * @description Common control events used by all controls.
 * @param control
 * @returns {{onBlur: onBlur, onChange: onChange, onFocus: onFocus}}
 * @author Abhishek Jain
 */
export default function formControlEvents(control) {
    return {
        onFocus: () => {
            triggerFormControlFocus(control)
        },
        onBlur: () => {
            triggerFormControlFocus(control, false)
        },
        onChange:
            (e) => {
                let value
                if (isFromControlTypeOption(control)) {
                    value = e.currentTarget.checked
                } else if (isFromControlTypeDateTime(control)) {
                    value = e.toString()
                } else {
                    value = e.target.value
                }
                triggerFormControlChange(control, value)
            },
    }
}

/**
 * @description Dispatches ControlActions.updateControlProps to update the changed value and updates isChanged.
 * Executes any fn provided after updating the store. The supplied fn will receive the updated control to make use of.
 * If the control is required, validation is triggered to ensure its value is acceptable and onChange is executed if valid.
 * @uses STORE.dispatch
 * @param control The control whose value needs to be changed
 * @param updatedValue The new value that needs to be set for the control
 * @param triggerSideEffects Set to false to silently change the value only and disallow any consequences of value change, like then/catch/finally.
 * @param onChange Fn to be executed after updating to the new value
 * @param onUnChange Fn to be executed after updating to the new value and if the new value == defaultValue
 * @param onChangeRegardless Fn to be executed after updating to the new value regardless of whether it was changed or not
 * @author Abhishek Jain
 */
export const triggerFormControlChange = (control, updatedValue, triggerSideEffects = true, onChange, onUnChange, onChangeRegardless) => {
    new Promise((resolve, reject) => {
        lf(control.cid, 'Executing Promise', updatedValue, control)
        const hasControlChanged = control.defaultValue != updatedValue
        STORE.dispatch(ControlActions.updateControlProps(control, {
            isChanged: hasControlChanged,
            value: updatedValue,
        }))
        if (triggerSideEffects) {
            lf(control.cid, 'Promise Resolved?', hasControlChanged, updatedValue)
            hasControlChanged ? resolve() : reject()
        }
    }).then(() => {
            lf(control.cid, 'Control was Changed manually or dynamically')
            onChange = onChange || control.onChange
            if (onChange) {
                control = getFormControl(control.fid, control.cid)
                //Control was Changed manually or dynamically and isn't required, trigger onChange if available
                onChange(control)
            }
        }
    ).catch((e) => {
        lf(control.cid, e, 'Control hasn\'t Changed or was reverted to defaultValue (manually or dynamically)')
        //Control hasn't Changed or was reverted to defaultValue (manually or dynamically)
        onUnChange = onUnChange || control.onUnChange
        if (onUnChange) {
            control = getFormControl(control.fid, control.cid)
            onUnChange(control)
        }
    }).finally(() => {
        lf(control.cid, 'execute regardless of whether the value was changed or reverted(i.e. perceived as unchanged)')

        control = getFormControl(control.fid, control.cid)
        if (control.isRequired && control.hasRealTimeValidation) {
            //control is required, validate to ensure its value is acceptable
            triggerFormControlValidation(control).then(() => {
                control = getFormControl(control.fid, control.cid)
                if (control.isRealTimeFormDataUpdate) {
                    if (control.valid) {
                        STORE.dispatch(formDataUpdate(control))
                        STORE.dispatch(formErrorsUpdate(control, true))
                    } else {
                        STORE.dispatch(formErrorsUpdate(control))
                        STORE.dispatch(formDataUpdate(control, true))
                    }
                }
            })
        }

        //execute regardless of whether the value was changed or reverted(i.e. perceived as unchanged)
        onChangeRegardless = onChangeRegardless || control.onChangeRegardless
        if (onChangeRegardless) {
            onChangeRegardless(updatedValue)
        }
    })
}

/**
 * @description Sets control focus, executes any additional fn provided, followed by un/highlighting the control.
 * @param control The control which needs to be focused
 * @param isFocused Set to true to focus, false to blue
 * @param onFocus Fn to be executed after the focus is set
 * @param onBlur Fn to be executed after the control is blurred
 * @param isHighlightedOnFocus un/Highlight control after the focus is set and onFocus triggered
 * @author Abhishek Jain
 */
export const triggerFormControlFocus = (control, isFocused = true, onFocus, onBlur, isHighlightedOnFocus) => {
    new Promise((resolve, reject) => {
        lf(control.cid, 'Executing Promise', control)
        let updateProps = {isFocused: isFocused}
        if (control.isVirgin) {
            updateProps.isVirgin = false
        }
        STORE.dispatch(ControlActions.updateControlProps(control, {
            ...updateProps
        }))
        isFocused ? resolve() : reject()
    }).then(() => {
            lf(control.cid, 'Control was Focused and props updated; Execute any additional onFocus if provided')
            STORE.dispatch(formControlNeutralise(getFormControl(control.fid, control.cid)))
            //Control was Focused and props updated; Execute any additional onFocus if provided
            onFocus = onFocus || control.onFocus
            if (onFocus) {
                onFocus(control)
            }
        }
    ).catch(() => {
        lf('..........................................catch')
        lf(control.cid, 'Control was blurred and props updated; Execute any additional onBlur if provided')

        control = getFormControl(control.fid, control.cid)

        if (!control.isRealTimeFormDataUpdate && !control.isRequired) {
            STORE.dispatch(formDataUpdate(control))
            STORE.dispatch(formErrorsUpdate(control, true))
        }

        if (control.isRequired) {
            //control is required, validate to ensure its value is acceptable
            triggerFormControlValidation(control)
        }

        onBlur = onBlur || control.onBlur
        if (onBlur) {
            //Control was blurred and props updated; Execute any additional onBlur if provided
            onBlur(control)
        }
    }).finally(() => {
        setTimeout(() => {
            lf('..........................................finally')
            lf(control.cid, 'execute after focus has been set')
            //execute after focus has been set
            control = getFormControl(control.fid, control.cid)
            if (control.isHighlighted || isHighlightedOnFocus || control.isHighlightedOnFocus) {
                triggerFormControlHighlight(control, isFocused)
            }
        })
    })
}

/**
 * @description Sets control focus, executes any additional fn provided, followed by un/highlighting the control.
 * @param control The control which needs to be highlighted
 * @param isHighlighted Set to true to highlight, false to unHighlight
 * @param triggerSideEffects Set to false to silently change the value only and disallow any consequences of value change, like then/catch/finally.
 * @param onHighlight Fn to be executed after the control is highlighted
 * @param onUnHighlight Fn to be executed after the control is unHighlighted
 * @author Abhishek Jain
 */
export const triggerFormControlHighlight = (control, isHighlighted = true, triggerSideEffects = true, onHighlight, onUnHighlight) => {
    new Promise((resolve, reject) => {
        lf(control.cid, 'Executing Promise', control)
        STORE.dispatch(ControlActions.updateControlProp(control, 'isHighlighted', isHighlighted))
        isHighlighted ? resolve() : reject()
    }).then(() => {
            lf(control.cid, 'Control was highlighted and props updated; Execute any additional onHighlight if provided')
            //Control was highlighted and props updated; Execute any additional onHighlight if provided
            onHighlight = onHighlight || control.onHighlight
            if (onHighlight) {
                onHighlight(control)
            }
        }
    ).catch(() => {
        lf(control.cid, 'Control was unHighlighted and props updated; Execute any additional onUnHighlight if provided')
        //Control was unHighlighted and props updated; Execute if any additional onUnHighlight if provided
        onUnHighlight = onUnHighlight || control.onUnHighlight
        if (onUnHighlight) {
            onUnHighlight(control)
        }
    })
}

export const triggerFormControlValidation = (control, onValid, onInvalid) => {
    lf('..........................................triggerFormControlValidation')
    return new Promise((resolve, reject) => {
        lf(control.cid, 'Executing Promise', control)
        let isValid
        if (isFromControlTypeText(control)) {
            if (isFromControlTypeEmail(control)) {
                isValid = isValidEmail(control.value)
            } else if (control.defaultValue === '' && control.value === '') {
                isValid = false
            } else {
                lf(control.defaultValue === '' && control.value === '', control.defaultValue, control.value)
                isValid = true
            }
        } else if (isFromControlTypeOption(control)) {
            if (control.defaultValue === '' && control.value === '') {
                isValid = false
            }
        } else {
            lf('isValid @todo?', control)
            isValid = true
        }

        if (!control.isDefaultValueAllowed && control.value === control.defaultValue) {
            isValid = false
        } else if (control.isDefaultValueAllowed && control.value === control.defaultValue) {
            isValid = true
        }
        isValid ? resolve() : reject()
    }).then(() => {
            lf(control.cid, 'Control set as valid and props updated; Execute any additional onValid if provided')
            //Control set as valid and props updated; Execute any additional onValid if provided
            STORE.dispatch(formControlToggleValidity(control))
            STORE.dispatch(formDataUpdate(control))
            STORE.dispatch(formErrorsUpdate(control, true))
            onValid = onValid || control.onValid
            if (onValid) {
                onValid(control)
            }
        }
    ).catch(() => {
        lf(control.cid, 'Control set as inValid and props updated; Execute any additional onInvalid if provided')
        //Control set as inValid and props updated; Execute any additional onInvalid if provided
        STORE.dispatch(formControlToggleValidity(control, false))
        STORE.dispatch(formErrorsUpdate(control))
        STORE.dispatch(formDataUpdate(control, true))
        onInvalid = onInvalid || control.onInvalid
        if (onInvalid) {
            onInvalid(control)
        }
    }).finally(() => {
        if (!control.isValidationVisible) {
            STORE.dispatch(formControlNeutralise(getFormControl(control.fid, control.cid)))
        }
        lf('..........................................triggerFormControlValidation OVER')
    })
}
