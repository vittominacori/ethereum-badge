<template>
    <b-row>
        <b-col v-if="loading" lg="6" offset-lg="3" class="mt-4 p-0">
            <b-card bg-variant="light">
                <ui--loader :loading="loading"></ui--loader>
            </b-card>
        </b-col>
        <b-col v-if="!loading && !loaded" lg="6" offset-lg="3" class="mt-md-4 p-0">
            <b-card bg-variant="light">
                <blockquote>Some error occurred</blockquote>
                <router-link :to="$withBase('create.html')">Try creating your badge</router-link>
            </b-card>
        </b-col>
        <b-col v-if="loaded" lg="6" offset-lg="3" class="mt-md-4 p-0">
            <b-card no-body bg-variant="light">
                <b-media>
                    <b-img v-if="badge.address" slot="aside" fluid-grow :src="badge.qrcode" :alt="badge.address" />
                    <h4 class="card-title my-3">Your address</h4>
                    <h6 class="card-subtitle text-muted address">{{ badge.address }}</h6>
                    <div class="mt-3">
                        <b-link class="text-secondary mr-3" :href="this.network.current.etherscanLink + '/address/' + badge.address" target="_blank">
                            View on Etherscan
                        </b-link>
                        <b-link class="text-secondary" @click="shareBadge">
                            Share or Embed
                        </b-link>
                    </div>
                </b-media>
                <div slot="footer" class="text-center">
                    <b-form @submit.prevent="sendDonation" class="py-2">
                        <b-input-group>
                            <b-form-input
                                    id="yourDonation"
                                    name="yourDonation"
                                    placeholder="Your donation"
                                    :disabled="loading"
                                    v-model.trim="donation"
                                    v-validate="{ required: true, decimal: 4 }"
                                    data-vv-as="donation"
                                    :class="{'is-invalid': errors.has('yourDonation')}">
                            </b-form-input>
                            <b-input-group-append>
                                <b-button :disabled="loading" type="submit" variant="success">Send</b-button>
                            </b-input-group-append>
                        </b-input-group>
                        <small v-show="errors.has('yourDonation')" class="text-danger">
                            {{ errors.first('yourDonation') }}
                        </small>
                    </b-form>
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
        donation: '',
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
      sendDonation () {
        this.$validator.validateAll().then((result) => {
          if (result) {
            console.log('TODO');
          }
        });
      },
      shareBadge () {
        this.$refs.shareModal.show();
      },
    },
  };
</script>
