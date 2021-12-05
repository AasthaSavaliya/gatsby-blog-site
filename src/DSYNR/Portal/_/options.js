import React from "react";
import {ArrowLeft, ArrowRight, Pencil} from "react-bootstrap-icons";

/**
 * Global defaults which serve as the single source of constants used across the app.
 * @see https://react-bootstrap.netlify.app/portalonents/modal/#modals
 * @type {{Actions: {enlistPortal: string, updatePortalProp: string}, Props: {ico: undefined, size: string, footer: undefined, hasBackdrop: boolean, isClosable: boolean, backdropCls: undefined, description: undefined, header: undefined, pid: undefined, isVisible: boolean, title: undefined, body: undefined}}}
 */
export const DsynrPortalOptions = {
    Actions: {
        enlistPortal: 'enlistPortal',
        updatePortalProp: 'updatePortalProp',
    },
    Props: {
        pid: undefined,

        ico: undefined,
        title: undefined,
        description: undefined,

        body: undefined,
        bodyCls: 'p-0',

        header: undefined,
        headerCls: 'border-0',

        footer: undefined,
        footerCls: 'border-0',

        isVisible: true,
        isClosable: true,
        isCentered: true,
        isFullscreen: false,
        isScrollable: false,

        isDismissible: true, //set false (overrides isBackdropVisible) to disallow closing the portal by clicking outside
        isBackdropVisible: true, //backdrop wont hide if portal !isDismissible; use backdropCls to hide backdrop; if false there will be no backdrop
        backdropCls: undefined,

        size: 'xl',
    },
}