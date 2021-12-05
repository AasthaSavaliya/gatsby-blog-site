import {useDispatch, useSelector} from "react-redux";
import {Modal} from "react-bootstrap";
import {getPortal} from "./_/utils";
import {portalInitialise, portalToggleVisibility} from "./_/actions";
import {lf} from "../Utils/debug";

/**
 * @description The DsynrPortal (or portal/modal) is the main parent container, which can have several children.
 * Every portal must be assigned properties (props). These props define how the portal will look and function.
 *
 * Multiple portals can be used in the same component / page or app, provided their pid's are unique!
 *
 * @example Defining a portalProps object with minimum required declaration:
 *
 * const DsynrPortalProps = {
 *  ...DsynrPortalOptions.Props, //required to ensure that all the default portal properties are included.
 *  pid: 'portalId', //required to ensure that the portal is unique among other portals in the app.
 *  ..., //navigate to DsynrPortalOptions.Props for all the available properties to customise the portal.
 * }
 *
 * <DsynrPortal {...DsynrPortalProps}>
 *     ...
 * </DsynrPortal>
 * @param portalProps The portalProps object contains default portal properties inherited using ...DsynrPortalOptions.Props, and other custom overrides.
 * @param {string} portalProps.pid The pid is a required parameter. pid or the portal id identifies the portal uniquely across the app and is also used as the key to access its state from the redux store.
 * @param {object} DsynrPortalOptions.Props Using ...DsynrPortalOptions.Props automatically includes all the available properties for the portal along with their default values.
 * To customise the portal features, add the props you wish to modify by adding them additionally.
 * @see DsynrPortalOptions.Props
 * @uses Modal from react-bootstrap
 * @returns {JSX.Element} Complete portal with all the children nested under it.
 * @constructor
 * @author [Dsynr]{@link https://dsynr.com}
 * @summary Use to add a portal (modal) within an app/component or a page.
 * @see DsynrPortalOptions.Props for available portalProps
 */
export default function DsynrPortal({...portal}) {

    lf('DsynrPortal', portal)

    const dispatch = useDispatch()

    if (!getPortal(portal.pid)) {
        dispatch(portalInitialise(portal))
    }

    portal = useSelector(state => state.portals[portal.pid])


    return <Modal
        onHide={() => {
            if (portal.isClosable) {
                dispatch(portalToggleVisibility(portal, false))
            }
        }}
        onExited={() => {
            if (portal.onExited) {
                portal.onExited()
            }
        }}
        onEntered={() => {
            if (portal.onEntered) {
                portal.onEntered()
            }
        }}
        scrollable={portal.isScrollable}
        fullscreen={portal.isFullscreen}
        centered={portal.isCentered}
        size={portal.size}
        show={portal.isVisible}

        backdrop={
            !portal.isDismissible ? 'static' //backdrop visible; use backdropCls to hide
                : portal.isBackdropVisible //portal can be closed by clicking outside; if false there will be no backdrop!
        }

        backdropClassName={portal.backdropCls}
        aria-labelledby={portal.pid}
    >
        {
            portal.header ? portal.header
                :
                portal.title || portal.ico || portal.isClosable ?
                    <Modal.Header className={portal.headerCls} closeButton={portal.isClosable}>
                        <Modal.Title id={portal.pid}>
                            <span className='me-2'>{portal.ico}</span>{portal.title}
                        </Modal.Title>
                    </Modal.Header>
                    : ''
        }

        <Modal.Body className={portal.bodyCls}>
            {portal.body || portal.children}
        </Modal.Body>

        {
            portal.footer || portal.description ?
                <Modal.Footer className={portal.footerCls}>
                    {portal.footer}
                    {
                        portal.description ?
                            <>
                                <div className='text-muted d-table mx-auto'>
                                    <span className='me-2'>{portal.ico}</span>{portal.description}
                                </div>
                            </>
                            : ''
                    }
                </Modal.Footer>
                : ''
        }
    </Modal>
}