<script setup lang="ts">
import { createReusableTemplate } from "@vueuse/core";
import type { ModalProps } from "./index.vue";

const {
    dismissible,
    closable
} = defineProps<ModalProps>();

const isOpen = defineModel<boolean>("open");

const [DefineTemplate, ReuseTemplate] = createReusableTemplate();
</script>

<template>
    <DefineTemplate>
        <slot />
    </DefineTemplate>

    <UModal
        v-model:open="isOpen"
        :dismissible="dismissible"
        :ui="{
            content: 'max-w-[90dvw] h-fit md:max-w-[85dvw] lg:max-w-[75dvw] xl:max-w-[65dvw] w-fit divide-none',
            header: `${closable ? 'pb-0 sm:pb-0 min-h-12' : ''}`,
            body: `${closable ? 'pt-0 sm:pt-0' : ''}`,
        }"
    >
        <template
            v-if="closable"
            #body
        >
            <ReuseTemplate />
        </template>

        <template
            v-else
            #content
        >
            <div class="m-8">
                <ReuseTemplate />
            </div>
        </template>
    </UModal>
</template>