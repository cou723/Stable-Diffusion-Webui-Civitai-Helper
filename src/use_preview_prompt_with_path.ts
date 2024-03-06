"use strict";
function use_preview_prompt_with_path(
    event: any,
    model_type: any,
    model_path: any
) {
    console.log("start use_preview_prompt");

    //get hidden components of extension
    let js_use_preview_prompt_btn = globalThis
        .gradioApp()
        .getElementById("ch_js_use_preview_prompt_btn");
    if (!js_use_preview_prompt_btn) {
        return;
    }

    //msg to python side
    let msg = {
        action: "use_preview_prompt",
        model_type: model_type,
        model_path: model_path,
        prompt: "",
        neg_prompt: "",
    };

    // get active prompt
    let act_prompt = getActivePrompt();
    msg["prompt"] = act_prompt!.value;

    // get active neg prompt
    let neg_prompt = <HTMLInputElement>getActiveNegativePrompt();
    msg["neg_prompt"] = neg_prompt.value;

    // fill to msg box
    send_ch_py_msg(msg);

    //click hidden button
    js_use_preview_prompt_btn.click();

    console.log("end use_preview_prompt");

    event.stopPropagation();
    event.preventDefault();
}
