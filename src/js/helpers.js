import { async } from 'regenerator-runtime';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const getJSON = async function (url) {
  try {
    const respons = await Promise.race([fetch(url), timeout(10)]);
    const data = await respons.json();
    //error check
    if (!respons.ok)
      throw new Error(
        `${data.message} status:${respons.status} ${respons.statusText}`
      );
    return data;
  } catch (err) {
    throw err;
  }
};
//merge testing
