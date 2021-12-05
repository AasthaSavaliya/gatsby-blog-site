import React from "react";
import {ArrowLeft, ArrowRight, Pencil} from "react-bootstrap-icons";

/**
 * Global defaults which serve as the single source of constants used across DsynrForms.
 * @type {{Form: {Control: {Types: {dateTime: string, number: string, password: string, select: string, hidden: string, checkbox: string, textarea: string, text: string, email: string, switch: string, radio: string}, Actions: {enlistControl: string, updateControlProp: string, updateControlProps: string}, Props: {onUnChange: undefined, defaultValue: string, type: string, hasTime: boolean, isDefaultValueAllowed: boolean, isExtraInfoVisibleOnFocus: boolean, isVirgin: boolean, onChangeRegardless: undefined, options: undefined, onHighlight: undefined, isDisabled: boolean, isHighlightedOnFocus: boolean, isRequired: boolean, labelCls: string, isRealTimeFormDataUpdate: boolean, onChange: undefined, highlightCls: string, isVisible: boolean, cls: string, isInvalid: boolean, isFocused: boolean, onFocus: undefined, onValid: undefined, hasRealTimeValidation: boolean, size: string, errorCls: string, placeholderCls: string, isPlaintext: boolean, extraInfo: undefined, isLabelConjoined: boolean, isPlaceholderVisible: boolean, errorTip: string, onUnHighlight: undefined, selfResetTxt: JSX.Element, hasSelfReset: boolean, isValidationVisible: boolean, isReadOnly: boolean, isExtraInfoVisible: boolean, isChanged: boolean, placeholder: string, value: string, isHighlighted: boolean, isLabelInline: boolean, extraInfoCls: string, isValid: boolean, label: undefined, onInvalid: undefined, onBlur: undefined, isLabelFloating: boolean, isLabelVisible: boolean, selfResetCls: undefined, selfResetVariant: string}}, Actions: {updateFormProp: string, updateFormProps: string, enlistForm: string}, Props: {controls: {}, data: {}, submitBtnVariant: string, footer: undefined, progressBarHeight: string, isWizard: boolean, body: JSX.Element, resetBtnTxt: string, progressStepsMax: number, isResetBtnVisibleDuringWizard: boolean, isResetBtnVisible: boolean, submitBtnCls: undefined, isResetActionOverride: boolean, isControlErrorsVisible: boolean, isStyled: boolean, onSubmitSuccess: undefined, submitBtnTxt: string, isSubmitBtnVisible: boolean, onSubmitError: undefined, progressStepNow: number, isSubmitBtnVisibleDuringWizard: boolean, hasErrors: boolean, isSendAllData: boolean, useCustomProgressBar: undefined, hasData: boolean, isValid: boolean, isSubmitActionOverride: boolean, resetAction: undefined, progressTransition: string, resetBtnVariant: string, isProgressVisible: boolean, cls: undefined, isVisible: boolean, token: undefined, disableBtnsOnError: boolean, submitURL: undefined, resetBtnSize: string, isControlProgressVisible: boolean, resetBtnCls: undefined, submitAction: undefined, header: undefined, progressBarRootCls: string, wizard: undefined, progressBarCls: undefined, errors: {}, useAutoProgress: boolean, submitBtnSize: string}, Wizard: {Actions: {updateWizardProp: string}, Props: {activeIndex: number, prevBtnTxt: JSX.Element, nextBtnVariant: string, nextBtnCls: undefined, nextBtnTxt: JSX.Element, maxIndex: number, prevBtnVariant: string, prevBtnCls: undefined, isPrevBtnVisible: boolean, isActive: boolean, isNextBtnVisible: boolean}}}}}
 */
