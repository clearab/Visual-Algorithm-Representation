var root = null;
var SVGWidth = 40;
var SVGVert = 300;
var circRad = 20;
var svgNS = "http://www.w3.org/2000/svg";
var xlinkNS = "http://www.w3.org/1999/xlink";
var COLOR_FILL= "cyan";
var COLOR_DARK= "black";
var COLOR_BRIGHT="red";
var height = 0;
var speed = 1000;
var treeArray = new Array();
var animationArray = new Array();
var animationPlace = 0;
var isPaused = false;
var isRunning;
var redrawAll = false;
//this captures the window width as x and height as y
//courtesy of: http://andylangton.co.uk/articles/javascript/get-viewport-size-javascript/
//currently this isn't used, but should be implemented to accomadate different screen resolutions
var w=window,d=document,e=d.documentElement,g=d.getElementsByTagName('body')[0],x=w.innerWidth||e.clientWidth||g.clientWidth,y=w.innerHeight||e.clientHeight||g.clientHeight;

window.onload = function (){
  reset();
}
function showValue(newValue, id) {
  document.getElementById(id).innerHTML=newValue;
  if(id == 'speedRange') {
    speed = 2000 - (20 * newValue);
  }
}
//This method should call a draw method without
//any animations
function randomTree() {
  reset();
  var currSpeed = speed;
  COLOR_BRIGHT = "cyan";
  //speed up so you can't see the animations
  speed = 1;
  var size = document.getElementById('treeSizeRange').innerHTML
  var i = 0;
  while (i < size) {
    var newVal = Math.floor(Math.random()*101)
    if (!treeArray.include(newVal)&& newVal != 0) {
      insertNode(newVal);
      i++;
    }
  }
  COLOR_BRIGHT = "red";
  animationArray.push(new AnimationObject("pause"));
  animationArray.push(new AnimationObject("reset"));
  speed = currSpeed;
}
function insertSingleNode() {
  var value = document.getElementById('insertValue').value;
  value=parseFloat(value);
  if(value >=0 && value <=100 && value!="") {
    insertNode(value);
  }
  else
    alert("Please enter a number between 0 and 100");
}
function recalc(cNode,pNode,side) {
  if(cNode==root){
    if(SVGWidth <= 1000)
      cNode.x=.5*1000;
    else
      cNode.x=.5*SVGWidth;
  }
  else {
    if(side=="left") {
      cNode.x=pNode.x-(1/Math.pow(2,cNode.level+1))*SVGWidth;
    }
    if(side=="right") {
      cNode.x=pNode.x+(1/Math.pow(2,cNode.level+1))*SVGWidth;
    }
  }
  if(cNode.left!=null) {
    recalc(cNode.left,cNode,"left");
  }
  if(cNode.right!=null){
    recalc(cNode.right,cNode,"right");
  }
}
function insertNode(value){
  animationArray.push(new AnimationObject("reset"));
  var nNode = new TreeNode(value);
  var currHeight=height;
  insert(nNode,root);
  if(currHeight!=height){
    redrawAll = true;
    var currWidth=Math.pow(2,height+1)*circRad;
    if(currWidth>SVGWidth)
      SVGWidth=currWidth;
    if(SVGWidth>1000){
      var a = document.getElementById('svgArea');
      SVGVert += 300;
      a.setAttribute("viewBox","0 0 " + SVGWidth + " " + SVGVert);
    }
    recalc(root);
  }
  animationManager();
}
function TreeNode(value){
  this.id=0;
  this.value=value;
  this.level=0;
  this.x=0;
  this.y=0;
  this.left=null;
  this.right=null;
}
function insert(nNode,cNode,pNode,side) {
  //if cNode is null, this is where the nNode goes
  if(cNode==null) {
    if(side=="left"){
      nNode.y=pNode.y+2*circRad+10;
      nNode.x=pNode.x-(1/Math.pow(2,nNode.level+1))*SVGWidth;
      pNode.left=nNode;
      treeArray.push(nNode.value);
      animationArray.push(new AnimationObject("draw",nNode,pNode,side));
      animationArray.push(new AnimationObject("summary","Location found, adding node"));
    }
    else if (side=="right") {
      nNode.y=pNode.y+2*circRad+10;
      nNode.x=pNode.x+(1/Math.pow(2,nNode.level+1))*SVGWidth;
      pNode.right=nNode;
      treeArray.push(nNode.value);
      animationArray.push(new AnimationObject("draw",nNode,pNode,side));
      animationArray.push(new AnimationObject("summary","Location found, adding node"));
    }
    //root node
    else {
      nNode.x=.5*1000;
      nNode.y=circRad+10;
      root=nNode;
      treeArray.push(nNode.value);
      animationArray.push(new AnimationObject("draw",nNode));
      animationArray.push(new AnimationObject("summary","Assigning root."));
    }
    animationArray.push(new AnimationObject("psuedo","l1",COLOR_BRIGHT));
    animationArray.push(new AnimationObject("psuedo","l2",COLOR_BRIGHT));
    animationArray.push(new AnimationObject("pause"));
    animationArray.push(new AnimationObject("psuedo","l1",COLOR_DARK));
    animationArray.push(new AnimationObject("psuedo","l2",COLOR_DARK));
  }
  else {
    animationArray.push(new AnimationObject("highlight",cNode.value,COLOR_BRIGHT));
    //recurse left
    if(nNode.value<cNode.value){
      //update summary and psuedo here
      animationArray.push(new AnimationObject("psuedo","l3",COLOR_BRIGHT));
      animationArray.push(new AnimationObject("psuedo","l4",COLOR_BRIGHT));
      animationArray.push(new AnimationObject("summary",nNode.value+" < "+ cNode.value + " so recurse on left child."));
      animationArray.push(new AnimationObject("pause"));
      animationArray.push(new AnimationObject("psuedo","l3",COLOR_DARK));
      animationArray.push(new AnimationObject("psuedo","l4",COLOR_DARK));
      animationArray.push(new AnimationObject("highlight",cNode.value,COLOR_FILL));
      nNode.level++;
      if(nNode.level>height){
        height=nNode.level;
      }
      insert(nNode,cNode.left,cNode,"left");
    }
    //recurse right
    else if(nNode.value>cNode.value) {
      //update summary and psuedo here
      animationArray.push(new AnimationObject("psuedo","l5",COLOR_BRIGHT));
      animationArray.push(new AnimationObject("psuedo","l6",COLOR_BRIGHT));
      animationArray.push(new AnimationObject("summary",nNode.value+" > "+ cNode.value + " so recurse on right child."));
      animationArray.push(new AnimationObject("pause"));
      animationArray.push(new AnimationObject("psuedo","l5",COLOR_DARK));
      animationArray.push(new AnimationObject("psuedo","l6",COLOR_DARK));
      animationArray.push(new AnimationObject("highlight",cNode.value,COLOR_FILL));
      nNode.level++;
      if(nNode.level>height){
        height=nNode.level;
      }
      insert(nNode,cNode.right,cNode,"right");
    }
    else {
      //update summary and psuedo
      animationArray.push(new AnimationObject("psuedo","l7",COLOR_BRIGHT));
      animationArray.push(new AnimationObject("psuedo","l8",COLOR_BRIGHT));
      animationArray.push(new AnimationObject("summary","Value is already in tree!"));
      animationArray.push(new AnimationObject("pause"));
      animationArray.push(new AnimationObject("psuedo","l7",COLOR_DARK));
      animationArray.push(new AnimationObject("psuedo","l8",COLOR_DARK));
      animationArray.push(new AnimationObject("highlight",cNode.value,COLOR_FILL));
    }
  }
  
}
function drawAll() {
  clear();
  var i = 0;
  var j = 0;
  function drawLines(currNode,i) {
    if(currNode.left!=null){
      drawLine("left"+currNode.value,currNode.x,currNode.y,currNode.left.x,currNode.left.y);
      i++;
      drawLines(currNode.left,i);
    }
    if(currNode.right!=null) {
      drawLine("right"+currNode.value,currNode.x,currNode.y,currNode.right.x,currNode.right.y);
      i++;
      drawLines(currNode.right,i);
    }
  }
  function drawCircles(currNode,j) {
    if(currNode.value!=null) {
      drawCircle(currNode.value,currNode.x,currNode.y,circRad,currNode.value,COLOR_FILL,COLOR_DARK);
      j++;
      if(currNode.left!=null){
        drawCircles(currNode.left,j);
      }
      if(currNode.right!=null) {
        drawCircles(currNode.right,j);
      }
    }
    
  }
  drawLines(root,i);
  drawCircles(root,j);
}
function drawOne(nNode,pNode,side){
  //remove pNode
  if(redrawAll) {
    recalc(root);
    redrawAll=false;
    drawAll();
    return;
  }
  if(pNode!=null){
    
    var anc = document.getElementById(pNode.value)
    anc.parentNode.removeChild(anc);
    drawLine(side+""+pNode.value,pNode.x,pNode.y,nNode.x,nNode.y);
    //draw pNode
    drawCircle(pNode.value,pNode.x,pNode.y,circRad,pNode.value,COLOR_FILL,COLOR_DARK);
  }
  //draw nNode
  drawCircle(nNode.value,nNode.x,nNode.y,circRad,nNode.value,COLOR_FILL,COLOR_DARK);
}
/**
* type: draw (name, nNode, pNode, side)
* type: psuedo (name, id, color)
* type: summary (name, text)
* type: resetSummary(name)
* type: highlight(name, id, color)
 */
