// ==UserScript==
// @name         Smooth Auto Scroll with Speed Control
// @namespace    https://example.com/
// @version      1.3
// @description  Smooth auto scroll with speed control and adaptive UI colors using requestAnimationFrame.
// @author       YourName
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', () => {
        let scrolling = false;
        let lastTimestamp = null;
        let scrollSpeed = 100; // Pixel per second

        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.bottom = '20px';
        container.style.right = '20px';
        container.style.zIndex = '10000';
        container.style.padding = '10px';
        container.style.borderRadius = '8px';
        container.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
        container.style.fontFamily = 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif';
        container.style.userSelect = 'none';
        container.style.minWidth = '180px';

        function updateColors() {
            const bgColor = window.getComputedStyle(document.body).backgroundColor;
            const rgb = bgColor.match(/\d+/g);
            if (!rgb) {
                container.style.backgroundColor = '#fff';
                container.style.color = '#000';
                return;
            }
            const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
            if (brightness > 180) {
                container.style.backgroundColor = '#fff';
                container.style.color = '#000';
                toggleBtn.style.backgroundColor = '#007bff';
                toggleBtn.style.color = '#fff';
            } else {
                container.style.backgroundColor = '#222';
                container.style.color = '#eee';
                toggleBtn.style.backgroundColor = '#3399ff';
                toggleBtn.style.color = '#fff';
            }
        }

        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = 'Start Scroll';
        toggleBtn.style.width = '100%';
        toggleBtn.style.padding = '6px';
        toggleBtn.style.marginBottom = '8px';
        toggleBtn.style.border = 'none';
        toggleBtn.style.borderRadius = '4px';
        toggleBtn.style.cursor = 'pointer';
        toggleBtn.style.fontSize = '14px';
        toggleBtn.style.fontWeight = '600';

        const speedLabel = document.createElement('label');
        speedLabel.textContent = 'Speed (pixels/sec): ';
        speedLabel.style.fontSize = '13px';
        speedLabel.style.display = 'block';
        speedLabel.style.marginBottom = '4px';

        const speedValue = document.createElement('span');
        speedValue.textContent = scrollSpeed;
        speedValue.style.fontWeight = '600';

        speedLabel.appendChild(speedValue);

        const speedSlider = document.createElement('input');
        speedSlider.type = 'range';
        speedSlider.min = '10';
        speedSlider.max = '1000';
        speedSlider.value = scrollSpeed;
        speedSlider.step = '10';
        speedSlider.style.width = '100%';
        speedSlider.style.marginBottom = '4px';

        speedSlider.oninput = () => {
            scrollSpeed = parseInt(speedSlider.value);
            speedValue.textContent = scrollSpeed;
        };

        function scrollStep(timestamp) {
            if (!lastTimestamp) lastTimestamp = timestamp;
            const delta = timestamp - lastTimestamp;
            lastTimestamp = timestamp;

            const distance = (scrollSpeed * delta) / 1000;
            window.scrollBy(0, distance);

            if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
                stopScroll();
                return;
            }

            if (scrolling) {
                requestAnimationFrame(scrollStep);
            }
        }

        function startScroll() {
            if (scrolling) return;
            scrolling = true;
            lastTimestamp = null;
            toggleBtn.textContent = 'Stop Scroll';
            requestAnimationFrame(scrollStep);
        }

        function stopScroll() {
            scrolling = false;
            toggleBtn.textContent = 'Start Scroll';
        }

        toggleBtn.onclick = () => {
            if (scrolling) stopScroll();
            else startScroll();
        };

        container.appendChild(toggleBtn);
        container.appendChild(speedLabel);
        container.appendChild(speedSlider);
        document.body.appendChild(container);

        updateColors();

        const observer = new MutationObserver(() => {
            updateColors();
        });
        observer.observe(document.body, { attributes: true, attributeFilter: ['style', 'class'] });
    });

})();
