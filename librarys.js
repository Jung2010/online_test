
const range = (n = 1, start = 0, step = 1) => {
    const typeErr = () => { throw new TypeError("All of Arguments must be Number") };
  
    if (typeof n !== "number" || typeof start !== "number" || typeof step !== "number") typeErr();
    step = Math.round(step);
    if (step < 1) throw new Error("Step (3rd parameter) must be 1 or more.");
  
    let arr = [];
    for (let i = 0; i < n; i++) {
      let val = step * i + start;
      arr.push(val);
    }
    return arr;
  }
  
  const rand = function(min = 0, max = 10) {
    const typeErr = () => { throw new TypeError("All of Arguments must be Number") };
    if (typeof min !== "number" || typeof max !== "number") typeErr();
    return Math.floor(Math.random() * (max - min)) + min;
  }
  
  Function.prototype.repeat = function(n) {
    if (typeof this !== "function") throw new TypeError("First Argument must be Function");
    if (typeof n !== "number") throw new TypeError("Second Argument must be Number");
    for (const i in range(n)) this(i);
  }
  
  Array.prototype.sum = function(){return [...this].reduce((x,y)=>typeof y === "number"?x+y:x,0);}
  Array.prototype.average = (...arr)=>sum(...arr)/arr.length;
  
  const domQ = (query) => document.querySelector(query);
  const domQAll = (query) => document.querySelectorAll(query);
  const domId = (id) => document.getElementById(id);
  const domClass = (cls) => document.getElementsByClassName(cls);
  const domTag = (tag) => document.getElementsByTagName(tag);
  const domName = (name) => document.getElementsByName(name);
  
  HTMLElement.prototype.css = function(type,value) { return type?(value?this.style[type]=value:this.style?.[type]):this.style };
  HTMLElement.prototype.html = function(html) { return html?this.innerHTML=html:this.innerHTML; }
  HTMLElement.prototype.texts = function() { return this.innerText; }
  HTMLElement.prototype.add = function(html) { return html?this.innerHTML+=html:undefined; }
  HTMLElement.prototype.eachAdd = function(arr=[],callback=()=>{}) { return arr.forEach((...args)=>this.innerHTML+=callback(...args)); }
  
  NodeList.prototype.css = function(type,value) {
    if(typeof type==='string'&&typeof value==='string'){ this.forEach(v=>v.style[type]=value) }
  };
  NodeList.prototype.html = function(html=undefined) {
    if(typeof html === 'string'){ this.forEach(v=>v.innerHTML=value) }
    else if(typeof html === 'function'){ this.forEach((v,i,arr)=>v.innerHTML=html(v,i,arr)); }
    else if(typeof html === 'undefined'){ this.reduce((pre,cur)=>[...pre,cur.innerHTML],[]) }
  }
  NodeList.prototype.texts = function() {
    return this.reduce((pre,cur)=>[...pre,cur.innerText],[]);
  }
  
  const testArr = [];
  for (const i in range(1000)) { testArr.push(Math.floor(Math.random() * 100)); }
  
  Object.prototype.json = function(tab=2) { if(typeof tab === 'number') return JSON.stringify(this,null,tab); }
  String.prototype.parse = function() { return JSON.parse(this); }
  
  const getFetch = async(url)=>await fetch(url).then(resp=>resp.json());
  
  const findSames = (...arr)=>arr.reduce((pre,cur)=>{!pre[cur]?pre[cur]=1:++pre[cur];return pre},{});
  const toArr = (x)=>Array.from(x);
  String.prototype.encode = function(){ return encodeURI(this); }
  String.prototype.decode = function(){ return decodeURI(this); }
  Array.prototype.howMany = function(val){return this.reduce((pre,cur)=>cur.json()===val.json()?++pre:pre,0)}
  const Reframer = (function(){
    let reframers = 0;
    let resultForReGet;
    class Reframer {
      constructor(url) {
        this.url = "about:blank" && url;
        this.loaded = false;
      }
      create() {
        if (this.id) return;
        reframers++;
        this.id = `rfr${reframers}`;
        document.body.innerHTML += `
        <iframe
        id='${this.id}'
        src='${this.url}'
        style='display:none;'></iframe>
        `;
        document.querySelector('#' + this.id).addEventListener('load', () => {
          this.loaded = true;
        });
      }
      get() {
        if (!this.id) return;
        const id = this.id;
        const element = document.getElementById(id);
        return element.contentWindow.document.body.innerText;
      }
      refresh(callback = ()=>{}) {
        if( typeof(callback) !== "function" ) callback = ()=>{};
        if (!this.id) return;
        const element = document.getElementById(this.id);
        element.contentDocument.location.reload(true);
        this.loaded = false;
        element.addEventListener('load', () => {
          this.loaded = true;
          callback.call(this);
        });
      }
      reGet() {
        this.loaded = false;
        this.refresh();
        return this.get();
      }
  
      static worker(url,callback=()=>{}) {
        const works = new Reframer(encodeURI(url));
        works.create();
        document.getElementById(works.id).addEventListener("load",()=>{
          callback();
          document.getElementById(works.id).remove();
        });
      }
    }
    return Reframer;
  }())
  /* KPF(key press found) LOAD START */
  {
  
    var keyPressed = new Array();
  
    window.addEventListener("keydown", e => {
      const key = e.keyCode;
      keyPressed[key] = true;
    });
  
  
    window.addEventListener("keyup", e => {
      const key = e.keyCode;
      keyPressed[key] = false;
    });
  
    kpfLoad();
  
    function kpfLoad() {
      var lodingArray = new Array();
      //console.log("kpfLoad Start");
      for (var i = 0; i - 1 < 249; i++) {
        keyPressed[i] = false;
        lodingArray.push("kpfLoding=" + i + ":" + keyPressed[i]);
        if (i == 249) {
          //console.log("Check to kpf function");
          var ok = true;
          for (var j = 0; j - 1 < 249; j++) {
            if (keyPressed[j] == null || keyPressed[j] == true) {
              lodingArray.push("kpfCheck-" + j + ":fail");
              ok = false;
            } else {
              lodingArray.push("kpfCheck-" + j + ":successful");
            }
            if (j == 249) {
              if (ok == false) {
                lodingArray.push("Fail, Reload");
                kpfLoad();
              } else {
                lodingArray.push("Kpf Success");
              }
            }
          }
        }
      }
      //console.log(lodingArray);
    }
  
    function kpf(code) {
      if (keyPressed[code]) {
        return true;
      } else {
        return false;
      }
    }
  }
  /* KPF(key press found) LOAD End */

