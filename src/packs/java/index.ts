import { javaRules } from './rules.js';
import type { LanguagePack } from '../cpp/index.js';

export const javaPack: LanguagePack = {
  name: 'java',
  displayName: 'Java',
  description: 'Modern Java (Records, Optional, Immutability) with Maven/Gradle support',
  rulesContent: javaRules,
  gates: [
    { 
      name: 'lint', 
      cmd: '[ -f pom.xml ] && mvn checkstyle:check || ./gradlew checkstyleMain', 
      description: 'Checkstyle linting' 
    },
    { 
      name: 'build', 
      cmd: '[ -f pom.xml ] && mvn clean compile -Werror || ./gradlew classes -PcompilerArgs=-Werror', 
      description: 'Strict compilation (warnings as errors)' 
    },
    { 
      name: 'test', 
      cmd: '[ -f pom.xml ] && mvn test || ./gradlew test', 
      description: 'Run unit tests' 
    },
  ],
};
