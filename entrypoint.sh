#!/bin/bash

lhci autorun --collect.url="$URL" --collect.startServerCommand="$START_SERVER_COMMAND" --config="config/lighthouserc.json" &
wait $!

result=$(cat report-lhci/manifest.json | jq '.[0] .summary' | tr -d {}'"')

performance=$(echo $result | cut -f1 -d, | cut -f2 -d.)
accessibility=$(echo $result | cut -f2 -d, | cut -f2 -d.)
bestPratice=$(echo $result | cut -f3 -d, | cut -f2 -d.)
seo=$(echo $result | cut -f4 -d, | cut -f2 -d.)
pwa=$(echo $result | cut -f5 -d, | cut -f2 -d.)

function status() {
    if (($1 > 89))
    then
      color="#339900"
    elif (($1 <= 89 && $1 >= 49))
    then
      color="#f2c744"
    elif (($1 <49 ))
    then
      color="#cc3300"
    fi
    echo $color
}

performance_color=$(status $performance)
accessibility_color=$(status $accessibility)
bestPratice_color=$(status $bestPratice)
seo_color=$(status $seo)
pwa_color=$(status $pwa)

curl -H "Content-type: application/json" \
--data "{'blocks':[{'type': 'section','text': {'type': 'mrkdwn','text': 'Rapport LightHouse.\n*URL:* https://lab.derniercri.io'}},{'type': 'divider'}],'attachments':[{'color': '${performance_color}','blocks':[{'type':'section','text':{'type':'mrkdwn','text':'*Performance:* ${performance}'}}]},{'color':'${accessibility_color}','blocks':[{'type':'section','text':{'type':'mrkdwn','text':'*Accessibilité:* ${accessibility}'}}]},{'color':'${bestPratice_color}','blocks':[{'type': 'section','text': {'type': 'mrkdwn','text':'*Bonnes pratiques:* ${bestPratice}'}}]},{'color': '${seo_color}','blocks': [{'type': 'section','text': {'type': 'mrkdwn','text': '*SEO:* ${seo}'}}]},{'color': '${pwa_color}','blocks': [{'type': 'section','text': {'type': 'mrkdwn','text': '*PWA:* ${pwa}'}}]}]}" \
-X POST $SLACK_WEBHOOK_URL
