<template>
    <b-row class="mt-4 p-0">
        <b-col lg="8" offset-lg="2">
            <b-jumbotron bg-variant="light" header-level="4">
                <template slot="header">
                    ETHBadge
                </template>
                <template slot="lead">
                    {{ $site.title }}
                </template>
                <ui--badge :internal="true" address="0x158D6727B17aaBa726D7318ac7dcA5edf8fAf6f8"></ui--badge>
                <hr class="my-4">
                <p class="lead">Create an Ethereum badge for your address to share or embed in your website.</p>
                <b-button size="lg"
                          variant="outline-info"
                          class="mt-2"
                          :to="$withBase('create.html')">
                    Create your badge
                </b-button>
            </b-jumbotron>
        </b-col>
    </b-row>
</template>

<script>
  export default {
    name: 'Home',
  };
</script>
