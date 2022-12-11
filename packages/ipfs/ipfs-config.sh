if ! ipfs pin remote service ls | grep -q 'crate'; then
  ipfs pin remote service add crate https://localhost:3030/ xxx
fi
