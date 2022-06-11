export function walletAddressShortener(walletAddress) {
  const firstSection = walletAddress.slice(0, 6);
  const lastSection = walletAddress.slice(
    walletAddress.length - 4,
    walletAddress.length
  );
  return `${firstSection}...${lastSection}`;
}
