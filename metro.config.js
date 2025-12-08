const { getDefaultConfig } = require("expo/metro-config");
const withObfuscator = require("obfuscator-io-metro-plugin");

const config = getDefaultConfig(__dirname);

// Verifica se é produção OU build do EAS (para garantir que rode na nuvem)
const isProduction = process.env.NODE_ENV === 'production' || process.env.EAS_BUILD === 'true';

module.exports = isProduction
  ? withObfuscator(config, {
      global: true,
      // FILTRO AJUSTADO: Adicionei a verificação para 'lib/'
      filter: (filename) => {
        return (
          filename.includes("src/") || 
          filename.includes("app/") || 
          filename.includes("lib/")
        );
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
  : config;