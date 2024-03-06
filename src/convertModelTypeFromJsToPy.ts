"use strict";
function convertModelTypeFromJsToPy(js_model_type) {
    let model_type = "";
    switch (js_model_type) {
        case "textual_inversion":
            model_type = "ti";
            break;
        case "hypernetworks":
            model_type = "hyper";
            break;
        case "checkpoints":
            model_type = "ckp";
            break;
        case "lora":
            model_type = "lora";
            break;
    }

    return model_type;
}
