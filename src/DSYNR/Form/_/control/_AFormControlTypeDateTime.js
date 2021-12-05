import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {setHours, setMinutes} from "date-fns";
import formControlEvents, {triggerFormControlChange} from "./events";
import {isFromControlTypeDateTime, isFromControlTypeOption} from "../utils";
import {lf} from "../../../Utils/debug";

//@todo onfocus/blur not working
export default function _AFormControlTypeDateTime({...control}) {

    // control = useSelector(state => state.forms[control.fid].controls[control.cid])

    // lf('control.value.......', typeof control.value)
    // const dateTime = Date.parse(control.value) //@todo provision for displaying friendly time
    // lf('dateTime.......', typeof dateTime)
//https://github.com/Hacker0x01/react-datepicker/blob/master/docs/datepicker.md
    return <DatePicker
        inline
        // utcOffset={-4}
        selected={control.value} //@todo value not passing to formData, type coercion?

        onChange={
            (date) => {
                // lf('date.......', typeof date)
                triggerFormControlChange(control, date)
            }}

        dateFormatCalendar='LLLL'
        allowSameDay={false}
        placeholderText="Select a date other than today or yesterday"
        showTimeSelect={control.hasTime}
        excludeTimes={[
            setHours(setMinutes(new Date(), 0), 17),
            setHours(setMinutes(new Date(), 30), 18),
            setHours(setMinutes(new Date(), 30), 19),
            setHours(setMinutes(new Date(), 30), 17),
        ]}
    />
}