<script lang="ts" setup>
</script>
<template>
<div>
  <div class="relative flex">

      <!-- Content -->
      <div class="w-full md:w-1/2">
        <div class="min-h-screen h-full flex flex-col after:flex-1">

          <div class="w-full max-w-sm mx-auto px-4 py-8 flex-1 flex flex-col items-stretch justify-center">
            <slot />
          </div>

        </div>
      </div>

      <!-- Image -->
      <div class="hidden md:block absolute top-0 bottom-0 right-0 md:w-1/2" aria-hidden="true">
        <video autoplay loop class="w-full h-full object-cover opacity-80" src="/login.mp4" />
        <!--
        <img class="object-cover object-center w-full h-full" src="../../assets/cover.jpg" width="760" height="1024" alt="Authentication" />
        -->
        <img class="absolute top-1/4 left-0 transform -translate-x-1/2 ml-8 hidden lg:block" src="../../assets/auth-decoration.png" width="218" height="224" alt="Authentication decoration" />
      </div>

    </div>
</div>
</template>