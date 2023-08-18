import { reactive, toRefs } from 'vue';
import { storageAvailable } from './util.js';

const state = reactive({
    user: null,
});

/**
 * Sets the value of accessToken
 * @param {string} accessToken
 * @returns undefined
 */
const login = async (accessToken) => {
    if (state.user) return state.user;

    const response = await fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query: `
                query {
                    Viewer {
                        id
                        name
                        avatar {
                            medium
                        }
                    }
                }
            `,
        }),
    });

    if (!response.ok) throw Error(response.statusText);

    state.user = {
        ...(await response.json()).data.Viewer,
        accessToken: accessToken,
    };

    if (storageAvailable('localStorage')) {
        localStorage.setItem('accessToken', accessToken);
    }

    return state.user;
};

/**
 * Removes the value of accessToken
 * @returns undefined
 */
const logout = () => {
    if (storageAvailable('localStorage')) {
        localStorage.removeItem('accessToken');
    }
    state.user = null;
};

export default {
    ...toRefs(state),
    login,
    logout,
};
