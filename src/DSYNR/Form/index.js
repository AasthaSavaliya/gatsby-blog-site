import {useDispatch, useSelector} from "react-redux";
import {formInitialise} from "./_/form/actions";
import {getForm} from "./_/utils";
import _AForm from "./_/form/_AForm";
import _AFormNotification from "./_/form/_AFormNotification";

/**
 * @description The DsynrForm (or form) is the main parent container, which can has several children, i.e. one or more controls, images, headings, and other html tags.
 * Every form must be assigned properties (props). These props define how the form will look and function.
 *
 * Multiple forms can be used in the same component / page or app, provided their fid's are unique!
 *
 * When multiple children are provided within the form body, the form automatically assumes wizard mode. To avoid this, set isWizard to false.
 * @example Defining a formProps object with minimum required declaration:
 *
 * const DsynrFormProps = {
 *  ...DsynrFormOptions.Form.Props, //required to ensure that all the default form properties are included.
 *  fid: 'formId', //required to ensure that the form is unique among other forms in the app.
 * }
 *
 * <DsynrForm {...DsynrFormProps}>
 *     ...
 * </DsynrForm>
 * @example Defining a formProps object with custom overrides and usage (along with children) in components:
 *
 * const fid = 'anotherFormId' //define separately as fid is also going to be used in the controls (DRY + avoids typos).
 *
 * const formProps = {
 *  ...DsynrFormOptions.Form.Props,
 *  fid: fid,
 *  cls: 'm-5 p-5 bg-info', //use bootstrap classnames or custom classnames defined in css
 *  isWizard: false,
 *  ..., //navigate to DsynrFormOptions.Form.Props for all the available properties
 * }
 *
 * <DsynrForm {...formProps}>
 * <DsynrFormControl {...DsynrFormControlProps} />
 * </DsynrForm>
 * @param formProps The formProps object contains default from properties inherited using ...DsynrFormOptions.Form.Props, and other custom overrides.
 * @param {string} formProps.fid The fid is a required parameter. fid or the form id identifies the form uniquely across the app and is also used as the key to access its state from the redux store.
 * @param {object} formProps.DsynrFormOptions.Form.Props Using ...DsynrFormOptions.Form.Props automatically includes all the available properties for the form along with their default values.
 * To customise the form features, add the props you wish to modify by adding them additionally.
 * @see DsynrFormOptions.Form.Props
 * @uses Form from react-bootstrap
 * @see https://developer.mozilla.org/en-US/docs/Web/Security/Securing_your_site/Turning_off_form_autocompletion autoComplete bug in reactForms
 * @returns {JSX.Element} Complete form including controls (with validation) passed to it as children, wizard (optional) and submit/reset buttons
 * @constructor
 * @author [Dsynr]{@link https://dsynr.com}
 * @summary Use to add a form within an app/component or a page.
 */
export default function DsynrForm({...formProps}) {

    const dispatch = useDispatch()

    if (!getForm(formProps.fid)) {
        dispatch(formInitialise(formProps))
    }

    formProps = useSelector(state => state.forms[formProps.fid])

    return <>
        <_AForm formProps={formProps}/>
        <_AFormNotification formProps={formProps}/>
    </>
}