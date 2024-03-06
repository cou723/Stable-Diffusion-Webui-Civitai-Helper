"use strict";
//convert model type between js style and python style
function convertModelTypeFromPyToJS(model_type) {
    let js_model_type = "";
    switch (model_type) {
        case "ti":
            js_model_type = "textual_inversion";
            break;
        case "hyper":
            js_model_type = "hypernetworks";
            break;
        case "ckp":
            js_model_type = "checkpoints";
            break;
        case "lora":
            js_model_type = "lora";
            break;
    }

    return js_model_type;
}
