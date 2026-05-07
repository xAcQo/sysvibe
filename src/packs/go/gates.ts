import type { GateDefinition } from '../cpp/index.js';

export const goGates: GateDefinition[] = [
  {
    name: 'Lint (golangci-lint)',
    description: 'Runs golangci-lint to enforce aggressive linting and security checks',
    cmd: 'golangci-lint run',
  },
  {
    name: 'Vet (go vet)',
    description: 'Runs go vet to catch suspicious constructs',
    cmd: 'go vet ./...',
  },
  {
    name: 'Test & Race Detection',
    description: 'Runs unit tests with data race detection enabled',
    cmd: 'go test -race ./...',
  },
];
