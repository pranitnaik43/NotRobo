var categories = ["bike", "red flowers", "sunset", "laptop", "horses", "food"];
var numOfTiles = 16;
var isSelected = new Array(numOfTiles).fill(0);  //len=9 all zeroes; 1=>selected; 0=>not_selected
var rightAns = new Array(numOfTiles).fill(0);

function getRandom(upperBound)  //return random number [0, upperBound)
{
  return Math.floor(Math.random() * upperBound);
}

function createMyElement(tag, value="", classes="", id="") {
  var element = document.createElement(tag);
  if(value!="")
    element.innerHTML = value;
  if(classes!="")
    element.setAttribute('class', classes);
  if(id!="")
    element.setAttribute('id', id);
  return element;
}

function imageClicked(e) {
  var imgId = e.target.id;
  var digitIndices = imgId.match(/\d/g);   //get the digit from image id using regex
  var imgInd = digitIndices.join("");
  // console.log(imgId, imgInd);
  var img = document.querySelector('#img_'+imgInd);
  if(imgInd!==null) {
    isSelected[imgInd] ^= 1; //invert the bit
    if(isSelected[imgInd]){
      img.style.filter = 'opacity(20%)';
    }
    else {
      img.style.filter = 'opacity(100%)';
    }
  }
}

function shuffleArray(arr) {
  return arr.map((val, index) => ({randId: Math.random(), value: val, originalIndex: index}))
    .sort((obj1, obj2) => obj1.randId - obj2.randId )
    .map((obj, ind) => {
      if(obj.originalIndex<numOfTiles/2) {
        rightAns[ind] = 1;
      }
      return obj.value;
    });
// Shuffle logic:
// We put each element in the array in an object, and give it a random sort key
// We sort using the random key
// We unmap to get the original objects
}

function submit() {
  var success = true;
  for(var i=0; i<numOfTiles; i++){
    if(rightAns[i]!==isSelected[i]) {
      success = false;
      break;
    }
  }
  // console.log(isSelected, success);
  var cardBody = document.querySelector('.card-body');
  while (cardBody.hasChildNodes()) {  
    cardBody.removeChild(cardBody.firstChild);
  }
  if(success) {
    var greenTick = createMyElement('i', '', 'fa fa-check-circle-o fa-5x greenTick m-auto');
    greenTick.setAttribute('aria-hidden', 'true');
    cardBody.append(greenTick);
  }
  else {
    var wrongCross = createMyElement('i', '', 'fa fa-times fa-5x wrongCross m-auto');
    wrongCross.setAttribute('aria-hidden', 'true');
    cardBody.append(wrongCross);
  }
  var submitBtn = document.querySelector('.submitBtn');
  submitBtn.disabled = true;
}

var randomCatgeryIndex = getRandom(categories.length);
var category1 = categories[randomCatgeryIndex];
var category2 = categories[categories.length - randomCatgeryIndex - 1];
let arr = [];

url1 = "https://pixabay.com/api/?key=22259967-a2dbebc140ed7dc2596fc90d1&q=" + category1.replace(" ", "+") + "&image_type=photo&pretty=true&per_page=16";
url2 = "https://pixabay.com/api/?key=22259967-a2dbebc140ed7dc2596fc90d1&q=" + category2.replace(" ", "+") + "&image_type=photo&pretty=true&per_page=16";
fetch(url1)
  .then(response => { return response.json(); })
  .then(result => {
    // console.log("category1", result);
    var hits = result.hits;
    var i = 0;
    while(i<numOfTiles/2 && i<hits.length) {
      var a = hits[i].previewURL;
      if(a!=null)
        arr.push(a);    
      i++; 
    }
    fetch(url2)
      .then(response => { return response.json(); })
      .then(result => {
        // console.log("category2", result);
        var hits = result.hits;
        var i = 0;
        while(i<numOfTiles/2 && i<hits.length) {
          var a = hits[i].previewURL;
          if(a!=null)
            arr.push(a);    
          i++; 
        }
        // console.log("Merged Array", arr);
        arr = shuffleArray(arr);
        // console.log("Shuffled Array", arr);
        var cardBody = document.querySelector('.card-body');
        var i = 0;
        var img;
        while(i<numOfTiles) {
          img = createMyElement('img', '', 'w-25 h-25', 'img_'+i);
          img.src = arr[i];
          img.addEventListener('click', (e) => { imageClicked(e) });
          cardBody.append(img);
          i++;
        }
        var cardHeader = document.querySelector('.card-header');
        cardHeader.innerText = "Select " + numOfTiles/2 + " images containing " + category1;
        // console.log(rightAns);
      })
      .catch(err => { console.log(err); }); 
  })
  .catch(err => { console.log(err); });


// var a = ["https://cdn.pixabay.com/photo/2020/05/09/17/54/train-5150747_150.jpg", "https://cdn.pixabay.com/photo/2016/11/10/03/49/wheels-1813465_150.jpg", "https://cdn.pixabay.com/photo/2018/03/12/14/02/road-3219715_150.jpg", "https://cdn.pixabay.com/photo/2016/11/19/12/05/beverage-1838926_150.jpg", "https://cdn.pixabay.com/photo/2018/03/27/18/46/car-3266965_150.jpg", "https://cdn.pixabay.com/photo/2017/08/16/10/30/schie-stra-bus-2647194_150.jpg", "https://cdn.pixabay.com/photo/2019/09/20/07/16/auto-4491034_150.jpg", "https://cdn.pixabay.com/photo/2017/06/18/22/06/colourful-2417413_150.jpg", "https://cdn.pixabay.com/photo/2018/04/07/15/50/flight-3298781_150.jpg"];

// var cardBody = document.querySelector('.card-body');
// var i = 0;
// var img;
// while(i<numOfTiles) {
//   img = createMyElement('img', '', 'w-25 h-25', 'img_'+i);
//   img.src = a[i];
//   img.addEventListener('click', (e) => { imageClicked(e) });
//   cardBody.append(img);
//   i++;
// }