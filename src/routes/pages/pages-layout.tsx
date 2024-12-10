import { SubPageNavigation } from "@/components/sub-page-navigation";
import { Wrapper } from "@/components/wrapper";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Outlet } from "react-router";

export function PagesLayout() {
  const [header, setHeader] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const headerElement = document.getElementById("header");
    if (headerElement) {
      setHeader(headerElement);
    }
  }, []);

  return (
    <>
      {header && createPortal(<SubPageNavigation />, header)}
      <main>
        <Wrapper>
          <Outlet />
        </Wrapper>
      </main>
    </>
  );
}
