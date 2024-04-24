import chalk from "chalk";
import templateList from "./templateList.mjs";

export default [
  {
    type: 'input',
    name: 'projectName',
    message: chalk.yellow('请输入项目名称：'),
  },
  {
    type: 'list',
    name: 'template',
    message: chalk.yellow('请选择创建项目的模板'),
    choices: templateList.map(({ name, value }) => ({
      name,
      value
    }))
  }
]