module.exports = {
  title: 'Create your Ethereum Badge',
  description: 'A simple DApp that allows you creating an Ethereum badge for your address to share and embed.',
  base: '/ethereum-badge/',
  ga: 'UA-115756440-2',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:url', content: 'https://vittominacori.github.io/ethereum-badge' }],
    ['meta', { property: 'og:image', content: 'https://vittominacori.github.io/ethereum-badge/assets/images/ethereum-badge.jpg' }], // eslint-disable-line max-len
    ['meta', { property: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { property: 'twitter:image', content: 'https://vittominacori.github.io/ethereum-badge/assets/images/ethereum-badge.jpg' }], // eslint-disable-line max-len
    ['meta', { property: 'twitter:title', content: 'ETHBadge | Create your Ethereum Badge' }],
    ['script', { src: '/assets/js/web3.min.js' }],
  ],
  defaultNetwork: 'mainnet',
  infuraProjectId: '1b5f68501da84b098773fa516464e212',
};
