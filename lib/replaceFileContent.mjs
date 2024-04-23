import fs from 'fs';
import path from 'path';
import { exit, info, infoGreen } from "./logger.mjs";
import { readFile } from 'fs/promises';
import * as child_process from "node:child_process";

const install = projectName => {
  const currentPath = process.cwd();
  const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
  // 创建一个子进程执行npm install 任务
  const nodeJob = child_process.spawn(npm , ['install'], {
    stdio: 'inherit', // 指定父子进程通信方式
    cwd: path.join(currentPath,projectName)
  });
  // 监听任务结束，提示用户创建成功，接下来的操作
  nodeJob.on("close",()=>{
    info(`创建成功! ${projectName} 项目位于 ${path.join(currentPath,projectName)}`)
    info('')
    info('你可以执行以下命令运行开发环境')
    infoGreen(` cd ${projectName}       `);
    infoGreen(` npm run dev             `);
  })
}

export default async (projectName) => {
  const currentPath = process.cwd();
  try{
    // 读取项目的package.json
    const pkgPath = path.join(currentPath,`${projectName}/package.json`);
    // 读取内容
    // nodejs 中不建议以module模式引入json文件，故通过读取文件形式获取package.json中的内容
    let pkgJsonString;

    try {
      const filePath = new URL(pkgPath, import.meta.url);
      pkgJsonString = await readFile(filePath, { encoding: 'utf8' });
    } catch (err) {
      console.error(err.message);
      pkgJsonString = '{}';
    }

    const pkg = JSON.parse(pkgJsonString);
    pkg.name = projectName;
    fs.writeFileSync(pkgPath,JSON.stringify(pkg,null,2));

    const indexPath = path.join(currentPath, `${projectName}/index.html`);
    let html = fs.readFileSync(indexPath).toString();
    // 修改模板title为项目名称
    html = html.replace(/<title>(.*)<\/title>/g,`<title>${projectName}</title>`)
    fs.writeFileSync(indexPath,html);
  }catch(error){
    exit(error)
  }
  // 安装依赖
  install(projectName)
}