
var web_url_for_model = window.location.href

const canvas = document.querySelector('#canvas-main');
var ctx = canvas.getContext("2d");
var hl = document.getElementById("panel-id")


// Add event listeners
// fileDrag.addEventListener("dragover", fileDragHover, false);
// fileDrag.addEventListener("dragleave", fileDragHover, false);
// fileDrag.addEventListener("drop", fileSelectHandler, false);
// fileSelect.addEventListener("change", fileSelectHandler, false);

// function fileDragHover(e) {
//   // prevent default behaviour
//   e.preventDefault();
//   e.stopPropagation();

//   // fileDrag.className = e.type === "dragover" ? "upload-box dragover" : "upload-box";
// }

// function fileSelectHandler(e) {
//   // handle file selecting
//   var files = e.target.files || e.dataTransfer.files;
//   fileDragHover(e);
//   for (var i = 0, f; (f = files[i]); i++) {
//     previewFile(f);
//   }
// }

//========================================================================
// Web page elements for functions to use
//========================================================================

var imagePreview = document.getElementById("image-preview");
// var imageDisplay = document.getElementById("image-display");
// var uploadCaption = document.getElementById("upload-caption");
var predResult = document.getElementById("pred-result2");
var model = undefined;

//========================================================================
// Main button events
//========================================================================


async function initialize() {
  model = await tf.loadLayersModel('model.json');
}

var upld_model = document.getElementById('upld-btn')
var select_model = document.getElementById('modelUpload')

upld_model.addEventListener('click', function () {
  select_model.click();

})

select_model.addEventListener('change', function () {
  console.log("uploading User Model")
  upload_model();
})


// function select_file(){
//   document.getElementById('modelUpload').click()
//   upload_model()
// }


async function upload_model() {
  const modelfile = document.getElementById('modelUpload').files[0];
  popmsg("Uploading model")
  // const model = await tfl.loadModel(tf.io.browserFiles(modelfile));
  // var file=fileSelector.files[0];
  if (modelfile) {
    // create reader
    // console.log(file)
    // var reader = new FileReader();
    // reader.readAsText(modelfile);
    // reader.onload = function(e) {
    //     // browser completed reading file - display it
    //     console.log("Using uploaded model")

    //     model_file=e.target.result;
    //     // localStorage.setItem("model.json",model_file)
    //     // model=model_file
    //     // console.log(model_file)
    // };
    // basepath = os.path.dirname(__file__)
    // console.log(basepath)
    console.log("Using Uploaded Model")
    // console.log(tf.io.browserFiles(modelfile.name))
    var link = web_url_for_model + modelfile.name
    console.log(link)
    model = await tf.loadLayersModel(link);
    // model = await tf.loadLayersModel(model_file); 
  }
  else {
    // console.log("using pre-trained model")
    // model = await tf.loadLayersModel('model.json'); 
    // // await model.save('localstorage://my-model');
    alert("Please select a model first :) ");

  }
}

async function predict_one() {
  console.log("IN First")
  // let img_abc = toimg();
  // img_abc
 var _res = await toimg()
  .then((_res) => {
    console.log("Should Be Working Fine" + _res)
    setTimeout(predict,500);
    // predict();
  })
}


// var toimg = new Promise((resolve, reject) =>
 function toimg(){
  // var canvas = document.getElementById("#canvas-main")
  return new Promise((resolve,reject)=>{
     canvas.toBlob(function (blob) {
    console.log("In TO Image")
    link = document.getElementById('image-preview');
    link.src = URL.createObjectURL(blob);
    resolve("yes");
    // console.log(link.src)
  }, 'image/png');
  // console.log("Working")
  })
 
}

// );


