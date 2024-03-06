"use strict";
// send msg to python side by filling a hidden text box
// then will click a button to trigger an action
// msg is an object, not a string, will be stringify in this function
function send_ch_py_msg(msg) {
    console.log("run send_ch_py_msg");
    console.log("msg: " + JSON.stringify(msg));

    let js_msg_txtbox = <HTMLInputElement>(
        gradioApp().querySelector("#ch_js_msg_txtbox textarea")
    );
    if (js_msg_txtbox && msg) {
        // fill to msg box
        js_msg_txtbox.value = JSON.stringify(msg);
        js_msg_txtbox.dispatchEvent(new Event("input"));
    }
}
