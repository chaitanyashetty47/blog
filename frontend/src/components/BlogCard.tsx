import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { MoreVertical, Edit, Trash } from "lucide-react";
import { BACKEND_URL } from "../config";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface BlogCardProps {
  id: number;
  authorName: string;
  title: string;
  content: string;
  publishedDate: string;
  onDelete?:(id:number) => void;
}

export const BlogCard = ({
  id,
  authorName,
  title,
  content,
  publishedDate,
  onDelete
}: BlogCardProps) => {
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const showOptionsButton = location.pathname.includes('/profile') || location.pathname.includes('/update');

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/blog/edit/${id}`);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${BACKEND_URL}/api/v1/blog/delete/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token")
        }
      });
      console.log("Blog post deleted");
      //navigate("/blogs");
      if(onDelete){
        onDelete(id);
      }
      
    } catch (error) {
      console.error("Error deleting blog post:", error);
    }
  };

  return (
    <div className="p-4 border-b border-slate-200 pb-4 w-screen max-w-screen-md cursor-pointer">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Avatar name={authorName} />
          <div className="font-extralight pl-2 text-sm flex justify-center flex-col">{authorName}</div>
          <div className="pl-2 flex justify-center flex-col">
            <Circle />
          </div>
          <div className="pl-2 font-thin text-slate-500 text-sm flex justify-center flex-col">
            {publishedDate}
          </div>
        </div>
        {showOptionsButton && (
          <Popover>
            <PopoverTrigger asChild>
              <button className="text-slate-500 hover:text-slate-700">
                <MoreVertical size={20} />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-40">
              <div className="flex flex-col space-y-2">
                <button
                  onClick={handleEdit}
                  className="flex items-center space-x-2 hover:bg-slate-100 p-2 rounded"
                >
                  <Edit size={16} />
                  <span>Edit</span>
                </button>
                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <button
                      className="flex items-center space-x-2 hover:bg-slate-100 p-2 rounded text-red-500 w-full text-left"
                    >
                      <Trash size={16} />
                      <span>Delete</span>
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your blog post.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
      <Link to={`/blog/${id}`}>
        <div className="text-xl font-semibold pt-2">
          {title}
        </div>
        <div className="text-md font-thin">
          {content.slice(0, 100) + "..."}
        </div>
        <div className="text-slate-500 text-sm font-thin pt-4">
          {`${Math.ceil(content.length / 100)} minute(s) read`}
        </div>
      </Link>
    </div>
  );
}

export function Circle() {
  return <div className="h-1 w-1 rounded-full bg-slate-500"></div>
}

export function Avatar({ name, size = "small" }: { name: string, size?: "small" | "big" }) {
  return (
    <div className={`relative inline-flex items-center justify-center overflow-hidden bg-yellow-500 rounded-full ${size === "small" ? "w-6 h-6" : "w-10 h-10"}`}>
      <span className={`${size === "small" ? "text-xs" : "text-md"} font-extralight text-black-600 dark:text-black-300`}>
        {name[0]}
      </span>
    </div>
  );
}