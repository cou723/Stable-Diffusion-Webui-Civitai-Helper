
export function ch_sd_version(): string | null {
    let foot = gradioApp().getElementById("footer");
    if (!foot) {
        return null;
    }

    let versions = foot.querySelector(".versions");
    if (!versions) {
        return null;
    }

    let [webui_version] = versions.getElementsByTagName("a");
    if (!webui_version) {
        return null;
    }

    const version_text = webui_version.innerHTML.substring(1);
    const webui_version_text = version_text.match(/v[0-9]\.[0-9]\.[0-9]/)![0];

    return webui_version_text;
}
