<template>
    <h1>Testy Dust Gurst</h1>
    <DataTable :value="artists">
        <Column field="artist" header="Artist" :sortable="true"></Column>
        <Column field="count" header="Count" :sortable="true"></Column>
    </DataTable>
</template>
  
<script>

export default {
    data() {
        return {
            token: null,
            tracks: [],
            artists: null,
        }
    },
    mounted() {
        console.log('here')
        this.getToken()
    },
    methods: {
        getToken() {
            // get token
            var myHeaders = new Headers()
            myHeaders.append(
                'Authorization',
                'Basic ZTU0NjlmMjY5MzViNDQ3OWIxZDhmNTI1OTUyYjE0ZjI6OGFhM2Q4OGZkY2RlNGYxNmExM2Q3N2QyYWJhNzI0YWE='
            )
            myHeaders.append('Content-Type', 'application/x-www-form-urlencoded')
            myHeaders.append(
                'Cookie',
                '__Host-device_id=AQBri1yo6lP4nwGSwtM67CbUF_EOoHE4i58H_EEGSFBSkuYicFO8UKgrSD-0inlGYUyI6ZF3AxiZtRYICmySHZl6zG6PKzmY6TE; sp_tr=false'
            )

            var urlencoded = new URLSearchParams()
            urlencoded.append('grant_type', 'client_credentials')

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: urlencoded,
                redirect: 'follow'
            }

            fetch('https://accounts.spotify.com/api/token', requestOptions)
                .then((response) => response.text())
                .then((result) => {
                    const jsonApiToken = JSON.parse(result)
                    this.token = jsonApiToken.access_token
                    this.getPlaylistTracks(0)
                })
                .catch((error) => console.log('error', error))
        },
        getPlaylistTracks(offset) {
            var myHeaders = new Headers()
            myHeaders.append('Authorization', 'Bearer ' + this.token)

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            }

            fetch(
                `https://api.spotify.com/v1/playlists/2NsboFJhs1WOo8gt5RjW0y/tracks?offset=${offset}`,
                requestOptions
            )
                .then((response) => response.text())
                .then((result) => {
                    const jsonPlaylist = JSON.parse(result)
                    console.log(jsonPlaylist.items)
                    //this.tracks.concat(jsonPlaylist.items)
                    Array.prototype.push.apply(this.tracks, jsonPlaylist.items);
                    if (jsonPlaylist.items.length == 100) {
                        this.getPlaylistTracks(100)
                    } else {
                        console.log(this.tracks)
                        this.sortByArtist()
                    }
                })
                .catch((error) => console.log('error', error))
        },
        sortByArtist() {
            let testy = []
            this.tracks.map((currentValue, index, arr) => {

                //currentValue.track.artists[0].name

                function upsert(array, element) { // (1)
                    console.log()
                    const i = array.findIndex(_element => _element.artist === element.artist);
                    if (i > -1) array[i].count = array[i].count + 1; // (2)
                    else array.push(element);
                }

                let neue = { artist: currentValue.track.artists[0].name, count: 1 }
                upsert(testy, neue)
            })
            console.log("testy: ", testy)

            this.artists = testy
        }
    }
}
</script>
  