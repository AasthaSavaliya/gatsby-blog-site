import {DsynrPortalOptions} from "./options";
import {lf} from "../../Utils/debug";
import {updateObj} from "../../Utils/obj";
import {updatePortalProp, updateState} from "./utils";

/**
 * @description The DsynrPortals reducer will process and update the state of DsynrPortals within the app (with the new values) passed to it via the dispatched action.
 * @param portals The portals' state to use with the reducer. Providing initial state is optional, as the action dispatcher is anyway going to provide the latest state for the reducer to work on.
 * @param action The action object that was dispatched using one of the portal actions.
 * @returns {{}|*} A copy of the updated portals' state after being processed by the reducer.
 * @constructor
 * @summary The DsynrPortals reducer only works if the portal-action dispatched is defined in the switch-case.
 * @author [Dsynr]{@link https://dsynr.com}
 */
export default function DsynrPortals(portals = {}, action) {
    if (action.payload) {

        const payload = action.payload
        lf('payload@REDUCER_Portals:::', payload)

        let portal, pid
        if (payload.portal !== undefined) {

            portal = payload.portal
            pid = portal.pid

            switch (action.type) {

                case DsynrPortalOptions.Actions.enlistPortal:
                    return updateObj(portals, {[pid]: payload.portal})

                case DsynrPortalOptions.Actions.updatePortalProp:
                    return updateState(portals, pid,
                        updatePortalProp(portals[portal.pid], payload.prop, payload.val)
                    )
            }
        }

    }
    return portals
}