import {FloatingLabel, FormLabel} from "react-bootstrap";
import React from "react";
import {DsynrFormOptions} from "../options";

export default function _AFormControlLabel(control) {

    let standardLabel

    const label = <FormLabel className={control.labelCls}
                             visuallyHidden={!control.isLabelVisible}>
        {control.label}
    </FormLabel>

    const floatingLabel = <FloatingLabel controlId={control.cid}
                                         label={control.label}
                                         className={control.labelCls}>

        {control.control}
    </FloatingLabel>

    const controlTypes = DsynrFormOptions.Form.Control.Types
    switch (control.type) {
        case controlTypes.checkbox:
        case controlTypes.switch:
        case controlTypes.radio:
            standardLabel = <>
                {control.control}
                {label}
            </>
            break
        default:
            standardLabel = <>
                {!control.isLabelConjoined ? label : ''}
                {control.control}
            </>
            break
    }

    return <>
        {control.isLabelFloating ? floatingLabel : standardLabel}
    </>
}
