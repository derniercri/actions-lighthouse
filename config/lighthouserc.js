const core = require('@actions/core');

module.exports = {
  ci: {
    collect: {
      settings: {
        maxWaitForLoad: 60000,
        port: 9222
      },
      startServerCommand: core.getInput('START_SERVER_COMMAND'),
      numberOfRuns: 3
    },
    assert: {
      assertions: {
        'categories:performance': ['error', {minScore: 0.49, aggregationMethod: 'median'}, 'warn', {minScore: 0.89, aggregationMethod: 'median'}],
        'categories:accessibility': ['error', {minScore: 0.49, aggregationMethod: 'median'}, 'warn', {minScore: 0.89, aggregationMethod: 'median'}],
        'categories:best-practices': ['error', {minScore: 0.49, aggregationMethod: 'median'}, 'warn', {'minScore': 0.89, aggregationMethod: 'median' }],
        'categories:seo': ['error', {minScore: 0.49, aggregationMethod: 'median'}, 'warn', {minScore: 0.89, aggregationMethod: 'median'}],
        'categories:pwa': ['error', {minScore: 0.49, aggregationMethod: 'median'}, 'warn', {minScore: 0.89, aggregationMethod: 'median'}]
      }
    },
    upload: {
      target: 'filesystem',
      outputDir: './report-lhci',
      ignoreDuplicateBuildFailure: 'true'
    }
  },
};
