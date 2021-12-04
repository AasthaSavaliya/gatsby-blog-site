import {FormCheck, FormControl, InputGroup} from "react-bootstrap";
import React from "react";
import {DsynrFormOptions} from "../options";
import _AFormControlTypeSelect from "./_AFormControlTypeSelect";
import _AFormControlTypeDateTime from "./_AFormControlTypeDateTime";
import formControlEvents from "./events";
import {useSelector} from "react-redux";

export default function _AFormControl({...control}) {

    // control = useSelector(state => state.forms[control.fid].controls[control.cid])

    let formControl
    const isFormDisabled = useSelector(state => state.forms[control.fid].isDisabled)

    const controlTypes = DsynrFormOptions.Form.Control.Types
    let commonDOMAttributes = {
        autoFocus: control.isFocused,
        disabled: control.isDisabled || isFormDisabled,
        isInvalid: control.isInvalid,
        isValid: control.isValid,
        size: control.size,
        ...formControlEvents(control)
    }
    switch (control.type) {
        case controlTypes.textarea:
            commonDOMAttributes.as = control.type
            break
        default:
            commonDOMAttributes.type = control.type
            break
    }

    switch (control.type) {
        case controlTypes.dateTime:
            formControl = <_AFormControlTypeDateTime {...control}/>
            break
        case controlTypes.select:
            formControl = <_AFormControlTypeSelect commonDOMAttributes={commonDOMAttributes} {...control}/>
            break
        case controlTypes.checkbox:
        case controlTypes.switch:
        case controlTypes.radio:
            formControl = <FormCheck
                checked={control.value}
                inline={control.isLabelInline}
                {...commonDOMAttributes}
            />
            break
        default:
            //text
            formControl = <FormControl
                value={control.value}
                readOnly={control.isReadOnly}
                plaintext={control.isPlaintext}
                placeholder={
                    control.isLabelFloating ? control.placeholder :
                        (control.isPlaceholderVisible ? control.placeholder : '')
                }
                {...commonDOMAttributes}
            />
            break
    }

    if (control.isLabelConjoined) {
        formControl = <>
            <InputGroup>
                {
                    control.label && control.isLabelVisible && control.isLabelConjoined ?
                        <>
                            <InputGroup.Text className={control.labelCls}>
                                {control.label}
                            </InputGroup.Text>
                        </>
                        : ''
                }
                {formControl}
            </InputGroup>
        </>
    }

    return <>
        {formControl}
    </>
}