export const DsynrFormOptions = {
    /**
     * @description Available options for Form actions and properties.
     */
    Form: {
        /**
         * @description Form actions used for the redux actions and reducers to process.
         */
        Actions: {
            /**
             * @description Register the form along with all of its controls in the store.
             */
            enlistForm: 'enlistForm',
            /**
             * @description Update a single property of the form.
             */
            updateFormProp: 'updateFormProp',
            /**
             * @description Update multiple properties of the form.
             */
            updateFormProps: 'updateFormProps',
        },
        /**
         * @description Default form properties. For available options, refer the options.js
         * @example To include all the form properties when defining the fromProps object use:
         ...DsynrFormOptions.Form.Props
         */
        Props: {
            token: undefined,//The token is set as bearer authorisation to facilitate exchange of data via APIs.
            controls: {},
            errors: {},
            hasErrors: false,
            data: {},
            hasData: false,
            body: undefined,

            header: undefined,
            footer: undefined,
            cls: undefined,
            isStyled: true,
            notification:false,//The content for in-form notification. Only one notification at a time.

            /**
             * @description submitAction is not async. It executes right after formSubmit, without waiting for the formSubmit results.
             * To execute submitAction on response, instead use onSubmitSuccess / onSubmitError
             */
            submitAction: undefined,
            isSubmitActionOverride: false,//Set true to replace default formSubmit behaviour.
            submitURL: undefined,
            isSendAllData: true,
            onSubmitError: undefined,
            onSubmitSuccess: undefined,

            submitBtnTxt: 'Submit',
            submitBtnSize: 'lg',
            submitBtnCls: undefined,//Use in addition to the btnVariant.
            submitBtnVariant: 'info',
            isSubmitBtnVisible: true,
            isSubmitBtnVisibleDuringWizard: true,

            resetAction: undefined,
            isResetActionOverride: true,//Trigger resetAction preceded by formReset, set true to replace default reset behaviour.

            resetBtnTxt: 'Reset',
            resetBtnSize: 'lg',
            resetBtnCls: undefined,
            resetBtnVariant: 'outline-danger',
            isResetBtnVisible: true,
            isResetBtnVisibleDuringWizard: true,

            disableBtnsOnError: false,

            isVisible: true,
            isDisabled: false,//Setting the form to disabled will disable all of its controls and set pointer-events to none.
            isBusy: false,//Use when performing in-form async actions (prior to submission) to disallow access to of the controls for the time the action runs. Setting the form to busy sets isDisabled to true.

            isWizard: true,
            wizard: undefined,

            isValid: true,
            isControlErrorsVisible: true,//@todo?

            isProgressVisible: true,
            isControlProgressVisible: false,//@todo Show minor progress increment upon individual control validation in wizard mode.
            useCustomProgressBar: undefined,//When supplied, will replace the default progressBar component.
            /**
             * Following props apply only when using the default progressBar.
             */
            progressBarRootCls: 'bg-white my-3',
            progressBarCls: undefined,//If defined, will replace default styles and cls of progressBar.
            progressTransition: 'clip 1s ease-in-out',//CSS transition value.
            progressBarHeight: '5px',
            useAutoProgress: true,//When false, disables the auto-progress and requires updating vals manually to show progress.
            progressStepNow: 0,//Define the current progress step.
            progressStepsMax: 10,//Define the maximum steps the progress is split into.
        },
        /**
         * @description When multiple children are provided within the form body, the form automatically assumes wizard mode.
         * In wizard mode, for every direct descendent of the DsynrForm, a slide (step) is created with previous/next buttons.
         * The default progressBar in the form now increases based on the active index of the wizard.
         * @example To override wizard properties use:
         * const formProps = {
         *  ...DsynrFormOptions.Form.Props,
         *  fid: fid,
         *  wizard:{
         *      isActive: 2 //set the active index of the wizard to directly show the second step (or slide) in the form when it loads
         *      ... //use ...DsynrFormOptions.Form.Props.Wizard.Props to get a list of available props.
         *  }
         * }
         * @see https://react-bootstrap.github.io/components/carousel/ The wizard uses bootstrap carousel
         */
        Wizard: {
            Actions: {
                updateWizardProp: 'updateWizardProp',
            },
            /**
             * @description Default properties for the form wizard. For available options, refer the options.js
             * @example By default all the formWizard properties are included when defining the fromProps object.
             ...DsynrFormOptions.Form.Props.Wizard.Props
             */
            Props: {
                isActive: true,
                maxIndex: 0,
                activeIndex: 0,
                prevIndex: 0,
                isPrevBtnVisible: true,
                prevBtnTxt: <ArrowLeft/>,
                prevBtnCls: undefined,
                prevBtnVariant: 'outline-dark',
                isNextBtnVisible: true,
                nextBtnTxt: <ArrowRight/>,
                nextBtnCls: undefined,
                nextBtnVariant: 'dark',

                /**
                 * @example Following functions, if defined, must return true for the promise to resolve and change wizardStep
                 onGotoNextStep: () => {
                 ...
                return true
            }   }
                 */
                onGotoNextStep: undefined,
                onNextStep: undefined,
                onGotoPrevStep: undefined,
                onPrevStep: undefined,
            }
        },
        /**
         * @description Available options for FormControl actions and properties.
         */
        Control: {
            Actions: {
                enlistControl: 'enlistControl',
                updateControlProp: 'updateControlProp',
                updateControlProps: 'updateControlProps',
            },
            /**
             * @description Default properties for DsynrFormControl. For available options, refer the options.js
             * @example To include all the formControl properties when defining the controlProps object use:
             ...DsynrFormOptions.Form.Control.Props
             */
            Props: {
                type: 'text',//DsynrFormOptions.formControlTypes.text
                isRequired: false,
                isReadOnly: false,
                isPlaintext: false,//Display control and label as plain text. @todo change floating label cls when using this
                isVisible: true,
                isDisabled: false,

                isChanged: false,
                onChange: undefined,
                onUnChange: undefined,
                onChangeRegardless: undefined,

                isVirgin: true,

                isValid: false,
                onValid: undefined,

                isInvalid: false,
                onInvalid: undefined,

                isFocused: false,
                onFocus: undefined,
                onBlur: undefined,

                isRealTimeFormDataUpdate: true,//Set false to update fromData onBlur only instead of onChange
                hasRealTimeValidation: true,//Set false to validate control value onChange instead of onBlur

                /**
                 * @todo improve implementation adding InputGroup.Text to show the reset button messes with non-textual controls
                 */
                hasSelfReset: true,
                selfResetTxt: <Pencil/>,
                selfResetCls: undefined,
                selfResetVariant: 'dark',

                defaultValue: '',
                isDefaultValueAllowed: false,

                value: '',
                options: undefined,//Only controls of the type Select use the options property.
                hasTime: false,//Only controls of the type dateTime use the hasTime property.

                cls: 'p-3 mx-5',//Applies to the control container.
                size: 'lg',//Doesn't affect when isLabelFloating.

                highlightCls: 'p-3 mx-5 rounded-3 bg-warning shadow-lg', //replaces the control container cls
                isHighlighted: false,
                isHighlightedOnFocus: true,
                onHighlight: undefined,
                onUnHighlight: undefined,

                label: undefined,
                labelCls: 'text-muted',
                isLabelFloating: false,
                isLabelConjoined: false,
                isLabelVisible: true, //doesnt hide label when isLabelFloating
                isLabelInline: true, //applies to checkboxes and radios only

                placeholder: ' ', //isLabelFloating doesnt work properly if placeholder is empty
                placeholderCls: 'text-muted', //applies only when isLabelFloating (placeholder is shown along _AFormControlExtraInfo instead of inline in control where the label is showing)
                isPlaceholderVisible: true,

                extraInfo: undefined,
                extraInfoCls: 'text-muted opacity-75',
                isExtraInfoVisible: true,
                isExtraInfoVisibleOnFocus: true,//@todo

                errorTip: 'Eh!',
                errorCls: 'p-3 mx-5 rounded-3 shadow bg-warning bg-opacity-25 border border-warning', //replaces the control container cls
                isValidationVisible: true,
            },
            /**
             * @description The formControlTypes match the different types of HTML form controls available for use in the forms.
             * @example By default if no type is specified, the formControl assumes the format of text input field.
             * To specify a specific controlType use:
             * DsynrFormOptions.Form.Control.Types. //select desired control type
             */
            Types: {
                text: 'text',
                email: 'email',
                number: 'number',
                textarea: 'textarea',
                select: 'select',
                checkbox: 'checkbox',
                switch: 'switch',
                radio: 'radio',
                password: 'password',
                dateTime: 'dateTime',//@todo buggy
                hidden: 'hidden',
            },
        },
    },
}