<template>
  <div>
    <button v-if="!loggedIn" @click="login">Log in to Shpotify</button>
    <div v-else>
      Logged in as <b>{{ user.display_name }}</b>
      <Button class="login-button" label="Log me out of here fooo" @click="logout"/>
      <Button class="login-button" label="Take me to some juicy shtats" @click="goToShtats"/>
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loggedIn: false,
      user: null
    }
  },
  methods: {
    login() {
      const client_id = 'd5c90c3559e747e598fe18eccc6cd1a0'; // Your client id
      //const redirect_uri = 'http://localhost:4173';
      const redirect_uri = import.meta.env.VITE_REDIRECT_URI;
      const scopes = 'user-read-private user-read-email';
      const url = `https://accounts.spotify.com/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scopes}&response_type=code`;

      window.location.href = url;
    },
    async getToken(code) {
      const client_id = 'd5c90c3559e747e598fe18eccc6cd1a0'; // Your client id
      const client_secret = '643bf177ae114d369d9d3a7eab2fa1fb'; // Your secret
      //const redirect_uri = 'http://localhost:4173'; // Your redirect uri
      const redirect_uri = import.meta.env.VITE_REDIRECT_URI; // Your redirect uri

      const data = {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirect_uri
      };

      const headers = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
      });

      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: headers,
        body: new URLSearchParams(data),
      });

      const tokenData = await response.json();
      console.log("🚀 ~ file: Login.vue:54 ~ getToken ~ tokenData:", tokenData)

      // Store the access token in local storage
      localStorage.setItem('access_token', tokenData.access_token);

      // Fetch the user's profile using the access token
      const headersWithToken = new Headers({
        'Authorization': 'Bearer ' + tokenData.access_token
      });

      const userResponse = await fetch('https://api.spotify.com/v1/me', {
        headers: headersWithToken
      });

      this.user = await userResponse.json();
      this.loggedIn = true;
      console.log(this.user)
    },
    logout() {
      // Clear the access token from local storage
      localStorage.removeItem('access_token');
      this.loggedIn = false;
      this.user = null;
    },
    goToShtats() {
      this.$router.push('/shtats')
    }
  },
  async created() {
    console.log('VITE_REDIRECT_URI: ', import.meta.env.VITE_REDIRECT_URI)
    console.log('PROD?: ', import.meta.env.PROD)
    const code = this.$route.query.code;

    if (code) {
      // If a code is present in the query parameters, exchange it for an access token
      await this.getToken(code);

      // Redirect to the home page to remove the code from the query parameters
      this.$router.push('/');
      //this.$router.push('/shtats');
    } else {
      // Check if there is an access token in local storage
      const access_token = localStorage.getItem('access_token');

      if (access_token) {
        // If an access token is present, fetch the user's profile using it
        const headersWithToken = new Headers({
          'Authorization': 'Bearer ' + access_token
        });

        const userResponse = await fetch('https://api.spotify.com/v1/me', {
          headers: headersWithToken
        });

        this.user = await userResponse.json();
        this.loggedIn = true;
      }
    }
  }
}
</script>

<style>
.login-button {
  display: block;
  margin: 15px auto;
}
</style>
