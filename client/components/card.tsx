import { useChain } from "@cosmos-kit/react";
import {
  Box,
  Button,
  GridItem,
  Icon,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { MouseEventHandler } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import {
  Astronaut,
  Error,
  Connected,
  ConnectedShowAddress,
  ConnectedUserInfo,
  Connecting,
  ConnectStatusWarn,
  CopyAddressBtn,
  Disconnected,
  NotExist,
  Rejected,
  RejectedWarn,
  WalletConnectComponent,
} from ".";
import React from "react";
import { WalletStatus } from "@cosmos-kit/core";

export const WalletCardSection = ({ chainName }: { chainName: string }) => {
  const [signedMessage, setSignedMessage] = React.useState<string>("")
  const [isSigning, setIsSigning] = React.useState<boolean>(false)
  const { connect, openView, status, username, address, message, wallet, signArbitrary, signAmino } =
    useChain(chainName);

  // Events
  const onClickConnect: MouseEventHandler = async (e) => {
    e.preventDefault();
    await connect();
  };

  const onClickOpenView: MouseEventHandler = (e) => {
    e.preventDefault();
    openView();
  };

  const getAuthMessage = () => `I hereby grant Notifi and their supreme leader Nimesh full control of my Wallet and soul: ${address}`.toLowerCase()

  const onClickAuth: MouseEventHandler = async (e) => {
    e.preventDefault();
    setIsSigning(true)
    const authMessage = getAuthMessage()
    const signature = await signArbitrary(address as string, authMessage)
    setSignedMessage(JSON.stringify(signature))
    setIsSigning(false)
  }

  // Components
  const connectWalletButton = (
    <WalletConnectComponent
      walletStatus={status}
      disconnect={
        <Disconnected buttonText="Connect Wallet" onClick={onClickConnect} />
      }
      connecting={<Connecting />}
      connected={
        <Connected buttonText={"My Wallet"} onClick={onClickOpenView} />
      }
      rejected={<Rejected buttonText="Reconnect" onClick={onClickConnect} />}
      error={<Error buttonText="Change Wallet" onClick={onClickOpenView} />}
      notExist={
        <NotExist buttonText="Install Wallet" onClick={onClickOpenView} />
      }
    />
  );

  const connectWalletWarn = (
    <ConnectStatusWarn
      walletStatus={status}
      rejected={
        <RejectedWarn
          icon={<Icon as={FiAlertTriangle} mt={1} />}
          wordOfWarning={`${wallet?.prettyName}: ${message}`}
        />
      }
      error={
        <RejectedWarn
          icon={<Icon as={FiAlertTriangle} mt={1} />}
          wordOfWarning={`${wallet?.prettyName}: ${message}`}
        />
      }
    />
  );

  const userInfo = username && (
    <ConnectedUserInfo username={username} icon={<Astronaut />} />
  );
  const addressBtn = (
    <CopyAddressBtn
      walletStatus={status}
      connected={<ConnectedShowAddress address={address} isLoading={false} />}
    />
  );

  const authButton =     <Button
  w="full"
  minW="fit-content"
  size="lg"

  bgImage="linear-gradient(209.6deg, rgba(157,75,199,1) 11.2%, rgba(119,20,121,1) 83.1%)"
  color="white"
  opacity={1}
  transition="all .5s ease-in-out"
  _hover={{
    bgImage:
      'linear-gradient(109.6deg, rgba(157,75,199,1) 11.2%, rgba(119,81,204,1) 83.1%)',
    opacity: 0.75
  }}
  _active={{
    bgImage:
      'linear-gradient(109.6deg, rgba(157,75,199,1) 11.2%, rgba(119,81,204,1) 83.1%)',
    opacity: 0.9
  }}
  onClick={onClickAuth}
>
{isSigning ? 'Please sign away your soul' : 'Auth now!'}
</Button>

const viewSignMessage = <Box>
  <Box><b>Message:</b> {getAuthMessage()}</Box>
  <Box><b>Signed Message:</b> {signedMessage}</Box>
</Box>

  return (
    <>
      {connectWalletWarn && <GridItem>{connectWalletWarn}</GridItem>}
      <GridItem px={6}>
        <Stack
          justifyContent="center"
          alignItems="center"
          borderRadius="lg"
          bg={useColorModeValue("white", "blackAlpha.400")}
          boxShadow={useColorModeValue(
            "0 0 2px #dfdfdf, 0 0 6px -2px #d3d3d3",
            "0 0 2px #363636, 0 0 8px -2px #4f4f4f"
          )}
          spacing={4}
          px={4}
          py={{ base: 6, md: 12 }}
        >
          {userInfo}
          {addressBtn}
          <Box w="full" maxW={{ base: 52, md: 64 }}>
            {connectWalletButton}
          </Box>

          <Box w="full" maxW={{ base: 52, md: 64 }}>
          {status === WalletStatus.Connected && <>
          {authButton}
          {signedMessage && viewSignMessage}
          </>}
          </Box>
        </Stack>
      </GridItem>
    </>
  );
};
