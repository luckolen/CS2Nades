document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('utility-grid');
    
    // --- 1. CONFIGURATION & MAP VALIDATION ENGINE ---
    if (gridContainer) {
        const urlParams = new URLSearchParams(window.location.search);
        const mapName = urlParams.get('map');
        
        if (!mapName) {
            window.location.href = '../404.html';
            return;
        }
        
        const titleElement = document.getElementById('map-title');
        if (titleElement) {
            titleElement.textContent = `DE_${mapName.toUpperCase()}`;
        }

        fetch(`../data/${mapName}.json`)
            .then(response => {
                if (!response.ok) {
                    window.location.href = '../404.html';
                    return;
                }
                return response.json();
            })
            .then(grenadesData => {
                if (!grenadesData) return;
                renderGrenadeCards(grenadesData);
                initializeFilterEngine();
                initializeLightboxEngine();
                initializeDeepLinkEngine();
            })
            .catch(err => {
                console.error("Error booting tactical utility data stream:", err);
            });
    }

    // --- 2. TEMPLATE GENERATOR (UPDATED TO APPEND MEDIA PATH) ---
    function renderGrenadeCards(data) {
        gridContainer.innerHTML = ''; 

        data.forEach(nade => {
            const typeBadgesHTML = nade.types
                .map(type => `<span class="type-badge ${type}">${type}</span>`)
                .join('');

            const priorityBadgeHTML = nade.priority === 'main' 
                ? `<span class="type-badge" style="background: rgba(241, 196, 15, 0.1); color: #f1c40f; border: 1px solid rgba(241, 196, 15, 0.25);">⭐️</span>` 
                : '';

            // Appends the absolute project path parent directory structure automatically
            const imagesHTML = nade.images
                .map(img => `
                    <div class="img-box">
                        <span class="label">${img.label}</span>
                        <img src="../media/${img.src}" alt="${img.label}">
                    </div>`)
                .join('');

            const cardHTML = `
                <div id="${nade.id}" class="grenade-card" data-side="${nade.side}" data-type="${nade.types.join(' ')}" data-priority="${nade.priority}">
                    <div class="grenade-header">
                        <div class="title-group">
                            <span class="side-badge ${nade.side}-side">${nade.side.toUpperCase()}</span>
                            ${typeBadgesHTML}
                            ${priorityBadgeHTML}
                            <p class="grenade-title">${nade.title}</p>
                        </div>
                        <span class="throw-type">${nade.throwType}</span>
                    </div>
                    <div class="image-container">
                        ${imagesHTML}
                    </div>
                    <div class="grenade-notes">${nade.notes || ''}</div>
                </div>`;

            gridContainer.insertAdjacentHTML('beforeend', cardHTML);
        });
    }

    // --- 3. THREE-AXIS FILTER ENGINE ---
    function initializeFilterEngine() {
        const sideButtons = document.querySelectorAll('[data-filter-side]');
        const typeButtons = document.querySelectorAll('[data-filter-type]');
        const priorityButtons = document.querySelectorAll('[data-filter-priority]');
        const grenadeCards = document.querySelectorAll('.grenade-card');

        let activeSide = 'all';
        let activeType = 'all';
        let activePriority = 'all';

        sideButtons.forEach(btn => btn.addEventListener('click', () => {
            sideButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeSide = btn.getAttribute('data-filter-side');
            runEvaluation();
        }));

        typeButtons.forEach(btn => btn.addEventListener('click', () => {
            typeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeType = btn.getAttribute('data-filter-type');
            runEvaluation();
        }));

        priorityButtons.forEach(btn => btn.addEventListener('click', () => {
            priorityButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activePriority = btn.getAttribute('data-filter-priority');
            runEvaluation();
        }));

        function runEvaluation() {
            grenadeCards.forEach(card => {
                const cardSide = card.getAttribute('data-side') || '';
                const cardTypes = (card.getAttribute('data-type') || '').split(' ');
                const cardPriority = card.getAttribute('data-priority') || '';

                const matchSide = (activeSide === 'all' || cardSide === activeSide);
                const matchType = (activeType === 'all' || cardTypes.includes(activeType));
                const matchPriority = (activePriority === 'all' || cardPriority === activePriority);

                if (matchSide && matchType && matchPriority) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        }
    }

    // --- 4. LIGHTBOX MECHANICS (CENTER SCALE ZOOM) ---
    function initializeLightboxEngine() {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        
        const lightboxImg = document.createElement('img');
        lightbox.appendChild(lightboxImg);
        document.body.appendChild(lightbox);

        gridContainer.addEventListener('click', (e) => {
            const clickedImg = e.target.closest('.img-box img');
            if (!clickedImg) return;

            lightboxImg.src = clickedImg.src;
            lightboxImg.alt = clickedImg.alt;

            const labelText = clickedImg.previousElementSibling?.textContent.toLowerCase() || '';
            const isAim = labelText.includes('aim') || labelText.includes('zoom') || clickedImg.src.toLowerCase().includes('aim');

            if (isAim) {
                lightbox.classList.add('zoomed-mode');
            } else {
                lightbox.classList.remove('zoomed-mode');
            }
            
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        lightbox.addEventListener('click', () => {
            lightbox.classList.remove('active');
            lightbox.classList.remove('zoomed-mode');
            document.body.style.overflow = '';
        });
    }

    // --- 5. DEEP LINKING & ANCHOR ROUTING ---
    function initializeDeepLinkEngine() {
        gridContainer.addEventListener('click', (e) => {
            const titleElement = e.target.closest('.grenade-title');
            if (!titleElement) return;

            const card = titleElement.closest('.grenade-card');
            if (card && card.id) {
                window.location.hash = card.id;
                titleElement.classList.add('clicked-flash');
                setTimeout(() => titleElement.classList.remove('clicked-flash'), 400);
            }
        });

        if (window.location.hash) {
            setTimeout(() => {
                const targetCard = document.querySelector(window.location.hash);
                if (targetCard) {
                    targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    const title = targetCard.querySelector('.grenade-title');
                    if (title) {
                        title.classList.add('clicked-flash');
                        setTimeout(() => title.classList.remove('clicked-flash'), 800);
                    }
                }
            }, 250); 
        }
    }
});
