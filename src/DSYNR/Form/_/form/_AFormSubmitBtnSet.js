import {Button} from "react-bootstrap";
import {useDispatch} from "react-redux";
import React from "react";
import {formReset, formSubmit} from "./actions";

export default function _AFormSubmitBtnSet({...form}) {

    const dispatch = useDispatch()

    return <>
        {
            form.isSubmitBtnVisible || form.isResetBtnVisible ?
                <>
                    <div className='d-table mx-auto mt-4'>
                        {
                            (form.isSubmitBtnVisible && form.isSubmitBtnVisibleDuringWizard)
                            || (form.isSubmitBtnVisible
                                && form.isWizard
                                && form.wizard.activeIndex === form.wizard.maxIndex - 1
                            ) ?
                                <Button variant={form.submitBtnVariant} size={form.submitBtnSize}
                                        className={form.submitBtnCls}
                                        onClick={() => {
                                            dispatch(formSubmit(form))
                                        }}
                                        disabled={form.hasErrors}
                                >
                                    {form.submitBtnTxt}
                                </Button>
                                : ''
                        }
                        {
                            ((form.hasData || form.hasErrors) && form.isResetBtnVisible)
                            || (form.isResetBtnVisible && form.isWizard && form.isResetBtnVisibleDuringWizard
                                && form.wizard.activeIndex === form.wizard.maxIndex - 1
                            ) ?
                                <Button variant={form.resetBtnVariant} size={form.resetBtnSize}
                                        className={form.resetBtnCls}
                                        onClick={() => {
                                            dispatch(formReset(form))
                                        }}
                                >
                                    {form.resetBtnTxt}
                                </Button>
                                : ''
                        }
                    </div>
                </> : ''
        }
    </>
}
