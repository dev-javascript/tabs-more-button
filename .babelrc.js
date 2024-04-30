'use strict';

const output = process.env.BABEL_OUTPUT;
const modules = output == null ? false : output;
const options = {
  presets: [['@babel/env', { loose: true, modules }]],
  env: {
    test: {
      // extra configuration for process.env.NODE_ENV === 'test'
      presets: ['@babel/env'], // overwrite env-config from above with transpiled module syntax
    },
  },
};

module.exports = options;
