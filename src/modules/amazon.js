import { reactive, toRefs } from 'vue';


export const useAmazon = () => {
    const state = reactive({
        loaded: false,
    });

    const AmazonAPI = document.createElement('script');
    AmazonAPI.setAttribute('src','https://resources.amazonwebapps.com/v1/latest/Amazon-Web-App-API.min.js');
    document.head.appendChild(AmazonAPI);

    document.addEventListener('amazonPlatformReady', () => {
        state.loaded = true;
    });

    return { ...toRefs(state) };
}
