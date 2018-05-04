/* export const genModal = (i) => {
  const parent = document.createElement('div');
  parent.classList.add('modal');
  parent.classList.add('fade');
  parent.id = `ModalCenter${i}`;
  parent.setAttribute('tabindex', '-1');
  parent.setAttribute('role', 'dialog');
  parent.setAttribute('aria-hidden', 'true');
  const modaldialog = document.createElement('div');
  modaldialog.classList.add('modal-dialog');
  modaldialog.setAttribute('role', 'document');
  const modalcontent = document.createElement('div');
  modalcontent.classList.add('modal-content');
  const modalheader = document.createElement('div');
  modalheader.classList.add('modal-header');
  const headerButton = document.createElement('button');
  headerButton.type = 'button';
  headerButton.classList.add('close');
  headerButton.setAttribute('data-dismiss', 'modal');
  headerButton.setAttribute('area-label', 'Close');
  const span = document.createElement('span');
  span.setAttribute('aria-hidden', 'true');
  span.innerHTML = '&times;';
  const modalbody = document.createElement('div');
  modalbody.classList.add('modal-body');
  headerButton.append(span);
  modalheader.append(headerButton);
  modalcontent.append(modalheader);
  modalcontent.append(modalbody);
  modaldialog.append(modalcontent);
  parent.append(modaldialog);
  return parent;
};
export const genButton = (i) => {
  const button = document.createElement('button');
  button.classList.add('btn');
  button.classList.add('btn-primary');
  button.setAttribute('data-toggle', 'modal');
  button.setAttribute('data-target', `#ModalCenter${i}`);
  button.type = 'button';
  button.textContent = 'открыть описание';
  return button;
};
*/
export default (id) => {
  const modalDiv = document.createElement('div');
  modalDiv.innerHTML = `
  <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#ModalCenter${id}">
  Открыть описание
</button>
<div class="modal fade" id="ModalCenter${id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
      </div>
    </div>
  </div>
</div>`;
  return modalDiv;
};
