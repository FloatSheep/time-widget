<template>
  <div>
    <a-config-provider
      :theme="{
        token: {
          colorPrimary: '#0F6CBD',
          fontFamily: `LXGW WenKai Screen, sans-serif`,
          fontSize: 16,
          colorBgContainer: 'transparent',
          lineWidth: 0,
          fontWeightStrong: 900
        }
      }"
    >
      <router-view></router-view>
    </a-config-provider>
  </div>
</template>
