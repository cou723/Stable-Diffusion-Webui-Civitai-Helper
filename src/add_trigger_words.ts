import { getActivePrompt } from "./getActivePrompt";
import { send_ch_py_msg } from "./send_ch_py_msg";

export function add_trigger_words(
    event: any,
    model_type: any,
    search_term: any
) {
    console.log("start add_trigger_words");

    //get hidden components of extension
    let js_add_trigger_words_btn = gradioApp().getElementById(
        "ch_js_add_trigger_words_btn"
    );
    if (!js_add_trigger_words_btn) {
        return;
    }

    //msg to python side
    let msg = {
        action: "add_trigger_words",
        model_type: model_type,
        search_term: search_term,
        prompt: "",
        neg_prompt: "",
    };

    // get active prompt
    let act_prompt = getActivePrompt();
    msg["prompt"] = act_prompt!.value;

    // fill to msg box
    send_ch_py_msg(msg);

    //click hidden button
    js_add_trigger_words_btn.click();

    console.log("end add_trigger_words");

    event.stopPropagation();
    event.preventDefault();
}
