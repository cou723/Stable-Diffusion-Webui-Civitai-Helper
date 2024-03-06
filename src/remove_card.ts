import { ch_sd_version } from "./ch_sd_version";
import { convertModelTypeFromPyToJS } from "./convertModelTypeFromPyToJS";
import { getActiveTabType } from "./getActiveTabType";
import { get_new_ch_py_msg } from "./get_new_ch_py_msg";
import { send_ch_py_msg } from "./send_ch_py_msg";

export async function remove_card(
    event: any,
    model_type: any,
    search_term: any
) {
    console.log("start remove_card");

    //get hidden components of extension
    let js_remove_card_btn = gradioApp().getElementById(
        "ch_js_remove_card_btn"
    );
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
        search_term: search_term,
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
            let refresh_btn_id = "";
            let refresh_btn = null;

            //check sd version
            let sd_version = ch_sd_version();
            console.log(`sd version is: ${sd_version}`);
            if (sd_version && sd_version >= "1.8.0") {
                let js_model_type = convertModelTypeFromPyToJS(model_type);
                if (!js_model_type) {
                    return;
                }

                refresh_btn_id =
                    active_tab + "_" + js_model_type + "_extra_refresh";
                refresh_btn = gradioApp().getElementById(refresh_btn_id);
            } else {
                refresh_btn_id = active_tab + "_extra_refresh";
                refresh_btn = gradioApp().getElementById(refresh_btn_id);
            }

            if (refresh_btn) {
                console.log("click button: " + refresh_btn_id);
                refresh_btn.click();
            }
        }
    }

    console.log("end remove_card");
}
