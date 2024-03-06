"use strict";
// get msg from python side from a hidden textbox
// it will try once in every sencond, until it reach the max try times
export const get_new_ch_py_msg = (max_count = 5) =>
    new Promise((resolve, reject) => {
        console.log("run get_new_ch_py_msg");

        let count = 0;
        let new_msg = "";
        let find_msg = false;
        const interval = setInterval(() => {
            const py_msg_txtbox = <HTMLInputElement>(
                gradioApp().querySelector("#ch_py_msg_txtbox textarea")
            );

            count++;

            if (py_msg_txtbox && py_msg_txtbox.value) {
                console.log("find py_msg_txtbox");
                console.log("py_msg_txtbox value: ");
                console.log(py_msg_txtbox.value);

                new_msg = py_msg_txtbox.value;
                if (new_msg != "") {
                    find_msg = true;
                }
            }

            if (find_msg) {
                //clear msg in both sides
                py_msg_txtbox.value = "";
                py_msg_txtbox.dispatchEvent(new Event("input"));

                resolve(new_msg);
                clearInterval(interval);
            } else if (count > max_count) {
                //clear msg in both sides
                py_msg_txtbox.value = "";
                py_msg_txtbox.dispatchEvent(new Event("input"));

                reject("");
                clearInterval(interval);
            }
        }, 1000);
    });
