// Authentication
export const LoginUrl = "auth/login";

// Dashboard
export const DashboardSummary = "admin/dashboard/summary";
export const DisbursementTrend = "admin/dashboard/trends/disbursement";
export const RecoveryTrend = "admin/dashboard/trends/recovery";
export const ProductDistribution = "admin/dashboard/distribution/product";
export const TelcoDistribution = "admin/dashboard/distribution/telco";
export const AgingDistribution = "admin/dashboard/distribution/aging";
export const RiskMetrics = "admin/dashboard/risk";
export const FraudStats = "admin/dashboard/fraud";
export const HighValueCustomers = "admin/dashboard/customers/high-value";
export const RepeatBorrowers = "admin/dashboard/customers/repeat";
export const RecentLoans = "admin/dashboard/loans/recent";
export const DelinquentCustomers = "admin/dashboard/customers/delinquent";
export const LegacyRiskCustomers = "admin/dashboard/customers/legacy-risk";
export const PortfolioWatchlist = "admin/dashboard/portfolio/watchlist";

// Customer Control
export const CustomerProfile = (msisdn: string) =>
  `admin/customer/profile/${msisdn}`;
export const BlacklistCustomer = (msisdn: string) =>
  `admin/customer/blacklist/${msisdn}`;
