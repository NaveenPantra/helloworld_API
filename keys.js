const APIKey = ['1234', '1235', '1236', '1237', 'asdf;lkj'];

const validKey = (key) => {
  if (key == 'undefined')
    return false;
  for (let i = 0 ; i < APIKey.length; i++) {
    if (APIKey[i] === key) {
      return true;
    }
  }
  return false;
};

module.exports = {
  'validKey': validKey,
  'APIKey': APIKey
};
