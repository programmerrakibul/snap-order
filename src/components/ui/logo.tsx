import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <>
      <Link href={"/"}>
        <Image
          src={"/logo.png"}
          alt="SnapOrder logo"
          width={160}
          height={48}
          className="w-40 h-12 object-cover"
        />
      </Link>
    </>
  );
};

export default Logo;
