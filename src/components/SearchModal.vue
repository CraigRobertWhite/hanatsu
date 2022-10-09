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
            state.results = [];
            state.moreResults = false;

            if (!state.search) {
                return;
            }

            try {
                const response = await fetch(`https://api.consumet.org/meta/anilist/advanced-search?query=${state.search}&perPage=6`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) throw Error(response.statusText);
                const { hasNextPage, results } = await response.json();
                state.moreResults = hasNextPage;
                state.results = results;
            } catch (error) {
                state.error = error;
            }

        }, 400);
    };
</script>

<template>
    <Modal v-if="isOpen" :is-open="isOpen" placement="top" @close="$emit('close')" class="text-white text-sm sm:text-base">
        <div class="flex items-center border-b border-neutral-800">
            <input @input="debounceSearch" type="text" class="w-full p-3 bg-neutral-900 outline-0">
            <FontAwesomeIcon :icon="faSearch" size="xl" class="text-neutral-700 px-3" />
        </div>
        <Transition
            enter-active-class="duration-300 ease-out"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="duration-200 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <ul v-if="state.results.length" class="sm:grid grid-cols-2">
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
                        <p class="mb-2">{{ result.title.romaji }}</p>
                        <div class="text-neutral-400">
                            <span class="mr-2">{{ result.releaseDate }}</span>
                            <span class="ring-1 ring-white px-2 pb-0.5">{{ result.type }}</span>
                        </div>
                    </div>
                </li>
            </ul>
        </Transition>
    </Modal>
</template>
