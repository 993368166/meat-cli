import fs from 'fs';
import path from 'path';
import os from 'os';
import request from 'request';
import {logWithSpinner, stopSpinner} from "./spinner.mjs";
import { unzipFile, deletePath } from "./io.mjs";
const currentPath = process.cwd();
import templateList from "./templateList.mjs";

export default (templateName, projectName, callback) => {

  // 根据模板名称查询对应仓库的url
  const url = templateList.find(({ value }) => value === templateName)?.url;

  // 压缩包下载的目录，这里是在系统临时文件目录创建一个目录
  const tempProjectPath = fs.mkdtempSync(path.join(os.tmpdir(), `${projectName}-`));

  // 压缩包保存的路径
  const file = path.join(tempProjectPath,`${templateName}.zip`);

  // 判断压缩包是否存在
  if (fs.existsSync(file)) {
    // 删除原文件
    fs.unlinkSync(file);
  }

  logWithSpinner('下载模板中...');
  let stream = fs.createWriteStream(file);
  // 不检验证书
  request({
    url,
    strictSSL: false,
  }).pipe(stream).on('close', err => {
    stopSpinner(false);
    if (err) {
      callback(err);
      return;
    }
    // 获取解压目录
    const destPath = path.join(currentPath, `${projectName}`);
    fs.mkdirSync(destPath, { recursive: true });
    // 解压下载的模板压缩包
    unzipFile(file, destPath, error => {
      // 删除创建的临时文件夹
      deletePath(tempProjectPath);
      callback(error);
    });
  })
}