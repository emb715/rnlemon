module.exports = {
  preset: '@testing-library/react-native',
  bail: true,
  verbose: true,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  setupFiles: [
    './node_modules/@react-native-google-signin/google-signin/jest/build/jest/setup.js'
  ],
  setupFilesAfterEnv: [
    'react-native-gesture-handler/jestSetup.js',
    '<rootDir>/jest/jest.setup.js'
  ],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|react-native-reanimated|@react-native(-community)?)|react-navigation|@react-navigation/.*)'
  ],

  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/jest/assetsTransformer.js',
    '\\.(css|less)$': '<rootDir>/jest/assetsTransformer.js'
  }
}
