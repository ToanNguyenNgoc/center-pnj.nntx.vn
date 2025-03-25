const axios = require('axios');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();
const baseURL = process.env.REACT_APP_API;

async function fetchData() {
  try {
    const response = await axios.get(`${baseURL}/permissions`, {
      headers: {
        'Authorization': `Bearer`
      }
    });

    const permissions = response.data.context.data.reduce((acc, item) => {
      acc[item.name] = item.name;
      return acc;
    }, {});

    const jsonData = JSON.stringify(permissions, null, 2);
    const filePath = path.resolve('../center-pnj.nntx.vn/src/app/components/permission-layout/permissions.json');
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(filePath, jsonData);
    console.log(`Saved: ${filePath}`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

fetchData();
