<script setup>
    import { onBeforeMount, onUnmounted, reactive } from 'vue';
    import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

    defineEmits({
        openAnime: e => typeof e === 'string',
    });

    const state = reactive({
        loading: true,
        error: null,
        // ---
        search: '',
        // ---
        trending: {},
    });

    const load = async () => {
        state.loading = true;
        state.error = null;
        state.trending = {};

        try {
            const response = await fetch('https://consumet-api.herokuapp.com/meta/anilist/trending?perPage=5', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            state.trending = await response.json();
        } catch (error) {
            state.error = error;
        } finally {
            state.loading = false;
        }
    }

    onBeforeMount(() => load(onUnmounted));
</script>

<template>
    <article v-if="state.trending?.results?.length">
        <h4 class="text-2xl font-medium text-white mb-4">Trending</h4>
        <section class="flex justify-between">
            <figure
                v-for="anime in state.trending.results"
                :key="anime.id"
                @click="$emit('openAnime', anime.id)"
                class="relative cursor-pointer rounded-2xl overflow-hidden text-white hover:ring-4
                       hover:ring-neutral-600"
            >
                <div class="absolute bottom-0 w-full p-3 backdrop-blur backdrop-brightness-50">
                    {{ anime.title.userPreferred }}
                </div>
                <img :src="anime.image"
                     :alt="anime.title.userPreferred"
                     class="h-80 w-48 object-cover">
            </figure>
            <figure class="h-80 w-12 cursor-pointer rounded-l-2xl bg-neutral-800 flex items-center justify-center">
                <FontAwesomeIcon :icon="faChevronRight" class="text-gray-100" size="2xl" />
            </figure>
        </section>
    </article>
</template>
