# Crate IPFS Service

This folder contains a Dockerfile which builds a modified go-ipfs microservice, preconfigured for the Crate remote pinning endpoint. To use the image, you'll need to specify a JWT authentication key, as so:

```
docker run --rm --net=host -e PINATA_KEY=xxxxxxxx ghcr.io/crate-network/ipfs
```