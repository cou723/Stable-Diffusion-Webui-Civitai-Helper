"use strict";
function add_trigger_words_with_path(event, model_type, model_path) {
    console.log("start add_trigger_words");

    //get hidden components of extension
    let js_add_trigger_words_btn = globalThis
        .gradioApp()
        .getElementById("ch_js_add_trigger_words_btn");
    if (!js_add_trigger_words_btn) {
        return;
    }

    //msg to python side
    let msg = {
        action: "add_trigger_words",
        model_type: model_type,
        model_path: model_path,
        prompt: "",
        neg_prompt: "",
    };

    // get active prompt
    let act_prompt = getActivePrompt();
    msg["prompt"] = act_prompt.value;

    // fill to msg box
    send_ch_py_msg(msg);

    //click hidden button
    js_add_trigger_words_btn.click();

    console.log("end add_trigger_words");

    event.stopPropagation();
    event.preventDefault();
}