import {Button, ButtonGroup, Carousel, CarouselItem} from "react-bootstrap";
import React from "react";
import {useDispatch} from "react-redux";
import {formWizardGotoSlide} from "./actions";
import {lf} from "../../../Utils/debug";
import {networkRequest} from "../../../Utils/network";
import {dataPosted} from "../form/actions";

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
 * @param form
 * @returns {JSX.Element}
 * @private
 * @author [Dsynr]{@link https://dsynr.com}
 * @summary Displays a form as a multi-step wizard.
 */
export default function _AFormWizard(form) {

    const dispatch = useDispatch()

    const wizardSlides = Object.keys(form.children)

    const wizard = form.wizard

    const isPrevBtnVisible = wizard.isPrevBtnVisible
    const isNextBtnVisible = wizard.isNextBtnVisible
    const prevIndex = wizard.prevIndex
    const activeIndex = wizard.activeIndex
    const maxIndex = wizard.maxIndex

    const gotoIndex = (index) => {
        dispatch(formWizardGotoSlide(form, index))
    }

    const changeWizardStep = (theStep, theIndex) => {
        if (theStep) {
            // lf('theStep EXISTS..........')
            new Promise(async (resolve, reject) => {
                // lf('theStep Promise..........')

                let response = await theStep(form)
                // lf('theStep Promise..........response @theStep=', response)
                if (response) {
                    // lf('theStep Promise..........resolve')
                    resolve()
                } else {
                    // lf('theStep Promise..........reject')
                    reject()
                }
            }).then(() => {
                // lf('theStep Promise..........THEN......')
                gotoIndex(theIndex)
            }).catch(() => {
                // lf('theStep Promise..........CATCH?......')
                //@todo show hinter?
            })
        } else {
            // lf('theStep NOT Promise..........ELSE......')
            gotoIndex(theIndex)
        }
    }

    const gotoNextWizardStep = () => {
        if (activeIndex < maxIndex) {
            changeWizardStep(wizard.onGotoNextStep, activeIndex + 1)
        }
    }

    const gotoPreviousWizardStep = () => {
        if (activeIndex > 0) {
            changeWizardStep(wizard.onGotoPrevStep, activeIndex - 1)
        }
    }

    return <>
        <Carousel
            activeIndex={activeIndex}
            interval={null}
            indicators={false}
            controls={false}
            keyboard={false}
            touch={false}
            wrap={false}

            onSlide={() => {
                if (activeIndex < prevIndex) {
                    lf('wizard.onSlide...prevIndex', activeIndex, prevIndex, activeIndex < prevIndex)
                    if (wizard.onPrevStep) {
                        queueMicrotask(wizard.onPrevStep)
                    }
                } else {
                    lf('wizard.onSlide...NextStep', activeIndex, prevIndex, activeIndex < prevIndex)
                    if (wizard.onNextStep) {
                        queueMicrotask(wizard.onNextStep)
                    }
                }
            }}
        >
            {wizardSlides.map(index => {
                return <CarouselItem key={index}>
                    {form.children[index]}
                </CarouselItem>
            })}
        </Carousel>

        <div className="mx-auto d-table mt-4">
            <ButtonGroup size="lg">

                {
                    activeIndex === 0 ? '' :
                        <>{
                            isPrevBtnVisible ? <Button
                                    disabled={form.hasErrors}
                                    className={wizard.prevBtnCls}
                                    variant={wizard.prevBtnVariant}
                                    onClick={gotoPreviousWizardStep}
                                >
                                    {wizard.prevBtnTxt}
                                </Button>
                                : ''
                        }</>
                }

                {
                    activeIndex === maxIndex - 1 ? '' :
                        <>{
                            isNextBtnVisible ? <Button
                                    disabled={form.hasErrors}
                                    className={wizard.nextBtnCls}
                                    variant={wizard.nextBtnVariant}
                                    onClick={gotoNextWizardStep}
                                >
                                    {wizard.nextBtnTxt}
                                </Button>
                                : ''
                        }</>
                }

            </ButtonGroup>
        </div>
    </>
}