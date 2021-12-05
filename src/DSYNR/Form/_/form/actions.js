import {DsynrFormOptions} from "../options";
import {getForm, getFormControl, getFormControls, getFormNotificationId, setupFormControls} from "../utils";
import {formControlReset, formControlVirginise} from "../control/actions";
import {networkRequest} from "../../../Utils/network";
import {lf} from "../../../Utils/debug";
import {formWizardGotoSlide, formWizardINI} from "../wizard/actions";
import {updateObj} from "../../../Utils/obj";
import {STORE} from "../../../../_/store";
import {PortalActions, portalBodyUpdate, portalToggleVisibility} from "../../../Portal/_/actions";
import {getPortal} from "../../../Portal/_/utils";

/**
 * @description Prefer thunk actions, which are dispatchable from anywhere with ease.
 * Define only pure (non-thunk) actions in here for exceptional cases.
 * @type {{updateFormProp: (function(*=, *=, *=): {payload: {val: *, form: *, prop: *}, type: string}), updateFormProps: (function(*=, *=): {payload: {form: *, props: *}, type: string}), enlistForm: (function(*=): {payload: {form: *}, type: string})}}
 */
export const FormActions = {

    /**
     * @description Enlist a form into the global store post initialisation.
     * @param form The form (short for formProps) to use when registering the form in the store.
     * @returns {{payload: {form: *}, type: string}}
     */
    enlistForm: form => {
        return {
            type: DsynrFormOptions.Form.Actions.enlistForm,
            payload: {
                form: form,
            }
        }
    },

    /**
     * @description Update a single property of the form.
     * @param form The form (formProps) which the prop belongs to.
     * @param propName Name of the property that need to be updated.
     * @param propVal Value to set for the specified propName.
     * @returns {{payload: {val: *, form: *, prop: *}, type: string}}
     */
    updateFormProp: (form, propName, propVal) => {
        return {
            type: DsynrFormOptions.Form.Actions.updateFormProp,
            payload: {
                form: form,
                prop: propName,
                val: propVal,
            }
        }
    },

    /**
     * @description Update multiple properties of a form.
     * @param form The form (formProps) which the props belong to.
     * @param props Key-value pair of the properties that need to be updated.
     * @returns {{payload: {form: *, props: *}, type: string}}
     */
    updateFormProps: (form, props) => {

        // lf('updateControlPropS...................', control, props)
        return {
            type: DsynrFormOptions.Form.Actions.updateFormProps,
            payload: {
                form: form,
                props: props //{}
            }
        }
    },
}

/**
 * @description Initialise a form based on the formProps specified.
 * @param form The formProps (aka form) to use for the form initialisation.
 * @returns {(function(*): void)|*}
 */
export const formInitialise = form => {
    return function (dispatch) {

        // lf('form.............', form)

        form.controls = setupFormControls(form.fid, form.children)
        // lf('form.controls.............', form.controls)

        dispatch(FormActions.enlistForm(form))

        if (form.isWizard && (form.wizard === undefined || form.wizard.isActive === undefined)) {
            //merge any wizard props specified
            const wProps = updateObj(DsynrFormOptions.Form.Wizard.Props, form.wizard)
            const updatedFormProps = updateObj(form, {wizard: wProps})
            dispatch(formWizardINI(updatedFormProps))
        }
    }
}

/**
 * @description Update the formData with the value from specified control.
 * @param control The controlProps (aka control) whose value needs to be added or removed.
 * @param {boolean} removeData Set false to remove the value of the control from the formData. Used to avoid storing of unacceptable or unwanted values in the formData.
 * @returns {(function(*): void)|*}
 * @see formErrorsUpdate
 */
export const formDataUpdate = (control, removeData = false) => {
    return function (dispatch) {
        const form = getForm(control.fid)
        let formData = form.data
        if (removeData) {
            delete formData[control.cid]
        } else {
            formData[control.cid] = control.value || control.checked
        }
        dispatch(FormActions.updateFormProps(form, {
            'data': formData,
            'hasData': Object.keys(formData).length > 0,
        }))
    }
}

/**
 * @description Update the formErrors with the error information about the specified control.
 * @param control The controlProps (aka control) which has an erroneous/corrected value.
 * @param {boolean} removeError Set false to remove the error notification about the control from the formErrors.
 * @returns {(function(*): void)|*}
 * @see formDataUpdate
 */
export const formErrorsUpdate = (control, removeError = false) => {
    return function (dispatch) {
        const form = getForm(control.fid)
        let formErrors = form.errors
        if (formErrors[control.cid] && removeError) {
            delete formErrors[control.cid]
        } else {
            formErrors[control.cid] = control.errorTip
        }
        dispatch(FormActions.updateFormProps(form, {
            'errors': formErrors,
            'hasErrors': Object.keys(formErrors).length > 0,
        }))
    }
}

/**
 * @description Populate the formData from the values gathered through iterating over each control in the form.
 * @param fid ID of the form.
 * @returns {(function(*): void)|*}
 */
export const formDataRecap = fid => {
    return function (dispatch) {
        const controls = getFormControls(fid)
        let formData = {}
        for (const cid in controls) {
            const control = controls[cid]
            if (control.isDefaultValueAllowed || !control.isVirgin) {
                // if (isFromControlTypeOption(control)) {
                //     propName = 'checked'
                // }
                formData[cid] = controls[cid].value
                // const cv = controls[cid].value
                // if (cv === undefined && !controls[cid].isRequired) {
                //     formData[cid] = '' //send '' instead of undefined!
                // } else if (cv !== undefined) {
                // }
            }
        }
        const form = getForm(fid)
        lf('formDataRecap.....@', fid, formData)
        dispatch(FormActions.updateFormProps(form, {
            'data': formData,
            'hasData': Object.keys(formData).length > 0,
        }))
    }
}

