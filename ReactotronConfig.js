import Reactotron from "reactotron-react-native";
import { reactotronRedux } from "reactotron-redux";

const reactotron = Reactotron.configure()
  .useReactNative({
    asyncStorage: false,
    errors: false,
    log: false,
    editor: false,
    overlay: false,
    networking: { ignoreUrls: /symbolicate/ },
  })
  .use(reactotronRedux())
  .connect();
export default reactotron;
