const { axios } = require('axios');
const chromeLauncher = require('chrome-launcher');
const core = require('@actions/core');
const config = require('./config/lighthouserc.js');
const fs = require('fs');
const lighthouse = require('lighthouse');

function status(category) {
  let color = ''
    if (category > 89)
      color="#339900"
    else if (category <= 89 && category >= 49)
      color="#f2c744"
    else if (category < 49 )
      color="#cc3300"
    return color
}

const dir = './report-lhci';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

(async () => {
  const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
  const runnerResult = await lighthouse(core.getInput('URL') , config);

  // `.report` is the HTML report as a string
  const reportHtml = runnerResult.report;
  fs.writeFileSync('report-lhci/lhreport.html', reportHtml, 'utf-8');

  // kill chrome
  await chrome.kill();

  const performance = runnerResult.lhr.categories.performance.score * 100
  const accessibility = runnerResult.lhr.categories.accessibility.score * 100
  const bestPractices = runnerResult.lhr.categories['best-practices'].score * 100
  const seo = runnerResult.lhr.categories.seo.score * 100
  const pwa = runnerResult.lhr.categories.pwa.score * 100

  const performance_color = status(performance)
  const accessibility_color = status(accessibility)
  const bestPractice_color = status(bestPractices)
  const seo_color = status(seo)
  const pwa_color = status(pwa)

  // Send webhook
  try {
    axios.post(core.getInput('SLACK_WEBHOOK_URL'), {
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "Rapport LightHouse.\n*URL:*"+core.getInput('URL')
          }
        },
        {
          "type": "divider"
        }
      ],
      "attachments": [
        {
          "color": performance_color,
          "blocks": [
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": "*Performance:*"+performance
              }
            }
          ]
        },
        {
          "color": accessibility_color,
          "blocks": [
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": "*Accessibilité:*"+accessibility
              }
            }
          ]
        },
        {
          "color": bestPractice_color,
          "blocks": [
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": "*Bonnes pratiques:*"+bestPractices
              }
            }
          ]
        },
        {
          "color": seo_color,
          "blocks": [
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": "*SEO:*"+seo
              }
            }
          ]
        },
        {
          "color": pwa_color,
          "blocks": [
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": "*PWA:*"+pwa
              }
            }
          ]
        }
      ]
    })
  }
  catch (error) {
    core.setFailed(error.message)
  }
})();
