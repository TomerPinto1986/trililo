<template>
    <div>
        <button class="button" @click="logInWithFacebook">
            Login with Facebook
        </button>
    </div>
</template>
<script>
export default {
    name: "facebookLogin",
    methods: {
        logInWithFacebook() {
            window.FB.login(function (response) {
                if (response.authResponse) {
                    console.log('Welcome!  Fetching your information.... ');
                    window.FB.api('/me', function (response) {
                        console.log('Good to see you, ' + response.name + '.');
                        console.log(response);
                    });
                } else {
                    console.log('User cancelled login or did not fully authorize.');
                }
            }, {scope: 'public_profile,email'});

        },

    }
};
</script>
<style>
.button {
    color: white;
    min-width: 150px;
    background-color: #000000a1;
    height: 2.5rem;
    border-radius: 2rem;
    font-weight: 400;
    font-size: 0.8rem;
}
</style>