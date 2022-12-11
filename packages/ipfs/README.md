# Crate IPFS Service

This folder contains a Dockerfile which builds a modified go-ipfs microservice, preconfigured for the Crate remote pinning endpoint. To use the image, you'll need to specify a JWT authentication key. Example:

```
export PINATA_KEY=xxxxxxxxx
docker run -e PINATA_KEY=$PINATA_KEY -p 5001:5001 --rm ghcr.io/crate-network/ipfs
```
