import {DsynrFormOptions} from "./options";
import {lf} from "../../Utils/debug";
import {updateObj} from "../../Utils/obj";
import {updateForm, updateFormControlProp, updateFormControlProps, updateFormControls, updateFormWizard, updateFormWizardProp} from "./utils";
import {updateState} from "../../Utils/react";

/**
 * @description The DsynrForms reducer will process and update the state of DsynrForms within the app (with the new values) passed to it via the dispatched action.
 * @param forms The forms' state to use with the reducer. Providing initial state is optional, as the action dispatcher is anyway going to provide the latest state for the reducer to work on.
 * @param action The action object that was dispatched using one of the form actions.
 * @returns {{}|*} A copy of the updated forms' state after being processed by the reducer.
 * @constructor
 * @summary The DsynrForms reducer only works if the form-action dispatched is defined in the switch-case.
 * @author [Dsynr]{@link https://dsynr.com}
 */
export default function DsynrForms(forms = {}, action) {
    if (action.payload) {

        const payload = action.payload
        lf('payload@DsynrForms:::', payload)

        let form, fid, controls, control, cid
        if (payload.form !== undefined || payload.control !== undefined) {

            if (payload.control !== undefined) {
                control = payload.control
                fid = control.fid
                form = forms[fid]
            } else if (payload.form !== undefined) {
                form = payload.form
                fid = form.fid
            }

            switch (action.type) {

                case DsynrFormOptions.Form.Actions.enlistForm:
                    return updateObj(forms, {[fid]: payload.form})

                case DsynrFormOptions.Form.Actions.updateFormProp:
                    return updateState(forms, fid,
                        updateForm(forms[form.fid], payload.prop, payload.val)
                    )

                case DsynrFormOptions.Form.Actions.updateFormProps:
                    return updateState(forms, fid,
                        updateFormControlProps(forms[form.fid], payload.props)
                    )

                case DsynrFormOptions.Form.Wizard.Actions.updateWizardProp:
                    return updateState(forms, fid,
                        updateForm(form, 'wizard',
                            updateFormWizard(form,
                                updateFormWizardProp(form.wizard, payload.prop, payload.val)
                            )
                        )
                    )

                case DsynrFormOptions.Form.Control.Actions.enlistControl:
                    return updateState(forms, fid,
                        updateForm(form, 'controls',
                            updateFormControls(
                                form,
                                control
                            )
                        )
                    )

                case DsynrFormOptions.Form.Control.Actions.updateControlProps:
                    return updateState(forms, fid,
                        updateForm(form, 'controls',
                            updateFormControls(
                                form,
                                updateFormControlProps(control, payload.props)
                            )
                        )
                    )

                case DsynrFormOptions.Form.Control.Actions.updateControlProp:
                    return updateState(forms, fid,
                        updateForm(form, 'controls',
                            updateFormControls(
                                form,
                                updateFormControlProp(control, payload.prop, payload.val)
                            )
                        )
                    )
            }
        }

    }
    return forms
}