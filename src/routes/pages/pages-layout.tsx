import { Spinner } from "@/components/spinner";
import { SubPageNavigation } from "@/components/sub-page-navigation";
import { Wrapper } from "@/components/wrapper";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Outlet, useNavigation } from "react-router";

export function PagesLayout() {
  const [header, setHeader] = useState<HTMLElement | null>(null);
  const navigation = useNavigation();
  const isNavigating = Boolean(navigation.location);

  useEffect(() => {
    const headerElement = document.getElementById("header");
    if (headerElement) {
      setHeader(headerElement);
    }
  }, []);

  return (
    <>
      {header && createPortal(<SubPageNavigation />, header)}

      {isNavigating ? (
        <Spinner />
      ) : (
        <main className="flex-1">
          <Wrapper>
            <Outlet />
          </Wrapper>
        </main>
      )}
    </>
  );
}
