<script setup>
    import {
        faCalendarDay,
        faCheck,
        faCircleNotch,
        faPause,
        faPlay,
        faQuestion,
        faStar,
        faTriangleExclamation,
        faXmark,
    } from '@fortawesome/free-solid-svg-icons';
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
    import Modal from './Modal.vue';
    import { reactive, watch, watchEffect } from 'vue';
    import VideoPlayer from './VideoPlayer.vue';

    const props = defineProps({
        animeId: { type: String },
    });

    defineEmits({
        close: null,
    });

    const state = reactive({
        loading: true,
        loadingError: null,
        loadingEpisode: false,
        loadingEpisodeError: null,
        // ---
        anime: null,
        openedEpisode: null,
    });

    watchEffect(async() => {
        if (props.animeId) {
            state.loading = true;
            state.loadingEpisode = false;
            state.loadingError = state.loadingEpisodeError = null;
            state.anime = null;
            state.openedEpisode = null;

            try {
                const response = await fetch(`https://consumet-api.herokuapp.com/meta/anilist/info/${props.animeId}?provider=zoro`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                state.anime = await response.json();
            } catch (error) {
                state.loadingError = error;
            } finally {
                state.loading = false;
            }
        }
    });

    const loadEpisode = async (episodeId) => {
        state.openedEpisode = { id: episodeId };
        state.loadingEpisode = true;
        state.loadingEpisodeError = null;

        try {
            const response = await fetch(`https://consumet-api.herokuapp.com/anime/zoro/watch?episodeId=${episodeId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const { sources, subtitles } = await response.json();
            state.openedEpisode = {
                id: episodeId,
                source: sources.find(source => source.isM3U8 && source.quality === 'auto'),
                tracks: subtitles.filter(track => track.lang !== 'Thumbnails').map(track => ({
                    url: track.url,
                    kind: 'subtitles',
                    label: track.lang,
                    srclang: track.lang.substring(0, 2).toLowerCase(),
                    'default': track.lang === 'English',
                })),
            };
            if (!state.openedEpisode.source) {
                throw Error('Failed to find valid source for video')
            }
        } catch (error) {
            state.loadingEpisodeError = error;
        } finally {
            state.loadingEpisode = false;
        }
    }

    const getStatusIcon = (type) => {
        switch(type) {
            case 'Ongoing':
                return faPlay;
            case 'Completed':
                return faCheck;
            case 'Hiatus':
                return faPause;
            case 'Cancelled':
                return faXmark;
            case 'Not yet aired':
                return faCalendarDay;
            default:
                return faQuestion;
        }
    };

    const getStatusClass = (type) => {
        switch(type) {
            case 'Ongoing':
                return 'text-blue-600';
            case 'Completed':
                return 'text-green-500';
            case 'Hiatus':
                return 'text-orange-500';
            case 'Cancelled':
                return 'text-red-500';
            default:
                return faQuestion;
        }
    };
</script>

<template>
    <Modal v-if="!!animeId" :is-open="!!animeId" size="md" @close="$emit('update:animeId', null)" class="text-white">
        <div v-if="state.loading" class="flex h-24 items-center justify-center">
            <FontAwesomeIcon :icon="faCircleNotch" size="2xl" class="text-red-600 animate-spin" />
        </div>
        <div v-else-if="state.loadingError" class="h-96 flex flex-col items-center justify-center">
            <FontAwesomeIcon :icon="faTriangleExclamation" size="2xl" class="text-red-600" />
            <h6 class="sm:text-xl font-medium mt-2 mb-4">An error occurred</h6>
            <code>{{ state.loadingError }}</code>
        </div>
        <template v-else>
            <div class="relative">
                <button
                    @click="$emit('update:animeId', null)"
                    class="absolute right-0 py-2 px-4 m-2 backdrop-blur rounded-lg"
                >
                    <FontAwesomeIcon :icon="faXmark" size="2xl" />
                </button>
                <div class="absolute bottom-0 h-20 w-full bg-gradient-to-b from-transparent to-neutral-900"></div>
                <img
                    :src="state.anime.cover"
                    :alt="state.anime.title.userPreferred"
                    class="w-full h-80 object-cover object-center"
                >
            </div>
            <div class="py-4 px-8 space-y-6">
                <h4 class="text-4xl font-medium">{{ state.anime.title.userPreferred }}</h4>
                <div class="grid grid-cols-3 gap-4">
                    <div class="col-span-2">
                        <div class="flex items-center space-x-2 mb-8">
                            <span>{{ state.anime.releaseDate }}</span>
                            <span class="ring-1 ring-white px-2">{{ state.anime.type }}</span>
                            <span>
                                {{ state.anime.totalEpisodes }}
                                {{ state.anime.totalEpisodes > 1 ? 'Episodes' : 'Episode' }}
                            </span>
                            <div>
                                <FontAwesomeIcon
                                    :icon="getStatusIcon(state.anime.status)"
                                    class="mr-1"
                                    :class="getStatusClass(state.anime.status)"
                                />
                                {{ state.anime.status }}
                            </div>
                            <div>
                                <FontAwesomeIcon :icon="faStar" class="text-red-600 mr-1" />
                                {{ Math.round(state.anime.rating + Number.EPSILON) / 10 }}
                            </div>
                        </div>
                        <p v-html="state.anime.description"></p>
                    </div>
                    <div class="flex">
                        <span class="text-neutral-500 mr-2">Genres:</span>
                        <p>{{ state.anime.genres.join(', ') }}</p>
                    </div>
                </div>
                <h5 class="text-3xl font-medium mb-4">Episodes</h5>
                <ul class="divide-y divide-neutral-800">
                    <li
                        v-for="episode in state.anime.episodes"
                        :key="episode.id"
                        @click="state.openedEpisode?.id !== episode.id && loadEpisode(episode.id)"
                        class="hover:bg-neutral-800"
                        :class="state.openedEpisode?.id === episode.id && 'bg-neutral-800'"
                        tabindex=0
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
                                    <h6 class="text-lg font-medium">
                                        {{ episode.title || `Episode ${episode.number}` }}
                                    </h6>
                                    <p class="text-neutral-200">
                                        {{ episode.description || 'No Description' }}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <template v-if="state.openedEpisode?.id === episode.id">
                            <Transition
                                enter-active-class="duration-300 ease-out"
                                enter-from-class="transform opacity-0"
                                enter-to-class="opacity-100"
                                leave-active-class="duration-200 ease-in"
                                leave-from-class="opacity-100"
                                leave-to-class="transform opacity-0"
                                mode="out-in"
                            >
                                <div v-if="state.loadingEpisode" class="flex aspect-video items-center justify-center">
                                    <FontAwesomeIcon :icon="faCircleNotch" size="2xl" class="text-red-600 animate-spin" />
                                </div>
                                <div
                                    v-else-if="state.loadingEpisodeError"
                                    class="aspect-video flex flex-col items-center justify-center"
                                >
                                    <FontAwesomeIcon :icon="faTriangleExclamation" size="2xl" class="text-red-600" />
                                    <h6 class="sm:text-xl font-medium mt-2 mb-4">An error occurred</h6>
                                    <code>{{ state.loadingEpisodeError }}</code>
                                </div>
                                <VideoPlayer
                                    v-else
                                    :thumbnail="episode.image"
                                    :source="state.openedEpisode.source"
                                    :tracks="state.openedEpisode.tracks"
                                    class="px-3"
                                />
                            </Transition>
                        </template>
                    </li>
                </ul>
            </div>
        </template>
    </Modal>
</template>
