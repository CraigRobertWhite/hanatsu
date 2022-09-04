<template>
    <!-- Navbar -->
    <nav class="max-w-6xl mx-auto py-12 px-4 h-16 flex items-center">
        <img class="h-10 w-auto mr-8" src="../src/assets/hanatsu-white.svg" alt="放つ">
    </nav>

    <!-- Main Content -->
    <main class="max-w-6xl mx-auto pt-10 pb-12 px-4 md:pb-16">
        <RouterView />
    </main>
</template>

<style>
    nav {
        background: linear-gradient(90deg, rgba(0,0,0,0) 10%, rgba(30,30,30,1) 50%, rgba(0,0,0,0) 90%) bottom no-repeat;
        background-size: 100% 2px;
    }
</style>
