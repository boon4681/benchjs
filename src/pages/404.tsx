export default () => {
    return (
        <>
            <div className="w-full h-screen flex flex-col justify-around">
                <div className="flex flex-col items-center justify-center">
                    <div className="text-8xl text-white">
                        404
                    </div>
                    <div>
                        NOT FOUND
                    </div>
                    <div className="my-6">
                        <a href="/" className="flex justify-center items-center transition hover:text-gray-200">
                            <div className="text-5xl font-extralight">{"<"}</div>
                            <div className="text-lg mx-3">Home</div>
                            <div className="text-5xl font-extralight">{">"}</div>
                        </a>
                    </div>
                </div>
            </div>
        </>
    )
}