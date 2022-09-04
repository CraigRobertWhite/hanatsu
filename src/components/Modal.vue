<script setup>
    import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue';

    defineProps({
        isOpen: { type: Boolean },
        size: { type: String, default: 'sm', validator: val => ['sm', 'md', 'lg'].includes(val) },
    });

    defineEmits({
        close: null,
    });
</script>

<template>
    <TransitionRoot as="template" :show="isOpen">
        <Dialog as="div" class="relative z-50" @close="$emit('close')">
            <TransitionChild
                as="template"
                enter="ease-out duration-300"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="duration-[0s] hidden"
            >
                <div class="fixed inset-0 bg-neutral-800 bg-opacity-75 transition-opacity" />
            </TransitionChild>

            <div class="fixed z-50 inset-0 overflow-y-auto">
                <div class="flex items-end sm:items-center justify-center min-h-full p-4">
                    <TransitionChild
                        as="template"
                        enter="ease-out duration-300"
                        enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enter-to="opacity-100 translate-y-0 sm:scale-100"
                        leave="duration-[0s] hidden"
                    >
                        <DialogPanel
                            class="w-full bg-neutral-900 rounded-lg overflow-hidden shadow-lg text-center sm:text-left
                                   transform transition-all mt-4"
                            :class="{
                                'sm:max-w-lg': size === 'sm',
                                'sm:max-w-4xl': size === 'md',
                            }"
                        >
                            <div v-if="$slots.default">
                                <slot />
                            </div>
                            <div
                                v-if="$slots.actions"
                                class="flex flex-col-reverse sm:flex-row justify-end mt-5 sm:mt-4 space-y-2
                                       space-y-reverse sm:space-x-2 sm:space-y-0"
                            >
                                <slot name="actions" />
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>
