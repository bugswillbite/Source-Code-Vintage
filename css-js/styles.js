// SCROLL ANIMATION EFFECTS (Bidirectional)
document.addEventListener("DOMContentLoaded", function () {
    
    // SCROLL ANIMATION SETUP
    function addScrollAnimations() {
        // Add animation classes to elements
        const sections = document.querySelectorAll('section');
    // include archive product cards so the same stagger/slide animations apply
    const productCards = document.querySelectorAll('.product-card, .product-card1, .archive-product-card');
        const headings = document.querySelectorAll('h2');
        
        // Add fade-in to sections
        sections.forEach((section, index) => {
            if (index > 0) { // Skip the home section
                section.classList.add('fade-in');
            }
        });
        
        // Add staggered animations to product cards
        productCards.forEach((card, index) => {
            if (index % 2 === 0) {
                card.classList.add('slide-in-left');
            } else {
                card.classList.add('slide-in-right');
            }
        });
        
        // Add scale animation to headings
        headings.forEach(heading => {
            heading.classList.add('scale-in');
        });
    }

    // INTERSECTION OBSERVER FOR BIDIRECTIONAL ANIMATIONS
    function observeElements() {
        const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
        
    
        const threshold = 0.01; 

        const options = {
            root: null, // default viewport
            rootMargin: '0px 0px 100px 0px', 
            threshold: threshold
        };
        
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                const element = entry.target;
                if (entry.isIntersecting) {
                    element.classList.add('visible');
                } else {
                    element.classList.remove('visible');
                }
            });
        }, options);

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    // Run setup and observer
    addScrollAnimations();
    observeElements();
    

    // SMOOTH SCROLL FOR NAVIGATION
    function setupSmoothScroll() {
        const header = document.querySelector('header');
        const headerHeight = header ? header.offsetHeight : 0;

        function scrollToTarget(targetOrSelector) {
            const target = typeof targetOrSelector === 'string'
                ? document.querySelector(targetOrSelector)
                : targetOrSelector;
            if (!target) return;
            const rect = target.getBoundingClientRect();
            const top = window.pageYOffset + rect.top - headerHeight - 8;
            window.scrollTo({ top: top, behavior: 'smooth' });
        }

        document.querySelectorAll('nav a[href^="#"]:not([data-target])').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                if (this.id === 'forSaleToggle' || this.dataset.noscroll === 'true') {
                    e.preventDefault();
                    return; 
                }

                e.preventDefault();
                const sel = this.dataset.target || this.getAttribute('href');
                if (sel) scrollToTarget(sel);
            });
        });
    }

    // SWORD POPUP FUNCTIONALITY
    function setupSwordPopup() {
        const sword1 = document.getElementById('sword1');
        const sword2 = document.getElementById('sword2');
        const popup = document.getElementById('swordPopup');
        const closeBtn = document.getElementById('closePopup');

        // Open popup when clicking either sword
        function openPopup() {
            popup.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }

        // Close popup
        function closePopup() {
            popup.style.display = 'none';
            document.body.style.overflow = 'auto'; // Restore scrolling
        }

        // Event listeners
        if (sword1) sword1.addEventListener('click', openPopup);
        if (sword2) sword2.addEventListener('click', openPopup);
        if (closeBtn) closeBtn.addEventListener('click', closePopup);

        // Close popup when clicking outside the content
        popup.addEventListener('click', function(e) {
            if (e.target === popup) {
                closePopup();
            }
        });

        // Close popup with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && popup.style.display === 'block') {
                closePopup();
            }
        });
    }

    // PARALLAX SCROLL EFFECTS FOR HEADER
    function setupHeaderParallax() {
        const subtitle = document.querySelector('.subTitle');
        const nav = document.querySelector('nav');
        
        if (!subtitle || !nav) return;

        let lastScrollY = 0;
        let scrollDirection = 'down';
        const isMobile = window.innerWidth <= 420;

        function handleScroll() {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            
            // Determine scroll direction
            scrollDirection = scrollY > lastScrollY ? 'down' : 'up';
            lastScrollY = scrollY;
            
            // Reduce parallax effects on mobile for better performance
            if (isMobile) {
                // Simplified mobile effects
                const fadeDistance = windowHeight * 0.1;
                const subtitleOpacity = Math.max(0, 1 - (scrollY / fadeDistance));
                
                subtitle.style.opacity = subtitleOpacity;
                subtitle.style.transform = `translateY(-${scrollY * 0.5}px)`;
                
                // Minimal nav movement on mobile
                if (scrollY > 30) {
                    nav.style.transform = `translateY(-10px)`;
                } else {
                    nav.style.transform = `translateY(0px)`;
                }
            } else {
                // Full desktop effects
                const fadeDistance = windowHeight * 0.3;
                const subtitleOpacity = Math.max(0, 1 - (scrollY / fadeDistance));
                const subtitleTranslateY = scrollY * 0.3;
                
                let navTransform = 0;
                
                if (scrollY <= 50) {
                    if (scrollDirection === 'up' && scrollY < 20) {
                        navTransform = 0;
                    } else {
                        navTransform = Math.min(scrollY * 0.2, 10);
                    }
                } else {
                    const navMoveDistance = Math.min(scrollY * 0.4, 25);
                    navTransform = -navMoveDistance;
                }
                
                subtitle.style.opacity = subtitleOpacity;
                subtitle.style.transform = `translateY(-${subtitleTranslateY}px)`;
                nav.style.transform = `translateY(${navTransform}px)`;
            }
        }

        // Add scroll event listener with throttling for mobile
        let ticking = false;
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(handleScroll);
                ticking = true;
                setTimeout(() => { ticking = false; }, isMobile ? 16 : 8);
            }
        }

        window.addEventListener('scroll', requestTick);
        
        // Set initial state
        handleScroll();
    }

    // SETTINGS MENU FUNCTIONALITY
    function setupSettingsMenu() {
        const settingsMenuToggle = document.getElementById('settingsMenuToggle');
        const settingsMenu = document.getElementById('settingsMenu');
        const animationToggle = document.getElementById('animationToggle');
        const flyingElements = document.querySelector('.flying-elements');
        
        if (!settingsMenuToggle || !settingsMenu || !animationToggle || !flyingElements) {
            console.log('Settings menu elements not found');
            return;
        }

        let menuOpen = false;
        let animationsEnabled = true;

        // Toggle settings menu
        function toggleSettingsMenu() {
            menuOpen = !menuOpen;
            settingsMenu.classList.toggle('active', menuOpen);
        }

        // Toggle animations
        function toggleAnimations() {
            animationsEnabled = animationToggle.checked;
            
            if (animationsEnabled) {
                // Enable animations
                flyingElements.style.display = 'block';
                flyingElements.style.animationPlayState = 'running';
                
                // Re-enable individual animations
                const flyingImages = flyingElements.querySelectorAll('img');
                flyingImages.forEach(img => {
                    img.style.animationPlayState = 'running';
                });
                console.log('Animations enabled');
            } else {
                // Disable animations
                flyingElements.style.display = 'none';
                console.log('Animations disabled');
            }
        }

        // Close menu when clicking outside
        function handleClickOutside(event) {
            if (menuOpen && !settingsMenu.contains(event.target) && !settingsMenuToggle.contains(event.target)) {
                menuOpen = false;
                settingsMenu.classList.remove('active');
            }
        }

        // Event listeners
        settingsMenuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleSettingsMenu();
        });

        animationToggle.addEventListener('change', function(e) {
            e.stopPropagation();
            toggleAnimations();
        });

        document.addEventListener('click', handleClickOutside);

        // Close menu with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && menuOpen) {
                menuOpen = false;
                settingsMenu.classList.remove('active');
            }
        });
        
        // Initialize states
        animationToggle.checked = true;
        toggleAnimations();
    }

    // MUSIC PLAYER FUNCTIONALITY
    function setupMusicPlayer() {
        const musicMenuToggle = document.getElementById('musicMenuToggle');
        const musicPopup = document.getElementById('musicPopup');
        const closeMusicPopup = document.getElementById('closeMusicPopup');
        const prevStationBtn = document.getElementById('prevStationBtn');
        const nextStationBtn = document.getElementById('nextStationBtn');
        const currentGenre = document.getElementById('currentGenre');
        const currentSongTitle = document.getElementById('currentSongTitle');
        const radioDescription = document.getElementById('radioDescription');
        const radioDescriptionDupe = document.getElementById('radioDescriptionDupe');
        const playPauseBtn = document.getElementById('playPauseBtn');
        const volumeBtn = document.getElementById('volumeBtn');
        const volumeSlider = document.getElementById('volumeSlider');

        if (!musicMenuToggle || !musicPopup || !closeMusicPopup) {
            console.log('Music player elements not found');
            return;
        }

        let currentAudio = null;
        let isPlaying = false;
        let isMuted = false;
        let currentVolume = 0.5;
        let currentSongId = 'cyber-dreams';

        // Song data with MP3 files
        const songs = {
            'cyber-dreams': {
                name: 'Hip Hop',
                songTitle: 'FLO NAZER',
                albumCover: 'imgs/ALBUMS/SKATE.png',
                url: 'music/hip-hop.mp3',
                description: 'This is Hip Hop radio - FLO NAZER. All songs produced & composed by The Prophitt.'
            },
            'neon-nights': {
                name: 'Smooth Jazz',
                songTitle: 'SECRETLY CANADIAN',
                albumCover: 'imgs/ALBUMS/GUITAR.png',
                url: 'music/smooth-jazz.mp3',
                description: 'This is Smooth Jazz radio - SECRETLY CANADIAN. All songs produced & composed by The Prophitt.'
            },
            'digital-rain': {
                name: 'Ambient',
                songTitle: '3DSXLHACKS',
                albumCover: 'imgs/ALBUMS/STARR.png',
                url: 'music/ambient.mp3',
                description: 'This is Ambient radio - 3DSXLHACKS. All songs produced & composed by The Prophitt.'
            },
            'retro-wave': {
                name: 'House',
                songTitle: 'REFRIDGERATOR RUNNIN',
                albumCover: 'imgs/ALBUMS/frig.gif',
                url: 'music/refridgerator_runnin_101 HOUSE.mp3',
                description: 'House Track -+> REFRIDGERATOR RUNNIN. All songs produced & composed by The Prophitt. Better go catch it!'
            },
            'synthwave': {
                name: 'Techno',
                songTitle: 'RUN 2',
                albumCover: 'imgs/ALBUMS/RUN2.gif',
                url: 'music/RUN21.mp3',
                description: 'This is Techno radio - RUN 2. All songs produced & composed by The Prophitt.'
            },
            'lo-fi-beats': {
                name: 'Pop',
                songTitle: 'CRINGE-WORTHY',
                albumCover: 'imgs/ALBUMS/SUNNY.png',
                url: 'music/pop.mp3',
                description: 'This is Pop radio - CRINGE-WORTHY. All songs produced & composed by The Prophitt.'
            },
            'synthpop': {
                name: 'Dance',
                songTitle: 'CLASSIC REGULAR',
                albumCover: 'imgs/ALBUMS/JUMP.png',
                url: 'music/dance.mp3',
                description: 'This is Dance radio - CLASSIC REGULAR. All songs produced & composed by The Prophitt.'
            },
            'chillwave': {
                name: 'Funk',
                songTitle: 'SHIVA, BABY',
                albumCover: 'imgs/ALBUMS/sba5.gif',
                url: 'music/shivababy_funk_100_2.mp3',
                description: 'This is Funk radio - SHIVA, BABY. All songs produced & composed by The Prophitt.'
            },
            'cyberpunk': {
                name: 'Indie',
                songTitle: 'OVER-LACED SHOES',
                albumCover: 'imgs/ALBUMS/dance.gif',
                url: 'music/Cosmic Waffle House_Indie_154.mp3',
                description: 'Indie Track -+> OVER-LACED SHOES. All songs produced & composed by The Prophitt.'
            }
        };
        const songKeys = Object.keys(songs);
        let currentStationIndex = songKeys.indexOf(currentSongId);

        // Open music popup
        function openMusicPopup() {
            musicPopup.style.display = 'block';
            document.body.style.overflow = 'hidden';
            updateDisplay(currentSongId);
        }

        // Close music popup
        function closeMusicPopupFunc() {
            musicPopup.style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        // Update display elements
        function updateDisplay(songId) {
            const song = songs[songId];
            currentSongId = songId;
            const currentAlbumCover = document.getElementById('currentAlbumCover');
            if (currentAlbumCover) {
                currentAlbumCover.src = song.albumCover;
                currentAlbumCover.alt = song.albumCover;
            }
            if (currentGenre) currentGenre.textContent = song.name;
            if (currentSongTitle) currentSongTitle.textContent = song.songTitle;
            if (radioDescription) radioDescription.textContent = song.description;
            if (radioDescriptionDupe) radioDescriptionDupe.textContent = song.description;
            // No song-btns to update
        }

        // Play selected song
        function playSong(songId) {
            const song = songs[songId];
            currentStationIndex = songKeys.indexOf(songId);
            if (currentAudio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
                currentAudio = null;
            }
            updateDisplay(songId);
            currentAudio = new Audio();
            currentAudio.volume = isMuted ? 0 : currentVolume;
            currentAudio.preload = 'auto';
            currentAudio.addEventListener('canplaythrough', () => {});
            currentAudio.addEventListener('error', (e) => {
                isPlaying = true;
                playPauseBtn.textContent = '⏸';
            });
            currentAudio.addEventListener('ended', () => {
                isPlaying = false;
                if (playPauseBtn) playPauseBtn.textContent = '▶';
            });
            currentAudio.src = song.url;
            currentAudio.play().then(() => {
                isPlaying = true;
                if (playPauseBtn) playPauseBtn.textContent = '⏸';
            }).catch(error => {
                isPlaying = true;
                if (playPauseBtn) playPauseBtn.textContent = '⏸';
            });
        }

        // Toggle play/pause
        function togglePlayPause() {
            if (currentAudio && currentAudio.src) {
                if (isPlaying) {
                    currentAudio.pause();
                    isPlaying = false;
                    playPauseBtn.textContent = '▶';
                } else {
                    currentAudio.play().then(() => {
                        isPlaying = true;
                        playPauseBtn.textContent = '⏸';
                    }).catch(error => {
                        isPlaying = true;
                        playPauseBtn.textContent = '⏸';
                    });
                }
            } else {
                playSong(currentSongId);
            }
        }

        // Toggle mute
        function toggleMute() {
            if (currentAudio) {
                if (isMuted) {
                    currentAudio.volume = currentVolume;
                    if (volumeSlider) volumeSlider.value = currentVolume * 100;
                    if (volumeBtn) volumeBtn.textContent = '🔊';
                    isMuted = false;
                } else {
                    currentAudio.volume = 0;
                    if (volumeSlider) volumeSlider.value = 0;
                    if (volumeBtn) volumeBtn.textContent = '🔇';
                    isMuted = true;
                }
            } else {
                isMuted = !isMuted;
                if (volumeBtn) {
                    volumeBtn.textContent = isMuted ? '🔇' : '🔊';
                }
                if (volumeSlider) {
                    volumeSlider.value = isMuted ? 0 : currentVolume * 100;
                }
            }
        }

        // Update volume
        function updateVolume() {
            if (!volumeSlider) return;
            const volume = volumeSlider.value / 100;
            currentVolume = volume;
            if (currentAudio && !isMuted) {
                currentAudio.volume = volume;
            }
            if (volumeBtn) {
                if (volume === 0 || isMuted) {
                    volumeBtn.textContent = '🔇';
                } else if (volume < 0.5) {
                    volumeBtn.textContent = '🔉';
                } else {
                    volumeBtn.textContent = '🔊';
                }
            }
        }

        // Event listeners
        musicMenuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            openMusicPopup();
        });
        closeMusicPopup.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeMusicPopupFunc();
        });
        musicPopup.addEventListener('click', function(e) {
            if (e.target === musicPopup) {
                closeMusicPopupFunc();
            }
        });
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                togglePlayPause();
            });
        }
        if (volumeBtn) {
            volumeBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                toggleMute();
            });
        }
        if (volumeSlider) {
            volumeSlider.addEventListener('input', updateVolume);
            volumeSlider.addEventListener('change', updateVolume);
        }
        if (nextStationBtn) {
            nextStationBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                currentStationIndex = (currentStationIndex + 1) % songKeys.length;
                playSong(songKeys[currentStationIndex]);
            });
        }
        if (prevStationBtn) {
            prevStationBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                currentStationIndex = (currentStationIndex - 1 + songKeys.length) % songKeys.length;
                playSong(songKeys[currentStationIndex]);
            });
        }
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && musicPopup.style.display === 'block') {
                closeMusicPopupFunc();
            }
        });
        if (volumeSlider) volumeSlider.value = currentVolume * 100;
        if (playPauseBtn) playPauseBtn.textContent = '▶';
        if (volumeBtn) volumeBtn.textContent = '🔊';
        updateDisplay(currentSongId);
    }

    // RESPONSIVE BEHAVIOR HANDLER
    function setupResponsiveBehavior() {
        let resizeTimeout;
        
        function handleResize() {
            // Clear existing timeout
            clearTimeout(resizeTimeout);
            
            // Set a new timeout
            resizeTimeout = setTimeout(() => {
                const isMobile = window.innerWidth <= 420;
                const isTablet = window.innerWidth <= 768 && window.innerWidth > 420;
                const flyingElements = document.querySelector('.flying-elements');
                
                // Handle flying elements based on screen size
                if (flyingElements) {
                    if (isMobile) {
                        flyingElements.style.display = 'none';
                    } else {
                        // Check if animations are enabled via settings
                        const animationToggle = document.getElementById('animationToggle');
                        const toggleText = animationToggle?.querySelector('.toggle-text');
                        const animationsEnabled = toggleText?.textContent === 'ON';
                        
                        if (animationsEnabled) {
                            flyingElements.style.display = 'block';
                        }
                    }
                }
                
                // Re-initialize parallax with new screen size considerations
                setupHeaderParallax();
                
                // Re-initialize intersection observer with new thresholds
                observeElements();
                
                // Adjust popup sizes for better mobile experience
                const musicPopup = document.getElementById('musicPopup');
                if (musicPopup && isMobile) {
                    const musicContent = musicPopup.querySelector('.music-popup-content');
                    if (musicContent) {
                        musicContent.style.borderRadius = '0';
                    }
                }
                
                // Handle navigation behavior on mobile
                const nav = document.querySelector('nav');
                if (nav && isMobile) {
                    nav.style.transform = 'translateY(0px)';
                }
                
            }, 250); // Debounce resize events
        }
        
        // Add resize event listener
        window.addEventListener('resize', handleResize);
        
        // Initial setup
        handleResize();
    }

    // FOR SALE DROPDOWN BEHAVIOR
    function setupForSaleDropdown() {
        const forSaleToggle = document.getElementById('forSaleToggle');
        const forSaleDropdown = document.getElementById('forSaleDropdown');

        if (!forSaleToggle || !forSaleDropdown) return;

        // Toggle on click for mobile
        forSaleToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const isVisible = forSaleDropdown.style.display === 'block';
            forSaleDropdown.style.display = isVisible ? 'none' : 'block';
        });

        // Smooth scroll when clicking a dropdown item. Use the visible title image
        // when its desktop-only h2 target is hidden on mobile.
        forSaleDropdown.querySelectorAll('a[data-target]').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const target = this.getAttribute('data-target');
                let el = document.querySelector(target);
                if (el && getComputedStyle(el).display === 'none') {
                    const titleImage = document.querySelector(`a[href="${target}"] .titleImg, a[href="${target}"] .titleImg2`);
                    if (titleImage) el = titleImage;
                }
                if (el) {
                    forSaleDropdown.style.display = 'none';
                    const header = document.querySelector('header');
                    const headerHeight = header ? header.offsetHeight : 0;
                    const top = window.pageYOffset + el.getBoundingClientRect().top - headerHeight - 8;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
            });
        });

        // Close dropdown when clicking outside (mobile)
        document.addEventListener('click', function(e) {
            if (!forSaleToggle.contains(e.target) && !forSaleDropdown.contains(e.target)) {
                if (window.innerWidth <= 768) {
                    forSaleDropdown.style.display = 'none';
                }
            }
        });
    }

    // Turn existing Depop buy links into marketplace dropdowns.
    function setupMarketplaceDropdowns() {
        const cards = document.querySelectorAll('.product-card, .product-card1, .product-card2');

        cards.forEach(card => {
            const depopLink = Array.from(card.querySelectorAll('a[href]')).find(link => {
                return link.href.includes('depop.com') && link.querySelector('button');
            });
            if (!depopLink) return;

            const menu = document.createElement('div');
            menu.className = 'marketplace-menu';

            const toggle = document.createElement('button');
            toggle.type = 'button';
            toggle.className = 'marketplace-toggle';
            toggle.textContent = 'Buy';
            toggle.setAttribute('aria-expanded', 'false');

            const options = document.createElement('div');
            options.className = 'marketplace-options';

            const depopOption = document.createElement('a');
            depopOption.className = 'marketplace-option';
            depopOption.href = depopLink.href;
            depopOption.target = '_blank';
            depopOption.rel = 'noopener noreferrer';
            depopOption.textContent = 'Depop';
            options.appendChild(depopOption);

            const grailedUrl = card.dataset.grailed;
            if (grailedUrl) {
                const grailedOption = document.createElement('a');
                grailedOption.className = 'marketplace-option';
                grailedOption.href = grailedUrl;
                grailedOption.target = '_blank';
                grailedOption.rel = 'noopener noreferrer';
                grailedOption.textContent = 'Grailed';
                options.appendChild(grailedOption);
            }

            toggle.addEventListener('click', function (event) {
                event.stopPropagation();
                const isOpen = menu.classList.toggle('is-open');
                toggle.setAttribute('aria-expanded', String(isOpen));
            });

            menu.append(toggle, options);
            depopLink.replaceWith(menu);
        });

        document.addEventListener('click', function (event) {
            document.querySelectorAll('.marketplace-menu.is-open').forEach(menu => {
                if (!menu.contains(event.target)) {
                    menu.classList.remove('is-open');
                    menu.querySelector('.marketplace-toggle')?.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    // TOUCH GESTURE SUPPORT FOR MOBILE
    function setupTouchGestures() {
        const isMobile = window.innerWidth <= 420;
        
        if (!isMobile) return;
        
        // Add touch-friendly interactions
        const interactiveElements = document.querySelectorAll('.product-card, .product-card1, .song-btn, .setting-toggle-btn');
        
        interactiveElements.forEach(element => {
            // Add touch feedback
            element.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
                this.style.transition = 'transform 0.1s ease';
            });
            
            element.addEventListener('touchend', function() {
                this.style.transform = '';
                this.style.transition = 'transform 0.3s ease';
            });
            
            element.addEventListener('touchcancel', function() {
                this.style.transform = '';
                this.style.transition = 'transform 0.3s ease';
            });
        });
        
        // Prevent double-tap zoom on buttons
        const buttons = document.querySelectorAll('button, .song-btn');
        buttons.forEach(button => {
            button.addEventListener('touchend', function(e) {
                e.preventDefault();
                this.click();
            });
        });
    }

    // SCROLLING IMAGES CLICK FUNCTIONALITY
    function setupScrollingImagesClick() {
        const scrollImages = document.querySelectorAll('.scroll-img');
        
        scrollImages.forEach(img => {
            img.addEventListener('click', function() {
                // Navigate to the collectables section
                document.getElementById('collectables').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        });
    }

    // DUAL SCROLL FUNCTIONALITY (Auto + Manual)
    function setupDualScrolling() {
        const scrollContainer = document.querySelector('.scrolling-container');
        const scrollImages = document.querySelector('.scrolling-images');
        
        if (!scrollContainer || !scrollImages) return;
        
        let scrollTimeout;
        let isUserScrolling = false;
        let lastScrollLeft = 0;
        let scrollCheckInterval;
        
        // Ensure auto-scroll is active on page load
        scrollImages.classList.remove('paused');
        
        // Pause auto-scroll when user manually scrolls
        function pauseAutoScroll() {
            isUserScrolling = true;
            scrollImages.classList.add('paused');
            
            // Clear existing timeout
            clearTimeout(scrollTimeout);
            
            // Start checking if user has stopped scrolling
            startScrollCheck();
        }
        
        // Check if user has stopped scrolling
        function startScrollCheck() {
            clearInterval(scrollCheckInterval);
            
            scrollCheckInterval = setInterval(() => {
                const currentScrollLeft = scrollContainer.scrollLeft;
                
                // If scroll position hasn't changed for 500ms, user has stopped
                if (currentScrollLeft === lastScrollLeft) {
                    // User has stopped scrolling, resume auto-scroll after 500ms more
                    clearInterval(scrollCheckInterval);
                    scrollTimeout = setTimeout(() => {
                        isUserScrolling = false;
                        scrollImages.classList.remove('paused');
                    }, 500);
                }
                
                lastScrollLeft = currentScrollLeft;
            }, 500); // Check every 500ms
        }
        
        // Handle infinite scroll loop (seamless transition)
        function handleInfiniteScroll() {
            const scrollLeft = scrollContainer.scrollLeft;
            const scrollWidth = scrollContainer.scrollWidth;
            const clientWidth = scrollContainer.clientWidth;
            const maxScroll = scrollWidth - clientWidth;
            
            // Calculate the width of one complete set of images (including gaps)
            const images = scrollContainer.querySelectorAll('.scroll-img');
            
            // Get actual image dimensions and gap from current viewport
            const imageStyle = window.getComputedStyle(images[0]);
            const imageWidth = parseInt(imageStyle.width);
            const containerStyle = window.getComputedStyle(scrollImages);
            const gap = parseInt(containerStyle.gap);
            
            const oneSetWidth = (imageWidth + gap) * (images.length / 2); // Divide by 2 since images are duplicated
            
            // When we've scrolled past one complete set, reset to beginning
            if (scrollLeft >= oneSetWidth) {
                scrollContainer.scrollLeft = scrollLeft - oneSetWidth;
            }
        }
        
        // Handle manual scrolling with infinite loop
        scrollContainer.addEventListener('scroll', function() {
            handleInfiniteScroll();
            if (!isUserScrolling) {
                pauseAutoScroll();
            }
        });
        
        // Handle touch scrolling on mobile
        scrollContainer.addEventListener('touchstart', function() {
            pauseAutoScroll();
        });
        
        scrollContainer.addEventListener('touchmove', function() {
            pauseAutoScroll();
        });
        
        // Handle mouse wheel scrolling
        scrollContainer.addEventListener('wheel', function(e) {
            if (e.deltaY !== 0) {
                // Convert vertical scroll to horizontal scroll
                e.preventDefault();
                scrollContainer.scrollLeft += e.deltaY;
                pauseAutoScroll();
            }
        });
        
        // Handle keyboard navigation
        scrollContainer.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                scrollContainer.scrollLeft -= 50; // Scroll by 50px increments
                pauseAutoScroll();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                scrollContainer.scrollLeft += 50; // Scroll by 50px increments
                pauseAutoScroll();
            }
        });
        scrollContainer.setAttribute('tabindex', '0');
    }

    // FLYING PROMO SETUP
    function setupFlyingPromo() {
        const flyingPromo = document.getElementById('flyingPromo');
        
        if (!flyingPromo) {
            console.log('Flying promo element not found');
            return;
        }
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            console.log('Mobile device detected - disabling flying promo');
            flyingPromo.style.display = 'none';
            return;
        }
        let isPromoActive = false;
        let isPromoClicked = false;
        let isInteractiveMode = false;
        let regularInterval;
        let promoHideTimeout;
        let initialTimeout;
        let enterFromLeft = false; 
        const promoLinks = [
            'https://www.podowski.net/',
            'https://theprophitt.bandcamp.com/',
            'https://www.youtube.com/@powdowski',
        ];

        function showPromo() {
            if (isPromoActive || isInteractiveMode) {
                console.log('Promo already active or in interactive mode, skipping');
                return;
            }
            if (window.innerWidth <= 768) {
                console.log('Screen too small, canceling promo');
                return;
            }
            console.log(`Showing flying promo from ${enterFromLeft ? 'left' : 'right'} side`);
            isPromoActive = true;
            isPromoClicked = false;
            flyingPromo.classList.remove('clicked', 'interactive', 'from-left');
            flyingPromo.style.transition = '';
            flyingPromo.style.opacity = '';
            flyingPromo.style.display = 'block';
            if (enterFromLeft) {
                flyingPromo.classList.add('from-left');
            }
            flyingPromo.classList.add('active');
            enterFromLeft = !enterFromLeft;
            promoHideTimeout = setTimeout(() => {
                if (!isPromoClicked && !isInteractiveMode) {
                    console.log('Hiding flying promo after 5 seconds');
                    dismissPromo();
                }
            }, 5000);
        }

        function dismissPromo() {
            flyingPromo.classList.remove('active', 'from-left');
            flyingPromo.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
            flyingPromo.style.opacity = '0';
            flyingPromo.style.transform = 'translateY(-50%) scale(0.8)';
            setTimeout(() => {
                flyingPromo.style.display = 'none';
                flyingPromo.style.transition = '';
                flyingPromo.style.opacity = '';
                flyingPromo.style.transform = '';
                isPromoActive = false;
                console.log('Promo dismissed and ready to show again');
            }, 1000);
        }

        regularInterval = setInterval(() => {
            if (window.innerWidth <= 768) {
                console.log('Screen too small for promo interval');
                return;
            }
            if (!isPromoActive && !isPromoClicked && !isInteractiveMode) {
                console.log('5 minute interval triggered, showing promo');
                showPromo();
            } else {
                console.log('5 minute interval triggered but promo already active or in interactive mode');
            }
        }, 100000); // 100 seconds

        // Initialize first promo appearance after 100 seconds - only on desktop
        initialTimeout = setTimeout(() => {
            if (window.innerWidth <= 768) {
                console.log('Screen too small for initial promo');
                return;
            }
            console.log('Initial promo appearance after 5 minutes');
            showPromo();
        }, 300000); // 5 minutes

        function handleResize() {
            if (window.innerWidth <= 768) {
                if (isPromoActive) {
                    dismissPromo();
                }
                flyingPromo.style.display = 'none';
                console.log('Screen resized to mobile - hiding promo');
            } else if (flyingPromo.style.display === 'none') {
                flyingPromo.style.display = 'block';
                flyingPromo.style.opacity = '0';
                console.log('Screen resized to desktop - enabling promo');
            }
        }

        window.addEventListener('resize', handleResize);
        flyingPromo.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Flying promo clicked! Opening random link');
            
            if (isPromoActive && !isPromoClicked && !isInteractiveMode) {
                isPromoClicked = true;
                const randomIndex = Math.floor(Math.random() * promoLinks.length);
                const selectedLink = promoLinks[randomIndex]; 
                console.log(`Opening link ${randomIndex + 1}: ${selectedLink}`);
                if (promoHideTimeout) {
                    clearTimeout(promoHideTimeout);
                }
                flyingPromo.classList.remove('active', 'from-left');
                flyingPromo.classList.add('clicked');
                setTimeout(() => {
                    window.open(selectedLink, '_blank');
                    dismissPromo();
                    isPromoClicked = false;
                }, 300);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isPromoActive) {
                console.log('ESC pressed, dismissing promo smoothly');
                if (promoHideTimeout) {
                    clearTimeout(promoHideTimeout);
                }
                dismissPromo();
                isPromoClicked = false;
            }
        });

        window.addEventListener('beforeunload', () => {
            if (regularInterval) clearInterval(regularInterval);
            if (initialTimeout) clearTimeout(initialTimeout);
            if (promoHideTimeout) clearTimeout(promoHideTimeout);
        });

        console.log('Flying promo setup complete - desktop only, 5-minute intervals');
    }

    window.addScrollAnimations = addScrollAnimations;
    window.observeElements = observeElements;
    window.setupHeaderParallax = setupHeaderParallax;

    addScrollAnimations();
    observeElements();
    setupSmoothScroll();
    setupSwordPopup();
    setupHeaderParallax();
    // Enable data-target based scrolling and make title images clickable
    function setupDataTargetScroll() {
        const header = document.querySelector('header');
        const headerHeight = header ? header.offsetHeight : 0;

        function scrollToSelector(selector) {
            const target = document.querySelector(selector);
            if (!target) return;
            const rect = target.getBoundingClientRect();
            const top = window.pageYOffset + rect.top - headerHeight - 8;
            window.scrollTo({ top: top, behavior: 'smooth' });
        }

        // Make title images use the same section links as their h2 headings.
        document.querySelectorAll('.titleImg, .titleImg2').forEach(img => {
            const link = img.closest('a');
            if (!link) return;

            link.addEventListener('click', function (e) {
                e.preventDefault();
                const selector = link.getAttribute('href');
                const heading = document.querySelector(selector);
                const target = heading && getComputedStyle(heading).display !== 'none' ? heading : img;
                scrollToTarget(target);
            });
        });
    }
    setupDataTargetScroll();
    setupSettingsMenu();
    setupMusicPlayer();
    setupForSaleDropdown();
    setupMarketplaceDropdowns();
    setupResponsiveBehavior();
    setupTouchGestures();
    setupScrollingImagesClick();
    setupDualScrolling();
    setupFlyingPromo();
    setupPreventVideoFullscreen();
    setupCollectionDetailView();
});

