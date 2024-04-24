#!/usr/bin/env node
import { program } from 'commander';
import { readFile } from 'fs/promises'

// nodejs 中不建议以module模式引入json文件，故通过读取文件形式获取package.json中的内容
let pkgJsonString;

try {
  const filePath = new URL('../package.json', import.meta.url);
  console.log(filePath, 'package.json');
  pkgJsonString = await readFile(filePath, { encoding: 'utf8' });
} catch (err) {
  console.error(err.message);
  pkgJsonString = '{}';
}

const pkg = JSON.parse(pkgJsonString);

// 版本号
program.version(pkg.version,'-v --version');

program
  .command('init [projectName]', 'init project')

program.parse(process.argv);