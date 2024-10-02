
import { Appbar } from "../components/Appbar"
import { BlogCard } from "../components/BlogCard"
import { BlogSkeleton } from "../components/BlogSkeleton";
import { useBlogsByUser } from "../hooks";
import { Avatar } from "../components/BlogCard";




export const Profile = () => {
  const { loading, blogs,removeBlog } = useBlogsByUser();
  const name = localStorage.getItem("userName");




  if (loading) {
    return <div>
        <Appbar name={name}/> 
        <div  className="flex justify-center">
            <div>
                <BlogSkeleton />
                <BlogSkeleton />
                <BlogSkeleton />
                <BlogSkeleton />
                <BlogSkeleton />
            </div>
        </div>
    </div>
}

return <div>
    <Appbar name={name}/>
    <div className="flex flex-row">

          <div className="fixed bottom-0 left-0 right-0 z-10 order-last w-full bg-white border-2 md:pt-5 md:h-screen md:sticky border_container md:top-0 md:left-0 md:order-first cols-span-12 md:col-span-3">
                    <div className="z-40 flex flex-row justify-center w-full h-fit md:flex-col">
                        <div className="items-center hidden py-4 space-y-1 border-b md:flex md:flex-col">
                          {/* <div className="bg-gray-600 w-20 h-20 rounded-full"></div> */}
                          <Avatar size="big" name={name?.charAt(0).toUpperCase() || "r"} />
                          <div className="text-sm font-normal">{name}</div>
                          <div className="text-sm font-medium">9898635901</div>
                        </div>
                        <div className="flex flex-row items-center justify-center w-full md:flex-col">
                          <div className="text-white bg-primary flex flex-col md:flex-row w-full items-center md:space-x-5 py-3 md:px-5 cursor-pointer">
                            <span className="flex flex-row items-center justify-center w-full text-sm text-center md:justify-start md:text-md md:font-medium md:w-full">Your Blogs</span>
                          </div>
                        </div>
                    </div>
                </div>

        <div  className="flex justify-center">
            <div>
                {blogs.map(blog => <BlogCard
                    id={blog.id}
                    authorName={blog.author.name || "Anonymous"}
                    title={blog.title}
                    content={blog.content}
                    publishedDate={"2nd Feb 2024"}
                    onDelete={removeBlog}
                />)}
            </div>
        </div>

    </div>
    
</div>
}