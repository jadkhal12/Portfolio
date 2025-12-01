document.addEventListener('DOMContentLoaded', () => {
	// Basic variables
	const body = document.body;
	const themeToggle = document.getElementById('themeToggle');
	const typedEl = document.getElementById('typed');
	const filterBtns = document.querySelectorAll('.filter-btn');
	const projects = document.querySelectorAll('.project');
	const modal = document.getElementById('projectModal');
	const modalTitle = document.getElementById('modalTitle');
	const modalDesc = document.getElementById('modalDesc');
	const modalStack = document.getElementById('modalStack');
	const modalClose = modal ? modal.querySelector('.modal-close') : null;
	const contactForm = document.getElementById('contactForm');
	const copyEmailBtn = document.getElementById('copyEmail');
	const emailAddrEl = document.getElementById('emailAddr');
	const emailAddr = emailAddrEl ? emailAddrEl.textContent.trim() : 'jadkhalil266@gmail.com';
	const bgCanvas = document.getElementById('bgCanvas');
	const menuToggle = document.getElementById('menuToggle');
	const navDrawer = document.getElementById('mainNav');
	const navOverlay = document.getElementById('navOverlay');
	const hero = document.getElementById('hero');
	const aboutVideo = document.getElementById('aboutVideo');
	const videoPlayOverlay = document.getElementById('videoPlayOverlay');

	// Theme persistence + icon
	const setThemeIcon = (el, isLight) => { 
		if (!el) return; 
		el.textContent = isLight ? '☀' : '☾'; 
	};
	
	const savedTheme = localStorage.getItem('theme');
	if (savedTheme === 'light') body.classList.add('light');
	setThemeIcon(themeToggle, body.classList.contains('light'));
	
	if (themeToggle) {
		themeToggle.addEventListener('click', () => {
			const isLight = body.classList.toggle('light');
			themeToggle.setAttribute('aria-pressed', isLight ? 'true' : 'false');
			setThemeIcon(themeToggle, isLight);
			localStorage.setItem('theme', isLight ? 'light' : 'dark');
		});
	}

	// Mobile menu toggle function
	function toggleMobileMenu(open) {
		if (!navDrawer || !menuToggle) return;
		
		if (open) {
			navDrawer.setAttribute('aria-hidden', 'false');
			menuToggle.setAttribute('aria-expanded', 'true');
			if (navOverlay) navOverlay.classList.add('active');
			body.classList.add('menu-open');
			// Prevent body scroll when menu is open
			body.style.overflow = 'hidden';
		} else {
			navDrawer.setAttribute('aria-hidden', 'true');
			menuToggle.setAttribute('aria-expanded', 'false');
			if (navOverlay) navOverlay.classList.remove('active');
			body.classList.remove('menu-open');
			body.style.overflow = '';
		}
	}

	// Nav drawer toggle
	if (menuToggle && navDrawer) {
		menuToggle.addEventListener('click', (e) => {
			e.stopPropagation();
			const isOpen = navDrawer.getAttribute('aria-hidden') === 'false';
			toggleMobileMenu(!isOpen);
		});
	}
	
	// Close menu when clicking overlay
	if (navOverlay) {
		navOverlay.addEventListener('click', () => {
			toggleMobileMenu(false);
		});
	}

	// Close menu when clicking the in-drawer close button (single X)
	const navCloseBtn = document.querySelector('.nav-close');
	if (navCloseBtn) {
		navCloseBtn.addEventListener('click', () => toggleMobileMenu(false));
	}

	// Smooth scroll for nav links and close mobile menu
	document.querySelectorAll('a[href^="#"]').forEach(a => {
		a.addEventListener('click', e => {
			const href = a.getAttribute('href');
			if (!href || href === '#') return;
			const target = document.querySelector(href);
			if (target) {
				e.preventDefault();
				target.scrollIntoView({behavior:'smooth', block:'start'});
				// Close mobile menu
				toggleMobileMenu(false);
			}
		});
	});

	// Close nav with Escape
	document.addEventListener('keydown', e => {
		if (e.key === 'Escape') {
			if (navDrawer && navDrawer.getAttribute('aria-hidden') === 'false') {
				toggleMobileMenu(false);
			}
			// Also close modal
			closeModal();
		}
	});

	// Typing effect
	const words = ['mobile apps.', 'efficient algorithms.', 'beautiful UIs.', 'flutter solutions.', 'clean code.'];
	let wI = 0, cI = 0, deleting = false;
	
	function typeLoop(){
		if (!typedEl) return;
		const word = words[wI];
		if (!deleting) {
			typedEl.textContent = word.slice(0, cI+1);
			cI++;
			if (cI === word.length) { 
				deleting = true; 
				setTimeout(typeLoop, 1200); 
				return; 
			}
		} else {
			typedEl.textContent = word.slice(0, cI-1);
			cI--;
			if (cI === 0) { 
				deleting = false; 
				wI = (wI+1) % words.length; 
			}
		}
		setTimeout(typeLoop, deleting ? 40 : 80);
	}
	if (typedEl) typeLoop();

	// Filters
	filterBtns.forEach(btn => {
		btn.addEventListener('click', () => {
			filterBtns.forEach(b => b.classList.remove('active'));
			btn.classList.add('active');
			const f = btn.dataset.filter;
			projects.forEach(p => {
				const cat = p.dataset.category;
				if (f === 'all' || cat === f) p.style.display = '';
				else p.style.display = 'none';
			});
		});
	});

	// Project modal
	function openModalFromCard(card){
		if (!modal) return;
		modalTitle.textContent = card.dataset.title || '';
		modalDesc.textContent = card.dataset.desc || '';
		modalStack.textContent = 'Stack: ' + (card.dataset.stack || '—');
		modal.setAttribute('aria-hidden', 'false');
		const panel = modal.querySelector('.modal-panel'); 
		if (panel) panel.focus();
	}
	
	function closeModal(){ 
		if (modal) modal.setAttribute('aria-hidden','true'); 
	}
	
	document.querySelectorAll('.open-project').forEach(btn => {
		btn.addEventListener('click', e => {
			const card = e.target.closest('.project'); 
			if (card) openModalFromCard(card);
		});
	});
	
	if (modalClose) modalClose.addEventListener('click', closeModal);
	if (modal) {
		modal.addEventListener('click', e => { 
			if (e.target.classList.contains('modal-overlay')) closeModal(); 
		});
	}

	// Skill bar animation on enter viewport
	const skillBars = document.querySelectorAll('.skill-bar');
	const skillObs = new IntersectionObserver(entries => {
		entries.forEach(ent => {
			if (ent.isIntersecting){
				const el = ent.target;
				const fill = el.querySelector('.skill-fill');
				const v = parseInt(el.dataset.skill, 10) || 0;
				fill.style.width = v + '%';
				skillObs.unobserve(el);
			}
		});
	},{threshold:0.3});
	skillBars.forEach(b => skillObs.observe(b));

	// Simple reveal for sections and cards
	const reveals = document.querySelectorAll('.section, .card');
	const revObs = new IntersectionObserver(entries => {
		entries.forEach(e => { 
			if (e.isIntersecting) e.target.classList.add('revealed'); 
		});
	},{threshold:0.12});
	reveals.forEach(r => revObs.observe(r));

	// Contact: open mailto
	if (contactForm) {
		contactForm.addEventListener('submit', (e) => {
			e.preventDefault();
			const name = document.getElementById('name').value.trim();
			const message = document.getElementById('message').value.trim();
			const subject = encodeURIComponent(`Contact from ${name}`);
			const body = encodeURIComponent(message + '\n\n--\nSent from portfolio');
			window.location.href = `mailto:${emailAddr}?subject=${subject}&body=${body}`;
		});
	}
	
	// Copy email button
	if (copyEmailBtn) {
		copyEmailBtn.addEventListener('click', async () => {
			try { 
				await navigator.clipboard.writeText(emailAddr); 
				copyEmailBtn.textContent = 'Copied!'; 
				setTimeout(() => copyEmailBtn.textContent = 'Copy Email', 1500);
			} catch(e) {
				alert('Copy failed — email: ' + emailAddr);
			}  
		});
	}

	// Accessibility: allow opening card by Enter key
	projects.forEach(p => {
		p.addEventListener('keydown', e => { 
			if (e.key === 'Enter') openModalFromCard(p); 
		});
	});

	// Canvas particle background
	if (bgCanvas && bgCanvas.getContext) {
		const ctx = bgCanvas.getContext('2d');
		let W = bgCanvas.width = bgCanvas.offsetWidth;
		let H = bgCanvas.height = bgCanvas.offsetHeight;
		const particles = [];
		const count = Math.max(12, Math.floor((W*H)/90000));
		
		function rand(min, max){
			return Math.random()*(max-min)+min;
		}
		
		for (let i=0; i<count; i++){ 
			particles.push({
				x:rand(0,W),
				y:rand(0,H),
				r:rand(0.8,2.5),
				vx:rand(-0.2,0.2),
				vy:rand(-0.15,0.15)
			});
		}
		
		function resizeCanvas(){ 
			W = bgCanvas.width = bgCanvas.offsetWidth; 
			H = bgCanvas.height = bgCanvas.offsetHeight; 
		}
		
		window.addEventListener('resize', resizeCanvas);
		
		function draw(){
			ctx.clearRect(0,0,W,H);
			for (let p of particles){
				p.x += p.vx; 
				p.y += p.vy;
				if (p.x < -10) p.x = W+10; 
				if (p.x > W+10) p.x = -10;
				if (p.y < -10) p.y = H+10; 
				if (p.y > H+10) p.y = -10;
				ctx.beginPath(); 
				ctx.fillStyle = 'rgba(255,255,255,0.06)'; 
				ctx.arc(p.x,p.y,p.r,0,Math.PI*2); 
				ctx.fill();
			}
			requestAnimationFrame(draw);
		}
		draw();
	}

	// Card tilt on pointer move
	const tiltCards = document.querySelectorAll('.card');
	tiltCards.forEach(card => {
		card.addEventListener('pointermove', e => {
			const rect = card.getBoundingClientRect();
			const px = (e.clientX - rect.left) / rect.width;
			const py = (e.clientY - rect.top) / rect.height;
			const rx = (py - 0.5) * 8;
			const ry = (px - 0.5) * -8;
			card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
			const bodyInner = card.querySelector('.card-body'); 
			if (bodyInner) bodyInner.style.transform = `translateZ(12px)`;
		});
		card.addEventListener('pointerleave', () => { 
			card.style.transform = ''; 
			const bodyInner = card.querySelector('.card-body'); 
			if (bodyInner) bodyInner.style.transform = ''; 
		});
	});

	// Hero parallax
	if (hero) {
		const art = hero.querySelector('.character');
		hero.addEventListener('pointermove', e => {
			const rect = hero.getBoundingClientRect();
			const nx = (e.clientX - rect.left) / rect.width - 0.5;
			const ny = (e.clientY - rect.top) / rect.height - 0.5;
			if (art) art.style.transform = `translate3d(${nx*8}px,${ny*8}px,0) rotate(${nx*3}deg)`;
		});
		hero.addEventListener('pointerleave', () => { 
			const art = hero.querySelector('.character'); 
			if (art) art.style.transform = ''; 
		});
	}

	// Video overlay behavior
	if (aboutVideo && videoPlayOverlay){
		videoPlayOverlay.addEventListener('click', () => {
			aboutVideo.play(); 
			videoPlayOverlay.setAttribute('aria-hidden','true');
		});
		aboutVideo.addEventListener('play', () => {
			videoPlayOverlay.setAttribute('aria-hidden','true');
		});
		aboutVideo.addEventListener('pause', () => {
			videoPlayOverlay.setAttribute('aria-hidden','false');
		});
	}

	// Keyboard shortcuts
	document.addEventListener('keydown', (e) => {
		// Ignore if user is typing in an input
		if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
		
		if (e.key === 't') {
			const isLight = body.classList.toggle('light'); 
			setThemeIcon(themeToggle, isLight); 
			localStorage.setItem('theme', isLight ? 'light' : 'dark');
		}
		if (e.key === '1') {
			const first = document.querySelector('.project'); 
			if (first) openModalFromCard(first);
		}
		if (e.key === 'v' && aboutVideo){
			if (aboutVideo.paused) { 
				aboutVideo.play(); 
			} else { 
				aboutVideo.pause(); 
			}
		}
		if (e.key === 'm' && menuToggle) {
			const isOpen = navDrawer.getAttribute('aria-hidden') === 'false';
			toggleMobileMenu(!isOpen);
		}
	});

	// Stewie character animation control
	(function(){
		const character = document.querySelector('.character');
		if (!character) return;
		
		const msg = character.querySelector('.character-msg');
		let active = false;
		let hasPlayedOnLoad = false;
		
		function triggerStewie(duration = 800){
			if (active) return; // debounce
			active = true;
			character.classList.add('active');
			if (msg) msg.setAttribute('aria-hidden','false');
			setTimeout(() => {
				character.classList.remove('active');
				if (msg) msg.setAttribute('aria-hidden','true');
				active = false;
			}, duration);
		}

		// Auto-play animation once when page loads
		function playOnLoad() {
			if (hasPlayedOnLoad) return;
			hasPlayedOnLoad = true;
			// Small delay to let page render
			setTimeout(() => triggerStewie(1000), 500);
		}

		// Play immediately on page load
		playOnLoad();

		// When navigating to #hero, trigger
		window.addEventListener('hashchange', () => { 
			if (!location.hash || location.hash === '#hero') triggerStewie(); 
		});
		
		window.addEventListener('popstate', () => { 
			if (!location.hash || location.hash === '#hero') triggerStewie(); 
		});

		// Brand/home click should also trigger
		const brand = document.querySelector('.brand');
		if (brand) {
			brand.addEventListener('click', () => {
				setTimeout(() => triggerStewie(), 350);
			});
		}

		// If hero becomes visible (scrolling back to top)
		try {
			const heroEl = document.getElementById('hero');
			if (heroEl && 'IntersectionObserver' in window){
				const io = new IntersectionObserver(entries => {
					entries.forEach(ent => { 
						if (ent.isIntersecting && hasPlayedOnLoad) {
							// Only trigger if already played once (user is returning to hero)
							triggerStewie(); 
						}
					});
				},{threshold:0.5});
				io.observe(heroEl);
			}
		} catch(e) {
			/* ignore */
		}
	})();
});