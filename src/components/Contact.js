import {DsynrFormOptions} from "../DSYNR/Form/_/options";
import DsynrForm from "../DSYNR/Form";
import DsynrFormControl from "../DSYNR/Form/DsynrFormControl";
import {Container} from "react-bootstrap";

export const Contact = () => {
    const fid ='user'

    const form = {
        ...DsynrFormOptions.Form.Props,
        fid: fid,
        isWizard:false,
        submitBtnTxt: 'Submit',
    }

    const name = {
        ...DsynrFormOptions.Form.Control.Props,
        cid: 'name',
        fid: fid,
        label:'Name',
        highlightCls: 'p-3 mx-5 rounded-3 bg-info',
    }

    const emailField = {
        ...DsynrFormOptions.Form.Control.Props,
        cid: 'emailField',
        fid: fid,
        label:'Email',
        type: DsynrFormOptions.Form.Control.Types.email,
        highlightCls: 'p-3 mx-5 rounded-3 bg-info',
    }

    const textareaField = {
        ...DsynrFormOptions.Form.Control.Props,
        cid: 'textareaField',
        fid: fid,
        label:'Address',
        type: DsynrFormOptions.Form.Control.Types.textarea,
        highlightCls: 'p-3 mx-5 rounded-3 bg-info',
    }

    return <>

        <DsynrForm {...form}>

            <Container className='bg-light p-4'>
                <DsynrFormControl {...name}/>
                <DsynrFormControl {...emailField}/>
                <DsynrFormControl {...textareaField}/>
            </Container>
        </DsynrForm>

    </>
}