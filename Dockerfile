FROM ubuntu:latest
LABEL authors="manda"

ENTRYPOINT ["top", "-b"]