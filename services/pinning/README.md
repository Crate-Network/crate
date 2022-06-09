# Crate Pinning Service

The Crate Pinning Service exposes an endpoint which conforms to the [IPFS Pinning API](https://ipfs.github.io/pinning-services-api-spec/) specification. It's the primary method of permanent data storage through Crate. This allows users to interact with Crate's file persistence over Filecoin via way of their own IPFS clients.

## Setup

Before running, add the `INFURA_PROJECT_ID` and `INFURA_PROJECT_SECRET` variables to your environment. The Infura project should be a Filecoin project.

Additionally, set the `GOOGLE_APPLICATION_CREDENTIALS` variable for Firebase authentication.
