module.exports = {
  getHello: getHello
};

async function getHello(name, age) {
  let result = { name: name };
  if (age) {
    result['age'] = age;
  }
  return result;
}
