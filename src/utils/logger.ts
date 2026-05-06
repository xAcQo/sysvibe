import chalk from 'chalk';
import ora, { type Ora } from 'ora';

export function info(msg: string): void {
  console.log(chalk.blue('ℹ'), msg);
}

export function success(msg: string): void {
  console.log(chalk.green('✓'), msg);
}

export function warn(msg: string): void {
  console.log(chalk.yellow('⚠'), msg);
}

export function error(msg: string): void {
  console.log(chalk.red('✗'), msg);
}

export function heading(msg: string): void {
  console.log(chalk.bold(msg));
}

export function toolFound(name: string, version: string): void {
  console.log(chalk.green(`  ✓ ${name} ${version}`));
}

export function toolMissing(name: string, installCmd: string): void {
  console.log(chalk.red(`  ✗ ${name}`) + chalk.dim(` — not found (install: ${installCmd})`));
}

export function banner(title: string): void {
  const line = '━'.repeat(55);
  console.log(`\n${chalk.dim(line)}`);
  console.log(chalk.bold.cyan(` SysVibe ► ${title}`));
  console.log(`${chalk.dim(line)}\n`);
}

export function createSpinner(msg: string): Ora {
  return ora({ text: msg, color: 'cyan' });
}
