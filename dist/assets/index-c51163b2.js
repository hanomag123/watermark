(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const u of o.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&r(u)}).observe(document,{childList:!0,subtree:!0});function i(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(n){if(n.ep)return;n.ep=!0;const o=i(n);fetch(n.href,o)}})();const l=document.getElementById("canvas"),s=l.getContext("2d");let y=null,E=null,a=null,c={src:null,x:0,y:0,width:null,height:null},d=!1,h,p,v=1,k=1;const w=document.getElementById("addWatermark");w&&w.addEventListener("click",function(){const e=this.nextElementSibling;e&&e.click()});const I=document.getElementById("inpWatermark");I&&I.addEventListener("change",function(){const[e]=this.files,t=document.getElementById("watermarkList");if(t){const i=URL.createObjectURL(e);t.insertAdjacentHTML("beforeend",`<li class="watermarks-item"><img src="${i}" alt="img"></li>`);const r=t.children.length-1,n=t.children[r];n.addEventListener("click",S),n.click()}});const B=document.querySelectorAll(".watermarks-item");B.length&&B.forEach(e=>{e.addEventListener("click",S)});function S(){const e=document.querySelectorAll(".watermarks-item");if(e.length&&(e.forEach(t=>t.classList.remove("active")),a)){this.classList.add("active");const t=this.querySelector("img");t!=null&&t.src&&O(t.src)}}const m=document.getElementById("uploadFile"),L=document.getElementById("canvasWrapper");m&&L&&l&&(m.addEventListener("dragover",M),m.addEventListener("dragleave",A),m.addEventListener("change",D));function D(e){const[t]=e.target.files;F(t)}function M(){document.getElementById("uploadFile").parentNode.className="draging dragBox"}function A(){document.getElementById("uploadFile").parentNode.className="dragBox"}async function F(e){const t=document.getElementById("originalImage");t&&(t.src=await N(e),t.addEventListener("load",async()=>{y=l.width=t.naturalWidth,E=l.height=t.naturalHeight,L.classList.add("active"),a=t,f(t)}))}function N(e){return new Promise(t=>{const i=new FileReader;i.addEventListener("load",()=>{t(i.result)}),i.readAsDataURL(e)})}let O=async function(e){const i=await(await fetch(e)).blob(),r=await createImageBitmap(i);c.src=r,c.width=r.width,c.height=r.height,f(a,c)};function f(e=null,t=null){s.clearRect(0,0,y,E),e&&s.drawImage(e,0,0,l.width,l.height),t!=null&&t.src&&(s.globalAlpha=k,s.drawImage(t.src,t.x,t.y,t.width,t.height)),s.fill(),s.globalAlpha=1}let P=function(e,t,i){let r=i.x,n=i.x+i.width,o=i.y,u=i.y+i.height;return e>r&&e<n&&t>o&&t<u},W=function(e){if(e.preventDefault(),p=parseInt(e.clientY-l.getBoundingClientRect().top),h=parseInt(e.clientX-l.getBoundingClientRect().left),P(h,p,c)){d=!0;return}},H=function(e){d&&(e.preventDefault(),d=!1)},U=function(e){d&&(e.preventDefault(),d=!1)},T=function(e){if(d){e.preventDefault();const t=parseInt(e.clientY-l.getBoundingClientRect().top),i=parseInt(e.clientX-l.getBoundingClientRect().left);let r=i-h,n=t-p;c.x+=r,c.y+=n,f(a,c),h=i,p=t}else return};l.onmousedown=W;l.onmouseup=H;l.onmouseout=U;l.onmousemove=T;const b=document.querySelectorAll("input[type=range]");b.length&&b.forEach(e=>{e.addEventListener("change",function(){this.nextElementSibling.innerHTML=e.value,this.id==="opacity"&&(k=e.value,f(a,c)),this.id==="scale"&&(v=e.value,c.width=c.width*v,c.height=c.height*v,f(a,c))}),e.nextElementSibling.innerHTML=e.value});const x=document.getElementById("preview"),g=document.getElementById("imagePreview");x&&x.addEventListener("click",function(){g.innerHTML="";const e=document.createElement("img");e.src=l.toDataURL(),g.appendChild(e),g.hidden=!1,setTimeout(()=>{document.addEventListener("click",C)},.3)});function C(){g.hidden=!0,document.removeEventListener("click",C)}const R=document.getElementById("saveButton");R&&R.addEventListener("click",function(){this.nextElementSibling.href=l.toDataURL(),this.nextElementSibling.click(),s.clearRect(0,0,y,E),L.classList.remove("active")});
