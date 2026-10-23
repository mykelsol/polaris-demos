(function(){
  if(window.__appShellInstalled) return; window.__appShellInstalled=true;
  var pages = [
    {label:'Battlespace Hub', href:'Intelligence%20Hub.html'},
    {label:'Theater Map', href:'Theater%20Map.html'},
    {label:'Adversary Posture', href:'Adversary%20Posture.html'},
    {label:'Leading Indicators', href:'Leading%20Indicators.html'},
    {label:'DC-CL-417', href:'Decision%20Case%20-%20DC-CL-417.html'},
    {label:'DC-CI-205', href:'Decision%20Case%20-%20DC-CI-205.html'},
    {label:'Corroboration Lab', href:'Corroboration%20Lab.html'},
    {label:'Incident Timeline', href:'Incident%20Timeline.html'},
    {label:'Decision Reviews', href:'Decision%20Reviews.html'},
    {label:'Analyst Reports', href:'Analyst%20Reports.html'},
    {label:'Distribution', href:'Distribution.html'},
    {label:'Agents', href:'Agents.html'},
    {label:'Monitoring Strategy', href:'Monitoring%20Strategy.html'},
    {label:'Assist', href:'Assist.html'}
  ];
  var nav = document.createElement('nav'); nav.id='app-nav';
  nav.innerHTML = ''+
    '<div class="nav-brand">'+
      '<div style="width:28px;height:28px;border:1px solid var(--border);border-radius:6px"></div>'+
      '<div><div style="font-size:12px;color:var(--ink-2)">POLARIS I/O</div><div style="font-weight:600">Battlespace Awareness</div></div>'+
    '</div>'+
    '<div class="nav nav-section" id="app-links"></div>';
  var links = nav.querySelector('#app-links');
  var current = decodeURIComponent(location.pathname.split('/').pop());
  pages.forEach(function(p){
    var a=document.createElement('a'); a.href=p.href; a.textContent=p.label; if(current===p.href) a.classList.add('active'); links.appendChild(a);
  });
  var hdr = document.createElement('div'); hdr.id='app-hdr';
  hdr.innerHTML = ''+
    '<div class="hdr-title">Battlespace Awareness Hub</div>'+
    '<div id="synthetic-demo-chip">Synthetic Demo</div>'+
    '<div class="hdr-spacer"></div>'+
    '<input class="search" placeholder="Search" />'+
    '<button class="btn">Polaris Assist</button>';
  var main = document.getElementById('app-main');
  if(!main){
    main = document.createElement('main'); main.id='app-main';
    while(document.body.firstChild){ main.appendChild(document.body.firstChild); }
    document.body.appendChild(main);
  }
  document.body.appendChild(nav); document.body.appendChild(hdr);
})();
