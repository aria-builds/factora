const C='factora-v3',A=['./','index.html','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/icon-maskable-512.png','icons/icon.svg','icons/icon-180.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(A)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=C).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!='GET')return;
  const u=new URL(r.url),font=/(^|\.)(googleapis|gstatic)\.com$/.test(u.hostname);
  if(u.origin!=location.origin&&!font)return;
  // صفحه اصلی: اول شبکه (نسخه تازه)، در حالت آفلاین از کش
  if(r.mode=='navigate'){e.respondWith(fetch(r).then(x=>{const c=x.clone();caches.open(C).then(k=>k.put('index.html',c));return x}).catch(()=>caches.match('index.html')));return}
  // بقیه: از کش می‌خواند و در پس‌زمینه به‌روز می‌کند
  e.respondWith(caches.match(r).then(m=>{
    const f=fetch(r).then(x=>{if(x.ok||x.type=='opaque'){const c=x.clone();caches.open(C).then(k=>k.put(r,c))}return x}).catch(()=>m);
    return m||f;
  }));
});
