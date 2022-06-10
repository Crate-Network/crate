FROM ipfs/go-ipfs:v0.13.0

ARG PINATA_KEY

RUN ipfs pin remote service add crate https://api.pinata.cloud/psa ${PINATA_KEY}