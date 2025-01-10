"use client";

import { ConnectButton } from "thirdweb/react";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Kbd } from "@nextui-org/kbd";
import { Link } from "@nextui-org/link";
import { Input } from "@nextui-org/input";
import { link as linkStyles } from "@nextui-org/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { GithubIcon, SearchIcon } from "@/components/icons";
import { client, chain } from "@/config/client";

export const Navbar = () => {
  const pathname = usePathname(); // Get current route path
  const searchInput = (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper: "bg-default-100",
        input: "text-sm",
      }}
      endContent={
        <Kbd className="hidden lg:inline-block" keys={["command"]}>
          K
        </Kbd>
      }
      labelPlacement="outside"
      placeholder="Search..."
      startContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
    />
  );

  return (
    <NextUINavbar isBordered>
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <p className="font-bold text-inherit">Senior Farewell NFTs</p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-6 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium"
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-">
          <Link isExternal aria-label="Github" href={siteConfig.links.github}>
            <GithubIcon className="text-default-500" />
          </Link>
          <ThemeSwitch />
        </NavbarItem>
        {/* <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem> */}
        <NavbarItem className="hidden md:flex">
          <ConnectButton
            accountAbstraction={{
              chain: chain,
              sponsorGas: true,
            }}
            chain={chain}
            client={client}
          />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Link isExternal aria-label="Github" href={siteConfig.links.github}>
          <GithubIcon className="text-default-500" />
        </Link>
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        {/* {searchInput} */}
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => {
            const isActive = pathname === item.href;

            return (
              <NavbarMenuItem key={`${item}-${index}`}>
                <Link
                  className={`text-lg ${
                    isActive ? "text-primary font-semibold" : "text-foreground"
                  }`}
                  href={item.href}
                >
                  {item.label}
                </Link>
              </NavbarMenuItem>
            );
          })}
        </div>
        <ConnectButton
          accountAbstraction={{
            chain: chain, // the chain where your smart accounts will be or is deployed
            sponsorGas: true, // enable or disable sponsored transactions
          }}
          chain={chain}
          client={client}
        />
      </NavbarMenu>
    </NextUINavbar>
  );
};

{
  /* <NextUINavbar isBordered>
  <NavbarBrand>
    <p className="font-bold text-inherit">Senior Farewell NFTs</p>
  </NavbarBrand>
  <NavbarContent justify="end">
    <NavbarItem>
      <NextLink
        className={clsx(
          linkStyles({ color: "foreground" }),
          "data-[active=true]:text-primary data-[active=true]:font-medium"
        )}
        color="foreground"
        href={"/"}
      >
        Home
      </NextLink>
    </NavbarItem>
    <NavbarItem>
      <NextLink
        className={clsx(
          linkStyles({ color: "foreground" }),
          "data-[active=true]:text-primary data-[active=true]:font-medium"
        )}
        color="foreground"
        href={"/collections"}
      >
        Collections
      </NextLink>
    </NavbarItem>
    <NavbarItem>
      <Button
        onClick={handleConnectWallet}
        color={isWalletConnected ? "success" : "primary"}
        startContent={<Wallet size={16} />}
        className="transition-transform hover:scale-105"
      >
        {isWalletConnected ? "Wallet Connected" : "Connect Wallet"}
      </Button>
    </NavbarItem>
  </NavbarContent>
</NextUINavbar>; */
}
