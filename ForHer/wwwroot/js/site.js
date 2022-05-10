var AUTHORIZE = "https://accounts.spotify.com/authorize"
var TOKEN = "https://accounts.spotify.com/api/token";
var PLAY = "https://api.spotify.com/v1/me/player/play";
var PAUSE = "https://api.spotify.com/v1/me/player/pause";
var NEXT = "https://api.spotify.com/v1/me/player/next";
var PREVIOUS = "https://api.spotify.com/v1/me/player/previous";
var PLAYER = "https://api.spotify.com/v1/me/player";
var SHUFFLE = "https://api.spotify.com/v1/me/player/shuffle";
var TRACKS = "https://api.spotify.com/v1/playlists/{{PlaylistId}}/tracks";

var redirect_uri = "https://localhost:5001/";


var client_id = "efcea45a56bf49d5aacc5e35acffae4b";
var client_secret = "e44bd059ff3d4ee4982165b6fe051d4d";
var access_token = null;
var refresh_token = null;
var todaySongs = new Array();
var songsNames = new Array();
var playlistId = "";
var userId = "";

async function onPageLoad() {
    client_id = "efcea45a56bf49d5aacc5e35acffae4b";
    fetchKeys();
    console.log(client_secret);
    fetchSongs();
    getUserId();
    checkPlaylists(0);
    if (window.location.search.length > 0) {
        handleRedirect();
    }
    else {
        access_token = localStorage.getItem("access_token");
        if (access_token == null) {
            requestAuthorization();
        }
    }

    document.getElementById("submitSongs").addEventListener("click", submitSongs);
}

function handleRedirect() {
    let code = getCode();
    fetchAccessToken(code);
    window.history.pushState("", "", redirect_uri); // remove param from url
}

function getCode() {
    let code = null;
    const queryString = window.location.search;
    if (queryString.length > 0) {
        const urlParams = new URLSearchParams(queryString);
        code = urlParams.get('code')
    }
    return code;
}

    //get functions


    function getDate() {
        var today = new Date();
        //return today.getDate() - 8;
        return 2;
    }

    function getUserId() {
        let url = "https://api.spotify.com/v1/me";
        callSpotifyApi("GET", url, null, handleUserId);
    }

 

    function checkPlaylists(set) {

        if (set == 0) {
            var url = "https://api.spotify.com/v1/me/playlists?limit=50";
            callSpotifyApi("GET", url, null, handleCheckPlaylists);
        }
        else {
            var url = "https://api.spotify.com/v1/me/playlists?limit=50&offset=" + set * 50;
            callSpotifyApi("GET", url, null, handleCheckPlaylists);
        }

    }


    //AUTHORIZATION

    function requestAuthorization() {

        var url = AUTHORIZE;
        url += "?client_id=" + client_id;
        url += "&response_type=code";
        url += "&redirect_uri=" + encodeURIComponent(redirect_uri);
        url += "&show_dialog=true";
        url += "&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private user-library-modify playlist-modify-private";
        window.location.href = url; // Show Spotify's authorization screen
    }

    function callAuthorizationApi(body, key) {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", TOKEN, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.setRequestHeader('Authorization', 'Basic ' + btoa(client_id + ":" + key));
        xhr.send(body);
        xhr.onload = handleAuthorizationResponse;
    }

    function handleAuthorizationResponse() {
        if (this.status == 200) {
            var data = JSON.parse(this.responseText);
            console.log(data);
            var data = JSON.parse(this.responseText);
            if (data.access_token != undefined) {
                access_token = data.access_token;
                localStorage.setItem("access_token", access_token);
            }
            if (data.refresh_token != undefined) {
                refresh_token = data.refresh_token;
                localStorage.setItem("refresh_token", refresh_token);
            }
            onPageLoad();

        }
        else {
            console.log(this.responseText);
            alert(this.responseText);
        }
    }

    //ACCESS TOKEN FUNCTIONS

    function fetchAccessToken(code) {
        let body = "grant_type=authorization_code";
        body += "&code=" + code;
        body += "&redirect_uri=" + encodeURIComponent(redirect_uri);
        body += "&client_id=" + client_id;
        body += "&client_secret=" + client_secret;
        callAuthorizationApi(body, fetchKeys());
    }

    function refreshAccessToken() {
        refresh_token = localStorage.getItem("refresh_token");
        let body = "grant_type=refresh_token";
        body += "&refresh_token=" + refresh_token;
        body += "&client_id=" + client_id;
        callAuthorizationApi(body, fetchKeys());
    }



    //SPOTIFY API CALLS
    function createPlaylist() {
        var url = "https://api.spotify.com/v1/users/" + userId + "/playlists"
        var body = {
            name: "For You",
            description: "I love you, so much. This took a lot time and screaming at my monitor. - the guy who loves you more than anyone else in the world",
            public: false
        }
        callSpotifyApi("POST", url, JSON.stringify(body), handleCreatePlaylist);
    }

  

    // FETCH QUERY BUILDERS
    function fetchSongs() {
        url = redirect_uri + "graphql"
        const query = `
            query(){
	            songs(){
                    date
		            songUri
                    name
	            }
            }
        `;
        callSongApi("POST", url, query)
    }

