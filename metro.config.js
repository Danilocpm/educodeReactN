const { getDefaultConfig } = require("expo/metro-config");
const { withObfuscator } = require("obfuscator-io-metro-plugin");

const config = getDefaultConfig(__dirname);

module.exports = withObfuscator(config, {
  global: true, // Aplica a ofuscação em todo o bundle
  filter: (filename) => {
    return filename.startsWith("src") || filename.startsWith("app"); 
  },
  obfuscatorOptions: {
    compact: true,
    controlFlowFlattening: true, // Deixa o fluxo lógico confuso (if/else viram loops while)
    controlFlowFlatteningThreshold: 0.75,
    deadCodeInjection: true, // Adiciona código inútil para confundir
    deadCodeInjectionThreshold: 0.4,
    debugProtection: false, // Cuidado: se true, trava o app se o devtools estiver aberto
    disableConsoleOutput: true, // Remove console.logs
    identifierNamesGenerator: 'hexadecimal',
    log: false,
    numbersToExpressions: true, // Converte 123 em (0x1 ^ 0x2...)
    renameGlobals: false,
    rotateStringArray: true,
    selfDefending: true,
    shuffleStringArray: true,
    splitStrings: true,
    stringArray: true,
    stringArrayEncoding: ['base64', 'rc4'], // Criptografa strings
    stringArrayThreshold: 0.75,
    unicodeEscapeSequence: false
  },
});
