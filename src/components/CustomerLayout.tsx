import rays from "../assets/rays.png";
import logoBanner from "../assets/logoBanner.png";
import { Outlet } from 'react-router-dom';

export default function CustomerLayout() {
  return (
    <div className="h-dvh absolute top-0 left-0 w-full bg-primary flex flex-col justify-start items-center overflow-y-scroll">

      <img src={rays} alt="Rays" className="w-40" />

      <div className="mx-5 space-y-6">
        <img src={logoBanner} alt="logo banner" className="w-full max-w-md mx-auto" />
        <Outlet />
      </div>
      <img src={rays} alt="Rays" className="w-40 rotate-180" />
    </div>
  );
}
