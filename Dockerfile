FROM ubuntu:22.04
RUN apt-get update -y && \
  apt-get install -y

# Node
RUN apt install curl -y
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && \
  apt-get install -y nodejs

# JQ
RUN apt-get install -y jq

# Yarn
RUN npm install --global yarn

# Wget
RUN apt-get install -y wget

# Chrome
# RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
# RUN apt-get install -y ./google-chrome-stable_current_amd64.deb

# get chromium (stable) and Xvfb
RUN apt-get install chromium-browser xvfb

# Lighthouse
RUN yarn global add @lhci/cli@0.8.x

WORKDIR /app
USER 1001
COPY entrypoint.sh /entrypoint.sh
COPY config/lighthouserc.json /lighthouserc.json
ENTRYPOINT [ "/entrypoint.sh" ]
