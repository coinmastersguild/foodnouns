<div align="center">
  <p align="center">
    <a href="https://foodnouns.wtf" target="blank">
        <img src="public/food-nouns-logo.svg" width="200" alt="FOODNOUNS Logo" /></a>
  </p>
  <h1>FOODNOUNS Monorepo</h1>
  <p>
    FOODNOUNS is a tasty spork of NounsDAO, the OG generative art collective run by a group of crypto misfits.  <br/>
    Learn more about FOODNOUNS at <a href="https://foodnouns.wtf">FOODNOUNS.wtf ⌐◨-◨</a>
</p>

</div>

## Tech overview:

- `yarn` v1 workspaces
- A TypeScript and React front-end + `@craco/craco` for customizing webpack v5 config
- `Node.js` v18.16.0
- `./packages/foodnouns-webapp` is the front-end for [foodnouns.wtf](https://foodnouns.wtf)
- The webapp displays both foodnouns and nouns and auctions simultaneously (WIP)

## Quickstart:

### Install dependencies from the root directory

```sh
yarn
```

### Build packages (just the wep-app for now) // TODO: more

```sh
yarn build
```

### Run the web-app auction page locally:

```sh
# switch to webapp
cd packages/foodnouns-webapp
# Copy example environment file with your own values
cp .env.example .env
# Start local development
yarn start
```

## Packages

### foodnouns-webapp

The [foodnouns webapp](packages/foodnouns-webapp) is the frontend for interacting with FoodNouns AND Noun auctions as hosted at [foodnouns.wtf](https://foodnouns.wtf).

### foodnouns-api

The [foodnouns api](packages/foodnouns-api) is an HTTP webserver that hosts token metadata. This is currently unused because on-chain, data URIs are enabled.

### foodnouns-assets

The [foodnouns assets](packages/foodnouns-assets) package holds the FoodNoun PNG and run-length encoded image data.

### foodnouns-contracts

The [foodnouns contracts](packages/foodnouns-contracts) is the suite of Solidity contracts powering Nouns DAO.

### foodnouns-sdk

The [foodnouns sdk](packages/foodnouns-sdk) exposes the Nouns contract addresses, ABIs, and instances as well as image encoding and SVG building utilities.

### foodnouns-subgraph

In order to make retrieving more complex data from the auction history, [foodnouns subgraph](packages/foodnouns-subgraph) contains subgraph manifests that are deployed onto [The Graph](https://thegraph.com).
