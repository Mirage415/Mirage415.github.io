(async function visitorGlobe() {
  const canvas = document.querySelector('#earth');
  const context = canvas.getContext('2d');
  const slider = document.querySelector('#longitude');
  const status = document.querySelector('#regions');
  const endpoint = 'https://yushen-liang-visitor-globe.andrepolaron325001.chatgpt.site/regions';
  const visits = fetch(endpoint, {method:'POST', credentials:'omit', referrerPolicy:'no-referrer'}).then(response => {
    if (!response.ok) throw Error('Unavailable');
    return response.json();
  }).catch(() => null);
  const countries = await visits;
  const visited = new Set(countries || []);
  const names = new Intl.DisplayNames(['en'], {type:'region'});
  status.textContent = countries === null ? 'Visitor data is temporarily unavailable.' :
    countries.length ? countries.map(code => names.of(code)).sort().join(' · ') : 'No regions recorded yet.';
  const response = await fetch('assets/atlas.json');
  const land = Object.entries(await response.json());
  const rad = Math.PI / 180;
  function draw() {
    context.clearRect(0,0,520,360);
    context.fillStyle='#183f4a';
    context.beginPath();context.arc(260,180,154,0,Math.PI*2);context.fill();
    for (const [code,points] of land) {
      context.fillStyle=visited.has(code)?'#ffc277':'#739e9b';
      for (const [lon,lat] of points) {
        const delta=(lon-Number(slider.value))*rad;
        const east=Math.cos(lat*rad)*Math.sin(delta);
        const front=Math.cos(lat*rad)*Math.cos(delta);
        const north=Math.sin(lat*rad);
        if (front*Math.cos(.25)+north*Math.sin(.25)<0) continue;
        const top=north*Math.cos(.25)-front*Math.sin(.25);
        context.fillRect(260+154*east,180-154*top,2.4,2.4);
      }
    }
  }
  slider.addEventListener('input',draw);
  draw();
})().catch(()=>{document.querySelector('#regions').textContent='The visitor globe is temporarily unavailable.'});
