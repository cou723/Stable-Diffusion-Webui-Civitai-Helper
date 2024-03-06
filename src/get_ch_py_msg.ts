"use strict";
// get msg from python side from a hidden textbox
// normally this is an old msg, need to wait for a new msg
export function get_ch_py_msg() {
    console.log("run get_ch_py_msg");
    const py_msg_txtbox = <HTMLInputElement>(
        gradioApp().querySelector("#ch_py_msg_txtbox textarea")
    );
    if (py_msg_txtbox && py_msg_txtbox.value) {
        console.log("find py_msg_txtbox");
        console.log("py_msg_txtbox value: ");
        console.log(py_msg_txtbox.value);
        return py_msg_txtbox.value;
    } else {
        return "";
    }
}
