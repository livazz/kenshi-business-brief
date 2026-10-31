const shareButton = document.getElementById('share');
const shareStatus = document.getElementById('share-status');
shareButton.addEventListener('click', async () => {
  const url = 'https://livazz.github.io/kenshi-business-brief/kenshi/';
  try {
    if (navigator.share) {
      await navigator.share({title: 'Kenshi — Le jeu, les ventes & le business', url});
      shareStatus.textContent = 'Menu de partage ouvert.';
    } else if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(url);
      shareStatus.textContent = 'Lien copié. Vous pouvez le partager.';
    } else {
      shareStatus.textContent = 'Lien à partager : ' + url;
    }
  } catch (error) {
    if (error.name !== 'AbortError') shareStatus.textContent = 'Lien à partager : ' + url;
  }
});
document.getElementById('print').addEventListener('click', () => {
  const expanded = [];
  document.querySelectorAll('details').forEach(detail => {
    if (!detail.open) { expanded.push(detail); detail.open = true; }
  });
  window.addEventListener('afterprint', () => expanded.forEach(detail => { detail.open = false; }), {once: true});
  window.print();
});
