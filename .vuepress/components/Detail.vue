<template>
    <b-row>
        <b-col v-if="loading" lg="6" offset-lg="3" class="mt-4 p-0">
            <b-card bg-variant="light">
                <ui--loader :loading="loading"></ui--loader>
            </b-card>
        </b-col>
        <b-col v-if="!loading && !loaded" lg="6" offset-lg="3" class="mt-4 p-0">
            <b-card bg-variant="light">
                <blockquote>Some error occurred</blockquote>
                <router-link :to="$withBase('create.html')">Try creating your badge</router-link>
            </b-card>
        </b-col>
        <b-col v-if="loaded" lg="6" offset-lg="3" class="mt-4 p-0">
            <b-card bg-variant="light">
                <b-media>
                    <b-img v-if="badge.address" slot="aside" :src="badge.qrcode" width="96" height="96" :alt="badge.address" />
                    <h4 class="card-title">Your address</h4>
                    <h6 class="card-subtitle text-muted address">{{ badge.address }}</h6>
                </b-media>
                <div slot="footer" class="text-center">
                    <b-button variant="link" class="text-secondary" :href="this.network.current.etherscanLink + '/address/' + badge.address" target="_blank">
                        View on Etherscan
                    </b-button>
                    <b-button variant="link" class="text-secondary" @click="shareBadge">
                        Share or Embed
                    </b-button>
                </div>
            </b-card>
            <b-modal ref="shareModal" hide-footer title="Share your badge">
                <b-row>
                    <b-col lg="12">
                        <b-form-group
                                label="Share link"
                                label-for="badgeLink">
                            <b-form-input
                                    id="badgeLink"
                                    name="badgeLink"
                                    placeholder="Your badge link"
                                    size="lg"
                                    readonly
                                    v-model.trim="badge.link">
                            </b-form-input>
                        </b-form-group>
                    </b-col>
                    <b-col lg="12">
                        <b-form-group
                                label="Embed code"
                                label-for="badgeEmbed">
                            <b-form-input
                                    id="badgeEmbed"
                                    name="badgeEmbed"
                                    placeholder="Your badge embed"
                                    size="lg"
                                    readonly
                                    v-model.trim="badge.embed">
                            </b-form-input>
                        </b-form-group>
                    </b-col>
                </b-row>
            </b-modal>
        </b-col>
        <b-col lg="6" offset-lg="3" class="text-right p-0">
            <b-link v-if="embedded" :href="$withBase('/')" target="_blank">
                <small class="text-muted">Powered by EthereumBadge</small>
            </b-link>
        </b-col>
    </b-row>
</template>

<script>
  import browser from '../mixins/browser';
  import dapp from '../mixins/dapp';

  export default {
    name: 'Detail',
    mixins: [
      browser,
      dapp,
    ],
    data () {
      return {
        loaded: false,
        loading: true,
        badge: {
          address: '',
          link: '',
          embed: '',
          qrcode: '',
        },
      };
    },
    mounted () {
      this.initDapp();
    },
    methods: {
      async initDapp () {
        this.network.current = this.network.list[this.network.default];
        try {
          await this.initWeb3(this.network.default, true);
          await this.getAddress(this.getParam('address'));
        } catch (e) {
          alert(e);
          document.location.href = this.$withBase('/');
        }
      },
      async getAddress (address) {
        this.loading = false;

        if (this.web3.isAddress(address)) {
          this.badge.address = address;

          this.badge.qrcode = await this.generateQRCode(this.badge.address);
          this.badge.link = window.location.origin + this.$withBase(`/detail.html?address=${this.badge.address}`);
          this.badge.embed = `<iframe src="${this.badge.link}&embedded=1" style="border:none; overflow:hidden; width: 520px; max-width: 100%; height: 320px" scrolling="no" frameborder="0" allowTransparency="true"></iframe>`; // eslint-disable-line max-len

          this.loaded = true;
        }
      },
      shareBadge () {
        this.$refs.shareModal.show();
      },
    },
  };
</script>