// COLLECTION DETAIL VIEW: clicking a collection image opens a detail pane with Back
function setupCollectionDetailView() {
    const collectionImages = document.querySelectorAll('.collection-art');
    if (!collectionImages || collectionImages.length === 0) return;

    // When a collection-art image is clicked, show the matching hidden <section id="detail-..."> as a subpage
    async function openDetail(img) {
        const collectionsSection = document.getElementById('collections');
        const productsSection = document.getElementById('products');
        if (!collectionsSection) return;

        const detailId = img.dataset.detailId;
        if (detailId) {
            const source = document.getElementById(detailId);
            if (source) {
                // Hide listing sections and show the authored detail section as a subpage
                try {
                    collectionsSection.style.display = 'none';
                    collectionsSection.setAttribute('aria-hidden', 'true');
                } catch (e) {}
                if (productsSection) {
                    try {
                        productsSection.style.display = 'none';
                        productsSection.setAttribute('aria-hidden', 'true');
                    } catch (e) {}
                }

                // Ensure the section uses the site's archive-section styling and is visible
                source.style.display = 'block';
                source.setAttribute('aria-hidden', 'false');

                // Prepend a Back button if not already present in the authored HTML
                let backBtn = source.querySelector('.collection-back');
                if (!backBtn) {
                    backBtn = document.createElement('button');
                    backBtn.className = 'collection-back';
                    backBtn.setAttribute('aria-label', 'Back to collections');
                    backBtn.textContent = '← Back';
                    source.insertBefore(backBtn, source.firstChild);

                    backBtn.addEventListener('click', function () {
                        // Hide detail subpage and restore listing sections
                        try { source.style.display = 'none'; source.setAttribute('aria-hidden', 'true'); } catch (e) {}
                        try { collectionsSection.style.display = 'block'; collectionsSection.setAttribute('aria-hidden', 'false'); } catch (e) {}
                        try { if (productsSection) { productsSection.style.display = 'none'; productsSection.setAttribute('aria-hidden', 'true'); } } catch (e) {}
                        // Re-run observers/animations in case layout changed
                        try { if (window.observeElements) window.observeElements(); } catch (e) {}
                    });
                }

                return; // done — we've shown the authored subpage
            }
        }

        // If we didn't find an authored section, fall back to the previous detail-building behavior
        // (keep existing behavior: create a detail pane and populate it from templates / remote / inline)
        // Build detail pane using optional per-image content sources
        const detail = document.createElement('div');
        detail.className = 'collection-detail';

        // Back button
        const backBtn = document.createElement('button');
        backBtn.className = 'collection-back';
        backBtn.setAttribute('aria-label', 'Back to collections');
        backBtn.textContent = '← Back';
        detail.appendChild(backBtn);

        // Content wrapper
        const contentWrap = document.createElement('div');
        contentWrap.className = 'collection-detail-content';

        const tplId = img.dataset.detailTemplate;
        if (tplId) {
            const tpl = document.getElementById(tplId);
            if (tpl && tpl.content) {
                contentWrap.appendChild(tpl.content.cloneNode(true));
            }
        } else if (img.dataset.detailSrc) {
            try {
                const resp = await fetch(img.dataset.detailSrc, {cache: 'no-store'});
                if (resp.ok) {
                    const html = await resp.text();
                    const frag = document.createElement('div');
                    frag.innerHTML = html;
                    contentWrap.appendChild(frag);
                }
            } catch (e) {}
        } else if (img.dataset.detailHtml) {
            const frag = document.createElement('div');
            frag.innerHTML = img.dataset.detailHtml;
            contentWrap.appendChild(frag);
        } else {
            const ii = document.createElement('img'); ii.src = img.src; ii.alt = img.alt || ''; ii.className = 'collection-detail-img';
            const meta = document.createElement('div'); meta.className = 'collection-detail-meta';
            const h3 = document.createElement('h3'); h3.textContent = img.alt || 'Collection item';
            const p = document.createElement('p'); p.textContent = '';
            meta.appendChild(h3); meta.appendChild(p);
            contentWrap.appendChild(ii); contentWrap.appendChild(meta);
        }

        detail.appendChild(contentWrap);

        // Replace collectionsSection content with detail
        collectionsSection.innerHTML = '';
        collectionsSection.appendChild(detail);

        // Attach back handler
        backBtn.addEventListener('click', function () {
            // restore the original collections/products sections by reloading the page section state
            try { window.location.reload(); } catch (e) {
                // as a fallback: attempt to show collections and hide detail
                try { const cs = document.getElementById('collections'); if (cs) { cs.style.display = 'block'; cs.setAttribute('aria-hidden', 'false'); } } catch (ee) {}
            }
        });
    }

    collectionImages.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', function (e) {
            e.preventDefault();
            openDetail(img);
        });
    });
}

