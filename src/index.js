const test = () => {
  const element = document.createElement('div');
  element.innerHTML = 'No!';
  return element;
};

document.body.appendChild(test());
