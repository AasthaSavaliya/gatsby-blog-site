import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {Button, FormGroup} from "react-bootstrap";
import _AFormControl from "./_/control/_AFormControl";
import _AFormControlLabel from "./_/control/_AFormControlLabel";
import _AFormControlExtraInfo from "./_/control/_AFormControlExtraInfo";
import {getFormControl, isFromControlTypeOption, setInitialControlValue} from "./_/utils";
import {ControlActions, formControlReset} from "./_/control/actions";
import {Animated} from "react-animated-css";
import {DsynrFormOptions} from "./_/options";

/**
 * @description Use the DsynrFormControl (or form control or control) to specify an HTML form control.
 * Every control must be assigned properties (props). These props define how the control will look and function.
 *
 * Multiple controls can be used in the same form, provided their cid's are unique, and they have the same fid!
 * @example Defining a controlProps object with minimum required declaration:
 *
 * const DsynrFormControlProps = {
 *  ...DsynrFormOptions.Form.Control.Props, //required to ensure that all the default control properties are included.
 *  fid: 'formId', //required to ensure that the form and control are mapped correctly.
 *  cid: 'controlId', //required to ensure that the control is unique among other controls in the form.
 * }
 *
 * <DsynrFormControl {...DsynrFormControlProps} />
 * @example Defining a controlProps object with custom overrides and usage in forms:
 *
 * const fid = 'anotherFormId' //define separately as fid is also going to be used in form declaration as well as multiple controls (DRY + avoids typos).
 *
 * const anotherControlProps = {
 *  ...DsynrFormOptions.Form.Control.Props,
 *  fid: fid,
 *  cid: cid,
 *  size: 'sm', //use bootstrap sizing conventions
 *  isReadOnly: true,
 *  hasSelfReset: false,
 *  ..., //navigate to DsynrFormOptions.Form.Control.Props for all the available properties
 * }
 *
 * <DsynrForm {...formProps}>
 * <DsynrFormControl {...anotherControlProps} />
 * </DsynrForm>
 * @param controlProps The controlProps object contains default control properties inherited using ...DsynrFormOptions.Form.Control.Props, and other custom overrides.
 * @param {object} controlProps.DsynrFormOptions.Form.Control.Props Using ...DsynrFormOptions.Form.Control.Props automatically includes all the available properties for the control along with their default values.
 * @param {string} controlProps.cid The cid is a required parameter. cid or the control id identifies the control uniquely within the form and is also used as the key to access its state from the redux store.
 * @param {string} controlProps.fid The fid is a required parameter. fid ensures that the form and control are mapped correctly.
 * To customise the control features, add the props you wish to modify by adding them additionally.
 * @see DsynrFormOptions.Form.Control.Props
 * @see https://react-bootstrap.github.io/components/forms/ Controls use Bootstrap/Form
 * @returns {JSX.Element}
 * @constructor
 * @author [Dsynr]{@link https://dsynr.com}
 * @summary Use to add a form control within the form.
 */
export default function DsynrFormControl({...controlProps}) {

    const dispatch = useDispatch()

    if (!getFormControl(controlProps.fid, controlProps.cid)) {
        /**
         * @description Enlisting control is required when controls are not directly added within the forms but contained in widgets which are then nested in the form.
         * @example Select control for users
         */
        dispatch(ControlActions.enlistControl(controlProps))
    }

    controlProps = useSelector(state => state.forms[controlProps.fid].controls[controlProps.cid])
    const isFormDisabled = useSelector(state => state.forms[controlProps.fid].isDisabled)

    const isFieldTypeHidden = controlProps.type === DsynrFormOptions.Form.Control.Types.hidden

    let isSelfResetVisible = true
    if (isFromControlTypeOption(controlProps)) {
        isSelfResetVisible = false
    }

    const theControl = <_AFormControl {...controlProps}/>

    queueMicrotask(() => {
        setInitialControlValue(controlProps)
    })

    return <>
        {isFieldTypeHidden ? theControl : controlProps.isVisible ?
            <Animated animationIn="fadeInUp" animationOut="fadeOut" isVisible={true}>
                <div
                    className={`${controlProps.isHighlighted ? controlProps.highlightCls : (controlProps.isFocused && controlProps.isValidationVisible && controlProps.isInvalid ? controlProps.errorCls : controlProps.cls)}`}>
                    <FormGroup controlId={controlProps.cid}>

                        {
                            controlProps.label ?
                                <>
                                    <_AFormControlLabel control={theControl}
                                                        {...controlProps}
                                    />
                                </>
                                :
                                <>{theControl}</>
                        }
                    </FormGroup>

                    {
                        isSelfResetVisible && controlProps.hasSelfReset && controlProps.isChanged ?
                            // <div className='text-center' style={{width: '50px'}}>
                            <Button disabled={isFormDisabled}
                                    variant={controlProps.selfResetVariant}
                                    className={controlProps.selfResetCls}
                                    onClick={
                                        () => {
                                            dispatch(formControlReset(controlProps))
                                        }}
                            >{controlProps.selfResetTxt}
                            </Button>
                            // </div>
                            : ''
                    }

                    <_AFormControlExtraInfo {...controlProps}/>
                </div>
            </Animated>
            : ''
        }
    </>
}