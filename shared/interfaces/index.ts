export interface ICoinList {
  success: boolean;
  crypto: ICrypto;
  fiat: Record<string, string>;
}

export interface ICrypto extends Record<string, ICryptoData> {}

export interface ICryptoData {
  symbol: string;
  name: string;
  name_full: string;
  max_supply: number | string;
  icon_url: string;
}
