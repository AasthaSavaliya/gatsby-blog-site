import {Form} from "react-bootstrap";
import _AFormProgress from "./_AFormProgress";
import {hasChildrenReact} from "../utils";
import _AFormWizard from "../wizard/_AFormWizard";
import _AFormSubmitBtnSet from "./_AFormSubmitBtnSet";

/**
 * @description Generates a react-bootstrap form enhanced by DsynrFormProps.
 * @param formProps
 * @returns {JSX.Element|string}
 * @private
 * @summary The core form generator.
 */
export default function _AForm({formProps}) {
    return formProps.isVisible ?
        <Form
            className={`${formProps.isStyled ? formProps.cls : ''} ${formProps.isDisabled ? 'opacity-75 pe-none' : ''}`}
        >

            <_AFormProgress {...formProps}/>

            {
                hasChildrenReact(formProps) && formProps.isWizard ?
                    <_AFormWizard {...formProps}/> : (formProps.body || formProps.children)
            }

            <_AFormSubmitBtnSet {...formProps}/>
        </Form>
        : ''
}