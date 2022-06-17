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
  await Promise.all(
    fileArr.map(async (f) => {
      const addedFile = await ipfs.add(f);
      const fileURL = IPFS_ROOT_STORAGE + addedFile.path;
      result.push(fileURL);
    })
  );
  return result;
}

export function timeFromUpdateUtil(created) {
  const timeNow = new Date();
  const timeUpdated = new Date(created);

  const daysSince =
    (timeNow.getTime() - timeUpdated.getTime()) / 1000 / 3600 / 24;

  switch (daysSince) {
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
  if (string == null) {
    return null;
  }
  return string[0].toUpperCase() + string.slice(1);
}

export function timeCreatedForActivity(created) {
  // Activity times need to be more precise
  const timeNow = new Date();
  const timeUpdated = new Date(created);

  const yearInMinutes = 365 * 24 * 60;
  const monthInMinutes = 30 * 24 * 60;
  const weekInMinutes = 7 * 24 * 60;
  const daysInMinutes = 24 * 60;

  const minutesSince = Math.floor(
    (timeNow.getTime() - timeUpdated.getTime()) / 1000 / 60
  );

  if (minutesSince > yearInMinutes) {
    return 'Over a year ago';
  } else if (minutesSince > monthInMinutes) {
    return Math.floor(minutesSince / monthInMinutes)
      ? 'About a month ago'
      : `${Math.floor(minutesSince / monthInMinutes)} months ago`;
  } else if (minutesSince > weekInMinutes) {
    return Math.floor(minutesSince / weekInMinutes)
      ? 'About a week ago'
      : `${Math.floor(minutesSince / weekInMinutes)} months ago`;
  } else if (minutesSince > daysInMinutes) {
    return Math.floor(minutesSince / daysInMinutes) === 1
      ? '1 day ago'
      : `${Math.floor(minutesSince / daysInMinutes)} days ago`;
  } else if (minutesSince > 60) {
    return `${Math.floor(minutesSince / 60)} hours ago`;
  }
  return minutesSince <= 1 ? 'A minute ago' : `${minutesSince} minutes ago`;
}
