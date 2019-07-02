<template>
    <b-navbar v-if="!embedded" toggleable="md" fixed="bottom" variant="light">
        <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

        <b-navbar-brand to="/"><b-img :src="$withBase('/assets/images/base-token.png')" height="24" /> ETHBadge</b-navbar-brand>

        <b-collapse is-nav id="nav_collapse">
            <b-navbar-nav>
                <b-nav-item to="/create.html">Create your Badge</b-nav-item>
            </b-navbar-nav>

            <b-navbar-nav class="ml-auto">
                <b-nav-item disabled>&copy; 2019</b-nav-item>
                <b-nav-item href="https://vittominacori.github.io/" target="_blank">@vittominacori</b-nav-item>
                <b-nav-item :to="$withBase('detail.html?address=0x158D6727B17aaBa726D7318ac7dcA5edf8fAf6f8')">Donate</b-nav-item>
                <b-nav-item href="https://github.com/vittominacori/ethereum-badge" target="_blank">Source code</b-nav-item>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</template>

<script>
  import browser from '../mixins/browser';

  export default {
    name: 'Footer',
    mixins: [
      browser,
    ],
  };
</script>
