<template>
    <b-row class="mt-4 p-0">
        <b-col lg="8" offset-lg="2">
            <b-jumbotron bg-variant="light" header-level="4">
                <template slot="header">
                    Ethereum Badge
                </template>
                <template slot="lead">
                    {{ $site.title }}
                </template>
                <hr class="my-4">
                <p>Create a button or an embeddable widget for your address</p>
                <b-button size="lg"
                          variant="outline-success"
                          class="mt-2"
                          :to="$withBase('create.html')">
                    Create page
                </b-button>
                <b-button size="lg"
                          variant="outline-primary"
                          class="mt-2"
                          :to="$withBase('detail.html?address=0xB5c64c7d6b374aD738e314eAa7bCC07AEc194B7b')">
                    View sample
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
