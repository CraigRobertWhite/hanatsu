<script setup>
    import { onBeforeMount, onUnmounted, reactive, watch } from 'vue';
    import { faCircleNotch, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
    import { storageAvailable } from '../../util.js';

    const props = defineProps({
        openedAnimeId: { type: Object, default: null },
    })

    defineEmits({
        'update:openedAnimeId': e => typeof e === 'string',
    });

    const state = reactive({
        loading: true,
        loadingError: null,
        // ---
        search: '',
        // ---
        categories: {},
    });

    const updateContinueWatching = () => {
        if (storageAvailable('localStorage')) {
            const progress = localStorage.getItem('progress');
            if (progress) {
                state.categories['Continue Watching'] = Object.values(JSON.parse(progress));
            }
        }
    }

    watch(() => props.openedAnimeId, (value) => {
        if (!value) {
            updateContinueWatching();
        }
    });

    const load = async () => {
        state.loading = true;
        state.loadingError = null;

        try {
            updateContinueWatching();
            const trendingResponse = await fetch('https://api.consumet.org/meta/anilist/trending?perPage=10', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const popularResponse = await fetch('https://api.consumet.org/meta/anilist/popular?perPage=10', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const recentResponse = await fetch('https://api.consumet.org/meta/anilist/recent-episodes?perPage=10', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            state.categories['Trending'] = (await trendingResponse.json()).results;
            state.categories['Popular'] = (await popularResponse.json()).results;
            state.categories['Recently Released'] = (await recentResponse.json()).results;
        } catch (error) {
            console.log(error)
            state.loadingError = error;
        } finally {
            state.loading = false;
        }
    }

    onBeforeMount(() => load(onUnmounted));
</script>

<template>
    <Transition
        enter-active-class="duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
        mode="out-in"
    >
        <div v-if="state.loading" class="flex h-[50vh] items-center justify-center">
            <FontAwesomeIcon :icon="faCircleNotch" size="2xl" class="text-red-600 animate-spin" />
        </div>
        <div v-else-if="state.loadingError" class="h-[50vh] flex flex-col items-center justify-center text-white">
            <FontAwesomeIcon :icon="faTriangleExclamation" size="2xl" class="text-red-600" />
            <h6 class="sm:text-xl font-medium mt-2 mb-4">An error occurred</h6>
            <code>{{ state.loadingError }}</code>
        </div>
        <div v-else>
            <article v-for="(category, name) in state.categories" :key="name" class="mb-12">
                <h4 class="text-2xl font-medium text-white mb-4">{{ name }}</h4>
                <section class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 place-items-center gap-4">
                    <figure
                        v-for="anime in category"
                        :key="anime.id"
                        @click="$emit('update:openedAnimeId', anime.id)"
                        class="h-60 sm:h-80 w-full cursor-pointer rounded-2xl overflow-hidden text-white hover:ring-4
                       hover:ring-neutral-600 bg-cover flex items-end"
                        :style="{ backgroundImage: `url(${anime.image})` }"
                    >
                        <div class="text-sm sm:text-base w-full p-3 backdrop-blur backdrop-brightness-50">
                            {{ anime.title.romaji }}
                        </div>
                    </figure>
                </section>
            </article>
        </div>
    </Transition>
</template>
