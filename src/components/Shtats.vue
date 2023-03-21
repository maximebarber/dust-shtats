<template>
  <main>
    <Accordion :activeIndex="0">
      <AccordionTab header="Info about all the tracks">
        <TracksInfo :tracks="this.tracksDetailsAndAudioFeaturesCombined" />
      </AccordionTab>
      <AccordionTab header="Info about the artists">
        <ArtistCount :artists="this.artists" />
      </AccordionTab>
    </Accordion>
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
      tracksAudioFeatures: [],
      tracksDetailsAndAudioFeaturesCombined: [],
      artists: null,
    }
  },
  beforeCreate() {
  },
  created() {
  },
  beforeMount() {
    this.token = localStorage.getItem('access_token')
    //this.token = localStorage.getItem('token')
    this.getPlaylistTracks(0)
  },
  mounted() {
  },
  beforeUpdate() {
  },
  updated() {
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

              fetch("https://api.spotify.com/v1/users/" + currentValue.added_by.id, requestOptions)
                .then(response => response.text())
                .then((result) => {
                  const jsonUserProfile = JSON.parse(result)
                  const addedBy = jsonUserProfile.display_name

                  const track = {
                    id: trackId,
                    artist: trackArtist,
                    name: trackName,
                    addedBy: addedBy,
                  }

                  tracksDetailsTemp.push(track)
                })
                .catch(error => console.log('error', error));

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
          jsonTrackAudioFeatures.audio_features.map((currentTrack) => {
            this.tracksAudioFeatures.push(currentTrack)
          })

          // Combine audio features with track details
          let merged = [];
          for (let i = 0; i < this.tracksAudioFeatures.length; i++) {
            merged.push({
              ...this.tracksAudioFeatures[i],
              ...(this.tracksDetails.find((itmInner) => itmInner.id === this.tracksAudioFeatures[i].id))
            });
          }
          this.tracksDetailsAndAudioFeaturesCombined = merged
        })
        .catch(error => console.log('error', error));

    },
  },
}
</script>
  