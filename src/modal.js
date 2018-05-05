
export const genButton = (id) => {
  const div = document.createElement('div');
  div.innerHTML = `
    <button id="ModalButton${id}" type="button" class="btn btn-primary" data-toggle="modal" data-target="#ModalCenter">
    Открыть описание
  </button>`;
  return div;
};


export const genModal = () => {
  const div = document.createElement('div');
  div.innerHTML = `
  <div class="modal fade" id="ModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Описание</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div id="modal-body" class="modal-body">
      </div>
    </div>
  </div>
</div>`;
  return div;
};
