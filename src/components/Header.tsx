import { Navbar, NavbarBackLink } from "konsta/react";

export default function Header() {
  return (
    <Navbar
      title="DiveBook"
      subtitle=""
      className="top-0 sticky py-3"
      left={<NavbarBackLink text="" onClick={() => history.back()} />}
    />
  );
}
