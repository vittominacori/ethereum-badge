<template>
    <div>
        <template v-if="loading">
            <b-card bg-variant="light">
                <ui--loader :loading="loading"></ui--loader>
            </b-card>
        </template>
        <template v-if="!loading && !loaded">
            <b-card bg-variant="light">
                <blockquote>Some error occurred</blockquote>
                <router-link :to="$withBase('create.html')">Try creating your badge</router-link>
            </b-card>
        </template>
        <template v-if="loaded">
            <b-card no-body footer-class="p-2">
                <b-media>
                    <b-img v-if="badge.address" slot="aside" fluid-grow :src="badge.qrcode" :alt="badge.address" />
                    <h4 class="card-title my-3">Send ETH to the following address</h4>
                    <h6 class="card-subtitle text-muted address">{{ badge.address }}</h6>
                    <b-link class="text-muted"
                            :href="this.network.current.etherscanLink + '/address/' + badge.address"
                            target="_blank">
                        <small>View on Etherscan</small>
                    </b-link>
                    <p class="lead">
                        Current balance: <b>{{ badge.balance }} ETH</b>
                    </p>
                </b-media>
                <div slot="footer" class="text-center">
                    <small v-if="trx.hash">
                        Your hash:
                        <b-link class="text-secondary" :href="trx.link" target="_blank">
                            <small>{{ trx.hash }}</small>
                        </b-link>
                    </small>
                    <b-form v-else @submit.prevent="sendDonation">
                        <b-input-group>
                            <b-form-input
                                    id="yourDonation"
                                    name="yourDonation"
                                    placeholder="Your donation"
                                    :disabled="makingTransaction"
                                    v-model.trim="donation"
                                    v-validate="{ required: true, decimal: 4, min_value: 0.0001 }"
                                    data-vv-as="donation"
                                    :class="{'is-invalid': errors.has('yourDonation')}">
                            </b-form-input>
                            <b-input-group-append>
                                <b-button :disabled="makingTransaction" type="submit" variant="outline-info">
                                    Send
                                </b-button>
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
        </template>
        <div v-if="loaded" class="text-right p-0 pr-2">
            <b-link v-if="embedded && !internal" :href="$withBase('/')" target="_blank">
                <small class="text-muted">Powered by ETHBadge</small>
            </b-link>
            <b-link v-else @click="shareBadge">
                <small class="text-muted">Share or Embed</small>
            </b-link>
        </div>
    </div>
</template>

<script>
  import browser from '../../mixins/browser';
  import dapp from '../../mixins/dapp';

  export default {
    name: 'Badge',
    mixins: [
      browser,
      dapp,
    ],
    props: {
      address: {
        type: String,
        default: '',
      },
      internal: {
        type: Boolean,
        default: false,
      },
    },
    data () {
      return {
        loaded: false,
        loading: true,
        makingTransaction: false,
        donation: '',
        badge: {
          address: '',
          balance: 0,
          link: '',
          embed: '',
          qrcode: '',
        },
        trx: {
          hash: '',
          link: '',
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
          await this.getAddress(this.address || this.getParam('address'));
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
          this.badge.embed = `<iframe src="${this.badge.link}&embedded=1" style="border:none; overflow:hidden; width: 570px; max-width: 100%; height: 240px" scrolling="no" frameborder="0" allowTransparency="true"></iframe>`; // eslint-disable-line max-len

          this.web3.eth.getBalance(
            this.badge.address,
            (err, balance) => {
              if (!err) {
                this.badge.balance = parseFloat(this.web3.fromWei(balance)).toFixed(4);
              } else {
                console.log(err); // eslint-disable-line no-console
              }
            },
          );

          this.loaded = true;
        }
      },
      sendDonation () {
        this.$validator.validateAll().then(async (result) => { // eslint-disable-line promise/catch-or-return
          if (result) {
            if (!this.metamask.installed) {
              alert('Please verify that you have MetaMask installed and unlocked.');
              return;
            }

            if (this.metamask.netId !== this.network.current.id) {
              alert(`You are on the wrong Network. Please switch MetaMask on ${this.network.current.name}.`);
              return;
            }

            try {
              this.web3Provider.enable() // eslint-disable-line promise/no-nesting
                .then((accounts) => {
                  this.makingTransaction = true;

                  this.web3.eth.sendTransaction(
                    {
                      value: this.web3.toWei(this.donation, 'ether'),
                      from: accounts[0],
                      to: this.badge.address,
                    },
                    (err, trxHash) => {
                      if (!err) {
                        this.trx.hash = trxHash;
                        this.trx.link = this.network.current.etherscanLink + '/tx/' + this.trx.hash;
                      } else {
                        alert('Some error occurred. Maybe you rejected the transaction or you have MetaMask locked!');
                      }
                      this.makingTransaction = false;
                    }
                  );
                })
                .catch(function (reason) {
                  console.log(reason); // eslint-disable-line no-console
                });
            } catch (e) {
              console.log(e); // eslint-disable-line no-console
              alert('Cannot connect. Please verify that you have MetaMask installed and unlocked.');
            }
          }
        });
      },
      shareBadge () {
        this.$refs.shareModal.show();
      },
    },
  };
</script>
