import { Wrapper } from "@/components/wrapper";
import { Link } from "react-router";

export function Header() {
  return (
    <header id="header" className="p-8 space-y-8 md:space-y-0">
      <Wrapper>
        <Link className="block mx-auto w-fit" to="/">
          <span className="sr-only">Home</span>
          <img src="/assets/logo/star-wars.svg" width={150} height={150} />
        </Link>
      </Wrapper>
    </header>
  );
}
