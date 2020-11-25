export default {
    state: {
        currUser: {
            "_id": "u101",
            "username": "Abi Abambi",
            "email": "abi@ababmi.com",
            "password": "aBambi123",
            "imgUrl": "http://some-img.jpg"
          }
    },
    getters:{
        user(state){
            return state.currUser
        }
    },
    mutations: {},
    actions: {},

}