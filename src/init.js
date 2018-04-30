const func = () => {
const component = () => {
    let element = document.createElement('div');
    element.innerHTML = 'No!';
    return element;
  };

  document.body.appendChild(component());
}
export default func;
