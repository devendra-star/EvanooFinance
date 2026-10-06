import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
// ---------- Bottom Tabs ----------
export type BottomTabParamList = {
  Home: undefined;
  Calc: undefined;
  Score: undefined;
  Loans: undefined;
  Cards: undefined;
  Khata: undefined;
};
// ---------- Root Stack (no Drawer — tabs are the primary nav) ----------
export type StackParamList = {
  AppLock: undefined;
  Login: undefined;
  OtpVerify: { mobileNumber: string };
  Registration: undefined;
  SetPin: undefined;
  MainTabs: NavigatorScreenParams<BottomTabParamList>;
  // Loan / card flowsá
  LoanDetails: { loanId: string };
  CreditCardDetails: { cardId: string };
  PaymentHistory: undefined;
  // Top-left icon on Home → Support
  Support: undefined;
  HelpCenter: undefined;
  LiveChat: undefined;
  RaiseTicket: undefined;
  FAQs: undefined;
  // Top-right icon on Home → Profile
  Profile: undefined;
  ProfileSettings: undefined;
  Notifications: undefined;
  PrivacySecurity: undefined;
};
// ---------- Auth screens ----------
export type LoginScreenProps = NativeStackScreenProps<StackParamList, 'Login'>;
export type OtpVerifyScreenProps = NativeStackScreenProps<
  StackParamList,
  'OtpVerify'
>;
export type RegistrationScreenProps = NativeStackScreenProps<
  StackParamList,
  'Registration'
>;
export type SetPinScreenProps = NativeStackScreenProps<
  StackParamList,
  'SetPin'
>;
// ---------- Tab screens (Tab + Stack composed) ----------
type TabComposite<T extends keyof BottomTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<BottomTabParamList, T>,
  NativeStackScreenProps<StackParamList>
>;
export type HomeScreenProps = TabComposite<'Home'>;
export type CalcScreenProps = TabComposite<'Calc'>;
export type ScoreScreenProps = TabComposite<'Score'>;
export type LoansScreenProps = TabComposite<'Loans'>;
export type CardsScreenProps = TabComposite<'Cards'>;
export type KhataScreenProps = TabComposite<'Khata'>;
// ---------- Loan / card detail screens ----------
export type LoanDetailsScreenProps = NativeStackScreenProps<
  StackParamList,
  'LoanDetails'
>;
export type CreditCardDetailsScreenProps = NativeStackScreenProps<
  StackParamList,
  'CreditCardDetails'
>;
export type PaymentHistoryScreenProps = NativeStackScreenProps<
  StackParamList,
  'PaymentHistory'
>;
// ---------- Support screens ----------
export type SupportScreenProps = NativeStackScreenProps<
  StackParamList,
  'Support'
>;
export type HelpCenterScreenProps = NativeStackScreenProps<
  StackParamList,
  'HelpCenter'
>;
export type LiveChatScreenProps = NativeStackScreenProps<
  StackParamList,
  'LiveChat'
>;
export type RaiseTicketScreenProps = NativeStackScreenProps<
  StackParamList,
  'RaiseTicket'
>;
export type FAQsScreenProps = NativeStackScreenProps<StackParamList, 'FAQs'>;
// ---------- Profile screens ----------
export type ProfileScreenProps = NativeStackScreenProps<
  StackParamList,
  'Profile'
>;
export type ProfileSettingsScreenProps = NativeStackScreenProps<
  StackParamList,
  'ProfileSettings'
>;
export type NotificationsScreenProps = NativeStackScreenProps<
  StackParamList,
  'Notifications'
>;
export type PrivacySecurityScreenProps = NativeStackScreenProps<
  StackParamList,
  'PrivacySecurity'
>;
