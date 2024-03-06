import { send_ch_py_msg } from "./send_ch_py_msg";

// download model's new version into SD at python side
export function ch_dl_model_new_version(
    event: any,
    model_path: any,
    version_id: any,
    download_url: any
) {
    console.log("start ch_dl_model_new_version");

    // must confirm before downloading
    let dl_confirm =
        "\nConfirm to download.\n\nCheck Download Model Section's log and console log for detail.";
    if (!confirm(dl_confirm)) {
        return;
    }

    //get hidden components of extension
    let js_dl_model_new_version_btn = gradioApp().getElementById(
        "ch_js_dl_model_new_version_btn"
    );
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
