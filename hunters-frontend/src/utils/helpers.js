import { create } from 'ipfs-http-client';
import { IPFS_INITIALIZE, IPFS_ROOT_STORAGE } from './constants';

export function walletAddressShortener(walletAddress) {
  const firstSection = walletAddress.slice(0, 6);
  const lastSection = walletAddress.slice(
    walletAddress.length - 4,
    walletAddress.length
  );
  return `${firstSection}...${lastSection}`;
}

// param: Array<files>
// returns: Array<string>
export async function storeFilesInIPFS(files) {
  let ipfs; // IPFSHTTPClient | undefined;
  console.log('in here')
  try {
    ipfs = create({
      url: IPFS_INITIALIZE,
    });
  } catch (error) {
    console.error('IPFS error ', error);
    ipfs = undefined;
  }
  const fileArr = Array.from(files);
  const result = [];
  await fileArr.map(async (f) => {
    const addedFile = await ipfs.add(f);
    const fileURL = IPFS_ROOT_STORAGE + addedFile.path;
    result.push(fileURL)
  })
  return result;
}
