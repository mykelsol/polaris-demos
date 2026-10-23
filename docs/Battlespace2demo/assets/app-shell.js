(function(){
  if(window.__appShellInstalled) return; window.__appShellInstalled=true;
  function setAccent(hex){ document.documentElement.style.setProperty('--accent', hex); try{ localStorage.setItem('accent', hex);}catch(e){} }
  try{ var saved=localStorage.getItem('accent'); if(saved) setAccent(saved);}catch(e){}

  var sections = [
    {title:'Battlespace', items:[
      {label:'Battlespace Hub', href:'Intelligence%20Hub.html', icon:'\u{1F3E0}'},
      {label:'Theater Map', href:'Theater%20Map.html', icon:'\u{1F5FA}\u{FE0F}'},
      {label:'Adversary Posture', href:'Adversary%20Posture.html', icon:'\u{1F3AF}'},
      {label:'Leading Indicators', href:'Leading%20Indicators.html', icon:'\u23F1\uFE0F'}
    ]},
    {title:'Decisions', items:[
      {label:'DC-CL-417', href:'Decision%20Case%20-%20DC-CL-417.html', icon:'\u{1F9ED}'},
      {label:'DC-CI-205', href:'Decision%20Case%20-%20DC-CI-205.html', icon:'\u26A1'},
      {label:'Corroboration Lab', href:'Corroboration%20Lab.html', icon:'\u{1FA7A}'},
      {label:'Incident Timeline', href:'Incident%20Timeline.html', icon:'\u{1F4C5}'},
      {label:'Decision Reviews', href:'Decision%20Reviews.html', icon:'\u{1F4C8}'}
    ]},
    {title:'Intelligence', items:[
      {label:'Analyst Reports', href:'Analyst%20Reports.html', icon:'\u{1F4D1}'},
      {label:'Distribution', href:'Distribution.html', icon:'\u{1F4E6}'},
      {label:'Operations', href:'Operations.html', icon:'\u{1F6F0}\uFE0F'},
      {label:'Entities', href:'Entities.html', icon:'\u{1FA79}'},
      {label:'Patterns', href:'Patterns.html', icon:'\u{1F517}'},
      {label:'Signals', href:'Signals.html', icon:'\u{1F4E1}'}
    ]},
    {title:'System', items:[
      {label:'Agents', href:'Agents.html', icon:'\u{1F916}'},
      {label:'Monitoring Strategy', href:'Monitoring%20Strategy.html', icon:'\u{1F6E0}\uFE0F'},
      {label:'Assist', href:'Assist.html', icon:'\u2753'}
    ]}
  ];

  var nav = document.createElement('nav'); nav.id='app-nav';
  nav.innerHTML = '<div class="nav-brand">'+
      '<div class="icon"></div>'+
      '<div><div style="font-size:12px;color:var(--ink-2)">POLARIS I/O</div><div style="font-weight:600">Battlespace Awareness</div></div>'+
    '</div>';
  var current = decodeURIComponent(location.pathname.split('/').pop());
  sections.forEach(function(sec){
    var wrap=document.createElement('div'); wrap.className='nav-section';
    var h=document.createElement('h4'); h.textContent=sec.title; wrap.appendChild(h);
    var list=document.createElement('div'); list.className='nav';
    sec.items.forEach(function(p){
      var a=document.createElement('a'); a.href=p.href; a.innerHTML='<span>'+(p.icon||'•')+'</span><span>'+p.label+'</span>'; if(current===p.href) a.classList.add('active'); list.appendChild(a);
    });
    wrap.appendChild(list); nav.appendChild(wrap);
  });

  var hdr = document.createElement('div'); hdr.id='app-hdr';
  hdr.innerHTML = '<button id="toggleNav" title="Toggle nav">\u2630</button>'+
    '<div class="hdr-title">Battlespace Awareness Hub</div>'+
    '<div id="synthetic-demo-chip">Synthetic Demo</div>'+
    '<div class="hdr-spacer"></div>'+
    '<input class="search" placeholder="Search" />'+
    '<button class="btn" id="openTweaks">Tweaks</button>'+
    '<button class="btn">Polaris Assist</button>';

  var tweaks = document.createElement('aside'); tweaks.id='app-tweaks';
  tweaks.innerHTML = '<h3>Presentation tweaks</h3>'+
    '<div class="tweak-row"><label>Accent color</label>'+
      '<span class="color-swatch" data-c="#2563eb" style="background:#2563eb"></span>'+
      '<span class="color-swatch" data-c="#0ea5e9" style="background:#0ea5e9"></span>'+
      '<span class="color-swatch" data-c="#16a34a" style="background:#16a34a"></span>'+
      '<span class="color-swatch" data-c="#f59e0b" style="background:#f59e0b"></span>'+
      '<span class="color-swatch" data-c="#ef4444" style="background:#ef4444"></span>'+
    '</div>'+
    '<div class="tweak-row"><button class="btn" id="closeTweaks">Close</button></div>';

  var main = document.getElementById('app-main');
  if(!main){
    main = document.createElement('main'); main.id='app-main';
    while(document.body.firstChild){ main.appendChild(document.body.firstChild); }
    document.body.appendChild(main);
  }
  document.body.appendChild(nav); document.body.appendChild(hdr); document.body.appendChild(tweaks);

  document.getElementById('openTweaks').addEventListener('click', function(){ tweaks.classList.add('open'); });
  document.getElementById('closeTweaks').addEventListener('click', function(){ tweaks.classList.remove('open'); });
  tweaks.querySelectorAll('.color-swatch').forEach(function(el){ el.addEventListener('click', function(){ setAccent(el.dataset.c); }); });
  document.getElementById('toggleNav').addEventListener('click', function(){ document.body.classList.toggle('nav-collapsed'); });
})();
