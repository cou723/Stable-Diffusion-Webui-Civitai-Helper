"use strict";
function getActivePrompt() {
    const currentTab = globalThis.get_uiCurrentTabContent();
    switch (currentTab.id) {
        case "tab_txt2img":
            return <HTMLInputElement>(
                currentTab.querySelector("#txt2img_prompt textarea")
            );
        case "tab_img2img":
            return <HTMLInputElement>(
                currentTab.querySelector("#img2img_prompt textarea")
            );
    }
    return null;
}
