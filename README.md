# 玛特宇宙前端脚手架

通过该脚手架可以帮助您快速搭建项目

## node版本

推荐node版本 20.0.0+ npm版本 9.8.0

## 起步

### 安装

```
npm install -g meta-universe-cli

# OR

yarn global add meta-universe-cli
```

### 创建一个项目

```
meta-universe-cli init

# OR

meta-universe-cli init [projectName]
```

## 目录结构

```
templateList|-- meta-universe-cli
    |-- .gitignore
    |-- LICENSE
    |-- package-lock.json
    |-- package.json
    |-- README.md
    |-- bin
        |-- index-init.mjs          // 初始化
        |-- index.mjs               // 入口文件
    |-- lib
        |-- downloadTemplate.mjs    // 下载模板
        |-- io.mjs                  // 文件处理
        |-- logger.mjs              // log设置
        |-- questions.mjs           // 用户操作步骤列表
        |-- replaceFileContent.mjs  // 模板下载后重写
        |-- spinner.mjs             // loading
        |-- templateList.mjs        // 模板列表
```

### 新增模板方法

/lib/templateList.mjs 中新增一条如下数据

```json
 {
    name:"模板的label---这将会在用户操作选择中展示",
    value:"模板的value",
    url: "模板GitHub仓库的压缩包地址"
  }
```