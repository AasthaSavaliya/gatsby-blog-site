import {useSelector} from "react-redux";

/**
 * @description The DsynrFormControlData dynamically displays the current value of any form control. It can be used anywhere in the app.
 * Defining DsynrFormControlData prior to defining DsynrForm is ok but should ONLY be used after the DsynrForm has rendered, or it won't be able to find the value and consequently throw an error.
 * @example Minimum required declaration:
 * <DsynrFormControlData fid='theFormID' cid='theControlID'/>
 * @example Minimum required declaration with CORRECT usage:
 *
 * const fid = 'formId'
 * const cid = 'controlId'
 *
 * <DsynrForm {...formProps}>
 * <DsynrFormControl {...DsynrFormControlProps} />
 * </DsynrForm>
 *
 * <DsynrFormControlData fid={fid} cid={cid}/>
 * @example Minimum required declaration with INCORRECT usage (calling before the form throws error):
 *
 * const fid = 'formId'
 * const cid = 'controlId'
 *
 * <DsynrFormControlData fid={fid} cid={cid} />
 *
 * <DsynrForm {...formProps}>
 * <DsynrFormControl {...DsynrFormControlProps} />
 * </DsynrForm>
 * @param fid Required - The id of the form to search for the control.
 * @param cid Required - The id of the control in the form to show the value of.
 * @returns {string} Stringified value stored in the 'value' prop of the control.
 * @constructor
 * @author [Dsynr]{@link https://dsynr.com}
 * @summary Use to show the value of a control anywhere within an app/component or a page.
 * @todo Allow choosing between label or value when controlType is not text/datetime
 */
export default function DsynrFormControlData({fid, cid}) {

    let control

    control = useSelector(state => state.forms[fid].controls[cid])

    return control.value.toString()
}