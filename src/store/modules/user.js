const state = {
    id: null
};
const mutations = {
    setId(state, id) {
        state.id = id;
    }
};
const actions = {
    setId({
        commit
    }, id) {
        commit('setId', id);
    }
};
export default {
    state,
    mutations,
    actions
};
