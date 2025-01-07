export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Aurelia",
  description:
    "Mint your college memories as NFTs and store then forever on the blockchain",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Collections",
      href: "/collections",
    },
    {
      label: "myNFTs",
      href: "/myNFTs",
    },
    {
      label: "myCollections",
      href: "/myCollections",
    },
  ],
  navMenuItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Collections",
      href: "/collections",
    },
    {
      label: "myNFTs",
      href: "/myNFTs",
    },
  ],
  links: {
    github: "https://github.com/abhiraj2404/college_memories",
    twitter: "https://twitter.com/getnextui",
    docs: "https://nextui.org",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
