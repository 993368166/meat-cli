import { program } from 'commander';
import path from 'path';
import inquirer from 'inquirer';
import chalk from "chalk";
import { exit } from '../lib/logger.mjs';
import fs from 'fs';
import { logWithSpinner, stopSpinner }  from '../lib/spinner.mjs';
import { deletePath } from '../lib/io.mjs'
import downloadTemplate from "../lib/downloadTemplate.mjs";
import replaceFileContent from "../lib/replaceFileContent.mjs";


let projectName;
let force;

const questions = [
  {
    type: 'input',
    name: 'projectName',
    message: chalk.yellow('请输入项目名称：'),
  },
  {
    type: 'list',
    name: 'template',
    message: chalk.yellow('请选择创建项目的模板'),
    choices: [
      {
        name:"玛特宇宙vue3后台管理系统模板",
        value:"meta-vue3-manage-template"
      },
    ]
  }
];

// 下载项目模板
const startDownloadTemplate = (projectName, templateName) => {
  downloadTemplate(templateName, projectName , error => {
    if (error) {
      exit(error);
      return;
    }
    // 替换解压后的模板package.json, index.html关键内容
    replaceFileContent(projectName)
  })
}

// 检查目录
const checkProjectExits = (projectName,templateName) => {
  const currentPath = process.cwd();
  const filePath = path.join(currentPath,`${projectName}`); // 获取项目的真实路径
  // 删除
  if (force) {
    if (fs.existsSync(filePath)) {
      // 删除文件夹
      logWithSpinner(`删除${projectName}...`);
      deletePath(filePath);
      stopSpinner(false);
    }
    startDownloadTemplate(projectName, templateName); // 开始下载模板
    return;
  }
  // 判断文件是否存在 询问是否继续
  if (fs.existsSync(filePath)) {
    inquirer.prompt({
      type: 'confirm',
      name: 'out',
      message: `${projectName}文件夹已存在，是否覆盖？`
    }).then(data => {
      if (!data.out) { // 用户不同意
        exit();
      } else {
        // 删除文件夹
        logWithSpinner(`删除${projectName}...`);
        deletePath(filePath);
        stopSpinner(false);
        startDownloadTemplate(projectName, templateName) // 开始下载模板
      }
    }).catch(error => {
      exit(error);
    })
  } else {
    startDownloadTemplate(projectName, templateName); // 开始下载模板
  }
}

// 如果用户命令参数带projectName，只需要询问用户选择模板
if (projectName) {
  questions.splice(0,1);
}

// 执行用户交互命令
inquirer.prompt(questions).then(result => {
  if (result.projectName) {
    projectName = result.projectName;
  }
  const templateName = result.template;
  // 获取projectName templateName
  console.log("项目名称：" + projectName);
  console.log("模板名称：" + templateName);
  if(!templateName || !projectName){
    // 退出
    exit();
  }
  // 往下走
  checkProjectExits(projectName,templateName); // 检查目录是否存在
}).catch(error => {
  exit(error);
})

program
  .arguments('[projectName]')
  .description('初始化项目')
  .option('-f --force', '如果存在输入的项目目录，强制删除项目目录')
  .action((name, cmd) => {
    projectName = name;
    force = cmd.force || false;
  });

program.parse(process.argv);