let currentsong = new Audio();
let Songs;
let currfolder;

//Duration Function From ChatGPT
function formatTime(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function getFormattedTime(currentTime, duration) {
    const formattedCurrentTime = formatTime(currentTime);
    const formattedDuration = formatTime(duration);
    return `${formattedCurrentTime} / ${formattedDuration}`;
}
//
document.addEventListener('DOMContentLoaded', function() {
    const linkedinLogo = document.querySelector('.linkedin');

    if (linkedinLogo) {
        linkedinLogo.addEventListener('click', function() {
            window.location.href = 'https://www.linkedin.com/in/pushpraj-srivastav/'; 
            // Replace with your LinkedIn profile URL
        });
    } else {
        console.error('LinkedIn logo element not found');
    }
});


async function getSongs(folder) {
    currfolder = folder;
    let a = await fetch(`/${folder}/`)
    let b = await a.text()

    let div = document.createElement("div");
    div.innerHTML = b;
    let as = div.getElementsByTagName("a")
    Songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            Songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    let currentPlaying = null; // Variable to track the currently playing song

    // Show all the songs in the playlists
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    songul.innerHTML = ""; // Clear existing songs
    for (const song of Songs) {
        songul.innerHTML += `
            <li>
                <img class="invert" src="./SVG/musicsvg.svg" alt="">
                <div class="info">
                    <div>${song.replaceAll("%20", " ")}</div>
                </div>
                <div class="playnow">
                    <img class="invert" src="./SVG/paly.svg" alt="Play" data-action="play">
                </div> 
            </li>`;
    }
    
    // Attach an event listener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", function() {
            const songTitle = e.querySelector(".info").firstElementChild.innerHTML.trim();
            
            // Stop current song if it's playing
            if (currentPlaying && currentPlaying !== e) {
                currentPlaying.querySelector(".playnow img").setAttribute("src", "./SVG/paly.svg"); // Change to play button
                currentPlaying.style.borderColor = "white";
            }
    
            // Play the selected song
            playmusic(songTitle);
            e.querySelector(".playnow img").setAttribute("src","./SVG/restart.svg"); // Change to pause button
            e.style.border = "2px solid lightgreen";
    
            // Update currentPlaying
            currentPlaying = e;
        });
    });
    
    
    
    return Songs
}
const playmusic = (track) => {
    // let audio = new Audio("/Songs/"+track)
    currentsong.src = `/${currfolder}/` + track
    currentsong.play()
    play.src = "./SVG/pause.svg"

    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtimer").innerHTML = "00:00 / 00:00"
}
// async function displayalbums(){
//     let a = await fetch("http://192.168.1.6:3000/songs/")
//     let b = await a.text()
//     let div = document.createElement("div");
//     div.innerHTML = b;

//     let anchors = div.getElementsByTagName("a")
//     Array.from(anchors).forEach(e=>{
//         if(e.href.includes("/songs")){
//             console.log(e.href.split("/").slice(-2)[0]);
//         }
//     })
//     // console.log(div);
// } 

async function displayAlbums() {
    let a = await fetch(`/Songs/`)
    let b = await a.text();
    let div = document.createElement("div")
    div.innerHTML = b;
    let anchors = div.getElementsByTagName("a")    
    let cardcontainor = document.querySelector(".cardContainor")
    let array = Array.from(anchors)     
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
        if(e.href.includes("/Songs")&& !e.href.includes(".htaccess")){
            let folder = e.href.split("/Songs/").slice(-2)[1]
             // Get the metadata of the folder
             let a = await fetch(`/Songs/${folder}/info.json`) 
             let b = await a.json();
            //  console.log(b);
             cardcontainor.innerHTML = cardcontainor.innerHTML + ` <div data-folder="${folder}" class="card">
                        <div class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48"
                                fill="none">
                                <!-- Light green background circle -->
                                <circle cx="12" cy="12" r="12" fill="lightgreen" />
                                <!-- Path element -->
                                <path
                                    d="M15.4531 12.3948C15.3016 13.0215 14.5857 13.4644 13.1539 14.3502C11.7697 15.2064 11.0777 15.6346 10.5199 15.4625C10.2893 15.3913 10.0793 15.2562 9.90982 15.07C9.5 14.6198 9.5 13.7465 9.5 12C9.5 10.2535 9.5 9.38018 9.90982 8.92995C10.0793 8.74381 10.2893 8.60868 10.5199 8.53753C11.0777 8.36544 11.7697 8.79357 13.1539 9.64983C14.5857 10.5356 15.3016 10.9785 15.4531 11.6052C15.5156 11.8639 15.5156 12.1361 15.4531 12.3948Z"
                                    stroke="black" stroke-width="1.5" stroke-linejoin="round" />
                            </svg>


                        </div>
                        <img src="/Songs/${folder}/assakoda.jpeg" alt="">
                        <h2>${b.title}</h2>
                        <p>${b.Description}</p>
                    </div>`
        }
    }
    //Loading The Playlist when Card is Clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        // console.log(e); 
        e.addEventListener("click", async item => {
            console.log("Fetch Songs");
            Songs = await getSongs(`Songs/${item.currentTarget.dataset.folder}`)
            playmusic(Songs[0])
        })
     })
}

async function main() { 
    Songs = await getSongs("songs/")
    // playmusic(Songs[0], true)
    // console.log(Songs);
    
    //Display All the albums 
    displayAlbums() 


    //Attach and event Listener to Play , Next & Previous
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "./SVG/pause.svg"
        } else {
            currentsong.pause()
            play.src = "./SVG/paly.svg"
        }
    })
    //Listen for Time Update
    currentsong.addEventListener("timeupdate", (a) => {
        if (!isNaN(currentsong.duration)) {  // Ensure duration is not NaN
            document.querySelector(".songtimer").innerHTML = getFormattedTime(currentsong.currentTime, currentsong.duration);
        }
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    });
    //Add a Listener for seekbar
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        document.querySelector(".circle").style.left = (e.offsetX / e.target.getBoundingClientRect().width) * 100 + "%";

        currentsong.currentTime = ((currentsong.duration) * (e.offsetX / e.target.getBoundingClientRect().width) * 100) / 100;

    })

    //Add a Event Listener to Hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-2%"
    })

    //Add a Event Listener to Close Hamburger
    document.querySelector(".cancel").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%"
    })

    //Add an Event Listener To Pre & Next
    previous.addEventListener("click", () => {
        // console.log('Hello Pre');
        // console.log(currentsong.src);
        // console.log(Songs);
        let index = Songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playmusic(Songs[index - 1])
        };

    })

    next.addEventListener("click", () => {
        // console.log('Hello Nxt');
        // console.log(currentsong.src);
        // console.log(currentsong.src.split("/"));
        // console.log(currentsong.src.split("/").slice(-1)[0]);
        let index = Songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index + 1) < Songs.length) {
            playmusic(Songs[index + 1])
        };
    })
}
main()
