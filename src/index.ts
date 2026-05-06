#!/usr/bin/env node
import { Command } from 'commander';
import { registerInitCommand } from './commands/init.js';
import { registerAddCommand } from './commands/add.js';
import { registerCheckCommand } from './commands/check.js';
import { registerFixCommand } from './commands/fix.js';
import * as log from './utils/logger.js';

const program = new Command();

program
  .name('sysvibe')
  .description('Make AI coding agents better at systems languages')
  .version('0.1.0');

// Register commands
registerInitCommand(program);
registerAddCommand(program);

registerCheckCommand(program);

registerFixCommand(program);

program.parse();
