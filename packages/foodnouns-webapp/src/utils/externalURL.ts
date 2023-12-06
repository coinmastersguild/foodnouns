export enum ExternalURL {
  discord,
  twitter,
  notion,
  discourse,
}

export const externalURL = (externalURL: ExternalURL) => {
  switch (externalURL) {
    case ExternalURL.discord:
      return 'http://discord.gg/foodnounsdao';
    case ExternalURL.twitter:
      return 'https://twitter.com/foodnouns';
    case ExternalURL.notion:
      return 'https://foodnouns.notion.site/Explore-the-World-of-FOODNOUNS-4d4cf868455940b6bcb0243b45de615e';
    case ExternalURL.discourse:
      return 'https://discourse.nouns.wtf/';
  }
};
