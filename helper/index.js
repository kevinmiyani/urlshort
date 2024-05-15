function generateUniqueId(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const generateurl = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let url = "";
  const charactersLength = characters.length;
  const randomnumber = Math.random() * charactersLength;
  for (let index = 0; index < randomnumber; index++) {
    url += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return "https://example.com/" + url;
};

const genratehundred = async () => {
  const urls = [];
  for (let index = 0; index < 100; index++) {
    const url = await generateurl();
    const uniqueId = await generateUniqueId(4);
    urls.push({ full: url, short: uniqueId });
  }

  return urls;
};

module.exports = { generateUniqueId, genratehundred };
