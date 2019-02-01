import QRCode from 'qrcode';

export default {
  data () {
    return {
      embedded: false,
    };
  },
  mounted () {
    this.embedded = this.getParam('embedded') === '1';
  },
  methods: {
    getParam (param) {
      const vars = {};
      window.location.href.replace(location.hash, '').replace(
        /[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
        function (m, key, value) { // callback
          vars[key] = value !== undefined ? value : '';
        }
      );

      if (param) {
        return vars[param] ? vars[param] : null;
      }
      return vars;
    },
    generateQRCode (value) {
      return QRCode.toDataURL(
        value,
        {
          color: {
            dark: '#000', // Blue dots
            light: '#0000', // Transparent background
          },
        }
      );
    },
  },
};
