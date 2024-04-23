import chalk from "chalk";

export const warn = message => {
  console.log(chalk.yellow(message));
}

export const error = message => {
  console.log(chalk.red(message))
}

export const info = message => {
  console.log(chalk.white(message))
}

export const infoGreen = message => {
  console.log(chalk.green(message))
}

export const exit = error => {
  if(error && error instanceof Error){
    console.log(chalk.red(error.message))
  }
  process.exit(-1);
}