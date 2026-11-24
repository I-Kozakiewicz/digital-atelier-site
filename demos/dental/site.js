(() => {
  const cfg = window.clientSite;
  const languages = ['fr','en','ar'];
  const requested = new URLSearchParams(location.search).get('lang');
  let lang = languages.includes(requested) ? requested : 'fr';
  let choice = '';
  const qs = selector => document.querySelector(selector);
  qs(".photo").src = cfg.heroImage;
  const validNumber = /^[1-9][0-9]{7,14}$/.test(cfg.whatsappNumber);
  const platforms = ['facebook','instagram','tiktok','pinterest'];
  const demo = !validNumber && !platforms.some(platform => cfg[platform + 'Url']);
  document.querySelectorAll('[data-image]').forEach(img => {img.src = cfg.serviceImages[Number(img.dataset.image)];});
  document.querySelectorAll('[data-social]').forEach(link => {
    const platform = link.dataset.social;
    const href = cfg[platform + 'Url'] || (demo ? cfg.demoSocial[platform] : '');
    link.hidden = !href;
    if (href) link.href = href;
  });
  qs('.social-links').hidden = !demo && !cfg.facebookUrl && !cfg.instagramUrl;
  qs('#social-strip-label').dataset.copy = demo ? 'socialTopDemo' : 'socialTop';
  const headerWhatsApp = qs('#header-whatsapp');
  if (validNumber) {
    headerWhatsApp.target = '_blank';
    headerWhatsApp.rel = 'noopener noreferrer';
  }
  qs('#social-note').hidden = !demo;
  qs('#address').textContent = cfg.address;
  qs('#hours').textContent = cfg.hours;
  qs('#address').previousElementSibling.hidden = !cfg.address;
  qs('#hours').previousElementSibling.hidden = !cfg.hours;
  qs('.details').hidden = !cfg.address && !cfg.hours;
  qs('footer').hidden = !cfg.collectionUrl;
  if (cfg.collectionUrl) qs('#collection-link').href = cfg.collectionUrl;
  const preview = qs('#message-preview');
  function message() {
    const t = cfg.copy[lang];
    return choice ? t.message + '\n' + t.topic + ' · ' + t[choice] : t.message;
  }
  function whatsappUrl() {
    return 'https://wa.me/' + cfg.whatsappNumber + '?text=' + encodeURIComponent(message());
  }
  function render() {
    const t = cfg.copy[lang];
    const brand = lang === 'ar' && cfg.arabicName ? cfg.arabicName : cfg.name;
    document.documentElement.lang = lang;
    qs('.brand').textContent = brand;
    qs('.lang').setAttribute('aria-label', t.languageLabel);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-copy]').forEach(node => { node.textContent = t[node.dataset.copy]; });
    document.querySelectorAll('[data-lang]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.lang === lang)));
    qs('#selected').textContent = choice ? t.topic + ' · ' + t[choice] : '';
    if (!preview.hidden) preview.textContent = message();
    if (validNumber) headerWhatsApp.href = whatsappUrl();
    qs('#whatsapp').textContent = validNumber ? t.send : t.preview;
    qs('.note').hidden = validNumber;
    document.title = brand + ' · ' + t.eyebrow;
  }
  document.querySelectorAll('[data-lang]').forEach(button => button.addEventListener('click', () => {lang = button.dataset.lang; render();}));
  document.querySelectorAll('[data-choice]').forEach(button => button.addEventListener('click', () => {
    choice = button.dataset.choice;
    render();
    qs('#contact').scrollIntoView();
    qs('#whatsapp').focus({ preventScroll: true });
  }));
  qs('#whatsapp').addEventListener('click', () => {
    if (validNumber) {
      window.open(whatsappUrl(), '_blank', 'noopener,noreferrer');
      return;
    }
    preview.textContent = message();
    preview.hidden = false;
    preview.focus();
  });
  render();
})();