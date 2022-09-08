<script setup>
    import { faSearch } from '@fortawesome/free-solid-svg-icons';
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
    import Modal from './Modal.vue';
    import { reactive, watch } from 'vue';

    const props = defineProps({
        isOpen: { type: Boolean },
    });

    defineEmits({
        close: null,
        openAnime: e => typeof e === 'string',
    });

    const state = reactive({
        error: null,
        // ---
        search: '',
        debounce: null,
        moreResults: false,
        results: [],
    });

    watch(() => props.isOpen, () => {
        state.search = '';
        state.debounce = null;
        state.moreResults = false;
        state.results = [];
    });

    const debounceSearch = (event) => {
        clearTimeout(state.debounce);
        state.debounce = setTimeout(async () => {
            state.search = event.target.value;

            if (!state.search) {
                state.results = [];
                state.moreResults = false;
                return;
            }

            try {
                const response = await fetch(`https://consumet-api.herokuapp.com/meta/anilist/advanced-search?query=${state.search}&perPage=10`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const { hasNextPage, results } = await response.json();
                state.moreResults = hasNextPage;
                state.results = results;
            } catch (error) {
                state.error = error;
            }

        }, 600);
    };
</script>

<template>
    <Modal v-if="isOpen" :is-open="isOpen" placement="top" @close="$emit('close')" class="text-white">
        <div class="flex items-center border-b border-neutral-800">
            <input @input="debounceSearch" type="text" class="w-full p-3 bg-neutral-900 outline-0">
            <FontAwesomeIcon :icon="faSearch" size="xl" class="text-neutral-700 px-3" />
        </div>
        <ul class="grid grid-cols-2">
            <li
                v-for="result in state.results"
                :key="result.id"
                @click="$emit('openAnime', result.id); $emit('close')"
                class="hover:bg-neutral-800 cursor-pointer p-3 flex"
            >
                <img
                    :src="result.image"
                    :alt="`Episode ${result.number}`"
                    class="h-40 w-24 object-cover object-center mr-4"
                >
                <div class="flex flex-col">
                    <p class="mb-1">{{ result.title.romaji }}</p>
                    <small class="text-neutral-400">{{ result.releaseDate }} {{ result.format}}</small>
                </div>
            </li>
        </ul>
    </Modal>
</template>
