import { LogoArea } from "./LogoArea"

type HeaderParams = {
    userId: string | null;
}

const Header = ({userId}: HeaderParams) => {
    
    return (
        <>
            <LogoArea animateLogo={!!userId} />
            <div className='w-full overflow-hidden max-w-full fixed top-0 left-0 h-full'>
            <div className="bg-radial from-amber-200 via-transparent to-transparent w-[600px] h-full translate-y-1/2 scale-125 absolute bottom-0 -z-10 overflow-x-hidden"></div>  
            <div className="bg-radial from-red-200 via-transparent to-transparent w-[800px] h-full translate-y-1/3 left-0 scale-125 absolute bottom-0 -z-10 overflow-x-hidden"></div>  
            </div>
        </>
    )
}

export default Header;