function isColliding(a, b) {
  const ax = a.x;
  const ay = a.y;
  const aw = a.w;
  const ah = a.h;

  const bx = b.x;
  const by = b.y;
  const bw = b.w;
  const bh = b.h;

  return (
    // a의 좌상단이 b 안에 있는지 확인
    (ax >= bx && ax <= bx + bw && ay >= by && ay <= by + bh) ||
    // a의 우하단이 b 안에 있는지 확인
    (ax + aw >= bx && ax + aw <= bx + bw && ay + ah >= by && ay + ah <= by + bh) ||
    // b의 좌상단이 a 안에 있는지 확인
    (bx >= ax && bx <= ax + aw && by >= ay && by <= ay + ah) ||
    // b의 우하단이 a 안에 있는지 확인
    (bx + bw >= ax && bx + bw <= ax + aw && by + bh >= ay && by + bh <= ay + ah)
  );
}
function getOverlapRatio(a, b, axis) {
  const ax = a.x;
  const ay = a.y;
  const aw = a.w;
  const ah = a.h;

  const bx = b.x;
  const by = b.y;
  const bw = b.w;
  const bh = b.h;

  let overlapLength = 0;
  let overlapRatio = 0;

  if (axis === 'x') {
    overlapLength = Math.min(ax + aw, bx + bw) - Math.max(ax, bx);
    overlapRatio = overlapLength / aw;
  } else if (axis === 'y') {
    overlapLength = Math.min(ay + ah, by + bh) - Math.max(ay, by);
    overlapRatio = overlapLength / ah;
  }

  return overlapRatio;
}
function isCollision(a, b) {
  // 객체 a, b의 충돌 여부를 판단하는 함수입니다.
  // 만약 충돌했다면 충돌 방향도 반환합니다.

  // 객체 a, b의 바운딩 박스를 계산합니다.
  const aBox = {
    x1: a.x,
    y1: a.y,
    x2: a.x + a.w,
    y2: a.y + a.h
  };
  const bBox = {
    x1: b.x,
    y1: b.y,
    x2: b.x + b.w,
    y2: b.y + b.h
  };

  // 충돌 여부를 판단합니다.
  if (
    aBox.x1 <= bBox.x2 &&
    aBox.x2 >= bBox.x1 &&
    aBox.y1 <= bBox.y2 &&
    aBox.y2 >= bBox.y1
  ) {
    // 충돌했다면 충돌 방향을 계산합니다.
    const dx = (aBox.x1 + aBox.x2) / 2 - (bBox.x1 + bBox.x2) / 2;
    const dy = (aBox.y1 + aBox.y2) / 2 - (bBox.y1 + bBox.y2) / 2;

    if (Math.abs(dx) > Math.abs(dy)) {
      // 수평 방향 충돌
      if (dx > 0) {
        return "right"; // 오른쪽에서 충돌
      } else {
        return "left"; // 왼쪽에서 충돌
      }
    } else {
      // 수직 방향 충돌
      if (dy > 0) {
        return "bottom"; // 아래에서 충돌
      } else {
        return "top"; // 위에서 충돌
      }
    }
  } else {
    // 충돌하지 않았습니다.
    return null;
  }
}