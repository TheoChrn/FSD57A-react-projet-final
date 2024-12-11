import { ComponentPropsWithoutRef } from "react";
import { Link, LinkProps } from "react-router";

interface TSection extends ComponentPropsWithoutRef<"section"> {}
export const Section = ({ ...props }: TSection) => (
  <section {...props} className="space-y-2" />
);

interface TSectionTitle extends ComponentPropsWithoutRef<"h2"> {}
export const SectionTitle = ({ ...props }: TSectionTitle) => (
  <h2 {...props} className="text-xl" />
);

interface TSectionItems extends ComponentPropsWithoutRef<"ul"> {}
export const SectionItems = ({ ...props }: TSectionItems) => (
  <ul {...props} className="flex flex-wrap justify-center items-center gap-4" />
);

interface TSectionItem extends ComponentPropsWithoutRef<"li"> {}
export const SectionItem = ({ ...props }: TSectionItem) => <li {...props} />;

interface TSectionLinkItem extends LinkProps {}
export const SectionLinkItem = ({ ...props }: TSectionLinkItem) => (
  <SectionItem>
    <Link {...props} className="text-accent underline" />
  </SectionItem>
);
