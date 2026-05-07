import { Command } from 'commander';
import { checkbox } from '@inquirer/prompts';
import { basename } from 'path';
import * as log from '../utils/logger.js';
import { configExists, createDefaultConfig, writeConfig } from '../core/config.js';
import { detectAgent, getAgentDisplayName } from '../core/agent-detect.js';
import { generateAgentConfig } from '../core/config-gen.js';
import { checkToolchain, printToolchainReport } from '../core/toolchain.js';
import { getPackChoices, getPackDisplayName, isValidPack } from '../core/pack-manager.js';
import { scaffoldProject, printScaffoldReport, templateExists } from '../core/template-engine.js';

export function registerInitCommand(program: Command): void {
  program
    .command('init')
    .description('Initialize SysVibe in your project')
    .argument('[languages...]', 'Language packs to activate (e.g., cpp rust)')
    .option('--template <pack>', 'Scaffold a project from a language template (e.g., cpp, rust)')
    .action(async (languages: string[], options: { template?: string }) => {
      log.banner('INITIALIZING');

      // Check if already initialized
      if (configExists()) {
        log.warn('SysVibe is already initialized (.sysvibe.toml exists).');
        log.info('Use "sysvibe add <pack>" to add language packs.');
        return;
      }

      // Validate --template flag early
      if (options.template) {
        if (!isValidPack(options.template)) {
          log.error(`Unknown template: "${options.template}"`);
          log.info('Available templates: cpp, rust');
          process.exit(1);
        }
        if (!templateExists(options.template)) {
          log.error(`Template files not found for: ${options.template}`);
          process.exit(1);
        }
      }

      // Get language packs
      let selectedPacks: string[];

      if (languages.length > 0) {
        // Non-interactive mode
        selectedPacks = languages;
        log.info(`Selected packs: ${selectedPacks.map(getPackDisplayName).join(', ')}`);
      } else if (options.template) {
        // If --template is set but no languages, use the template pack
        selectedPacks = [options.template];
        log.info(`Selected packs: ${selectedPacks.map(getPackDisplayName).join(', ')}`);
      } else {
        // Interactive mode — checkbox prompt
        selectedPacks = await checkbox({
          message: 'Select language packs:',
          choices: getPackChoices().map((c) => ({
            name: `${c.name} — ${c.description}`,
            value: c.value,
          })),
          required: true,
        });
      }

      if (selectedPacks.length === 0) {
        log.error('At least one language pack is required.');
        process.exit(1);
      }

      console.log('');

      // Check toolchain
      const report = checkToolchain(selectedPacks);
      printToolchainReport(report);
      console.log('');

      // Detect agent
      const agent = detectAgent();
      if (agent.detected) {
        log.success(`Agent detected: ${getAgentDisplayName(agent.type)}`);
      } else {
        log.info('No AI agent detected — using AGENTS.md (universal standard)');
      }
      console.log('');

      // Create config
      const config = createDefaultConfig(selectedPacks, agent.type, agent.configFile);
      writeConfig(config);
      log.success(`Config written: .sysvibe.toml`);

      // Generate agent rules
      generateAgentConfig(selectedPacks, agent.type);
      log.success(`Rules injected: ${agent.configFile}`);
      if (agent.configFile !== 'AGENTS.md') {
        log.success('Rules injected: AGENTS.md (universal)');
      }

      // Scaffold project template if requested
      if (options.template) {
        console.log('');
        if (selectedPacks.length > 1) {
          log.warn('Multi-language combo detected — template scaffolding disabled.');
          log.info('Combo projects inject merged rules for all selected languages,');
          log.info('but scaffolding is only supported for single-language projects.');
          log.info(`Selected packs: ${selectedPacks.map(getPackDisplayName).join(', ')}`);
          log.info('Set up your project structure manually.');
        } else {
          const projectName = basename(process.cwd());
          log.info(`Scaffolding ${getPackDisplayName(options.template)} project: ${projectName}`);
          const result = scaffoldProject(options.template, projectName, process.cwd());
          printScaffoldReport(result);
        }
      }

      // Summary
      console.log('');
      log.banner('INITIALIZED');
      const packNames = selectedPacks.map(getPackDisplayName).join(', ');
      log.success(`SysVibe initialized!`);
      console.log('');
      log.info(`Active packs: ${packNames}`);
      log.info(`Config: .sysvibe.toml`);
      log.info(`Agent: ${getAgentDisplayName(agent.type)} → ${agent.configFile}`);
      if (options.template) {
        log.info(`Template: ${getPackDisplayName(options.template)} project scaffolded`);
      }
      console.log('');
      log.info('Next: sysvibe check (coming in Phase 3)');
    });
}
