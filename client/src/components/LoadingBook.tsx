import { Skeleton } from "@mui/material";
import React from "react";

function LoadingBook() {
    return (
        <div className="loding_container relative flex w-full justify-center gap-[20px] rounded-[7px] bg-book_container_color px-[18px] py-[20px] text-white">
            <div className="h-[140px] w-[106px]">
                <Skeleton
                    variant="rectangular"
                    height="100%"
                    width="100%"
                    sx={{ bgcolor: "grey.900" }}
                />
            </div>
            <div className="flex w-full flex-col justify-center gap-2">
                <Skeleton
                    variant="text"
                    width="100%"
                    sx={{ bgcolor: "grey.900" }}
                />
                <Skeleton
                    variant="text"
                    width="100%"
                    sx={{ bgcolor: "grey.900" }}
                />
                <Skeleton
                    variant="text"
                    width="100%"
                    sx={{ bgcolor: "grey.900" }}
                />
                <Skeleton
                    variant="text"
                    width="100%"
                    sx={{ bgcolor: "grey.900" }}
                />
            </div>
        </div>
    );
}

export default LoadingBook;
