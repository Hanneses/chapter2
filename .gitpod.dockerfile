FROM gitpod/workspace-postgres

RUN sudo apt-get update \
    && sudo apt-get install netcat-traditional -y \
    && sudo rm -rf /var/lib/apt/lists/*
