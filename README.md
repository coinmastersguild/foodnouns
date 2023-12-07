# FOODNOUNS Monorepo

FOODNOUNS is a tasty spork of NounsDAO, the OG generative art collective run by a group of crypto misfits.
Learn more about FOODNOUNS at [foodnouns.wtf](https://foodnouns.wtf) ⌐◨-◨

## Packages

### foodnouns-api

The [foodnouns api](packages/foodnouns-api) is an HTTP webserver that hosts token metadata. This is currently unused because on-chain, data URIs are enabled.

### foodnouns-assets
The [food assets](packages/foodnouns-assets) package holds the FoodNoun PNG and run-length encoded image data.

### foodnouns-contracts

The [nouns contracts](packages/foodnouns-contracts) is the suite of Solidity contracts powering Nouns DAO.

### foodnouns-sdk

The [nouns sdk](packages/foodnouns-sdk) exposes the Nouns contract addresses, ABIs, and instances as well as image encoding and SVG building utilities.

### foodnouns-subgraph

In order to make retrieving more complex data from the auction history, [nouns subgraph](packages/foodnouns-subgraph) contains subgraph manifests that are deployed onto [The Graph](https://thegraph.com).

### foodnouns-webapp

The [nouns webapp](packages/foodnouns-webapp) is the frontend for interacting with Noun auctions as hosted at [foodnouns.wtf](https://foodnouns.wtf).

## Quickstart to all the things

### Install dependencies

```sh
yarn
```

### Build all packages

```sh
yarn build
```

### Run Linter

```sh
yarn lint
```

### Run Prettier

```sh
yarn format
```
