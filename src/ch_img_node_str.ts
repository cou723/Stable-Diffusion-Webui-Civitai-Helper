"use strict";
function ch_img_node_str(path) {
    return `<img src='${ch_convert_file_path_to_url(
        path
    )}' style="width:24px"/>`;
}
