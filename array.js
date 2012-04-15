var svgNS = "http://www.w3.org/2000/svg";
var xlinkNS = "http://www.w3.org/1999/xlink";
var rectArray = new Array();
var animationArray = new Array();
var animationPlace = 0;
var speed = 1000;
var isPaused = false;
var isRunning;
var COLOR_DARK = "black";
var COLOR_DIM = "silver"
var COLOR_TEXT_HIGHLIGHT = "orangered";
var COLOR_BAR_HIGHLIGHT1 = "red";
var COLOR_BAR_HIGHLIGHT2 = "cyan";
var ARRAY_SIZE = 15;
 
window.onload = function init(){
  createArray();
  draw();
}
function showValue(newValue, id) {
  document.getElementById(id).innerHTML=newValue;
  if(id == 'speedRange') {
    speed = 2000 - (20 * newValue);
  }
}
function randomize() {
  clear();
  ARRAY_SIZE = document.getElementById('arraySizeRange').innerHTML;
  createArray();
  draw();
  animationPlace = 0;
  animationArray = new Array();
}
function createArray() {
  if(rectArray.length != 0) {
    rectArray.splice(0,rectArray.length -1);
  }
  for(i=0;i<ARRAY_SIZE;i++){
    var a = Math.floor(Math.random()*101)
    if (a > 5) {
      rectArray[i] = a;
    }
    else {
      rectArray[i] = a + 5;
    }
  }
}
function draw() {
  var xConstant = rectArray.length-15;
  var initialX = 250 - (Math.floor(16.6 * xConstant));
  for(i=0;i<rectArray.length;i++) {
    createText(i,rectArray[i], initialX);
    createRect(i,rectArray[i], initialX);
  }
}
function arraySwap(a,b) {
  var temp = rectArray[a];
  rectArray[a]=rectArray[b];
  rectArray[b]=temp;
}
function swap(a,b) {
  var aRect = document.getElementById("rect_" + a);
  var bRect = document.getElementById("rect_" + b);
  
  var aX = aRect.getAttribute("x");
  var bX = bRect.getAttribute("x");
  
  var aText = document.getElementById("text_" + a);
  var bText = document.getElementById("text_" + b);
  var aTextX = aText.getAttribute("x");
  var bTextX = bText.getAttribute("x");
  
  aRect.setAttribute("x",bX);
  bRect.setAttribute("x",aX);
  
  aText.setAttribute("x",bTextX);
  bText.setAttribute("x",aTextX);
  
  aRect.setAttribute("id","rect_" + b);
  aText.setAttribute("id","text_" + b);
  bRect.setAttribute("id","rect_" + a);
  bText.setAttribute("id","text_" + a);
}
function clear() {
  var a = document.getElementById("simulationArea");
  for(i=0;i<2*rectArray.length;i++) {
    var t = a.lastChild;
    t.parentNode.removeChild(t);
  }
  var w = document.getElementById("summaryOL");
  while (w.childNodes.length >= 1) {
    w.removeChild(w.lastChild);
  }
}
function createRect(id,height, initialX) {
  var newRect = document.createElementNS(svgNS,"rect");
  var newId = "rect_" + id;
  var xCoord = initialX + id*30;
  newRect.setAttribute("id",newId);
  newRect.setAttribute("width",25);
  newRect.setAttribute("height",height);
  newRect.setAttribute("x",xCoord);
  newRect.setAttribute("y",50);
  newRect.setAttribute("fill",COLOR_DARK);
  document.getElementById("simulationArea").appendChild(newRect);
}
function createText(id,value, initialX) {
  var a = initialX + id*30+14;
  var newText = document.createElementNS(svgNS,"text");
  var newId = "text_" + id;
  newText.setAttribute("id",newId);
  newText.setAttribute("x",a);
  newText.setAttribute("y",42);
  newText.setAttribute("font-size","11px");
  newText.setAttribute("text-anchor","middle");
  newText.setAttribute("fill",COLOR_DARK);
  var textNode = document.createTextNode(value);
  newText.appendChild(textNode);
  document.getElementById("simulationArea").appendChild(newText);
}
function changeColor(id,clr) {
  var a = document.getElementById(id);
  a.setAttribute("fill",clr);
}
function animationManager() {
  if (animationPlace<animationArray.length) {
    var nextObject = animationArray[animationPlace];
    if (nextObject.name == "swap") {
      swap(nextObject.id1,nextObject.id2);
    }
    if (nextObject.name == "highlight1") {
      changeColor(nextObject.id1,nextObject.color);
    }
    if (nextObject.name == "highlight2") {
      changeColor(nextObject.id1,nextObject.color);
      changeColor(nextObject.id2,nextObject.color);
    }
    if (nextObject.name == "pause") {
      animationPlace++;
      isRunning = setTimeout("animationManager()",speed);
      return;
    }
    if (nextObject.name == "reset") {
      for(var j = 0;j < rectArray.length;j++) {
        changeColor("rect_" + j,COLOR_DARK);
      }
      var w = document.getElementById("summaryOL");
            
      while (w.childNodes.length >= 1) {
        w.removeChild(w.lastChild);
      }
    }
    if (nextObject.name == "psuedo") {
      var a = document.getElementById(nextObject.id1);
      a.style.color=nextObject.color;
    }
    if (nextObject.name == "summary") {
      var x=document.getElementById("summaryOL");
      newLI = document.createElement("li");
      newText = document.createTextNode(nextObject.txt);
      newLI.appendChild(newText);
      x.appendChild(newLI);
    }
    if (nextObject.name == "dim") {
      for(var k = 0; k < nextObject.frIndex; k++) {
        changeColor("rect_" + k, COLOR_DIM);
      }
      if (nextObject.toIndex != rectArray.length-1) {
        for(var l = nextObject.toIndex + 1; l < rectArray.length;l++) {
          changeColor("rect_" + l, COLOR_DIM);
        }
      }
    }
    if(nextObject.name == "resetSummary") {
      var ww = document.getElementById("summaryOL");
            
      while (ww.childNodes.length >= 1) {
        ww.removeChild(ww.lastChild);
      }
    }
      
    animationPlace++;
    animationManager();
  } 
}
function AnimationObject() {
  this.name = arguments[0];
  if (arguments[0] == "swap") {
    this.id1 = arguments[1];
    this.id2 = arguments[2];
  }
  if (arguments[0] == "highlight1" || arguments[0] == "psuedo") {
    this.id1 = arguments[1];
    this.color = arguments[2];
  }
  if (arguments[0] == "highlight2") {
    this.id1 = arguments[1];
    this.id2 = arguments[2];
    this.color = arguments[3];
  }
  if (arguments[0] == "summary") {
    this.txt = arguments[1];
  }
  if (arguments[0] == "dim") {
    this.frIndex = arguments[1];
    this.toIndex = arguments[2];
  }
}
function quicksort(array, left, right) {
  animationArray.push(new AnimationObject("psuedo","l10",COLOR_TEXT_HIGHLIGHT));
  animationArray.push(new AnimationObject("psuedo","l11",COLOR_TEXT_HIGHLIGHT));
  if (left < right) {
    animationArray.push(new AnimationObject("psuedo","l12",COLOR_TEXT_HIGHLIGHT));
    var pivotIndex = Math.ceil((left + right)/2);
    animationArray.push(new AnimationObject("psuedo","l13",COLOR_TEXT_HIGHLIGHT));
    var pivotNewIndex = partition(array, left, right, pivotIndex);
    animationArray.push(new AnimationObject("psuedo","l13",COLOR_DARK));
    animationArray.push(new AnimationObject("psuedo","l14",COLOR_TEXT_HIGHLIGHT));
    quicksort(array, left, pivotNewIndex - 1);
    animationArray.push(new AnimationObject("psuedo","l14",COLOR_DARK));
    animationArray.push(new AnimationObject("psuedo","l15",COLOR_TEXT_HIGHLIGHT));
    quicksort(array, pivotNewIndex + 1, right);
    animationArray.push(new AnimationObject("psuedo","l15",COLOR_DARK));
  }
  animationArray.push(new AnimationObject("psuedo","l10",COLOR_DARK));
  animationArray.push(new AnimationObject("psuedo","l11",COLOR_DARK));
  animationArray.push(new AnimationObject("psuedo","l12",COLOR_DARK));
}
function partition(array, left, right, pivotIndex) {
  var pause = new AnimationObject("pause");
  var reset = new AnimationObject("reset");
    
  animationArray.push(new AnimationObject("dim",left,right));
  animationArray.push(new AnimationObject("highlight2","rect_" + left,"rect_" + right,COLOR_BAR_HIGHLIGHT1));
  animationArray.push(new AnimationObject("summary","Partition from index " + left + " to index " + right));
  animationArray.push(new AnimationObject("psuedo","l0",COLOR_TEXT_HIGHLIGHT));
  animationArray.push(pause);
  
  var pivotValue = array[pivotIndex];
  animationArray.push(new AnimationObject("highlight1","rect_" + pivotIndex,COLOR_BAR_HIGHLIGHT2));
  animationArray.push(new AnimationObject("summary","Pivot value is now: " + pivotValue));
  animationArray.push(new AnimationObject("psuedo","l1",COLOR_TEXT_HIGHLIGHT));
  animationArray.push(pause);
  animationArray.push(new AnimationObject("psuedo","l1",COLOR_DARK));
  
  arraySwap(pivotIndex,right);
  animationArray.push(new AnimationObject("highlight1","rect_" + right,COLOR_DARK));
  animationArray.push(new AnimationObject("swap",pivotIndex,right));
  animationArray.push(new AnimationObject("highlight1","rect_" + right,COLOR_BAR_HIGHLIGHT1));
  animationArray.push(new AnimationObject("psuedo","l2",COLOR_TEXT_HIGHLIGHT));
  animationArray.push(pause);
  animationArray.push(new AnimationObject("psuedo","l2",COLOR_DARK));
  
  var storeIndex = left;
  animationArray.push(new AnimationObject("highlight1","text_" + storeIndex,COLOR_BAR_HIGHLIGHT1));
  animationArray.push(new AnimationObject("highlight1","rect_" + right,COLOR_BAR_HIGHLIGHT2));
  animationArray.push(new AnimationObject("psuedo","l4",COLOR_TEXT_HIGHLIGHT));
  animationArray.push(new AnimationObject("psuedo","l5",COLOR_TEXT_HIGHLIGHT));
  for (var i = left;i<right;i++) {
    animationArray.push(new AnimationObject("highlight1","rect_" + i,COLOR_BAR_HIGHLIGHT2));
    animationArray.push(pause);
    
    if (array[i] < pivotValue) {
      animationArray.push(new AnimationObject("summary",array[i] + " < pivot, so swap with store index"));
      animationArray.push(new AnimationObject("highlight1","text_" + storeIndex,COLOR_DARK));
      arraySwap(i,storeIndex);
      animationArray.push(new AnimationObject("swap",i,storeIndex));
      animationArray.push(new AnimationObject("psuedo","l6",COLOR_TEXT_HIGHLIGHT));
      animationArray.push(pause);
      animationArray.push(new AnimationObject("psuedo","l6",COLOR_DARK));
      animationArray.push(new AnimationObject("highlight1","rect_" + storeIndex,COLOR_DARK));
            
      storeIndex = storeIndex + 1;
      animationArray.push(new AnimationObject("highlight1","text_" + storeIndex,COLOR_BAR_HIGHLIGHT1));
    }
    else {
      animationArray.push(new AnimationObject("highlight1","rect_" + i,COLOR_DARK));
      animationArray.push(new AnimationObject("summary",array[i] + " >= pivot, do nothing"));
      animationArray.push(pause);
    }
  }
  animationArray.push(new AnimationObject("psuedo","l4",COLOR_DARK));
  animationArray.push(new AnimationObject("psuedo","l5",COLOR_DARK));
  animationArray.push(new AnimationObject("highlight1","text_" + storeIndex,COLOR_DARK));
  arraySwap(storeIndex,right);
  animationArray.push(new AnimationObject("psuedo","l8",COLOR_TEXT_HIGHLIGHT));
  animationArray.push(new AnimationObject("summary","Swap the pivot into its final place (at store index)"));
  animationArray.push(new AnimationObject("swap",storeIndex,right));
  animationArray.push(pause);
  animationArray.push(reset);
  animationArray.push(new AnimationObject("psuedo","l0",COLOR_DARK));
  animationArray.push(new AnimationObject("psuedo","l8",COLOR_DARK));
  return storeIndex;
}
function runQuicksort() {
  if (!isPaused) {
    quicksort(rectArray,0,rectArray.length-1);
    animationManager();
  }
  else {
    isPaused = false;
    animationManager();
  }
}
function selectionSort(inArray) {
  var pause = new AnimationObject("pause");
  var reset = new AnimationObject("reset");
  animationArray.push(new AnimationObject("psuedo","l0",COLOR_TEXT_HIGHLIGHT));
  animationArray.push(new AnimationObject("psuedo","l1",COLOR_TEXT_HIGHLIGHT));
  for(var i = 0; i < inArray.length-1;i++) {
    animationArray.push(new AnimationObject("psuedo","l2",COLOR_TEXT_HIGHLIGHT));
    var min = i;
    animationArray.push(new AnimationObject("summary","minIndex is now: " + min));
    animationArray.push(new AnimationObject("highlight1","rect_"+min,COLOR_BAR_HIGHLIGHT1));
    animationArray.push(new AnimationObject("highlight1","text_"+i,COLOR_TEXT_HIGHLIGHT));
    animationArray.push(pause);
    animationArray.push(new AnimationObject("psuedo","l2",COLOR_DARK));
    animationArray.push(new AnimationObject("psuedo","l3",COLOR_TEXT_HIGHLIGHT));
    for(var j = i + 1; j < inArray.length;j++) {
      animationArray.push(new AnimationObject("highlight1","rect_"+j,COLOR_BAR_HIGHLIGHT2));
      animationArray.push(new AnimationObject("psuedo","l4",COLOR_TEXT_HIGHLIGHT));
      animationArray.push(pause);
      if(inArray[j] < inArray[min]) {
        animationArray.push(new AnimationObject("psuedo","l5",COLOR_TEXT_HIGHLIGHT));
        animationArray.push(new AnimationObject("highlight1","rect_"+min,COLOR_DARK));
        animationArray.push(new AnimationObject("summary",inArray[j]+" < " + inArray[min]+": so minIndex is now: " + j));
        min = j;
        animationArray.push(new AnimationObject("highlight1","rect_"+j,COLOR_BAR_HIGHLIGHT1));
        animationArray.push(pause);
        animationArray.push(new AnimationObject("psuedo","l5",COLOR_DARK));
                
      }
      else {
        animationArray.push(new AnimationObject("summary",inArray[j] +">="+inArray[min]+": so do nothing"))
        animationArray.push(new AnimationObject("highlight1","rect_"+j,COLOR_DARK));
      }
    }
    animationArray.push(new AnimationObject("psuedo","l3",COLOR_DARK));
    animationArray.push(new AnimationObject("psuedo","l4",COLOR_DARK));
    arraySwap(min,i);
    animationArray.push(new AnimationObject("psuedo","l6",COLOR_TEXT_HIGHLIGHT));
    animationArray.push(new AnimationObject("highlight1","text_"+i,COLOR_DARK));
    animationArray.push(new AnimationObject("summary","swap(array["+min+"],array["+i+"]"));
    animationArray.push(new AnimationObject("swap",min,i));
    animationArray.push(pause);
    animationArray.push(new AnimationObject("psuedo","l6",COLOR_DARK));
    animationArray.push(new AnimationObject("highlight1","rect_"+i,COLOR_DIM));
    animationArray.push(pause);
    animationArray.push(new AnimationObject("resetSummary"));
  }
  animationArray.push(new AnimationObject("psuedo","l0",COLOR_DARK));
  animationArray.push(new AnimationObject("psuedo","l1",COLOR_DARK));
  animationArray.push(pause);
  animationArray.push(reset);
}
function runSelectionSort() {
  if (!isPaused) {
    selectionSort(rectArray);
    animationManager();
  }
  else {
    isPaused = false;
    animationManager();
  }
}
function pause() {
  if (!isPaused) {
    isPaused = true;
    clearTimeout(isRunning);
  }
}