FROM ubuntu:22.04
RUN apt-get update -y && apt-get install -y

# Install wget
RUN apt-get install -y wget

# Node
RUN apt install curl -y
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && \
  apt-get install -y nodejs

# JQ
RUN apt-get install -y jq

RUN npm -g install @lhci/cli@0.8.x

# Chrome
RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN dpkg -i google-chrome*.deb

WORKDIR /app
COPY entrypoint.sh /entrypoint.sh
COPY config/lighthouserc.json /lighthouserc.json
ENTRYPOINT [ "/entrypoint.sh" ]
