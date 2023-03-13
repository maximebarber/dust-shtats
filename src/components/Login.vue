<template>
  <div>
    <Button label="Submit" @click="getToken()" />
    <h2>{{ token }}</h2>
  </div>
</template>
<script>
export default {
  data() {
    return {
      token: null,
    }
  },
  methods: {
    handleClick: function () {
      console.log("here")
    },
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
        })
        .catch((error) => console.log('error', error))
    },
  }
}
</script>