const dotenv = require('dotenv');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

dotenv.config();
const baseUrl = process.env.COINLAYER_API_BASEURL;
const coinLayerApiKey = process.env.COINLAYER_API_KEY;
const COINLAYER_API = `${baseUrl}/list?access_key=${coinLayerApiKey}`;

export const main = async () => {
  try {
    const filePath = path.resolve('public', 'crptoList.json');
    const { data } = await axios.get(COINLAYER_API);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (e) {
    console.log('Something went wrong', e);
    throw e;
  }
};

main()
  .then(() => console.log('Done.'))
  .catch(console.error);
