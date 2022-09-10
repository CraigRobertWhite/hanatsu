<script setup>
    import '@vidstack/player/define/vds-media.js';
    import '@vidstack/player/define/vds-hls.js';
    import { useAmazon } from '../modules/amazon.js';
    import { onMounted } from 'vue';

    defineProps({
        thumbnail: { type: String, required: true },
        source: { type: Object, required: true },
        tracks: { type: Array[Object], default: () => [] },
    });

    onMounted(() => {
        const { loaded: isAmazonLoaded } = useAmazon();
        const video = document.querySelector('video');
        video.onplay = async () => {
            if (isAmazonLoaded.value) {
                try {
                    await video.requestFullscreen({ navigationUI: 'show' });
                    video.focus();
                } catch (error) {}
            }
        };
    })
</script>

<template>
    <vds-media class="w-full" tabindex="-1">
        <vds-hls controls :poster="`${thumbnail}?${Math.random()}`" class="w-full outline-0">
            <video
                controls
                :poster="`${thumbnail}?${Math.random()}`"
                crossorigin="anonymous"
                class="outline-0 aspect-video"
            >
                <source
                    :src="source.url"
                    type="application/x-mpegURL"
                />
                <track
                    v-for="track in tracks"
                    :key="track.url"
                    :default="track.default"
                    :label="track.label"
                    :srclang="track.srclang"
                    :src="track.url"
                    kind="subtitles"
                />
            </video>
        </vds-hls>
    </vds-media>
</template>

<style scoped>
    ::cue {
        background: none;
        text-shadow: -1px 1px 2px black,
                      1px 1px 2px black,
                      1px -1px 0 black,
                     -1px -1px 0 black;
    }
</style>