// SCROLL ANIMATION EFFECTS (Bidirectional)
document.addEventListener("DOMContentLoaded", function () {
    
    // SCROLL ANIMATION SETUP
    function addScrollAnimations() {
        // Add animation classes to elements
        const sections = document.querySelectorAll('section');
        const productCards = document.querySelectorAll('.product-card, .product-card1');
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
        
        // Adjust threshold based on screen size for better mobile experience
        const isMobile = window.innerWidth <= 420;
        const threshold = isMobile ? 0.05 : 0.1;
        const rootMargin = isMobile ? '0px 0px -20px 0px' : '0px 0px -50px 0px';
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Element is entering viewport - animate in
                    entry.target.classList.add('visible');
                } else {
                    // Element is leaving viewport - animate out
                    entry.target.classList.remove('visible');
                }
            });
        }, {
            threshold: threshold,
            rootMargin: rootMargin
        });

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    // SMOOTH SCROLL FOR NAVIGATION
    function setupSmoothScroll() {
        document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
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
                const fadeDistance = windowHeight * 0.2;
                const subtitleOpacity = Math.max(0, 1 - (scrollY / fadeDistance));
                
                subtitle.style.opacity = subtitleOpacity;
                subtitle.style.transform = `translateY(-${scrollY * 0.1}px)`;
                
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
        const songButtons = document.querySelectorAll('.song-btn');
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
                albumCover: 'imgs/ALBUMS/hand.gif',
                url: 'music/refridgerator_runnin_101 HOUSE.mp3',
                description: 'House Track -+> REFRIDGERATOR RUNNIN. All songs produced & composed by The Prophitt. Better go catch it!'
            },
            'synthwave': {
                name: 'Techno',
                songTitle: 'REMOTE CONTROL THIEF',
                albumCover: 'imgs/ALBUMS/UFO.png',
                url: 'music/techno.mp3',
                description: 'This is Techno radio - REMOTE CONTROL THIEF. All songs produced & composed by The Prophitt.'
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
                albumCover: 'imgs/ALBUMS/IDKK.png',
                url: 'music/shivababy_funk_100_2.mp3',
                description: 'This is Funk radio - SHIVA, BABY. All songs produced & composed by The Prophitt.'
            },
            'cyberpunk': {
                name: 'Indie',
                songTitle: 'COSMIC WAFFLE HOUSE',
                albumCover: 'imgs/ALBUMS/ZOMBI.png',
                url: 'music/Cosmic Waffle House_Indie_154.mp3',
                description: 'Indie Track -+> COSMIC WAFFLE HOUSE. All songs produced & composed by The Prophitt.'
            }
        };

        // Open music popup
        function openMusicPopup() {
            console.log('Opening music popup');
            musicPopup.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            // Initialize display without auto-playing
            updateDisplay(currentSongId);
        }

        // Close music popup
        function closeMusicPopupFunc() {
            console.log('Closing music popup');
            musicPopup.style.display = 'none';
            document.body.style.overflow = 'auto';
            
            // Stop audio when closing
            if (currentAudio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
                isPlaying = false;
                playPauseBtn.textContent = '▶';
            }
        }

        // Update display elements
        function updateDisplay(songId) {
            const song = songs[songId];
            currentSongId = songId;
            
            // Update album cover
            const currentAlbumCover = document.getElementById('currentAlbumCover');
            if (currentAlbumCover) {
                currentAlbumCover.src = song.albumCover;
                currentAlbumCover.alt = song.albumCover;
            }
            
            // Update genre and song title
            if (currentGenre) currentGenre.textContent = song.name;
            if (currentSongTitle) currentSongTitle.textContent = song.songTitle;
            
            // Update radio description ticker
            if (radioDescription) radioDescription.textContent = song.description;
            if (radioDescriptionDupe) radioDescriptionDupe.textContent = song.description;
            
            // Remove active class from all song buttons
            songButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to selected song button
            const selectedButton = document.querySelector(`[data-song="${songId}"]`);
            if (selectedButton) {
                selectedButton.classList.add('active');
            }
            
            console.log(`Display updated for: ${song.name} - ${song.songTitle}`);
        }

        // Play selected song
        function playSong(songId) {
            const song = songs[songId];
            console.log(`Attempting to play: ${song.name} - ${song.songTitle}`);
            
            // Stop current audio if playing
            if (currentAudio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
                currentAudio = null;
            }
            
            // Update display first
            updateDisplay(songId);
            
            // Create new audio element
            currentAudio = new Audio();
            currentAudio.volume = isMuted ? 0 : currentVolume;
            currentAudio.preload = 'auto';
            
            // Handle successful load
            currentAudio.addEventListener('canplaythrough', () => {
                console.log(`Audio loaded successfully: ${song.songTitle}`);
            });
            
            // Handle load errors
            currentAudio.addEventListener('error', (e) => {
                console.log(`Audio load error for ${song.songTitle}:`, e);
                console.log(`Trying URL: ${song.url}`);
                // Still update UI for demo purposes
                isPlaying = true;
                playPauseBtn.textContent = '⏸';
            });
            
            // Handle audio end event
            currentAudio.addEventListener('ended', () => {
                isPlaying = false;
                if (playPauseBtn) playPauseBtn.textContent = '▶';
                console.log(`Song ended: ${song.songTitle}`);
            });
            
            // Set source and attempt to play
            currentAudio.src = song.url;
            
            currentAudio.play().then(() => {
                isPlaying = true;
                if (playPauseBtn) playPauseBtn.textContent = '⏸';
                console.log(`Now playing: ${song.name} - ${song.songTitle}`);
            }).catch(error => {
                console.log('Audio playback failed:', error);
                console.log(`File URL attempted: ${song.url}`);
                // For demo purposes, still update the UI
                isPlaying = true;
                if (playPauseBtn) playPauseBtn.textContent = '⏸';
                console.log(`Demo mode: ${song.name} - ${song.songTitle}`);
            });
        }

        // Toggle play/pause
        function togglePlayPause() {
            console.log('Play/pause button clicked');
            
            if (currentAudio && currentAudio.src) {
                if (isPlaying) {
                    currentAudio.pause();
                    isPlaying = false;
                    playPauseBtn.textContent = '▶';
                    console.log('Audio paused');
                } else {
                    currentAudio.play().then(() => {
                        isPlaying = true;
                        playPauseBtn.textContent = '⏸';
                        console.log('Audio resumed');
                    }).catch(error => {
                        console.log('Resume failed:', error);
                        // Demo mode
                        isPlaying = true;
                        playPauseBtn.textContent = '⏸';
                        console.log('Demo mode: resumed');
                    });
                }
            } else {
                // No audio loaded, start with current song
                console.log('No audio loaded, starting current song');
                playSong(currentSongId);
            }
        }

        // Toggle mute
        function toggleMute() {
            console.log('Volume button clicked');
            
            if (currentAudio) {
                if (isMuted) {
                    currentAudio.volume = currentVolume;
                    if (volumeSlider) volumeSlider.value = currentVolume * 100;
                    if (volumeBtn) volumeBtn.textContent = '🔊';
                    isMuted = false;
                    console.log('Audio unmuted');
                } else {
                    currentAudio.volume = 0;
                    if (volumeSlider) volumeSlider.value = 0;
                    if (volumeBtn) volumeBtn.textContent = '🔇';
                    isMuted = true;
                    console.log('Audio muted');
                }
            } else {
                // Toggle mute state even without audio
                isMuted = !isMuted;
                if (volumeBtn) {
                    volumeBtn.textContent = isMuted ? '🔇' : '🔊';
                }
                if (volumeSlider) {
                    volumeSlider.value = isMuted ? 0 : currentVolume * 100;
                }
                console.log(`Mute state: ${isMuted}`);
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
            
            // Update volume button icon
            if (volumeBtn) {
                if (volume === 0 || isMuted) {
                    volumeBtn.textContent = '🔇';
                } else if (volume < 0.5) {
                    volumeBtn.textContent = '🔉';
                } else {
                    volumeBtn.textContent = '🔊';
                }
            }
            
            console.log(`Volume updated: ${volume}`);
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
        
        // Close popup when clicking outside
        musicPopup.addEventListener('click', function(e) {
            if (e.target === musicPopup) {
                closeMusicPopupFunc();
            }
        });

        // Song selection
        songButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const songKey = this.getAttribute('data-song');
                console.log(`Song button clicked: ${songKey}`);
                playSong(songKey);
            });
        });

        // Music controls
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

        // Close with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && musicPopup.style.display === 'block') {
                closeMusicPopupFunc();
            }
        });

        // Initialize
        if (volumeSlider) volumeSlider.value = currentVolume * 100;
        if (playPauseBtn) playPauseBtn.textContent = '▶';
        if (volumeBtn) volumeBtn.textContent = '🔊';
        
        // Set initial display
        updateDisplay(currentSongId);
        
        console.log('Music player setup complete');
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
        }, 300000); // 5 minutes

        // Initialize first promo appearance after 5 minutes - only on desktop
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

    addScrollAnimations();
    observeElements();
    setupSmoothScroll();
    setupSwordPopup();
    setupHeaderParallax();
    setupSettingsMenu();
    setupMusicPlayer();
    setupResponsiveBehavior();
    setupTouchGestures();
    setupScrollingImagesClick();
    setupDualScrolling();
    setupFlyingPromo();
});



window.addEventListener('scroll', () => {
    const image = document.querySelector('.tilt-img');
    if (!image) return;

    const rect = image.getBoundingClientRect();
    const windowCenter = window.innerHeight / 2;
    const offset = rect.top + rect.height / 2 - windowCenter;

    const rotateY = Math.max(-15, Math.min(15, offset / 15));
    image.style.transform = `rotateY(${rotateY}deg)`;
});
