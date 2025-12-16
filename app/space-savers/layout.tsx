// import { ReactNode } from "react";
// import { Playfair_Display } from "next/font/google";

// const playfair = Playfair_Display({
//   subsets: ["latin"],
//   weight: ["400", "500"],
//   style: ["normal", "italic"],
// });

// export default function SpaceSaversLayout({
//   children,
// }: {
//   children: ReactNode;
// }) {
//   return <div className={playfair.className}>{children}</div>;
// }

import { ReactNode } from "react";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

export default function SpaceSaversLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className={playfair.className}>
      {children}
    </div>
  );
}


