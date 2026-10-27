import {
  BellIcon,
  ChildrenIcon,
  HomeIcon,
  LogoutIcon,
  PlusIcon,
  SunIcon,
  UserIcon,
} from "./icons";

const navigation = [
  { label: "Feed", icon: HomeIcon, active: true },
  { label: "Niños", icon: ChildrenIcon, active: false },
  { label: "Avisos", icon: BellIcon, active: false },
  { label: "Mi cuenta", icon: UserIcon, active: false },
];

export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-[248px] flex-none flex-col border-r border-[#ECE0D0] bg-[#FFFDF9] px-4 py-6 lg:flex">
      <div className="flex items-center gap-[11px] px-2 pb-[22px] pt-1">
        <div className="flex size-[38px] flex-none items-center justify-center rounded-xl bg-[linear-gradient(155deg,#F8C3A8,#F2937A)]">
          <SunIcon className="text-white" />
        </div>
        <div>
          <div className="font-display text-[17px] font-semibold leading-none text-[#3F362E]">
            OpenDayCare
          </div>
          <div className="mt-0.5 text-[11.5px] text-[#A89A8B]">Sala Soles</div>
        </div>
      </div>

      <div className="mb-[18px] flex w-full items-center justify-center gap-2 rounded-[14px] bg-[linear-gradient(180deg,#F4977E,#EE8164)] py-3 text-[14.5px] font-extrabold text-white shadow-[0_8px_18px_-8px_rgba(238,129,100,0.75)]">
        <PlusIcon className="text-white" />
        Nueva publicación
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {navigation.map(({ label, icon: Icon, active }) => (
          <div
            key={label}
            className={`flex items-center gap-3 rounded-[12px] px-3 py-[11px] text-[14.5px] ${
              active
                ? "bg-[#FBE3D8] font-extrabold text-[#D9583C]"
                : "bg-transparent font-semibold text-[#6E6359]"
            }`}
          >
            <Icon />
            {label}
          </div>
        ))}
      </nav>

      <div className="mt-[10px] border-t border-[#ECE0D0] pt-[14px]">
        <div className="flex items-center gap-[11px] px-2 py-1.5">
          <div className="flex size-[38px] flex-none items-center justify-center rounded-full bg-[#F2937A] font-display text-base font-semibold text-white">
            C
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[14px] font-extrabold text-[#3F362E]">
              Caro Giménez
            </div>
            <div className="text-[12px] text-[#A89A8B]">Maestra · Soles</div>
          </div>
          <div
            title="Cerrar sesión"
            className="flex size-8 flex-none items-center justify-center rounded-[10px] bg-[#F6ECDF] text-[#94887B]"
          >
            <LogoutIcon />
          </div>
        </div>
      </div>
    </aside>
  );
}
