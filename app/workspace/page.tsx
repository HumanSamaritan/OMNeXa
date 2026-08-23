import TaxWorkspace from "./tax-workspace";

export const metadata = {
  title: "Private Tax Workspace | SwayamITR",
  description: "Prepare an AY 2026–27 individual income-tax return in a browser-only workspace.",
};

export default function WorkspacePage() {
  return <TaxWorkspace userName="Private taxpayer" signOutPath="/" />;
}
