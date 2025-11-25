<script setup lang="ts">
import { ModalDesktop, ModalMobile } from '#components';

export interface ModalProps {
  dismissible?: boolean;
  closable?: boolean;
}

const {
    dismissible = false,
    closable = false
} = defineProps<ModalProps>();

const isOpen = defineModel<boolean>("open");

const { isMobile } = useDevice();

const ModalFacade = computed(() => {
    return isMobile.value
        ? ModalMobile
        : ModalDesktop
})
</script>

<template>
    <ModalFacade
        v-model:open="isOpen"
        :dismissible="dismissible"
        :closable="closable"
    >
        <slot />
    </ModalFacade>
</template>
