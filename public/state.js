// state.js
export const AppState = {
    skills: [],
    cache: {},
    get(key) {
        return this[key];
    },
    set(key, value) {
        this[key] = value;
    },
    clear() {
        this.skills = [];
        this.cache = {};
    }
};
