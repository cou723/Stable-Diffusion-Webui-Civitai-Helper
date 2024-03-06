"use strict";

import { ch_sd_version } from "./ch_sd_version";
import { getActiveTabType } from "./getActiveTabType";

onUiLoaded(() => {
    console.log("ui loaded");

    // get all extra network tabs
    let tab_prefix_list = ["txt2img", "img2img"];
    let model_type_list = [
        "textual_inversion",
        "hypernetworks",
        "checkpoints",
        "lora",
    ];
    let cardid_suffix = "cards";

    // update extra network tab pages' cards
    // * replace "replace preview" text button into an icon
    // * add 3 button to each card:
    //  - open model url 🌐
    //  - add trigger words 💡
    //  - use preview image's prompt 🏷️
    // notice: javascript can not get response from python side
    // so, these buttons just sent request to python
    // then, python side gonna open url and update prompt text box, without telling js side.
    function update_card_for_civitai() {
        //css
        let btn_margin = "0px 5px";
        let btn_fontSize = "200%";
        let btn_thumb_fontSize = "100%";
        let btn_thumb_display = "inline";
        let btn_thumb_pos = "static";
        let btn_thumb_backgroundImage = "none";
        let btn_thumb_background = "rgba(0, 0, 0, 0.8)";

        let ch_btn_txts = ["🌐", "💡", "🏷️"];
        let replace_preview_text = getTranslation("replace preview");
        if (!replace_preview_text) {
            replace_preview_text = "replace preview";
        }

        //change all "replace preview" into an icon
        let extra_network_id = "";
        let extra_network_node = null;
        let button_row = null;
        let search_term_node = null;
        let search_term = "";
        let model_type = "";
        let cards = null;
        let need_to_add_buttons = false;

        //get current tab
        let active_tab_type = getActiveTabType();
        if (!active_tab_type) {
            active_tab_type = "txt2img";
        }

        for (const tab_prefix of tab_prefix_list) {
            if (tab_prefix != active_tab_type) {
                continue;
            }

            //find out current selected model type tab
            let active_extra_tab_type = "";
            let extra_tabs = gradioApp().getElementById(
                tab_prefix + "_extra_tabs"
            );
            if (!extra_tabs) {
                console.log(
                    "can not find extra_tabs: " + tab_prefix + "_extra_tabs"
                );
            }

            //get active extratab
            const active_extra_tab = (
                Array.from(
                    get_uiCurrentTabContent().querySelectorAll(
                        ".extra-network-cards,.extra-network-thumbs"
                    )
                ).find(
                    (el: any) =>
                        el.closest(".tabitem").style.display === "block"
                ) as HTMLElement
            )?.id.match(/^(txt2img|img2img)_(.+)_cards$/)![2];

            console.log("found active tab: " + active_extra_tab);

            switch (active_extra_tab) {
                case "textual_inversion":
                    active_extra_tab_type = "ti";
                    break;
                case "hypernetworks":
                    active_extra_tab_type = "hyper";
                    break;
                case "checkpoints":
                    active_extra_tab_type = "ckp";
                    break;
                case "lora":
                    active_extra_tab_type = "lora";
                    break;
            }

            for (const js_model_type of model_type_list) {
                //get model_type for python side
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

                if (!model_type) {
                    console.log(
                        "can not get model_type from: " + js_model_type
                    );
                    continue;
                }

                //only handle current sub-tab
                if (model_type != active_extra_tab_type) {
                    continue;
                }

                console.log("handle active extra tab");

                extra_network_id =
                    tab_prefix + "_" + js_model_type + "_" + cardid_suffix;
                // console.log("searching extra_network_node: " + extra_network_id);
                extra_network_node =
                    gradioApp().getElementById(extra_network_id);

                // console.log("find extra_network_node: " + extra_network_id);

                if (!extra_network_node) {
                    console.log(
                        "can not find extra_network_node: " + extra_network_id
                    );
                    continue;
                }

                // get all card nodes
                cards = extra_network_node.querySelectorAll(".card");
                for (let card of cards) {
                    //get button row
                    button_row = card.querySelector(".button-row");

                    if (!button_row) {
                        console.log("can not find button_row");
                        continue;
                    }

                    let atags = button_row.querySelectorAll("a");
                    if (atags && atags.length) {
                        console.log("find atags: " + atags.length);
                    } else {
                        console.log("no atags");
                        need_to_add_buttons = true;
                    }

                    if (!need_to_add_buttons) {
                        console.log("do not need to add buttons");
                        continue;
                    }

                    // search_term node
                    // search_term = subfolder path + model name + ext
                    search_term_node = card.querySelector(
                        ".actions .additional .search_term"
                    );
                    if (!search_term_node) {
                        console.log(
                            "can not find search_term node for cards in " +
                                extra_network_id
                        );
                        continue;
                    }

                    // get search_term
                    search_term = search_term_node.innerHTML.trim();
                    if (!search_term) {
                        console.log(
                            "search_term is empty for cards in " +
                                extra_network_id
                        );
                        continue;
                    }

                    console.log("adding buttons");
                    // then we need to add 3 buttons to each ul node:
                    let open_url_node = document.createElement("a");
                    open_url_node.href = "#";
                    open_url_node.innerHTML = "🌐";
                    open_url_node.className = "card-button";

                    open_url_node.title = "Open this model's civitai url";
                    open_url_node.setAttribute(
                        "onclick",
                        "open_model_url(event, '" +
                            model_type +
                            "', '" +
                            search_term +
                            "')"
                    );

                    let add_trigger_words_node = document.createElement("a");
                    add_trigger_words_node.href = "#";
                    add_trigger_words_node.innerHTML = "💡";
                    add_trigger_words_node.className = "card-button";

                    add_trigger_words_node.title =
                        "Add trigger words to prompt";
                    add_trigger_words_node.setAttribute(
                        "onclick",
                        "add_trigger_words(event, '" +
                            model_type +
                            "', '" +
                            search_term +
                            "')"
                    );

                    let use_preview_prompt_node = document.createElement("a");
                    use_preview_prompt_node.href = "#";
                    use_preview_prompt_node.innerHTML = "🏷️";
                    use_preview_prompt_node.className = "card-button";

                    use_preview_prompt_node.title =
                        "Use prompt from preview image";
                    use_preview_prompt_node.setAttribute(
                        "onclick",
                        "use_preview_prompt(event, '" +
                            model_type +
                            "', '" +
                            search_term +
                            "')"
                    );

                    let remove_card_node = document.createElement("a");
                    remove_card_node.href = "#";
                    remove_card_node.innerHTML = "❌";
                    remove_card_node.className = "card-button";

                    remove_card_node.title = "Remove this model";
                    remove_card_node.setAttribute(
                        "onclick",
                        "remove_card(event, '" +
                            model_type +
                            "', '" +
                            search_term +
                            "')"
                    );

                    //add to card
                    button_row.appendChild(open_url_node);
                    button_row.appendChild(add_trigger_words_node);
                    button_row.appendChild(use_preview_prompt_node);
                    button_row.appendChild(remove_card_node);
                }
            }
        }
    }

    // for sd version 1.8.0+
    // update extra network tab pages' cards
    // * replace "replace preview" text button into an icon
    // * add 3 button to each card:
    //  - open model url 🌐
    //  - add trigger words 💡
    //  - use preview image's prompt 🏷️
    // notice: javascript can not get response from python side
    // so, these buttons just sent request to python
    // then, python side gonna open url and update prompt text box, without telling js side.
    function update_card_for_civitai_with_sd1_8() {
        console.log("start update_card_for_civitai_with_sd1_8");

        //css
        let btn_margin = "0px 5px";
        let btn_fontSize = "200%";
        let btn_thumb_fontSize = "100%";
        let btn_thumb_display = "inline";
        let btn_thumb_pos = "static";
        let btn_thumb_backgroundImage = "none";
        let btn_thumb_background = "rgba(0, 0, 0, 0.8)";

        let ch_btn_txts = ["🌐", "💡", "🏷️"];
        let replace_preview_text = getTranslation("replace preview");
        if (!replace_preview_text) {
            replace_preview_text = "replace preview";
        }

        //change all "replace preview" into an icon
        let extra_network_id = "";
        let extra_network_node = null;
        let button_row = null;
        let search_term_node = null;
        let search_term: any = "";
        let model_type = "";
        let cards = null;
        let need_to_add_buttons = false;
        let extra_tabs = null;
        let extra_tab = null;
        let active_extra_tab = null;
        let active_model_type = "";
        let active_extra_tab_type = "";
        let card_path = "";

        //get current tab
        let active_tab_type = getActiveTabType();
        if (!active_tab_type) {
            active_tab_type = "txt2img";
        }

        for (const tab_prefix of tab_prefix_list) {
            if (tab_prefix != active_tab_type) {
                continue;
            }

            //find out current selected model type tab

            extra_tabs = gradioApp().getElementById(tab_prefix + "_extra_tabs");
            if (!extra_tabs) {
                console.log(
                    "can not find extra_tabs: " + tab_prefix + "_extra_tabs"
                );
            }

            //get tab by id
            for (const js_model_type of model_type_list) {
                //get tab
                let extra_tab = gradioApp().getElementById(
                    tab_prefix + "_" + js_model_type
                );
                if (extra_tab == null) {
                    console.log(
                        `can not get extra_tab: ${tab_prefix}_${js_model_type}`
                    );
                    continue;
                }

                //check if tab is active
                if (extra_tab.style.display == "block") {
                    active_extra_tab = extra_tab;
                    active_model_type = js_model_type;
                    break;
                }
            }

            console.log("found active_model_type: " + active_model_type);

            switch (active_model_type) {
                case "textual_inversion":
                    active_extra_tab_type = "ti";
                    model_type = "ti";
                    break;
                case "hypernetworks":
                    active_extra_tab_type = "hyper";
                    model_type = "hyper";
                    break;
                case "checkpoints":
                    active_extra_tab_type = "ckp";
                    model_type = "ckp";
                    break;
                case "lora":
                    active_extra_tab_type = "lora";
                    model_type = "lora";
                    break;
            }

            //get model_type for python side
            if (!model_type) {
                console.log(
                    "can not get model_type with: " + active_model_type
                );
                continue;
            }

            console.log("handle active extra tab");

            extra_network_id =
                tab_prefix + "_" + active_model_type + "_" + cardid_suffix;
            // console.log("searching extra_network_node: " + extra_network_id);
            extra_network_node = gradioApp().getElementById(extra_network_id);
            if (!extra_network_node) {
                console.log(
                    "can not find extra_network_node: " + extra_network_id
                );
                continue;
            }

            // console.log("find extra_network_node: " + extra_network_id);

            // get all card nodes
            cards = extra_network_node.querySelectorAll(".card");
            console.log(`get cards: ${cards.length}`);
            for (let card of cards) {
                console.log(`current card: ${(card as any).dataset.name}`);

                //get button row
                button_row = <HTMLElement>card.querySelector(".button-row");
                if (!button_row) {
                    console.log("can not find .button_row");
                    continue;
                }

                //set button_row's flex-wrap to wrap
                button_row.style.flexWrap = "wrap";

                let atags = button_row.querySelectorAll("a");
                if (atags && atags.length) {
                    console.log("find atags: " + atags.length);
                } else {
                    //console.log("no atags");
                    need_to_add_buttons = true;
                }

                if (!need_to_add_buttons) {
                    console.log("no need to add buttons");
                    continue;
                }

                // search_term node
                // search_term = subfolder path + model name + ext
                search_term_node = card.querySelector(
                    ".actions .additional .search_terms"
                );
                if (!search_term_node) {
                    console.log(
                        "can not find search_term node for cards in " +
                            extra_network_id
                    );
                    continue;
                }

                // get search_term
                search_term = search_term_node.innerHTML.trim();
                if (!search_term) {
                    console.log(
                        "search_term is empty for cards in " + extra_network_id
                    );
                    continue;
                }

                //from sd v1.8, need to replace all single '\' into '\\'
                search_term = search_term.replaceAll("\\", "\\\\");

                //`data-sort-path` convert all path to lowercase, which can not be used to find model on linux.
                //so this is not used and fall back to use search_term
                //console.log("card path: " + card.dataset.sortPath);
                //card_path = card.dataset.sortPath.replaceAll("\\", "\\\\");

                console.log("adding buttons");
                // then we need to add 3 buttons to each ul node:
                let open_url_node = document.createElement("a");
                open_url_node.href = "#";
                open_url_node.innerHTML = "🌐";
                open_url_node.className = "card-button";

                open_url_node.title = "Open this model's civitai url";
                open_url_node.setAttribute(
                    "onclick",
                    "open_model_url(event, '" +
                        model_type +
                        "', '" +
                        search_term +
                        "')"
                );

                let add_trigger_words_node = document.createElement("a");
                add_trigger_words_node.href = "#";
                add_trigger_words_node.innerHTML = "💡";
                add_trigger_words_node.className = "card-button";

                add_trigger_words_node.title = "Add trigger words to prompt";
                add_trigger_words_node.setAttribute(
                    "onclick",
                    "add_trigger_words(event, '" +
                        model_type +
                        "', '" +
                        search_term +
                        "')"
                );

                let use_preview_prompt_node = document.createElement("a");
                use_preview_prompt_node.href = "#";
                use_preview_prompt_node.innerHTML = "🏷️";
                use_preview_prompt_node.className = "card-button";

                use_preview_prompt_node.title = "Use prompt from preview image";
                use_preview_prompt_node.setAttribute(
                    "onclick",
                    "use_preview_prompt(event, '" +
                        model_type +
                        "', '" +
                        search_term +
                        "')"
                );

                let remove_card_node = document.createElement("a");
                remove_card_node.href = "#";
                remove_card_node.innerHTML = "❌";
                remove_card_node.className = "card-button";

                remove_card_node.title = "Remove this model";
                remove_card_node.setAttribute(
                    "onclick",
                    "remove_card(event, '" +
                        model_type +
                        "', '" +
                        search_term +
                        "')"
                );

                //add to card
                button_row.appendChild(open_url_node);
                button_row.appendChild(add_trigger_words_node);
                button_row.appendChild(use_preview_prompt_node);
                button_row.appendChild(remove_card_node);
            }
        }

        console.log("end update_card_for_civitai_with_sd1_8");
    }

    let tab_id = "";
    let toolbar_id = "";
    let refresh_btn_id = "";
    let refresh_btn = null;
    let extra_tab = null;
    let extra_toolbar = null;
    let extra_network_refresh_btn = null;
    //add refresh button to extra network's toolbar

    //from sd version 1.8.0, extra network's toolbar is fully rewrited. This extension need to re-write this part too.
    let sd_version = ch_sd_version();
    console.log(`sd version is: ${sd_version}`);
    if (sd_version && sd_version >= "1.8.0") {
        for (let prefix of tab_prefix_list) {
            toolbar_id = prefix + "_lora_controls";

            //with sd 1.8.0, each model type has its own extra toolbar.
            //so here we need to get all toolbars
            for (const js_model_type of model_type_list) {
                //get toolbar
                toolbar_id = prefix + "_" + js_model_type + "_controls";

                //get toolbar
                extra_toolbar = gradioApp().getElementById(toolbar_id);

                //get official refresh button
                refresh_btn_id =
                    prefix + "_" + js_model_type + "_extra_refresh";
                refresh_btn = gradioApp().getElementById(refresh_btn_id);
                if (!refresh_btn) {
                    console.log(
                        "can not find refresh_btn with id: " + refresh_btn_id
                    );
                    continue;
                }

                // from sd v1.8.0, we add refresh function to official's refresh button
                refresh_btn.onclick = function (event) {
                    console.log("run refresh button on click");
                    //official's refresh function
                    extraNetworksControlRefreshOnClick(
                        event,
                        prefix,
                        js_model_type
                    );

                    update_card_for_civitai_with_sd1_8();
                };
            }
        }

        //run it once
        //update_card_for_civitai_with_sd1_8();
    } else {
        for (let prefix of tab_prefix_list) {
            tab_id = prefix + "_extra_tabs";
            extra_tab = gradioApp().getElementById(tab_id);

            //get toolbar
            //get Refresh button
            extra_network_refresh_btn = gradioApp().getElementById(
                "txt2img_lora_extra_refresh"
            );
            console.log(
                "get extra_network_refresh_btn: " + extra_network_refresh_btn
            );

            if (!extra_network_refresh_btn) {
                console.log(
                    "can not get extra network refresh button for " + tab_id
                );
                continue;
            }

            // add refresh button to toolbar
            let ch_refresh = document.createElement("button");
            ch_refresh.innerHTML = "🔁";
            ch_refresh.title = "Refresh Civitai Helper's additional buttons";
            ch_refresh.className = "lg secondary gradio-button";
            ch_refresh.style.fontSize = "200%";
            ch_refresh.onclick = update_card_for_civitai;

            const parrentNode = extra_network_refresh_btn.parentNode;
            if (!parrentNode) {
                console.error(
                    "can not find parrentNode for extra_network_refresh_btn"
                );
                return;
            }

            parrentNode.appendChild(ch_refresh);
        }

        //run it once
        update_card_for_civitai();
    }
});
