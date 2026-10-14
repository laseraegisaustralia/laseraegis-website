(function(){
  var MIN=30;
  function fit(h){
    h.style.fontSize="";h.style.whiteSpace="";
    if(window.innerWidth<900)return;
    var cs=getComputedStyle(h),orig=parseFloat(cs.fontSize),lh=parseFloat(cs.lineHeight);
    if(!lh||isNaN(lh))lh=orig*1.2;
    if(h.getBoundingClientRect().height<=lh*1.5)return;
    h.style.whiteSpace="nowrap";
    var s=orig;
    while(h.scrollWidth>h.clientWidth+1&&s>MIN){s-=1;h.style.fontSize=s+"px";}
    if(h.scrollWidth>h.clientWidth+1){h.style.fontSize="";h.style.whiteSpace="";}
  }
  function run(){
    var list=document.querySelectorAll("h1");
    for(var i=0;i<list.length;i++){
      if(list[i].closest(".contact-col-left,.hero-top-text,.article-header,.home-hero"))continue;
      fit(list[i]);
    }
  }
  run();
  window.addEventListener("resize",run);
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(run);
})();