function AnimationObject(name) {
  this.name=name;
  if(name=="draw"){
    this.nNode=arguments[1];
    if(arguments.length>1){
      this.pNode=arguments[2];
      this.side=arguments[3];
    }
    else {
      this.pNode=null;
      this.side=null;
    }
  }
  else if(name=="psuedo"){
    this.id=arguments[1];
    this.color=arguments[2];
  }
  else if(name=="summary"){
    this.text=arguments[1];
  }
  else if(name=="highlight"){
    this.id=arguments[1];
    this.color=arguments[2];
  }
  
}
function animationManager() {
  if (animationPlace<animationArray.length) {
    var nextObject = animationArray[animationPlace];
    if (nextObject.name=="draw"){
      drawOne(nextObject.nNode,nextObject.pNode,nextObject.side);
    }
    if (nextObject.name == "pause") {
      animationPlace++;
      isRunning = setTimeout("animationManager()",speed);
      return;
    }
    if (nextObject.name == "reset") {
      var w = document.getElementById("summaryOL");
            
      while (w.childNodes.length >= 1) {
        w.removeChild(w.lastChild);
      }
    }
    if (nextObject.name == "psuedo") {
      var a = document.getElementById(nextObject.id);
      a.style.color=nextObject.color;
    }
    if (nextObject.name == "summary") {
      var x=document.getElementById("summaryOL");
      newLI = document.createElement("li");
      newText = document.createTextNode(nextObject.text);
      newLI.appendChild(newText);
      x.appendChild(newLI);
    }
    if(nextObject.name == "resetSummary") {
      var ww = document.getElementById("summaryOL");
            
      while (ww.childNodes.length >= 1) {
        ww.removeChild(ww.lastChild);
      }
    }
    if(nextObject.name == "highlight"){
      var zz = document.getElementById(nextObject.id);
      zz.setAttribute("fill",nextObject.color);
    }
      
    animationPlace++;
    animationManager();
  } 
}
function pause() {
  if (!isPaused) {
    isPaused = true;
    clearTimeout(isRunning);
  }
}
function drawCircle(id,x,y,radius,value,fillColor,strokeColor) {
  var newCircle = document.createElementNS(svgNS,"circle");
  newCircle.setAttribute("cx",x);
  newCircle.setAttribute("cy",y);
  newCircle.setAttribute("id",id);
  newCircle.setAttribute("r",radius);
  newCircle.setAttribute("fill",fillColor);
  newCircle.setAttribute("stroke",strokeColor);
  document.getElementById("simulationArea").appendChild(newCircle);
  var newText = document.createElementNS(svgNS,"text");
  newText.setAttribute("id","value"+id);
  newText.setAttribute("x",x);
  newText.setAttribute("y",y+3);
  newText.setAttribute("font-size","11px");
  newText.setAttribute("text-anchor","middle");
  newText.setAttribute("fill",COLOR_DARK);
  var textNode = document.createTextNode(value);
  newText.appendChild(textNode);
  document.getElementById("simulationArea").appendChild(newText);	
}
function drawLine(id,fromX,fromY,toX,toY) {
  var newLine = document.createElementNS(svgNS,"line");
  newLine.setAttribute("x1",fromX);
  newLine.setAttribute("y1",fromY);
  newLine.setAttribute("x2",toX);
  newLine.setAttribute("y2",toY);
  newLine.setAttribute("id",id);
  newLine.setAttribute("stroke-width",2);
  newLine.setAttribute("stroke",COLOR_DARK);
  document.getElementById("simulationArea").appendChild(newLine);
}
function clear() {
  var a = document.getElementById("simulationArea");
  while (a.childNodes.length >= 1) {
    a.removeChild(a.lastChild);
  }
}
function reset() {
  root = null;
  speed = 1000;
  treeArray.splice(0);
  animationArray.splice(0);
  animationPlace=0;
  SVGVert=300;
  height = 0;
  SVGWidth = 40;
  var a = document.getElementById('svgArea');
  a.setAttribute("viewBox","0 0 1000 300");
}
Array.prototype.index = function(val) {
  for(var i = 0, l = this.length; i < l; i++) {
    if(this[i] == val) return i;
  }
  return null;
}

Array.prototype.include = function(val) {
  return this.index(val) !== null;
}