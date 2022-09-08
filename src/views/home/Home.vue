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
            const response = await fetch('https://consumet-api.herokuapp.com/meta/anilist/trending?perPage=10', {
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
        <section class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 place-items-center gap-4">
            <figure
                v-for="anime in state.trending.results"
                :key="anime.id"
                @click="$emit('openAnime', anime.id)"
                class="relative h-60 sm:h-80 w-full cursor-pointer rounded-2xl overflow-hidden text-white hover:ring-4
                       hover:ring-neutral-600 bg-cover"
                :style="{ backgroundImage: `url(${anime.image})` }"
            >
                <div class="text-sm sm:text-base absolute bottom-0 w-full p-3 backdrop-blur backdrop-brightness-50">
                    {{ anime.title.romaji }}
                </div>
            </figure>
        </section>
    </article>
</template>
