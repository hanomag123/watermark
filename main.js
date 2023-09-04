import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'

// imgInp.onchange = evt => {
//   const [file] = imgInp.files;
//   const img = document.getElementById('blah');
//   if (file && img) {
//     img.src = URL.createObjectURL(file);
//     img.classList.add('active')
//   }
// }

// hiding the div that will contain the images
const imagesDiv = document.querySelector("#images");

const fileInput = document.querySelector("#upload");

fileInput.addEventListener("change", async (e) => {
  const [file] = fileInput.files;

  // displaying the uploaded image
  const originalImage = document.querySelector("#originalImage");
  originalImage.src = await fileToDataUri(file);

  // adding the image watermark to the original image
  // and showing the watermarked image
  const watermakedImage = document.querySelector("#watermakedImage");


  originalImage.addEventListener("load", async () => {
    watermakedImage.src = await watermakImage(
      originalImage,
      "./images/1.jpg"
    );
  });

  // making the div containing the image visible
  imagesDiv.style.visibility = "visible";

  return false;
});

function fileToDataUri(field) {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      resolve(reader.result);
    });

    reader.readAsDataURL(field);
  });
}

async function watermakImage(originalImage, watermarkImagePath) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  const canvasWidth = originalImage.width;
  const canvasHeight = originalImage.height;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  // initializing the canvas with the original image
  context.drawImage(originalImage, 0, 0, canvasWidth, canvasHeight);

  // loading the watermark image and transforming it into a pattern
  const result = await fetch(watermarkImagePath);
  const blob = await result.blob();
  const image = await createImageBitmap(blob);
  const pattern = context.createPattern(image, "no-repeat");
  // translating the watermark image to the bottom right corner
  context.translate(canvasWidth - image.width, canvasHeight - image.height);
  context.rect(0, 0, canvasWidth, canvasHeight);
  context.fillStyle = pattern;

  context.fill();

  return canvas.toDataURL();
}

const canvas = document.getElementById('drag');

const ctx = canvas.getContext('2d');

const canvasW = canvas.width = canvas.getBoundingClientRect().width;
const canvasH = canvas.height = canvas.getBoundingClientRect().height;

canvas.style.border = '1px solid green';

let img = null;
let watermarks = [];
let images = [];
let currentimageIndex = null;
let is_dragging = false;
let startX;
let startY;




images.push({ x: 0, y: 0, width: 200, height: 200, color: 'blue' })
images.push({ x: 200, y: 100, width: 400, height: 200, color: 'red' })

let image = null;

let createWatermarks = async function (src) {
  // loading the watermark image and transforming it into a pattern
  const result = await fetch('/images/1.jpg');
  const blob = await result.blob();
  img = await createImageBitmap(blob);
  // pattern = await ctx.createPattern(image, "no-repeat")
  await drawImages(img)
}

createWatermarks()

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

  let index = 0;
  for (let image of images) {
    if (isMouseInimage(startX, startY, image)) {
      currentimageIndex = index;
      is_dragging = true;
      return;
    }
    index++
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
    return
  } else {
    event.preventDefault()
    const mouseY = parseInt(event.clientY - canvas.getBoundingClientRect().top);
    const mouseX = parseInt(event.clientX - canvas.getBoundingClientRect().left);

    let dx = mouseX - startX;
    let dy = mouseY - startY;

    let currentimage = images[currentimageIndex];
    currentimage.x += dx;
    currentimage.y += dy;

    drawImages(img);

    startX = mouseX;
    startY = mouseY;
  }
}

canvas.onmousedown = mouseDown;
canvas.onmouseup = mouseUp;
canvas.onmouseout = mouseOut;
canvas.onmousemove = mouseMove;


let drawImages = async function (img) {
  ctx.clearRect(0, 0, canvasW, canvasH)

  for (let image of images) {
    ctx.fillStyle = image.color;
    ctx.fillRect(image.x, image.y, image.width, image.height);
    // translating the watermark image to the bottom right corner
    ctx.drawImage(img, image.x, image.y);

    ctx.fill();

  }
}


