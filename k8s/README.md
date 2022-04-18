# Kubernetes

Firstly, images are stored privately. You'll need to load in a [GitHub PAT](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry) using the following command:

```
kubectl create secret docker-registry ghcr\
 --docker-server=ghcr.io\
 --docker-username=crate-network\
 --docker-password=$CR_PAT
```
