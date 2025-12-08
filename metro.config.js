const { getDefaultConfig } = require("expo/metro-config");
const withObfuscator = require("obfuscator-io-metro-plugin");

const config = getDefaultConfig(__dirname);

// Aplica obfuscação APENAS em produção
const isProduction = process.env.NODE_ENV === 'production';

module.exports = isProduction
  ? withObfuscator(config, {
      global: true,
      filter: (filename) => {
        return filename.startsWith("src") || filename.startsWith("app");
      },
      obfuscatorOptions: {
        compact: true,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 0.75,
        deadCodeInjection: true,
        deadCodeInjectionThreshold: 0.4,
        debugProtection: false,
        disableConsoleOutput: true,
        identifierNamesGenerator: 'hexadecimal',
        log: false,
        numbersToExpressions: true,
        renameGlobals: false,
        rotateStringArray: true,
        selfDefending: true,
        shuffleStringArray: true,
        splitStrings: true,
        stringArray: true,
        stringArrayEncoding: ['base64', 'rc4'],
        stringArrayThreshold: 0.75,
        unicodeEscapeSequence: false
      },
    })
  : config; // Sem obfuscação em desenvolvimento