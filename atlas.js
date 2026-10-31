const cards = [...document.querySelectorAll('.game')];
const search = document.getElementById('search');
const team = document.getElementById('team-filter');
const family = document.getElementById('family-filter');
const cardsView = document.getElementById('cards');
const tableView = document.getElementById('table-view');
const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function filter(){
  const query=normalize(search.value.trim());let count=0;
  cards.forEach(card=>{
    const visible=(!query||normalize(card.dataset.search).includes(query))&&(team.value==='all'||card.dataset.team===team.value)&&(family.value==='all'||card.dataset.family.split('|').includes(family.value));
    card.hidden=!visible;
    document.querySelector(`tr[data-game="${card.id}"]`).hidden=!visible;
    if(visible) count++;
  });
  document.getElementById('result-count').textContent=`${count} jeu${count>1?'x':''} affiché${count>1?'s':''} sur ${cards.length}`;
  document.getElementById('empty').hidden=count!==0;
}
[search,team,family].forEach(control=>control.addEventListener(control===search?'input':'change',filter));
document.getElementById('reset').addEventListener('click',()=>{search.value='';team.value='all';family.value='all';filter();});
function setView(table){cardsView.hidden=table;tableView.hidden=!table;document.getElementById('view-cards').setAttribute('aria-pressed',String(!table));document.getElementById('view-table').setAttribute('aria-pressed',String(table));}
document.getElementById('view-cards').addEventListener('click',()=>setView(false));
document.getElementById('view-table').addEventListener('click',()=>setView(true));
function showHash(){const card=cards.find(item=>`#${item.id}`===location.hash);if(card){search.value='';team.value='all';family.value='all';filter();setView(false);card.querySelector('details').open=true;requestAnimationFrame(()=>card.scrollIntoView({block:'start'}));}}
window.addEventListener('hashchange',showHash);
document.addEventListener('click',event=>{const anchor=event.target.closest('a[href^="#"]');if(anchor&&anchor.getAttribute('href')===location.hash&&cards.some(card=>`#${card.id}`===location.hash))showHash();});
showHash();
document.getElementById('open-all').addEventListener('click',()=>{setView(false);cards.filter(c=>!c.hidden).forEach(c=>c.querySelector('details').open=true);});
document.getElementById('share').addEventListener('click',async()=>{
  const url='https://livazz.github.io/kenshi-business-brief/';const status=document.getElementById('share-status');
  try{if(navigator.share){await navigator.share({title:'44 jeux indépendants — Petites équipes. Grands succès.',url});status.textContent='Menu de partage ouvert.';}else if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(url);status.textContent='Lien copié. Vous pouvez le partager.';}else status.textContent='Lien à partager : '+url;}catch(error){if(error.name!=='AbortError')status.textContent='Lien à partager : '+url;}
});
document.getElementById('print').addEventListener('click',()=>{
  const previous=cards.map(c=>({card:c,hidden:c.hidden,open:c.querySelector('details').open}));
  const tableWasVisible=!tableView.hidden;
  cards.forEach(c=>{c.hidden=false;c.querySelector('details').open=true;});setView(false);
  window.addEventListener('afterprint',()=>{previous.forEach(x=>{x.card.hidden=x.hidden;x.card.querySelector('details').open=x.open;});setView(tableWasVisible);},{once:true});
  window.print();
});
