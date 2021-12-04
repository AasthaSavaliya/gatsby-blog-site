export const l = (...msg) => {
    console.log(...msg);
}
export const lf = (...params) => {
    l('{}', ...params);
}