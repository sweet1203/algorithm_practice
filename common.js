function el(id) {
  return document.getElementById(id);
}

function setHtml(id, html) {
  el(id).innerHTML = html;
}

function setDisabled(id, disabled) {
  el(id).disabled = disabled;
}
