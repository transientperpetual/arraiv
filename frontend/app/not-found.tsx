import Image from "next/image";
import logo_slogan from "@/public/logo_slogan.png";

export default function NotFound() {
  return (
    <div className="flex flex-col w-screen h-screen bg-background gap-3 items-center">
      <div className="pt-29 pb-19">
        <Image src={logo_slogan} width={180} alt="arraiv logo" />
      </div>
      <h1>PAGE DOES NOT EXIST</h1>
      <p>Go to home </p>
    </div>
  );
}
