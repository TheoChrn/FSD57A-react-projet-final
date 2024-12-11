import { Loader } from "lucide-react";

export function Spinner() {
  return (
    <span className="flex flex-1 items-center justify-center">
      <Loader className="animate-spin" />
    </span>
  );
}
