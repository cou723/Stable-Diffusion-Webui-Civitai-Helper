/**
 * @type {import('webpack').Configuration}
 */
const path = require("path");

module.exports = {
    entry: "./src/main.ts", // エントリーポイントのTypeScriptファイル
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    output: {
        filename: "civitai_helper.js", // 出力ファイル名
        path: path.resolve(__dirname, "javascript"), // 出力先ディレクトリ
    },
    mode: "development",
    devtool: 'source-map',
};
