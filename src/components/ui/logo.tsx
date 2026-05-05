import Image from "next/image";
import Link from "next/link";

const Logo = ({ to = "/" }: { to?: string }) => {
  return (
    <>
      <Link href={to}>
        <Image
          src={"/logo.png"}
          alt="SnapOrder logo"
          width={160}
          height={48}
          loading="eager"
          className="w-40 h-12 object-cover"
        />
      </Link>
    </>
  );
};

export default Logo;
