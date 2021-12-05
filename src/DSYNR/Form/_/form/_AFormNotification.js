import React from "react";
import DsynrPortal from "../../../Portal";
import {DsynrPortalOptions} from "../../../Portal/_/options";
import {getFormNotificationId} from "../utils";

/**
 * @description Adds a DsynrPortal to display singular in-form pop-up notifications.
 * @param formProps
 * @returns {JSX.Element}
 * @private
 * @see DsynrPortal
 */
export default function _AFormNotification({formProps}) {

    const portalProps = {
        ...DsynrPortalOptions.Props,
        pid: getFormNotificationId(formProps.fid),
        // title: formProps.fid,
        description: ' ',
        // ico: 'ico',
        isDismissible: true,
        isBackdropVisible: false,
        size: 'sm',
        isClosable: true,
        isVisible: false,
        // bodyCls: 'border-0',
    }

    return <DsynrPortal {...portalProps}>
            {formProps.notification}
    </DsynrPortal>
}