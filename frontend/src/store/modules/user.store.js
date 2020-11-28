import { userService } from '../../services/user.service';

var localLoggedinUser = userService.getGuest();
if (sessionStorage.user) localLoggedinUser = JSON.parse(sessionStorage.user);

export default {
    state: {
        loggedinUser: localLoggedinUser,
        users: [],
    },
    getters: {
        users(state) {
            console.log(state.users);
            return state.users;
        },
        loggedinUser(state) {
            const user = (!state.loggedinUser) ? state.loggedinUser : userService.getGuest();
            return {
                _id: user._id,
                username: user.username,
                imgUrl: user.imgUrl
            };
        },
        isLogin(state) {
            return state.isLogin;
        }
    },
    mutations: {
        setUser(state, { user }) {
            state.loggedinUser = user;
        },
        setUsers(state, { users }) {
            console.log('getting users', users);
            state.users = users;
        },
        removeUser(state, { userId }) {
            state.users = state.users.filter(user => user._id !== userId);
        }
    },
    actions: {
        async login({ commit }, { userCred }) {
            const user = await userService.login(userCred);
            commit({ type: 'setUser', user });
            return user;
        },
        async signup({ commit }, { userCred }) {
            const user = await userService.signup(userCred)
            commit({ type: 'setUser', user });
            return user;

        },
        async logout({ commit }) {
            await userService.logout()
            commit({ type: 'setUsers', users: [] })
            commit({ type: 'setUser', user: null })
            return;
        },
        async loadUsers({ commit }) {
            const users = await userService.getUsers();
            commit({ type: 'setUsers', users })
        },
        async removeUser({ commit }, { userId }) {
            await userService.remove(userId);
            commit({ type: 'removeUser', userId })
        },
        async updateUser({ commit }, { user }) {
            user = await userService.update(user);
            commit({ type: 'setUser', user })
        }
    }
};