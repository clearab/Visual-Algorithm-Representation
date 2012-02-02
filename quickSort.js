var svgNS = "http://www.w3.org/2000/svg";
var xlinkNS = "http://www.w3.org/1999/xlink";
var rectArray = new Array();
var animationArray = new Array();
var animationPlace = 0;
var speed = 1000;
var isPaused = false;
var isRunning;
 
window.onload = function init(){
    createArray();
    draw();
}
function showValue(newValue) {
    document.getElementById("range").innerHTML=newValue;
    speed = 2000 - (20 * newValue);
}
function randomize() {
    createArray();
    clear();
    draw();
    animationPlace = 0;
    animationArray = new Array();
}
function createArray() {
    for(i=0;i<15;i++){
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
    for(i=0;i<rectArray.length;i++) {
        createText(i,rectArray[i]);
        createRect(i,rectArray[i]);
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
}
function createRect(id,height) {
    var newRect = document.createElementNS(svgNS,"rect");
    var newId = "rect_" + id;
    var xCoord = id*30;
    newRect.setAttribute("id",newId);
    newRect.setAttribute("width",25);
    newRect.setAttribute("height",height);
    newRect.setAttribute("x",xCoord);
    newRect.setAttribute("y",50);
    newRect.setAttribute("fill","black");
    document.getElementById("simulationArea").appendChild(newRect);
}
function createText(id,value) {
    var a = id*30+14;
    var newText = document.createElementNS(svgNS,"text");
    var newId = "text_" + id;
    newText.setAttribute("id",newId);
    newText.setAttribute("x",a);
    newText.setAttribute("y",42);
    newText.setAttribute("font-size","11px");
    newText.setAttribute("text-anchor","middle");
    newText.setAttribute("fill","black");
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
                changeColor("rect_" + j,"black");
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
}
function quicksort(array, left, right) {
    animationArray.push(new AnimationObject("psuedo","l10","orangered"));
    animationArray.push(new AnimationObject("psuedo","l11","orangered"));
    if (left < right) {
        animationArray.push(new AnimationObject("psuedo","l12","orangered"));
        var pivotIndex = Math.ceil((left + right)/2);
        animationArray.push(new AnimationObject("psuedo","l13","orangered"));
        var pivotNewIndex = partition(array, left, right, pivotIndex);
        animationArray.push(new AnimationObject("psuedo","l13","black"));
        animationArray.push(new AnimationObject("psuedo","l14","orangered"));
        quicksort(array, left, pivotNewIndex - 1);
        animationArray.push(new AnimationObject("psuedo","l14","black"));
        animationArray.push(new AnimationObject("psuedo","l15","orangered"));
        quicksort(array, pivotNewIndex + 1, right);
        animationArray.push(new AnimationObject("psuedo","l15","black"));
    }
    animationArray.push(new AnimationObject("psuedo","l10","black"));
    animationArray.push(new AnimationObject("psuedo","l11","black"));
    animationArray.push(new AnimationObject("psuedo","l12","black"));
}
function partition(array, left, right, pivotIndex) {
    var pause = new AnimationObject("pause");
    var reset = new AnimationObject("reset");
  
    animationArray.push(new AnimationObject("highlight2","rect_" + left,"rect_" + right,"red"));
    animationArray.push(new AnimationObject("summary","Partition from " + left + " to " + right));
    animationArray.push(new AnimationObject("psuedo","l0","orangered"));
    animationArray.push(pause);
  
    var pivotValue = array[pivotIndex];
    animationArray.push(new AnimationObject("highlight1","rect_" + pivotIndex,"cyan"));
    animationArray.push(new AnimationObject("summary","Pivot value is now: " + pivotValue));
    animationArray.push(new AnimationObject("psuedo","l1","orangered"));
    animationArray.push(pause);
    animationArray.push(new AnimationObject("psuedo","l1","black"));
  
    arraySwap(pivotIndex,right);
    animationArray.push(new AnimationObject("highlight1","rect_" + right,"black"));
    animationArray.push(new AnimationObject("swap",pivotIndex,right));
    animationArray.push(new AnimationObject("highlight1","rect_" + right,"red"));
    animationArray.push(new AnimationObject("psuedo","l2","orangered"));
    animationArray.push(pause);
    animationArray.push(new AnimationObject("psuedo","l2","black"));
  
    var storeIndex = left;
    animationArray.push(new AnimationObject("highlight1","text_" + storeIndex,"red"));
    animationArray.push(new AnimationObject("highlight1","rect_" + right,"cyan"));
    animationArray.push(new AnimationObject("psuedo","l4","orangered"));
    animationArray.push(new AnimationObject("psuedo","l5","orangered"));
    for (var i = left;i<right;i++) {
        animationArray.push(new AnimationObject("highlight1","rect_" + i,"cyan"));
        animationArray.push(pause);
    
        if (array[i] < pivotValue) {
            animationArray.push(new AnimationObject("summary",array[i] + " < pivot, so swap with store index"));
            animationArray.push(new AnimationObject("highlight1","text_" + storeIndex,"black"));
            arraySwap(i,storeIndex);
            animationArray.push(new AnimationObject("swap",i,storeIndex));
            animationArray.push(new AnimationObject("psuedo","l6","orangered"));
            animationArray.push(pause);
            animationArray.push(new AnimationObject("psuedo","l6","black"));
            animationArray.push(new AnimationObject("highlight1","rect_" + storeIndex,"black"));
            
            storeIndex = storeIndex + 1;
            animationArray.push(new AnimationObject("highlight1","text_" + storeIndex,"red"));
        }
        else {
            animationArray.push(new AnimationObject("highlight1","rect_" + i,"black"));
            animationArray.push(new AnimationObject("summary",array[i] + " >= pivot, do nothing"));
            animationArray.push(pause);
        }
    }
    animationArray.push(new AnimationObject("psuedo","l4","black"));
    animationArray.push(new AnimationObject("psuedo","l5","black"));
    animationArray.push(new AnimationObject("highlight1","text_" + storeIndex,"black"));
    arraySwap(storeIndex,right);
    animationArray.push(new AnimationObject("psuedo","l8","orangered"));
    animationArray.push(new AnimationObject("summary","Swap the pivot into its final place (at store index)"));
    animationArray.push(new AnimationObject("swap",storeIndex,right));
    animationArray.push(pause);
    animationArray.push(reset);
    animationArray.push(new AnimationObject("psuedo","l0","black"));
    animationArray.push(new AnimationObject("psuedo","l8","black"));
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
function pause() {
    if (!isPaused) {
        isPaused = true;
        clearTimeout(isRunning);
    }
}