export const LogoArea = () => {
  return (
    <>
    <div className="bg-[url('/stag.png')] bg-contain bg-center w-full h-screen bg-no-repeat flex items-center justify-center text-center mix-blend-multiply relative z-10 animate-[logoarea_4s_ease-in-out_forwards]">
        <div className="backdrop-blur-sm py-4 px-20 text-lg md:text-2xl text-center flex items-center justify-center flex-col absolute z-20 bottom-0">
            <strong className="text-balance block uppercase w-full first-letter:text-xl first-letter:md:text-3xl">Marvins Birthday</strong>
            <strong className="font-cursive text-white tracking-widest drop-shadow-[-2px_-2px_1px_rgba(0,0,0,.25),2px_2px_1px_rgba(0,0,0,.75)] my-2 text-lg sm:text-xl md:text-3xl">White Stag Festival</strong>
            <p className="text-sm">14. Juni 2025</p>
        </div>
    </div>
    </>
  )
}
