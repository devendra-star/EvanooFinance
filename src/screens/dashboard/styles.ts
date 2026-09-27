import { StyleSheet } from 'react-native';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../configs';

const CHART_DIMENSION = Math.floor(WINDOW_HEIGHT * 0.22);
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 15,
    paddingTop: 0,
  },
  activityContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 15,
  },
  punchBox: {
    width: Math.floor(WINDOW_WIDTH - 45) / 2,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
  },
  punchTitleConatiner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 5,
  },
  webviewContainer: {
    height: CHART_DIMENSION,
    width: CHART_DIMENSION,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leaveTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 10,
  },
  colorDot: {
    height: 8,
    width: 8,
    borderRadius: 100,
  },
});
export default styles;
