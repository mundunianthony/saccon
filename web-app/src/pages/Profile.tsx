import React, { useRef, useState } from "react";
import axios from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// constants
import { apiBaseUrl } from "@/constants";
// custom hook
import { useUserProfileInfo } from "@/hooks/useUserProfile";
// components
import Button from "@/components/Button";
import Spinner from "@/components/Spinner";
import LucideIcon from "@/components/LucideIcon";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import ProfilePlaceholder from "@/assets/profile-placeholder.png";

const formSchema = z.object({
  username: z.string().min(2, { message: "Username must be at least 2 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  profile: z.object({
    role_display: z.string(),
    profile_image: z
      .instanceof(File)
      .optional()
      .refine((file) => !file || file.size < 7000000, {
        message: "Profile image must be less than 7MB.",
      }),
  }),
});

const Profile = () => {
  const { profile } = useUserProfileInfo();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: profile?.username || "",
      email: profile?.email || "",
      profile: {
        role_display: profile?.profile?.role_display || "",
        profile_image: undefined,
      },
    },
  });

  const handleImageUpdate = () => {
    imageInputRef.current?.click();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      form.setValue("profile.profile_image", file); // Update form state with the selected file
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl); // Set preview for UI
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    const TOKEN = localStorage.getItem("access_token");

    try {
      const formData = new FormData();
      formData.append("username", values.username);
      formData.append("email", values.email);
      if (values.profile.profile_image instanceof File) {
        formData.append("profile_image", values.profile.profile_image);
      }

      await axios.patch(`${apiBaseUrl}/api/profile/`, formData, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-2/3 mx-auto mt-5">
      <h1 className="text-2xl mb-2">Update Profile</h1>
      <div className="w-full flex justify-center items-center border border-slate-950/25 dark:border-slate-400 rounded-md">
        <Form {...form}>
          <form className="space-y-4 mb-5" onSubmit={form.handleSubmit(onSubmit)}>
            {/* Profile Image Preview */}
            <div className="relative">
              <img
                src={
                  preview ||
                  (profile?.profile?.profile_image
                    ? `${apiBaseUrl}${profile.profile.profile_image}`
                    : ProfilePlaceholder)
                }
                alt="profile image"
                className="w-48 h-48 rounded-full mx-auto object-cover"
              />
              <LucideIcon
                name="Camera"
                className="absolute bottom-4 right-12 cursor-pointer"
                onClick={handleImageUpdate}
              />
            </div>

            {/* Profile Image Upload */}
            <FormField
              control={form.control}
              name="profile.profile_image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Image:</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        field.onChange(e.target.files?.[0]);
                        handleImageUpload(e);
                      }}
                      ref={imageInputRef}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Username Field */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Name:</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email:</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Role Display Field */}
            <FormField
              control={form.control}
              name="profile.role_display"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role:</FormLabel>
                  <FormControl>
                    <Input placeholder="Your role" {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              text={loading ? <Spinner /> : "Update Profile"}
              className="w-full mb-8"
            />
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Profile;