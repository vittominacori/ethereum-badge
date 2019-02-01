<template>
    <b-row class="mt-4 p-0">
        <b-col lg="6" offset-lg="3">
            <b-card title="Create your badge" bg-variant="light">
                <b-form @submit.prevent="createBadgePage" class="mt-3">
                    <b-row>
                        <b-col lg="12">
                            <b-form-group
                                    label="Your address"
                                    label-for="yourAddress">
                                <b-input-group>
                                    <b-form-input
                                            id="yourAddress"
                                            name="yourAddress"
                                            placeholder="Your address"
                                            size="lg"
                                            v-model.trim="address"
                                            v-validate="'required|eth_address'"
                                            data-vv-as="token address"
                                            :class="{'is-invalid': errors.has('yourAddress')}">
                                    </b-form-input>
                                </b-input-group>
                                <small v-show="errors.has('yourAddress')" class="text-danger">
                                    {{ errors.first('yourAddress') }}
                                </small>
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col lg="6" class="mt-3">
                            <b-button size="lg" variant="outline-info" type="submit">Create your badge</b-button>
                        </b-col>
                    </b-row>
                </b-form>
            </b-card>
        </b-col>
    </b-row>
</template>

<script>
  import browser from '../mixins/browser';
  import dapp from '../mixins/dapp';

  export default {
    name: 'Generator',
    mixins: [
      browser,
      dapp,
    ],
    data () {
      return {
        address: '',
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

          this.$validator.extend('eth_address', {
            getMessage: field => 'Insert a valid Ethereum address.',
            validate: value => this.web3.isAddress(value),
          });
        } catch (e) {
          alert(e);
          document.location.href = this.$withBase('/');
        }
      },
      createBadgePage () {
        this.$validator.validateAll().then((result) => {
          if (result) {
            document.location.href = this.$withBase(`detail.html?address=${this.address}`);
          }
        });
      },
    },
  };
</script>
