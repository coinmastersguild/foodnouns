# FOODNOUNS Monorepo

FOODNOUNS DAO is a generative avatar art collective run by a group of crypto misfits.

## Contributing

If you're interested in contributing to Nouns DAO repos we're excited to have you. Please discuss any changes in `#developers` in [discord.gg/nouns](https://discord.gg/nouns) prior to contributing to reduce duplication of effort and in case there is any prior art that may be useful to you.

## Packages

### foodnouns-api

The [nouns api](packages/foodnouns-api) is an HTTP webserver that hosts token metadata. This is currently unused because on-chain, data URIs are enabled.

### foodnouns-assets

The [nouns assets](packages/foodnouns-assets) package holds the Noun PNG and run-length encoded image data.

### foodnouns-bots

The [nouns bots](packages/foodnouns-bots) package contains a bot that monitors for changes in Noun auction state and notifies everyone via Twitter and Discord.

### foodnouns-contracts

The [nouns contracts](packages/foodnouns-contracts) is the suite of Solidity contracts powering Nouns DAO.

### foodnouns-sdk

The [nouns sdk](packages/foodnouns-sdk) exposes the Nouns contract addresses, ABIs, and instances as well as image encoding and SVG building utilities.

### foodnouns-subgraph

In order to make retrieving more complex data from the auction history, [nouns subgraph](packages/foodnouns-subgraph) contains subgraph manifests that are deployed onto [The Graph](https://thegraph.com).

### foodnouns-webapp

The [nouns webapp](packages/foodnouns-webapp) is the frontend for interacting with Noun auctions as hosted at [nouns.wtf](https://nouns.wtf).

## Quickstart

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
