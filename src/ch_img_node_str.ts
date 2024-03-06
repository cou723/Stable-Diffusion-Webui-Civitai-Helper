"use strict";

import { ch_convert_file_path_to_url } from "./ch_convert_file_path_to_url";

export function ch_img_node_str(path: string) {
    return `<img src='${ch_convert_file_path_to_url(
        path
    )}' style="width:24px"/>`;
}
