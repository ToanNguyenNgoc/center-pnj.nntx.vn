import aesjs from 'aes-js';
import { EnvConfig } from '../configs';
import { Const } from '../common';

export const aesEncode = (text: string) => {
  const key = EnvConfig.APP_AES_JS_KEY.split(',')?.map((i) => parseInt(i));
  const textBytes = aesjs.utils.utf8.toBytes(text);
  const aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
  const encryptedBytes = aesCtr.encrypt(textBytes);
  const encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
  return encryptedHex;
};
export const aesDecode = (code: string) => {
  let decryptedText = '';
  try {
    const key = EnvConfig.APP_AES_JS_KEY.split(',')?.map((i) => parseInt(i));
    const encryptedBytes = aesjs.utils.hex.toBytes(code);
    const aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
    const decryptedBytes = aesCtr.decrypt(encryptedBytes);
    decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
  } catch (error) { }
  return decryptedText;
};

export const aesEncodeAuthSaveLocal = (token: string, refresh_token: string, token_expired_at: string) => {
  return localStorage.setItem(Const.StorageKey.sig, aesEncode(JSON.stringify({
    token,
    refresh_token,
    token_expired_at,
  })))
}