/**
 * @description Initiate the process of form submission. If a submitAction is set, it will execute right after dispatching postData. To override default form submission behaviour, set isSubmitActionOverride to true.
 * @param form The form that needs to be submitted.
 * @returns {(function(*): void)|*}
 */
export const formSubmit = form => {
    return function (dispatch) {
        if (form.submitAction && form.isSubmitActionOverride) {
            form.submitAction()
        } else {
            dispatch(formDataRecap(form.fid))
            form = getForm(form.fid)
            lf('formSubmit............@', form)
            if (Object.keys(form.data).length > 0) {
                //submit only if there's any data
                //@todo disallow sending !isValid
                dispatch(postData(form.submitURL, form.data, form.token, form.onSubmitSuccess, form.onSubmitError))
            }
            if (form.submitAction) {
                form.submitAction()
            }
        }
    }

}

/**
 * @description Resets the whole form along with its controls to their initial state along with re-virginising the controls.
 * @param form The form that should be reset.
 * @returns {(function(*): void)|*}
 */
export const formReset = form => {
    return function (dispatch) {
        if (form.resetAction && form.isResetActionOverride) {
            form.resetAction()
        } else {
            if (form.isWizard) {
                dispatch(formWizardGotoSlide(form, 0))
            }

            // form = getForm(form.fid)

            for (const cid in form.controls) {
                const control = getFormControl(form.fid, cid)
                if (!control.isVirgin) {
                    dispatch(formControlReset(control, false))
                    dispatch(formControlVirginise(getFormControl(form.fid, cid)))
                }
            }
            dispatch(FormActions.updateFormProps(form, {
                'data': {},
                'errors': {},
                'hasData': false,
                'hasErrors': false,
            }))
            if (form.resetAction) {
                form.resetAction()
            }
        }
    }
}

/**
 * @description Post arbitrary data to server with or without using a form. Dispatches dataPosted after posting the data.
 * @param {string} URL The API URL to post the data to.
 * @param data The object to send.
 * @param token The token used to verify and allow posting to the URL.
 * @param onSuccess The function to execute upon successful submission. Receives the response object.
 * @param onFailure The function to execute upon submission failure. Receives the response object.
 * @returns {(function(*): Promise<void>)|*}
 * @see formSubmit
 * @author [Dsynr]{@link https://dsynr.com}
 * @summary Post data to the server.
 */
export const postData = (URL, data, token, onSuccess = false, onFailure = false) => {
    return async function (dispatch) {
        let response = await networkRequest(URL, data, token, 'POST')
        return dispatch(dataPosted(response, onSuccess, onFailure))
    }
}

/**
 * Execute post submission functions depending upon request success/failure. Dispatches successful/failure actions based on the CORS status.
 * @param response The response object received from the preceding networkRequest to the server.
 * @param onSuccess The function to execute upon successful submission. Receives the response object.
 * @param onFailure The function to execute upon submission failure. Receives the response object.
 * @returns {(function(*): void)|*}
 * @see postData
 * @author [Dsynr]{@link https://dsynr.com}
 * @summary Execute post-submission actions.
 */
export const dataPosted = (response, onSuccess = false, onFailure = false) => {
    lf('dataPosted.........')
    return function (dispatch) {
        if (response.type === 'cors') {
            //Fetch succeeded, validate response
            if (response.status === 200) {
                if (onSuccess) {
                    lf('onSuccess....', response, onSuccess)
                    return onSuccess(response)
                }
            } else {
                //403
                if (onFailure) {
                    return onFailure(response)
                }
            }
        } else {
            //Fetch failed, network issue
            dispatch(networkFailure(response))
        }
        return response
    }
}

/**
 * @description Triggers when a fetch request fails to submit the form due to a network issue.
 * @param response The response received from formSent.
 * @returns {(function(*): Promise<*>)|*}
 * @todo
 */
const networkFailure = (response) => {
    return async function (dispatch) {
        //@todo
    }
}

/**
 * @description Set the form state to busy or unBusy. Use when performing in-form async actions or otherwise to disallow access to of the controls.
 * Setting the form to busy also sets isDisabled to true.
 * @example If you want to validate whether an email exists in database (using a networkRequest) prior to allowing the user to fill other details, you can set the form to busy state which will disallow them from updating anything else in that form.
 * updateFormBusyness(form, false) //Does not require dispatch to trigger.
 * @param fid Form ID
 * @param {boolean} isBusy Set false to make unBusy.
 */
export const updateFormBusyness = (fid, isBusy = true) => {
    STORE.dispatch(FormActions.updateFormProps(getForm(fid), {
        'isBusy': isBusy,
        'isDisabled': isBusy,
    }))
}

/**
 * @description Show or hide an in-form pop-up notification.
 * @param form The form whose notification should be triggered.
 * @param notification The content to show in the notification pop-up. Setting to false hides the notification.
 */
export const formToggleNotification = (form, notification = false) => {
    lf('formToggleNotification......', notification)
    STORE.dispatch(FormActions.updateFormProp(form, 'notification', notification))
    const isVisible = !(typeof notification === "boolean")
    const portal = getPortal(getFormNotificationId(form.fid))
    STORE.dispatch(portalToggleVisibility(portal, isVisible))
    if (isVisible) {
        STORE.dispatch(
            portalBodyUpdate(portal, <>
                    <div className='d-table mx-auto'>
                        {notification}
                    </div>
                </>
            ))
    }
}


export const formToggleVisibility = (form, isVisible = true) => {
    return function (dispatch) {
        dispatch(FormActions.updateFormProp(form, 'isVisible', isVisible))
    }
}