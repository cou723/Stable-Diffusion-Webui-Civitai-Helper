"use strict";
//button's click function

async function open_model_url(event: any, model_type: any, search_term: any) {
    console.log("start open_model_url");

    //get hidden components of extension
    let js_open_url_btn = globalThis
        .gradioApp()
        .getElementById("ch_js_open_url_btn");
    if (!js_open_url_btn) {
        return;
    }

    //msg to python side
    let msg = {
        action: "open_url",
        model_type: model_type,
        search_term: search_term,
        prompt: "",
        neg_prompt: "",
    };

    // fill to msg box
    send_ch_py_msg(msg);

    //click hidden button
    js_open_url_btn.click();

    // stop parent event
    event.stopPropagation();
    event.preventDefault();

    //check response msg from python
    let new_py_msg: any = "";
    try {
        new_py_msg = await get_new_ch_py_msg();
    } catch (error) {
        console.log(error);
    }

    console.log("new_py_msg:");
    console.log(new_py_msg);

    //check msg
    if (new_py_msg) {
        let py_msg_json = JSON.parse(new_py_msg);
        //check for url
        if (py_msg_json && py_msg_json.content) {
            if (py_msg_json.content.url) {
                window.open(py_msg_json.content.url, "_blank");
            }
        }
    }

    console.log("end open_model_url");
}
