"use strict";
// download model's new version into SD at python side
function ch_dl_model_new_version(event, model_path, version_id, download_url) {
    console.log("start ch_dl_model_new_version");

    // must confirm before downloading
    let dl_confirm =
        "\nConfirm to download.\n\nCheck Download Model Section's log and console log for detail.";
    if (!confirm(dl_confirm)) {
        return;
    }

    //get hidden components of extension
    let js_dl_model_new_version_btn = globalThis
        .gradioApp()
        .getElementById("ch_js_dl_model_new_version_btn");
    if (!js_dl_model_new_version_btn) {
        return;
    }

    //msg to python side
    let msg = {
        action: "dl_model_new_version",
        model_path: model_path,
        version_id: version_id,
        download_url: download_url,
    };

    // fill to msg box
    send_ch_py_msg(msg);

    //click hidden button
    js_dl_model_new_version_btn.click();

    console.log("end dl_model_new_version");

    event.stopPropagation();
    event.preventDefault();
}
