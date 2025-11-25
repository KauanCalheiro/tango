<script setup lang="ts">
import type { ModalProps } from './index.vue';

const { closable } = defineProps<ModalProps>();

const isOpen = defineModel<boolean>("open");
</script>

<template>
    <UDrawer
        v-model:open="isOpen"
        :handle="true"
        class="max-h-[85dvh]"
        should-scale-background
        set-background-color-on-scale
    >
        <template #body>
            <slot />
        </template>
    </UDrawer>
</template>