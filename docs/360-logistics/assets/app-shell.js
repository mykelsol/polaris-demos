(function(){
  if(window.__appShellInstalled360) return; window.__appShellInstalled360=true;
  function install(){
    var sections = [
      {title:"360 Logistics", items:[
        {label:"Intelligence Hub", href:"360%20Logistics%20Decision%20Hub.dc.html", icon:"\u{1F3E0}"},
        {label:"Cargo Tracking", href:"Cargo%20Tracking.dc.html", icon:"\u{1F4E6}"},
        {label:"Aviation Scheduling", href:"Aviation%20Scheduling.dc.html", icon:"\u2708\uFE0F"},
        {label:"Carrier Tendering", href:"Carrier%20Tendering.dc.html", icon:"\u{1F69A}"},
        {label:"Billing / Recon", href:"Billing%20Reconciliation.dc.html", icon:"\u{1F4B8}"},
        {label:"Entities", href:"Entities.html", icon:"\u{1FA79}"}
      ]}
    ];
    var nav = document.createElement("nav"); nav.id="app-nav";
    nav.innerHTML = "<div class=\"nav-brand\">"+
      "<div class=\"icon\"></div>"+
      "<div><div style=\"font-size:12px;color:var(--ink-2)\">POLARIS I/O</div><div style=\"font-weight:600\">360 Logistics</div></div>"+
    "</div>";
    var current = decodeURIComponent(location.pathname.split("/").pop());
    sections.forEach(function(sec){
      var wrap=document.createElement("div"); wrap.className="nav-section";
      var h=document.createElement("h4"); h.textContent=sec.title; wrap.appendChild(h);
      var list=document.createElement("div"); list.className="nav";
      sec.items.forEach(function(p){
        var a=document.createElement("a"); a.href=p.href; a.innerHTML="<span>"+(p.icon||"\u2022")+"</span><span>"+p.label+"</span>"; if(current===p.href) a.classList.add("active"); list.appendChild(a);
      });
      wrap.appendChild(list); nav.appendChild(wrap);
    });
    var hdr = document.createElement("div"); hdr.id="app-hdr";
    hdr.innerHTML = "<button id=\"toggleNav\" title=\"Toggle nav\">\u2630</button>"+
      "<div class=\"hdr-title\">360 Logistics</div>"+
      "<div id=\"synthetic-demo-chip\">Synthetic Demo</div>"+
      "<div class=\"hdr-spacer\"></div>"+
      "<input class=\"search\" placeholder=\"Search\" />"+
      "<button class=\"btn\">Polaris Assist</button>";
    var main = document.getElementById("app-main");
    if(!main){
      main = document.createElement("main"); main.id="app-main";
      while(document.body.firstChild){ main.appendChild(document.body.firstChild); }
      document.body.appendChild(main);
    }
    document.body.appendChild(nav); document.body.appendChild(hdr);
    var btn=document.getElementById("toggleNav"); if(btn){ btn.addEventListener("click", function(){ document.body.classList.toggle("nav-collapsed"); }); }
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", install); else install();
})();
