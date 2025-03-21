export class EnvConfig{
  static API_URL = String(process.env.REACT_APP_API);
  static API_URL_DEV = String(process.env.REACT_APP_API_DEV);
  static APP_AES_JS_KEY = String(process.env.REACT_APP_AES_JS_KEY);
}