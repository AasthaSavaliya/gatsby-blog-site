import {l, lf} from "./debug.js";

/**
 * Returns request response regardless of success or failure. User response.data to access request response data
 * @param url
 * @param formData
 * @param token
 * @param method
 * @returns {Promise<any>}
 */
export async function networkRequest(url, formData = false, token = false, method = 'GET') {
    lf(`••• networkRequest: ${url} @${method}`, formData);

    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    if (token) {
        headers.append("Authorization", `Bearer ${token}`);
    }

    const reqOptions = {
        method: method,
        headers: headers,
    };

    if (formData) {
        reqOptions.body = JSON.stringify(formData)
    }

    let response
    try {
        response = await fetch(url, reqOptions)
        const data = await response.json()
        response.data = data
        lf('Fetch succeeded. Returning the response as is. (Server may or many not have responded normally)', data)
    } catch (e) {
        response = e
        l('Fetch failed reaching the server or other network issue @', url, response)
    }

    return response
}