function fetchKeys() {
    var url = redirect_uri + "graphql"
    var key;
    const query = `
            query(){
	            keys{
                    secret

	            }
            }
        `;
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify({
            query
        })
    }).then(response => {
        return response.json();
    }).then(data => {
        console.log(data.data.keys[0].secret);
        key =data.data.keys[0].secret;
    })
    return key;
}
    
    //API CALL BUILDERS
    var xml = null;

    function callSongApi(method, url, query) {
        fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({
                query
            })
        }).then(response => {
                return response.json();
        }).then(data => {
            handleSongsResponse(data);
        })
        
}

function callKeyApi(method, url, query) {
    

}

   
    function callSpotifyApi(method, url, body, callback) {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
        xhr.onload = callback;
        xhr.send(body);
        
    }


    //


    //UPDATE ELEMENTS

function submitSongs() {
    var a = document.getElementById("loveSongs");
    var b = document.getElementById("sadSongs");
    var c = document.getElementById("hardSongs");
        var song1 = a.options[a.selectedIndex].value;
        var song2 = b.options[b.selectedIndex].value;
        var song3 = c.options[c.selectedIndex].value;
    var sentSongs = [todaySongs[song1], todaySongs[song2], todaySongs[song3]];

    document.getElementById("submitSongs").hidden = true;

    let url = "https://api.spotify.com/v1/playlists/" + playlistId.replace("spotify:playlist:", "") + "/tracks";
        let body = {
            uris: sentSongs,
            position: 0
        };
        callSpotifyApi("POST", url, JSON.stringify(body), handleAddSongs);
    }

    function updateSongElements(songsUris) {
        let url = "https://open.spotify.com/embed/track/";
        for (var i = 0; i < songsUris.length; i++) {
            let current = document.getElementById("song" + i);
            current.src = url + songsUris[i] + "?utm_source=generator";
            
        }
        for (var i = 0; i < document.getElementById("loveSongs").options.length;i++) {
            document.getElementById("loveSongs").options[i].innerHTML = songsNames[i];
        }
        for (var i = 0; i < document.getElementById("sadSongs").options.length; i++) {
            document.getElementById("sadSongs").options[i].innerHTML = songsNames[i+3];
        }
        for (var i = 0; i < document.getElementById("hardSongs").options.length; i++) {
            document.getElementById("hardSongs").options[i].innerHTML = songsNames[i+6];
        }
        
    }


  
  
    //HANDLES

function handleAddSongs() {
    if (this.status == 201) {
        console.log(this.responseText);
    }
    else if (this.status == 401) {
        refreshAccessToken();
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}

    function handleCheckPlaylists() {
        if (this.status == 200) {
            var data = JSON.parse(this.responseText);
            var made = false;
            var playlists = data.items;
            console.log(playlists);
            for (let playlist in playlists) {
                console.log(playlists[playlist].name);
                if (playlists[playlist].name == "For Her") {
                    made = true;
                    playlistId = playlists[playlist].uri;
                    console.log(playlistId);
                }
                    
            }
            if (playlists.length >= 50)
                checkPlaylists(1);
            if (!made)
                createPlaylist();
        }
        else if (this.status == 401) {
            refreshAccessToken()
        }
        else {
            console.log(this.responseText);
            alert(this.responseText);
        }
    }

    function handleCreatePlaylist() {
        if (this.status == 201) {
            var data = JSON.parse(this.responseText);
            console.log(data);
            playlistId = data.uri;
            console.log(playlistId);
        }
        else if (this.status == 401) {
            refreshAccessToken()
        }
        else {
            console.log(this.responseText);
            alert(this.responseText);
        }
    }

    function handleUserId() {
        if (this.status == 200) {
            var data = JSON.parse(this.responseText);
            //console.log(data);
            userId = data.id;
            console.log(userId);
        }
        else if (this.status == 401) {
            refreshAccessToken()
        }
        else {
            console.log(this.responseText);
            alert(this.responseText);
        }
    }


    function handleSongsResponse(data) {
        var songUris = new Array();
        var obj = JSON.stringify(data);
        var count = 0;
        for (var i = 0; i < data.data.songs.length; i++) {
            var song = data.data.songs[i];
            var date = song.date;
            var uri = song.songUri;
            var name = song.name;
            if (date == getDate()) {
                todaySongs[count] = uri;
                songUris[count] = uri.replace("spotify:track:", "");
                songsNames[count] = name;
                count++;
            }
        }
        updateSongElements(songUris);
    }



    function handleApiResponse() {
        if (this.status == 200) {
            console.log(this.responseText);
            
        }
        else if (this.status == 401) {
            refreshAccessToken()
        }
        else {
            console.log(this.responseText);
            alert(this.responseText);
        }
}

function handleKeysResponse(data) {
    
    console.log(data.data.keys[0].secret);
    console.log(client_secret);
}



