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
  try {
    ipfs = create({
      url: IPFS_INITIALIZE,
    });
  } catch (error) {
    console.error('❗️ IPFS error ', error);
    ipfs = undefined;
  }
  const fileArr = Array.from(files);
  const result = [];
  await Promise.all(fileArr.map(async (f) => {
    const addedFile = await ipfs.add(f);
    const fileURL = IPFS_ROOT_STORAGE + addedFile.path;
    result.push(fileURL)
  }));
  return result;
}

export function timeFromUpdateUtil(created) {
  const timeNow = new Date();
  const timeUpdated = new Date(created);
  
  const daysSince = (timeNow.getTime() - timeUpdated.getTime()) / 1000 / 3600 / 24;

  switch(daysSince) {
    case daysSince / 365 > 1:
      return 'More than a year ago';
    case daysSince / 30 > 1: 
      return 'More than a month ago';
    case daysSince / 7 > 1:
      return 'More than a week ago';
    case daysSince > 1:
      return `More than ${Math.floor(daysSince)} days ago`;
    default:
      return 'Created Today';
  }
}


export function capitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1);
}

export function timeCreatedForActivity(created) {
  // Activity times need to be more precise
  
}