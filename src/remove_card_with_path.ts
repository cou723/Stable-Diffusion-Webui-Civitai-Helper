"use strict";

async function remove_card_with_path(event, model_type, model_path) {
    console.log("start remove_card");

    //get hidden components of extension
    let js_remove_card_btn = globalThis
        .gradioApp()
        .getElementById("ch_js_remove_card_btn");
    if (!js_remove_card_btn) {
        return;
    }

    // must confirm before removing
    let rm_confirm =
        "\nConfirm to remove this model.\n\nCheck console log for detail.";
    if (!confirm(rm_confirm)) {
        return;
    }

    //msg to python side
    let msg = {
        action: "remove_card",
        model_type: model_type,
        model_path: model_path,
        prompt: "",
        neg_prompt: "",
    };

    // fill to msg box
    send_ch_py_msg(msg);

    //click hidden button
    js_remove_card_btn.click();

    // stop parent event
    event.stopPropagation();
    event.preventDefault();

    //check response msg from python
    let new_py_msg: any = "";
    try {
        new_py_msg = await get_new_ch_py_msg();
    } catch (error) {
        console.log(error);
        new_py_msg = error;
    }

    console.log("new_py_msg:");
    console.log(new_py_msg);

    //check msg
    let result = "Done";
    //check msg
    if (new_py_msg) {
        result = new_py_msg;
    }

    // alert result
    alert(result);

    if (result == "Done") {
        console.log("refresh card list");
        //refresh card list
        let active_tab = getActiveTabType();
        console.log("get active tab id: " + active_tab);
        if (active_tab) {
            let js_model_type = convertModelTypeFromPyToJS(model_type);
            if (!js_model_type) {
                return;
            }

            let refresh_btn_id =
                active_tab + "_" + js_model_type + "_extra_refresh";
            let refresh_btn = globalThis
                .gradioApp()
                .getElementById(refresh_btn_id);
            if (refresh_btn) {
                console.log("click button: " + refresh_btn_id);
                refresh_btn.click();
            }
        }
    }

    console.log("end remove_card");
}
