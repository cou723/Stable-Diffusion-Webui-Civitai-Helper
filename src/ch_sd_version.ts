"use strict";
function ch_sd_version() {
    let foot = gradioApp().getElementById("footer");
    if (!foot) {
        return null;
    }

    let versions = foot.querySelector(".versions");
    if (!versions) {
        return null;
    }

    let links = versions.getElementsByTagName("a");
    if (links == null || links.length == 0) {
        return null;
    }

    return links[0].innerHTML.substring(1);
}
