<script setup>
    import AnimeModal from '../src/components/AnimeModal.vue';
    import { faSearch } from '@fortawesome/free-solid-svg-icons';
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
    import { reactive } from 'vue';
    import SearchModal from '../src/components/SearchModal.vue';

    const state = reactive({
        searching: false,
        openedAnimeId: null,
    });
</script>

<template>
    <!-- Navbar -->
    <nav class="max-w-6xl mx-auto py-12 px-4 h-16 flex items-center">
        <img class="h-10 w-auto mr-8" src="../src/assets/hanatsu-white.svg" alt="放つ">
        <button @click="state.searching = true" class="ml-auto py-2 px-3">
            <FontAwesomeIcon :icon="faSearch" size="xl" class="text-white" />
        </button>
    </nav>

    <!-- Main Content -->
    <main class="max-w-6xl mx-auto pt-10 pb-12 px-4 md:pb-16">
        <RouterView @open-anime="state.openedAnimeId = $event" />
    </main>

    <AnimeModal :anime-id="state.openedAnimeId" @update:animeId="state.openedAnimeId = $event" />
    <SearchModal
        :is-open="state.searching"
        @close="state.searching = false"
        @open-anime="state.openedAnimeId = $event"
    />
</template>

<style>
    nav {
        background: linear-gradient(90deg, rgba(0,0,0,0) 10%, rgba(30,30,30,1) 50%, rgba(0,0,0,0) 90%) bottom no-repeat;
        background-size: 100% 2px;
    }
</style>
