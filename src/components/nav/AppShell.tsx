import {
  Heading,
  VStack,
  Icon,
  HStack,
  Image,
  Grid,
  GridItem,
  Divider,
  Text,
  Box,
  type BoxProps,
  type LinkProps,
  Link,
} from "@chakra-ui/react";
import Head from "next/head";
import { BsGithub, BsTwitter } from "react-icons/bs";
import { useRouter } from "next/router";
import PublicPlaygroundWarning from "../PublicPlaygroundWarning";
import { type IconType } from "react-icons";
import { RiFlaskLine } from "react-icons/ri";
import { useState, useEffect } from "react";

type IconLinkProps = BoxProps & LinkProps & { label: string; icon: IconType; href: string };

const IconLink = ({ icon, label, href, target, color, ...props }: IconLinkProps) => {
  const isActive = useRouter().pathname.startsWith(href);
  return (
    <Box
      as={Link}
      href={href}
      target={target}
      w="full"
      bgColor={isActive ? "gray.300" : "transparent"}
      _hover={{ bgColor: "gray.300" }}
      py={4}
      justifyContent="start"
      cursor="pointer"
      {...props}
    >
      <HStack w="full" px={4} color={color}>
        <Icon as={icon} boxSize={6} mr={2} />
        <Text fontWeight="bold">{label}</Text>
      </HStack>
    </Box>
  );
};

const NavSidebar = () => {
  return (
    <VStack align="stretch" bgColor="gray.100" py={2} pb={0} height="100%">
      <Link href="/" w="full" _hover={{ textDecoration: "none" }}>
        <HStack spacing={0} pl="3">
          <Image src="/logo.svg" alt="" w={8} h={8} />
          <Heading size="md" p={2} pl={{ base: 16, md: 2 }}>
            OpenPipe
          </Heading>
        </HStack>
      </Link>
      <Divider />
      <VStack spacing={0} align="flex-start" overflowY="auto" overflowX="hidden" flex={1}>
        <IconLink icon={RiFlaskLine} label="Experiments" href="/experiments" />
      </VStack>
      <Divider />
      <VStack w="full" spacing={0} pb={2}>
        <IconLink
          icon={BsGithub}
          label="GitHub"
          href="https://github.com/openpipe/openpipe"
          target="_blank"
          color="gray.500"
          _hover={{ color: "gray.800" }}
        />
        <IconLink
          icon={BsTwitter}
          label="Twitter"
          href="https://twitter.com/corbtt"
          target="_blank"
          color="gray.500"
          _hover={{ color: "gray.800" }}
        />
      </VStack>
    </VStack>
  );
};

export default function AppShell(props: { children: React.ReactNode; title?: string }) {
  const [vh, setVh] = useState("100vh"); // Default height to prevent flicker on initial render

  useEffect(() => {
    const setHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
      setVh(`calc(var(--vh, 1vh) * 100)`);
    };
    setHeight(); // Set the height at the start

    window.addEventListener("resize", setHeight);
    window.addEventListener("orientationchange", setHeight);

    return () => {
      window.removeEventListener("resize", setHeight);
      window.removeEventListener("orientationchange", setHeight);
    };
  }, []);

  return (
    <Grid
      h={vh}
      w="100vw"
      templateColumns={{ base: "56px minmax(0, 1fr)", md: "200px minmax(0, 1fr)" }}
      templateRows="max-content 1fr"
      templateAreas={'"warning warning"\n"sidebar main"'}
    >
      <Head>
        <title>{props.title ? `${props.title} | OpenPipe` : "OpenPipe"}</title>
      </Head>
      <GridItem area="warning">
        <PublicPlaygroundWarning />
      </GridItem>
      <GridItem area="sidebar" overflow="hidden">
        <NavSidebar />
      </GridItem>
      <GridItem area="main" overflowY="auto">
        {props.children}
      </GridItem>
    </Grid>
  );
}
