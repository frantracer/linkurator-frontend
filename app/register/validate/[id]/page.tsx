import ValidateEmail from "./ValidateEmail";

export function generateStaticParams() {
  return [{id: '_'}];
}

export default function ValidateEmailPage() {
  return <ValidateEmail/>;
}
