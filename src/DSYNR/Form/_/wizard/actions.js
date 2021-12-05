import {DsynrFormOptions} from "../options";
import {getForm} from "../utils";

const ACTIONS = {
    updateWizardProp: (form, propName, propVal) => {
        return {
            type: DsynrFormOptions.Form.Wizard.Actions.updateWizardProp,
            payload: {
                form: form,
                prop: propName,
                val: propVal,
            }
        }
    }
}

export const formWizardINI = (updatedFormProps) => {
    return function (dispatch) {
        dispatch(ACTIONS.updateWizardProp(updatedFormProps, 'maxIndex', Object.keys(updatedFormProps.children).length))
    }
}

export const formWizardGotoSlide = (form, index) => {
    return function (dispatch) {
        //@todo +updateWizardProps
        dispatch(ACTIONS.updateWizardProp(form, 'prevIndex', form.wizard.activeIndex))
        dispatch(ACTIONS.updateWizardProp(getForm(form.fid), 'activeIndex', index))
    }
}