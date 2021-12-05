import {lf} from "./debug.js";

export const evalJS = (el) => {
    lf('evalJS', typeof el);
    if (typeof el === "string") {
        el = string2HTML(el);
    }
    let scripts = el.getElementsByTagName('script');
    for (let ix = 0; ix < scripts.length; ix++) {
        eval(scripts[ix].text);
    }
}
export const string2HTML = (str) => {
    lf('string2HTML');
    let parser = new DOMParser();
    let doc = parser.parseFromString(str, 'text/html');
    return doc.body;
};

export const isValidEmail = email => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export const bool2Int = bool => {
    return bool === true ? 1 : 0
}
