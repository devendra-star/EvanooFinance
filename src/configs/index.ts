import { Dimensions } from 'react-native';
// import { ExternalDirectoryPath } from "react-native-fs";

const SCREEN_HEIGHT = Dimensions.get('screen').height;
const SCREEN_WIDTH = Dimensions.get('screen').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;
const WINDOW_WIDTH = Dimensions.get('window').width;
// const APK_DOWNLOAD_DIRECTORY = `${ExternalDirectoryPath}/APK`;
const CONTENT_TYPE_JSON = 'application/json';
const CONTENT_TYPE_FORMDATA = 'multipart/form-data';
const HEADER_HEIGHT = 55;
const DEFAULT_PAGE_SIZE = 10;
const POST_REQUEST = 'POST';
const PUT_REQUEST = 'PUT';
const GET_REQUEST = 'GET';
const POLL_INTERVAL = 5 * 60 * 1000;

export {
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
  CONTENT_TYPE_JSON,
  CONTENT_TYPE_FORMDATA,
  HEADER_HEIGHT,
  DEFAULT_PAGE_SIZE,
  POST_REQUEST,
  PUT_REQUEST,
  GET_REQUEST,
  // APK_DOWNLOAD_DIRECTORY,
  POLL_INTERVAL,
};
