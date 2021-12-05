import {useRef} from "react";

/**
 * @description The progressBar enhances the UX by displaying the overall form completion progress.
 * Its increment is split into minimum steps required to reach the max steps, i.e. 100%.
 * This is either based on total wizard slides (maxIndex), valid controls or can be manually specified by setting !useAutoProgress.
 * To disable set !isProgressVisible
 * @example The progress may be controlled by either of the following techniques:
 * [1] When the form is in wizard mode (default), the progress automatically increases based on the activeIndex of the wizard.
 * [2] When the form is NOT in wizard mode (!isWizard), the progress automatically increases based on the valid controls.
 * [3] Control progress manually by setting !useAutoProgress
 * [4] Using a custom progressBar component.
 * @see useAutoProgress
 * @param form
 * @returns {JSX.Element}
 * @private
 * @author [Dsynr]{@link https://dsynr.com}
 * @summary Displays the progress of form completion.
 */
export default function _AFormProgress({...form}) {

    const progressBarRootRef = useRef(null);

    //@todo form.data might not properly be updating (or false positives, like when self-resetting control), for invalid controls, dateTime, textarea...
    const controlsDone = Object.keys(form.data).length

    let useAutoProgress = form.useAutoProgress
    let progressValue, maxProgress

    let progress = ''
    if (form.isProgressVisible) {
        if (form.useCustomProgressBar === undefined) {
            if (useAutoProgress) {
                //auto progress
                if (form.isWizard) {
                    if (form.isControlProgressVisible) {
                        //progress based on slides + each control there in
                        //@todo
                    } else {
                        //progress based on slides only
                        maxProgress = form.wizard.maxIndex - 1
                        progressValue = form.wizard.activeIndex
                    }
                } else {
                    maxProgress = Object.keys(form.controls).length - 1
                    progressValue = controlsDone
                }
            } else {
                maxProgress = form.progressStepsMax
                progressValue = form.progressStepNow
            }

            if (progressBarRootRef.current !== null) {
                const maxW = progressBarRootRef.current.offsetWidth
                const minW = maxW / maxProgress
                progressValue = (progressValue * minW) + 'px'
            }

            let progressBarRootStyle = {height: form.progressBarHeight}

            let progressBarStyle = ''
            if (form.progressBarCls === undefined) {
                progressBarStyle = {
                    transition: form.progressTransition,
                    clip: `rect(0, ${progressValue}, ${form.progressBarHeight}, 0)`, //@todo clip is deprecated use clipPath+transition (not working)
                    background: 'linear-gradient(-45deg, rgba(0, 255, 207, 1) 0%, rgba(0, 255, 254, 1) 25%, rgba(180, 0, 241, 1) 100%)'
                }
            }

            progress = <div ref={progressBarRootRef} style={progressBarRootStyle}
                            className={`progressBarRoot position-relative w-100 ${form.progressBarRootCls}`}
            >
                <div style={progressBarStyle}
                     className={`progressBar position-absolute left w-100 h-100 ${form.progressBarCls}`}
                />
            </div>
        } else {
            progress = form.useCustomProgressBar
        }
    }

    return <>{progress}</>
}