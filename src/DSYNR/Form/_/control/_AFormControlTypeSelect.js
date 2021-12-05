import {FormSelect} from "react-bootstrap";
import React from "react";

export default function _AFormControlTypeSelect({commonDOMAttributes, ...control}) {

    const options = Object.keys(control.options).map((key, index) => {
        return <option value={key} key={index}>
            {control.options[key]}
        </option>
    })

    return <>
        <FormSelect
            value={control.value}
            placeholder={
                control.isLabelFloating ? control.placeholder :
                    (control.isPlaceholderVisible ? control.placeholder : '')
            }
            {...commonDOMAttributes}
        >
            {options}
        </FormSelect>
    </>
}
