import './style.css'

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let canvasW = null;
let canvasH = null;
let bg = null;
let watermark = { src: null, x: 0, y: 0, width: null, height: null };
let is_dragging = false;
let startX;
let startY;
let scale = 1;
let opacity = 1;


const addWatermark = document.getElementById('addWatermark');

if (addWatermark) {
  addWatermark.addEventListener('click', function () {
    const inputFile = this.nextElementSibling;
    if (inputFile) {
      inputFile.click();
    }
  })
}

const inputFile = document.getElementById('inpWatermark');

if (inputFile) {
  inputFile.addEventListener('change', function () {
    const [file] = this.files;

    const watermarkList = document.getElementById('watermarkList');
    if (watermarkList) {
      const url = URL.createObjectURL(file);
      watermarkList.insertAdjacentHTML('beforeend',
        `<li class="watermarks-item"><img src="${url}" alt="img"></li>`
      )
      const lastChild = watermarkList.children.length - 1;
      const newItem = watermarkList.children[lastChild];

      newItem.addEventListener('click', watermarkClickHandler);
      newItem.click();
    }
  })
}

const waterMarksItems = document.querySelectorAll('.watermarks-item');

if (waterMarksItems.length) {
  waterMarksItems.forEach(item => {
    item.addEventListener('click', watermarkClickHandler)
  })
}

function watermarkClickHandler() {
  const waterMarksItems = document.querySelectorAll('.watermarks-item');
  if (waterMarksItems.length) {
    waterMarksItems.forEach(el => el.classList.remove('active'));
    if (bg) {
      this.classList.add('active');
      const img = this.querySelector('img');
      if (img?.src) {
        createWatermark(img.src)
      }
    }
  }
}

const uploadFile = document.getElementById('uploadFile');
const canvasWrapper = document.getElementById('canvasWrapper');

if (uploadFile && canvasWrapper && canvas) {
  uploadFile.addEventListener('dragover', drag);
  uploadFile.addEventListener('dragleave', drop);
  uploadFile.addEventListener('change', dragNdrop);
}

function dragNdrop(event) {
  const [file] = event.target.files;

  uploadImage(file);
}
function drag() {
  document.getElementById('uploadFile').parentNode.className = 'draging dragBox';
}
function drop() {
  document.getElementById('uploadFile').parentNode.className = 'dragBox';
}

async function uploadImage(file) {
  const originalImage = document.getElementById("originalImage");

  if (originalImage) {
    originalImage.src = await fileToDataUri(file);
    originalImage.addEventListener("load", async () => {

      canvasW = canvas.width = originalImage.naturalWidth;
      canvasH = canvas.height = originalImage.naturalHeight;

      canvasWrapper.classList.add('active');
      bg = originalImage;
      drawCanvas(originalImage)
    });
  }
}

function fileToDataUri(field) {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      resolve(reader.result);
    });

    reader.readAsDataURL(field);
  });
}

let initialWidth = null;
let initialHeight = null;
let createWatermark = async function (src) {
  const result = await fetch(src);
  const blob = await result.blob();
  const bitmap = await createImageBitmap(blob);
  watermark.src = bitmap;
  watermark.width = initialWidth = bitmap.width;
  watermark.height = initialHeight = bitmap.height;
  drawCanvas(bg, watermark)
}

function drawCanvas(bg = null, watermark = null) {
  ctx.clearRect(0, 0, canvasW, canvasH)
  if (bg) {
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height)
  }
  if (watermark?.src) {
    ctx.globalAlpha = opacity;
    ctx.drawImage(watermark.src, watermark.x, watermark.y, watermark.width, watermark.height);
  }
  ctx.fill();

  ctx.globalAlpha = 1;
}

let isMouseInimage = function (x, y, image) {
  let image_left = image.x;
  let image_right = image.x + image.width;
  let image_top = image.y;
  let image_bottom = image.y + image.height;
  if (x > image_left && x < image_right && y > image_top && y < image_bottom) {
    return true;
  } else {
    return false;
  }
}

let mouseDown = function (event) {
  event.preventDefault();
  startY = parseInt(event.clientY - canvas.getBoundingClientRect().top);
  startX = parseInt(event.clientX - canvas.getBoundingClientRect().left);

  if (isMouseInimage(startX, startY, watermark)) {
    is_dragging = true;
    return;
  }


}

let mouseUp = function (event) {
  if (!is_dragging) {
    return;
  }

  event.preventDefault();
  is_dragging = false;
}

let mouseOut = function (event) {
  if (!is_dragging) {
    return;
  }

  event.preventDefault();
  is_dragging = false;
}

let mouseMove = function (event) {
  if (!is_dragging) {
    canvas.classList.remove('grabcursor')
    return
  } else {
    event.preventDefault()
    canvas.classList.add('grabcursor')
    const mouseY = parseInt(event.clientY - canvas.getBoundingClientRect().top);
    const mouseX = parseInt(event.clientX - canvas.getBoundingClientRect().left);

    let dx = mouseX - startX;
    let dy = mouseY - startY;

    watermark.x += dx;
    watermark.y += dy;

    drawCanvas(bg, watermark);

    startX = mouseX;
    startY = mouseY;
  }
}

canvas.onmousedown = mouseDown;
canvas.onmouseup = mouseUp;
canvas.onmouseout = mouseOut;
canvas.onmousemove = mouseMove;

const inputs = document.querySelectorAll('input[type=range]');

if (inputs.length) {
  inputs.forEach(range => {
    range.addEventListener('change', opacityScale);
    range.addEventListener('input', opacityScale);


    range.nextElementSibling.innerHTML = range.value
  })
}

function opacityScale () {
  this.nextElementSibling.innerHTML = this.value;

  if (this.id === 'opacity') {
    opacity = this.value;
    drawCanvas(bg, watermark)
  }

  if (this.id === 'scale') {
    scale = this.value;
      watermark.width = initialWidth * scale;
      watermark.height = initialHeight * scale;

    drawCanvas(bg, watermark)
  }
}

const preview = document.getElementById('preview');
const imagePreview = document.getElementById('imagePreview')

if (preview) {
  preview.addEventListener('click', function () {
    imagePreview.innerHTML = '';
    const img = document.createElement('img');
    img.src = canvas.toDataURL();
    imagePreview.appendChild(img)
    imagePreview.hidden = false;
    setTimeout(() => {
      document.addEventListener('click', closePreview)
    }, .3)
  })
}

function closePreview() {

    imagePreview.hidden = true;
    document.removeEventListener('click', closePreview)

}

const saveButton = document.getElementById('saveButton')

if (saveButton) {
  saveButton.addEventListener('click', function () {
    this.nextElementSibling.href = canvas.toDataURL();
    this.nextElementSibling.click();

    ctx.clearRect(0, 0, canvasW, canvasH);
    canvasWrapper.classList.remove('active')
  })
}
