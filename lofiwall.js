// Simple lofi wall with SoundCloud integration
const TRACKS = [
    {
        embedUrl: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/abediq/jinsang-genesis&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true",
        trackUrl: "https://soundcloud.com/abediq/jinsang-genesis",
        albumCoverUrl: null
    },
    {
        embedUrl: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/jinsangbeats/light-rays&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true",
        trackUrl: "https://soundcloud.com/jinsangbeats/light-rays",
        albumCoverUrl: null
    },
    {
        embedUrl: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/jinsangbeats/far-away&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true",
        trackUrl: "https://soundcloud.com/jinsangbeats/far-away",
        albumCoverUrl: null
    },
    {
        embedUrl: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/retroronin/jinsang-night-breeze&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true",
        trackUrl: "https://soundcloud.com/retroronin/jinsang-night-breeze",
        albumCoverUrl: null
    },
    {
        embedUrl: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/phdflopperguy56-music/jinsang-september-rain&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true",
        trackUrl: "https://soundcloud.com/phdflopperguy56-music/jinsang-september-rain",
        albumCoverUrl: null
    },
    {
        embedUrl: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/user-994134991/egyptian-pools-prod-jinsang&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true",
        trackUrl: "https://soundcloud.com/user-994134991/egyptian-pools-prod-jinsang",
        albumCoverUrl: null
    },
    {
        embedUrl: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/michael-timi-ade/jinsang-morning&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true",
        trackUrl: "https://soundcloud.com/michael-timi-ade/jinsang-morning",
        albumCoverUrl: null
    },
    {
        embedUrl: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/jinsangbeats/affection&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true",
        trackUrl: "https://soundcloud.com/jinsangbeats/affection",
        albumCoverUrl: null
    }
];

// Fetch album cover from SoundCloud oEmbed API
async function fetchAlbumCover(trackUrl) {
    try {
        const response = await fetch(`https://soundcloud.com/oembed?format=json&url=${encodeURIComponent(trackUrl)}`);
        const data = await response.json();
        return data.thumbnail_url ? data.thumbnail_url.replace('-large', '-t500x500') : "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop";
    } catch (error) {
        return "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop";
    }
}

let currentlyPlayingCube = null;
let hiddenPlayer = null;

function createCubes() {
    const grid = document.getElementById('cubeGrid');
    grid.innerHTML = '';
    
    for (let i = 0; i < 8; i++) {
        const cube = document.createElement('div');
        cube.className = 'cube';
        
        const track = TRACKS[i];
        const coverUrl = track.albumCoverUrl || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop";
        
        cube.style.backgroundImage = `url(${coverUrl})`;
        cube.style.backgroundSize = 'cover';
        cube.style.backgroundPosition = 'center';
        cube.style.cursor = 'pointer';
        cube.dataset.trackIndex = i;
        
        cube.addEventListener('click', () => handleCubeClick(cube));
        grid.appendChild(cube);
    }
}

function handleCubeClick(cube) {
    // If clicking the same cube that's playing, stop music
    if (currentlyPlayingCube === cube) {
        stopMusic();
        currentlyPlayingCube = null;
        return;
    }
    
    // Set new playing cube and play music
    currentlyPlayingCube = cube;
    const trackIndex = parseInt(cube.dataset.trackIndex);
    playMusic(TRACKS[trackIndex].embedUrl);
    
    // Add click animation
    cube.style.transform = 'scale(0.95)';
    setTimeout(() => {
        cube.style.transform = '';
    }, 150);
}

function playMusic(embedUrl) {
    if (hiddenPlayer) {
        document.body.removeChild(hiddenPlayer);
    }
    
    hiddenPlayer = document.createElement('iframe');
    hiddenPlayer.style.position = 'fixed';
    hiddenPlayer.style.top = '20px';
    hiddenPlayer.style.left = '50%';
    hiddenPlayer.style.transform = 'translateX(-50%)';
    hiddenPlayer.style.width = '400px';
    hiddenPlayer.style.height = '166px';
    hiddenPlayer.style.border = 'none';
    hiddenPlayer.style.zIndex = '9999';
    hiddenPlayer.style.backgroundColor = 'rgba(0,0,0,0.9)';
    hiddenPlayer.style.borderRadius = '10px';
    hiddenPlayer.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
    hiddenPlayer.setAttribute('allow', 'autoplay');
    hiddenPlayer.src = embedUrl;
    
    document.body.appendChild(hiddenPlayer);
}

function stopMusic() {
    if (hiddenPlayer) {
        document.body.removeChild(hiddenPlayer);
        hiddenPlayer = null;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    for (let i = 0; i < TRACKS.length; i++) {
        TRACKS[i].albumCoverUrl = await fetchAlbumCover(TRACKS[i].trackUrl);
    }
    createCubes();
});

// Recreate cubes on window resize
window.addEventListener('resize', () => {
    setTimeout(() => {
        createCubes();
    }, 100);
});
