<script setup>
    import '@vidstack/player/define/vds-media.js';
    import '@vidstack/player/define/vds-hls.js';

    const props = defineProps({
        thumbnail: { type: String, required: true },
        source: { type: Object, required: true },
        tracks: { type: Array[Object], default: () => [] },
    });

    // UUID query parameter added to avoid Chromium-based browser caching CORS issues
    // Source: https://www.hacksoft.io/blog/handle-images-cors-error-in-chrome
    const thumbnailWithParam = `${props.thumbnail}?${crypto.randomUUID()}`;
</script>

<template>
    <vds-media class="w-full">
        <vds-hls controls :poster="thumbnailWithParam" class="w-full outline-0">
            <video
                controls
                :poster="thumbnailWithParam"
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
    video[poster] {
        object-fit: cover;
    }

    ::cue {
        background: none;
        text-shadow: -1px 1px 2px black,
                      1px 1px 2px black,
                      1px -1px 0 black,
                     -1px -1px 0 black;
    }
</style>
