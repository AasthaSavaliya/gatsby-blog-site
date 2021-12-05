import {FormText} from "react-bootstrap";
import React from "react";

export default function _AFormControlExtraInfo(control) {

    let placeholder

    const extraInfo = (control.isExtraInfoVisible && control.extraInfo) ?
        <span className={control.extraInfoCls}>{control.extraInfo}</span> : ''

    if (control.label &&
        control.isPlaceholderVisible &&
        //add extra empty line if placeholder is ' '
        // (which is required otherwise isLabelFloating doesnt work properly if placeholder is empty)
        control.placeholder && control.placeholder !== ' ' &&
        control.isLabelFloating) {
        placeholder = <>
            <_AFormControlExtraInfo extraInfo={control.placeholder}
                                    extraInfoCls={control.placeholderCls}
                                    isExtraInfoVisible={true}
            />
            {control.extraInfo ? <br/> : ''}
        </>
    }

    return <>
        {placeholder}
        {extraInfo}
    </>
}
