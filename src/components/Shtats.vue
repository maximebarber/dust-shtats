<template>
  <main class="m-8 flex flex-wrap justify-content-center">
    <TracksInfo :tracks="this.tracks" class="flex-initial flex align-items-center justify-content-center" />
    <ArtistCount :artists="this.artists" class="flex-initial flex align-items-center justify-content-center" />
  </main>
</template>
  
<script>
import ArtistCount from './ArtistCount.vue'
import TracksInfo from './TracksInfo.vue'

export default {
  components: {
    ArtistCount,
    TracksInfo
  },
  data() {
    return {
      token: null,
      tracks: [],
      tracksDetails: null,
      trackIdsString: [],
      artists: null,
    }
  },
  beforeCreate() {
    console.log("🚀 ~ file: Shtats.vue:24 ~ beforeCreate ~ beforeCreate:", this.token)
  },
  created() {
    this.token = localStorage.getItem('token')
    this.getPlaylistTracks(0)
    console.log("🚀 ~ file: Shtats.vue:28 ~ created ~ created:", this.token)
  },
  beforeMount() {
    console.log("🚀 ~ file: Shtats.vue:31 ~ beforeMount ~ beforeMount:", this.token)
  },
  mounted() {
    console.log("🚀 ~ file: Shtats.vue:34 ~ mounted ~ mounted:", this.token)
  },
  beforeUpdate() {
    console.log("🚀 ~ file: Shtats.vue:37 ~ beforeUpdate ~ beforeUpdate:", this.token)
  },
  updated() {
    console.log("🚀 ~ file: Shtats.vue:41 ~ updated ~ updated:", this.token)
  },
  methods: {
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
          Array.prototype.push.apply(this.tracks, jsonPlaylist.items);
          if (jsonPlaylist.items.length == 100) {
            this.getPlaylistTracks(100)
          } else {
            this.sortByArtist()
            // Add audio features
            let tracksDetailsTemp = []
            let trackIdsTemp = []
            this.tracks.map((currentValue) => {
              trackIdsTemp.push(currentValue.track.id)

              const trackId = currentValue.track.id
              const trackArtist = currentValue.track.artists[0].name
              const trackName = currentValue.track.name

              const track = {
                id: trackId,
                artist: trackArtist,
                name: trackName,
              }

              tracksDetailsTemp.push(track)
            })
            this.tracksDetails = tracksDetailsTemp
            // PUSH INTO ARRAYS OF 100
            if (trackIdsTemp.length > 100) {
              const loopCount = Math.ceil(trackIdsTemp.length / 100)
              let a = 0
              let b = 100
              for (let i = 1; i <= loopCount; i++) {
                this.trackIdsString.push(trackIdsTemp.slice(a, b))
                a += 100
                b += 100
              }
            }
            //console.log("🚀 ~ file: Shtats.vue:126 ~ .then ~ trackIdsString:", this.trackIdsString)
            for (let i = 0; i < this.trackIdsString.length; i++) {
              this.getTrackAudioFeatures(this.trackIdsString[i].join())
            }
          }
        })
        .catch((error) => console.log('error', error))
    },
    sortByArtist() {
      let artistCount = []
      this.tracks.map((currentValue) => {
        function upsert(array, element) { // (1)
          console.log()
          const i = array.findIndex(_element => _element.artist === element.artist);
          if (i > -1) array[i].count = array[i].count + 1; // (2)
          else array.push(element);
        }

        let newArtist = { artist: currentValue.track.artists[0].name, count: 1 }
        upsert(artistCount, newArtist)
      })

      this.artists = artistCount
    },
    getTrackAudioFeatures(trackIds) {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + this.token);

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      fetch("https://api.spotify.com/v1/audio-features?ids=" + trackIds, requestOptions)
        .then(response => response.text())
        .then((result) => {
          const jsonTrackAudioFeatures = JSON.parse(result)
          console.log("🚀 ~ file: Shtats.vue:154 ~ .then ~ jsonTrackAudioFeatures:", jsonTrackAudioFeatures)
          // TODO upsert with to this.tracksDetails
        })
        .catch(error => console.log('error', error));

    },
  },
}
</script>
  