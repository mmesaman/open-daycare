import { Sidebar } from "./_components/sidebar";
import { FeedPostCard } from "./_components/feed-post-card";
import { CameraIcon } from "./_components/icons";
import { posts } from "./_data/feed";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-[#F6ECDF]">
      <Sidebar />

      <main className="h-screen min-w-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[760px] px-5 pb-16 pt-6 lg:px-10 lg:pb-20 lg:pt-[34px]">
          <div className="mb-6">
            <div className="mb-1 text-[12.5px] font-extrabold uppercase tracking-[0.8px] text-[#D9583C]">
              Guardería · Sala Soles
            </div>
            <h1 className="m-0 font-display text-[26px] font-semibold text-[#3F362E] lg:text-[30px]">
              Buenas, Caro
            </h1>
            <p className="mt-[5px] text-[14.5px] text-[#94887B]">
              12 niños · martes 17 jun
            </p>
          </div>

          <div className="mb-6 flex items-center gap-[14px] rounded-[18px] border border-[#ECE0D0] bg-[#FFFDF9] px-[18px] py-[14px] shadow-[0_4px_14px_-10px_rgba(120,90,60,0.4)]">
            <div className="flex size-10 flex-none items-center justify-center rounded-full bg-[#F2937A] font-display text-base font-semibold text-white">
              C
            </div>
            <span className="flex-1 text-[15px] text-[#A89A8B]">
              Compartí un momento…
            </span>
            <span className="flex size-[38px] items-center justify-center rounded-xl bg-[#FBE3D8] text-[#E0654A]">
              <CameraIcon />
            </span>
          </div>

          <div className="mb-[14px] flex items-center gap-[14px]">
            <span className="text-[12.5px] font-extrabold tracking-[0.8px] text-[#8A7C6D]">
              PUBLICADO HOY
            </span>
            <span className="h-px flex-1 bg-[#E7DAC8]" />
          </div>

          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <FeedPostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
