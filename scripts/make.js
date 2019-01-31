const path = require("path");
const fs = require("fs");

const copyFolder = require("./utils/copyFolder");
const rootDir = path.resolve(__dirname, "../");

const scriptPath = process.argv[process.argv.length - 1];
const templatePath = path.resolve(__dirname, "template");
const output = path.resolve(rootDir, "src/project", scriptPath);

if (fs.existsSync(output)) {
  console.error(`已存在文件夹：${output},请删除后重试`);
} else {
  copyFolder(templatePath, output);
}
