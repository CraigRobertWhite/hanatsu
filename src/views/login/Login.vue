<script setup>
    import { faCircleNotch, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
    import { onBeforeMount, reactive } from 'vue';
    import auth from '../../auth.js';
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
    import { useRouter } from 'vue-router';

    const router = useRouter();

    const state = reactive({
        loading: true,
        loadingError: null,
    });

    onBeforeMount(async () => {
        try {
            auth.login((new URLSearchParams(location.hash.slice(1))).get('access_token'))

            await router.push({ name: 'home' });
        } catch (error) {
            state.loadingError = error;
        } finally {
            state.loading = false;
        }
    })
</script>

<template>
    <div v-if="state.loading" class="flex h-[50vh] items-center justify-center">
        <FontAwesomeIcon :icon="faCircleNotch" size="2xl" class="text-red-600 animate-spin" />
    </div>
    <div v-else-if="state.loadingError" class="aspect-video flex flex-col items-center justify-center">
        <FontAwesomeIcon :icon="faTriangleExclamation" size="2xl" class="text-red-600" />
        <h6 class="sm:text-xl font-medium mt-2 text-white">An error occurred</h6>
        <code class="text-white">{{ state.loadingError }}</code>
    </div>
</template>