async function predict() {
  // action for the submit button
  // const modelfile = document.getElementById('modelUpload').files[0];
  // var file=fileSelector.files[0];


  // console.log(file)
  // console.log("filename")
  // console.log(file.getAsText(""))
  // console.log(file.name)


  console.log(imagePreview.src)


  if (!imagePreview.src || !imagePreview.src.startsWith("blob")) {
    window.alert("Please select an image before submit.");
    return;
  }

  // toimg()

  let tensorImg = tf.browser.fromPixels(imagePreview).resizeNearestNeighbor([28, 28]).mean(2).toFloat().expandDims(2).expandDims(0);
  // console.log(tensorImg.data)
  // previewFile(tensorImg.encodePng())
  var prediction = await model.predict(tensorImg).data();
  var highestVal = Math.max.apply(null, Object.values(prediction)),
    val = Object.keys(prediction).find(function (a) {
      return prediction[a] === highestVal;
    });
  console.log("Predictions are")
  console.log(val)
  console.log(prediction);
  console.log(prediction[val])

  predResult.innerHTML = val;
  if (prediction[val] < 0.8){
    predResult.innerHTML = "Not Sure";
  }
  show(predResult)
  // })
}

function clearImage() {
  // reset selected files
  clr()
  // fileSelect.value = "";

  // remove image sources and hide them
  imagePreview.src = "";
  // imageDisplay.src = "";
  predResult.innerHTML = "?";

  hide(imagePreview);
  // hide(imageDisplay);
  // hide(predResult);
  // show(uploadCaption);

  // imageDisplay.classList.remove("loading");

  document.getElementById("modelUpload").value = "";
}

function previewFile(file) {
  // show the preview of the image
  var fileName = encodeURI(file.name);

  var reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = () => {
    imagePreview.src = URL.createObjectURL(file);

    show(imagePreview);
    // hide(uploadCaption);

    // reset
    predResult.innerHTML = "?";
    // imageDisplay.classList.remove("loading");

    // displayImage(reader.result, "image-display");
  };
}

//========================================================================
// Helper functions
//========================================================================

// function displayImage(image, id) {
//   // display image on given id <img> element
//   let display = document.getElementById(id);
//   display.src = image;
//   show(display);
// }

function hide(el) {
  // hide an element
  el.classList.add("hidden");
}

function show(el) {
  // show an element
  el.classList.remove("hidden");
}

initialize();



//    Modal Code
window.addEventListener('load', bindEvents3);

var popOut = document.querySelector('.bg-popOutPg');
var hidePopOut = document.querySelector('.lbtbBtn');

function bindEvents3() {
  hidePopOut.addEventListener('click', hidePop);
  // popOut.addEventListener('click',hidePop);
}

function hidePop() {
  popOut.style.display = 'none';
}

// Code For Canvas

function clr() {
  console.log("called clr")
  ctx.fillStyle = 'black';

  ctx.beginPath();
  ctx.fillRect(0, 0, hl.offsetWidth, hl.offsetHeight);
}

function resizecan() {
  // hl =  document.getElementById("MyDiv")
  // console.log("called REsize")
  canvas.height = hl.offsetHeight;
  // window.innerHeight;
  canvas.width = hl.offsetWidth;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

}

window.addEventListener('load', () => {
  // var canvas = document.querySelector('#canvas-main');
  // var ctx = canvas.getContext("2d");
  //Resizing

  canvas.height = hl.offsetHeight;
  // window.innerHeight;
  canvas.width = hl.offsetWidth;
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // window.innerWidth;

  let painting = false;

  function startPosition(e) {
    painting = true;
    draw(e);
  }
  function finishPosition() {
    painting = false;
    ctx.beginPath();
  }
  function draw(e) {
    if (!painting) return;
    ctx.lineWidth = 13;
    ctx.lineCap = "round";
    ctx.strokeStyle = 'white';
    // '#ff0000'
    var pt = canvas.getBoundingClientRect()
    // console.log(pt.left,pt.top);
    ctx.lineTo(e.clientX - pt.left, e.clientY - pt.top);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX - pt.left, e.clientY - pt.top);
  }

  //Event Listner

  canvas.addEventListener("mousedown", startPosition);
  canvas.addEventListener("mouseup", finishPosition);
  canvas.addEventListener("mousemove", draw);
  window.addEventListener("resize", resizecan);
})