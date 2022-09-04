<script setup>
    import { faCircleNotch, faStar, faXmark } from '@fortawesome/free-solid-svg-icons';
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
    import Modal from '../../components/Modal.vue';
    import { reactive, watchEffect } from 'vue';
    import '@vidstack/player/define/vds-media.js';
    import '@vidstack/player/define/vds-hls.js';

    const props = defineProps({
        isOpen: { type: Boolean },
        anime: { type: Object },
    });

    defineEmits({
        close: null,
    });

    const state = reactive({
        loadingEpisodes: true,
        loadingEpisodesError: null,
        loadingEpisode: true,
        loadingEpisodeError: null,
        // ---
        episodes: [],
        // ---
        openedEpisode: null,
    });

    watchEffect(async() => {
        if (props.anime) {
            state.loadingEpisodes = true;
            state.loadingEpisodesError = null;
            state.episodes = [];

            try {
                const response = await fetch(`https://consumet-api.herokuapp.com/meta/anilist/episodes/${props.anime.id}?provider=zoro`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                state.episodes = await response.json();
            } catch (error) {
                state.loadingEpisodesError = error;
            } finally {
                state.loadingEpisodes = false;
            }
        }
    });

    const loadEpisode = async (episodeId) => {
        state.loadingEpisode = true;
        state.loadingEpisodeError = null;
        state.openedEpisode = { id: episodeId };

        try {
            const response = await fetch(`https://consumet-api.herokuapp.com/anime/zoro/watch?episodeId=${episodeId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const { sources, subtitles } = await response.json();
            state.openedEpisode = {
                ...state.openedEpisode,
                video_url: sources.find(source => source.quality === 'auto').url,
                subtitles_url: subtitles.find(subtitle => subtitle.lang === 'English').url,
            };
        } catch (error) {
            state.loadingEpisodeError = error;
            state.openedEpisode = null;
        } finally {
            state.loadingEpisode = false;
        }
    }

    const getStatusIcon = (type) => type === 'C' ? 'Sale' : type === 'D' ? 'Credit' : 'Unknown';
</script>

<template>
    <Modal v-if="isOpen" :is-open="isOpen" size="md" @close="$emit('close')">
        <div class="relative">
            <button @click="$emit('close')" class="absolute right-0 py-2 px-4 m-2 backdrop-blur rounded-lg">
                <FontAwesomeIcon :icon="faXmark" size="2xl" class="text-white" />
            </button>
            <div class="absolute bottom-0 h-20 w-full bg-gradient-to-b from-transparent to-neutral-900"></div>
            <img :src="anime.cover" :alt="anime.title.userPreferred" class="w-full h-80 object-cover object-center">
        </div>
        <div class="py-4 px-8 text-white space-y-6">
            <h4 class="text-4xl font-medium">{{ anime.title.userPreferred }}</h4>
            <div class="grid grid-cols-3 gap-4">
                <div class="col-span-2">
                    <div class="flex items-center space-x-2 mb-8">
                        <span>{{ anime.releaseDate }}</span>
                        <span class="ring-1 ring-white px-2">{{ anime.type }}</span>
                        <span>{{ anime.totalEpisodes }} {{ anime.totalEpisodes > 1 ? 'Episodes' : 'Episode' }}</span>
                        <span class="ring-1 ring-white px-2">{{ anime.status }}</span>
                        <div>
                            <FontAwesomeIcon :icon="faStar" class="text-red-600" />
                            {{ Math.round(anime.rating + Number.EPSILON) / 10 }}
                        </div>
                    </div>
                    <p v-html="anime.description"></p>
                </div>
                <div class="flex">
                    <span class="text-neutral-500 mr-2">Genres:</span>
                    <p>{{ anime.genres.join(', ') }}</p>
                </div>
            </div>
            <h5 class="text-3xl font-medium mb-4">Episodes</h5>
            <div v-if="state.loadingEpisodes" class="flex h-24 items-center justify-center">
                <FontAwesomeIcon :icon="faCircleNotch" size="2xl" class="text-red-600 animate-spin" />
            </div>
            <div v-else-if="state.loadingEpisodesError">
                Error
            </div>
            <ul v-else class="divide-y divide-neutral-800">
                <li
                    v-for="episode in state.episodes"
                    :key="episode"
                    @click="state.openedEpisode?.id !== episode.id && loadEpisode(episode.id)"
                    class="hover:bg-neutral-800"
                    :class="state.openedEpisode?.id === episode.id && 'bg-neutral-800'"
                >
                    <div class="p-4 flex items-center cursor-pointer">
                        <h5 class="text-3xl font-medium text-neutral-400 mr-6">{{ episode.number }}</h5>
                        <div class="flex items-center">
                            <img
                                :src="episode.image"
                                :alt="`Episode ${episode.number}`"
                                class="h-16 w-32 object-cover object-center mr-4"
                            >
                            <div>
                                <h6 class="text-lg font-medium">{{ episode.title || `Episode ${episode.number}` }}</h6>
                                <p class="text-neutral-200">{{ episode.description || 'No Description' }}</p>
                            </div>
                        </div>
                    </div>
                    <template v-if="state.openedEpisode?.id === episode.id">
                        <div v-if="state.loadingEpisode" class="flex h-24 items-center justify-center">
                            <FontAwesomeIcon :icon="faCircleNotch" size="2xl" class="text-red-600 animate-spin" />
                        </div>
                        <div v-else-if="state.loadingEpisodeError">
                            Error
                        </div>
                        <vds-media v-else class="w-full px-3">
                            <vds-hls controls :poster="state.episodes[0].image" class="w-full">
                                <video controls :poster="state.episodes[0].image" crossorigin="anonymous">
                                    <source
                                        :src="state.openedEpisode.video_url"
                                        type="application/x-mpegURL"
                                    />
                                    <track
                                        default
                                        kind="subtitles"
                                        srclang="en"
                                        label="English"
                                        :src="state.openedEpisode.subtitles_url"
                                    />
                                </video>
                            </vds-hls>
                        </vds-media>
                    </template>
                </li>
            </ul>
        </div>
    </Modal>
</template>