// Archive toggle: show collections or products
document.addEventListener('DOMContentLoaded', function() {
    const btnCollections = document.getElementById('showCollections');
    const btnProducts = document.getElementById('showProducts');
    const sectionCollections = document.getElementById('collections');
    const sectionProducts = document.getElementById('products');

    function showSection(which) {
        if (which === 'collections') {
            sectionCollections.setAttribute('aria-hidden', 'false');
            sectionCollections.style.display = 'block';
            sectionProducts.setAttribute('aria-hidden', 'true');
            sectionProducts.style.display = 'none';
            btnCollections.classList.add('active');
            btnCollections.setAttribute('aria-pressed', 'true');
            btnProducts.classList.remove('active');
            btnProducts.setAttribute('aria-pressed', 'false');
        } else {
            sectionCollections.setAttribute('aria-hidden', 'true');
            sectionCollections.style.display = 'none';
            sectionProducts.setAttribute('aria-hidden', 'false');
            sectionProducts.style.display = 'block';
            btnCollections.classList.remove('active');
            btnCollections.setAttribute('aria-pressed', 'false');
            btnProducts.classList.add('active');
            btnProducts.setAttribute('aria-pressed', 'true');
            // Re-run observers/animations so elements that were hidden become visible/animated
            try { if (window.observeElements) window.observeElements(); } catch (e) { console.warn('observeElements failed', e); }
        }
    }

    if (btnCollections && btnProducts && sectionCollections && sectionProducts) {
        btnCollections.addEventListener('click', function(e) { e.preventDefault(); showSection('collections'); });
        btnProducts.addEventListener('click', function(e) { e.preventDefault(); showSection('products'); });
        // default state: show collections
        showSection('collections');
    }
});

    // Prevent videos from entering fullscreen
    function setupPreventVideoFullscreen() {
        try {
            const videos = document.querySelectorAll('video');
            if (!videos || videos.length === 0) return;

            // If any code tries to request fullscreen on a video, override the method per element.
            videos.forEach(v => {
                // Ensure inline playback on mobile (iOS/Android)
                v.setAttribute('playsinline', '');
                v.setAttribute('webkit-playsinline', '');
                v.setAttribute('x5-playsinline', '');

                // Disable picture-in-picture and fullscreen controls where supported
                try { v.setAttribute('disablepictureinpicture', ''); } catch (e) {}
                try { v.setAttribute('controlsList', 'nofullscreen nodownload'); } catch (e) {}

                // Override element methods to no-op
                try { v.requestFullscreen = () => Promise.reject(new Error('fullscreen disabled')); } catch (e) {}
                try { v.webkitRequestFullscreen = () => {}; } catch (e) {}
                try { v.mozRequestFullScreen = () => {}; } catch (e) {}
                try { v.msRequestFullscreen = () => {}; } catch (e) {}

                // iOS: prevent programmatic begin fullscreen event where possible
                v.addEventListener('webkitbeginfullscreen', function(ev) {
                    // If this fires, attempt to exit; often this won't be available, but try to keep UX consistent
                    try { if (document.webkitExitFullscreen) document.webkitExitFullscreen(); } catch (e) {}
                });
            });

            // Global guard: if a video becomes fullscreen, immediately exit
            document.addEventListener('fullscreenchange', () => {
                try {
                    if (document.fullscreenElement && document.fullscreenElement.tagName === 'VIDEO') {
                        document.exitFullscreen().catch(() => {});
                    }
                } catch (e) {}
            });
        } catch (e) {
            console.warn('setupPreventVideoFullscreen failed', e);
        }
    }



window.addEventListener('scroll', () => {
    // support multiple tilt images on the page (apply to each .tilt-img)
    const images = document.querySelectorAll('.tilt-img, .archive-img');
    if (!images || images.length === 0) return;

    const windowCenter = window.innerHeight / 2;
    images.forEach(image => {
        const rect = image.getBoundingClientRect();
        const offset = rect.top + rect.height / 2 - windowCenter;
        const rotateY = Math.max(-15, Math.min(15, offset / 8));
        image.style.transform = `rotateY(${rotateY}deg)`;
    });
});

document.addEventListener('DOMContentLoaded', function() {
    function isMobile() {
        return window.innerWidth <= 450;
    }
    if (isMobile()) {
        document.querySelectorAll('.archive-img-wrapper').forEach(function(wrapper) {
            var overlay = wrapper.querySelector('.archive-overlay');
            wrapper.addEventListener('click', function(e) {
                if (overlay) {
                    overlay.classList.toggle('toggled');
                }
            });
        });
    }
});
