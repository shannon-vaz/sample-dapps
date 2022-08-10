import 'semantic-ui-css/semantic.min.css';

import Layout from '../components/Layout';

const App = function ({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
};

export default App;
