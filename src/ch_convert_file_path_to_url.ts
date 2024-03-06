"use strict";
function ch_convert_file_path_to_url(path: any) {
    let prefix = "file=";
    let path_to_url = path.replaceAll("\\", "/");
    return prefix + path_to_url;
}
