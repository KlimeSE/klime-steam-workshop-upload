FROM cm2network/steamcmd:root as steam-workshop-upload

# Update packages and install necessary tools
RUN apt-get -y update && \
    apt-get install -y wget build-essential --no-install-recommends && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

ENV STEAM_USERNAME=
ENV STEAM_PASSWORD=
ENV STEAM_TFASEED=

COPY entrypoint.sh /entrypoint.sh

# Download steamcmd-2fa and set permissions
RUN chmod +x /entrypoint.sh && \
    wget https://github.com/KlimeSE/klime-steamcmd-2fa/releases/latest/download/steamcmd-2fa -O /home/steam/steamcmd-2fa && \
    chmod +x /home/steam/steamcmd-2fa

CMD ["."]
ENTRYPOINT ["/entrypoint.sh"]
