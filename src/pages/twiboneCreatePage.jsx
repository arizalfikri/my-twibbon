import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Upload,
  X,
  Image,
  FileText,
  Link,
  Calendar,
  Tag,
  User,
  Globe,
  Camera,
  Palette,
  Settings,
} from "lucide-react";
import NavbarEditor from "../components/layoutpage/NavbarEditor";
import InputSelectWithLabel from "../components/FormControl/SelectWithLabel";
import InputWithLabel from "../components/FormControl/InputWithLabel";

function ImageUploadArea() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (e) => setUploadedImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => setUploadedImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="h-full p-6">
      <div className="flex flex-col h-full">
        <h3 className="mb-4 text-lg font-semibold text-gray-800">
          Upload Gambar
        </h3>

        <div
          className={`flex-1 border-2 border-dashed rounded-xl transition-all duration-300 flex flex-col items-center justify-center ${
            dragActive
              ? "border-blue-400 bg-blue-50"
              : uploadedImage
              ? "border-green-400 bg-green-50"
              : "border-gray-300 bg-gray-50 hover:border-gray-400"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {uploadedImage ? (
            <div className="relative flex flex-col items-center justify-center w-full h-full">
              <img
                src={uploadedImage}
                alt="Uploaded"
                className="object-contain max-w-full mb-4 rounded-lg shadow-md max-h-64"
              />
              <div className="flex space-x-3">
                <button
                  onClick={() => setUploadedImage(null)}
                  className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-red-500 rounded-lg hover:bg-red-600"
                >
                  <X size={16} />
                  <span>Hapus</span>
                </button>
                <label className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-blue-500 rounded-lg cursor-pointer hover:bg-blue-600">
                  <Camera size={16} />
                  <span>Ganti</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <Upload size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="mb-2 text-lg font-medium text-gray-600">
                Drag & drop gambar di sini
              </p>
              <p className="mb-6 text-sm text-gray-500">
                atau klik untuk memilih file
              </p>
              <label className="inline-flex items-center px-6 py-3 space-x-2 text-white transition-colors bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-700">
                <Image size={20} />
                <span>Pilih Gambar</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
              <p className="mt-4 text-xs text-gray-400">
                Format yang didukung: JPG, PNG, GIF (Max 10MB)
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TwiboneCreatePage() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      category: "",
      tags: "",
      author: "",
      website: "",
      socialMedia: "",
      color: "#3B82F6",
      visibility: "",
      license: "",
    },
  });

  const formData = watch();

  const categoryOptions = [
    { value: "", label: "Pilih kategori kampanye" },
    { value: "Online", label: "Online" },
    { value: "Offline", label: "Offline" },
  ];

  const visibilityOptions = [
    { value: "", label: "Pilih tingkat visibilitas" },
    { value: "publik", label: "Publik" },
    { value: "terbatas", label: "Terbatas" },
    { value: "privat", label: "Privat" },
  ];


  const onSubmit = (data) => {
    console.log("Form Data:", data);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <NavbarEditor
      title="Create Twibone"
      />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/2 border-r border-gray-200 bg-gray-50">
          <ImageUploadArea />
        </div>
        <div className="w-1/2 bg-white">
          <div className="h-full bg-white">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                Detail Kampanye
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Lengkapi informasi kampanye Anda
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="p-6 overflow-y-auto h-[calc(100%-80px)]"
            >
              <div className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <FileText size={16} className="text-gray-500" />
                    <span>
                      Judul Kampanye
                      <span className="ml-1 text-red-500">*</span>
                    </span>
                  </div>
                  <InputWithLabel
                    htmlFor="title"
                    label=""
                    type="text"
                    placeholder="Masukkan judul kampanye yang menarik..."
                    name="title"
                    id="title"
                    control={control}
                    error={errors}
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <FileText size={16} className="text-gray-500" />
                    <span>Deskripsi</span>
                  </div>
                  <textarea
                    rows={4}
                    value={formData.description}
                    placeholder="Jelaskan detail tentang kampanye ini, tujuan, dan pesan yang ingin disampaikan..."
                    className="w-full px-4 py-3 transition-all border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <Tag size={16} className="text-gray-500" />
                    <span>Kategori</span>
                  </div>
                  <InputSelectWithLabel
                    htmlFor="category"
                    label=""
                    name="category"
                    control={control}
                    error={errors}
                    options={categoryOptions}
                    option_label="label"
                    option_value="value"
                    className="border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <Tag size={16} className="text-gray-500" />
                    <span>Tags</span>
                  </div>
                  <InputWithLabel
                    htmlFor="tags"
                    label=""
                    type="text"
                    placeholder="Masukkan tags dipisahkan dengan koma (contoh: politik, pemilu, indonesia)"
                    name="tags"
                    id="tags"
                    control={control}
                    error={errors}
                  />
                </div>

                {/* Author */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <User size={16} className="text-gray-500" />
                    <span>Nama Pembuat</span>
                  </div>
                  <InputWithLabel
                    htmlFor="author"
                    label=""
                    type="text"
                    placeholder="Nama organisasi atau individu"
                    name="author"
                    id="author"
                    control={control}
                    error={errors}
                  />
                </div>

                {/* Website */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <Globe size={16} className="text-gray-500" />
                    <span>Website</span>
                  </div>
                  <InputWithLabel
                    htmlFor="website"
                    label=""
                    type="url"
                    placeholder="https://example.com"
                    name="website"
                    id="website"
                    control={control}
                    error={errors}
                  />
                </div>

                {/* Social Media */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <Link size={16} className="text-gray-500" />
                    <span>Media Sosial</span>
                  </div>
                  <InputWithLabel
                    htmlFor="socialMedia"
                    label=""
                    type="text"
                    placeholder="@username atau link media sosial"
                    name="socialMedia"
                    id="socialMedia"
                    control={control}
                    error={errors}
                  />
                </div>

                {/* Color */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <Palette size={16} className="text-gray-500" />
                    <span>Warna Tema</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={formData.color}
                      className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
                    />
                    <InputWithLabel
                      htmlFor="color"
                      label=""
                      type="text"
                      placeholder="#3B82F6"
                      name="color"
                      id="color"
                      control={control}
                      error={errors}
                      style={{ flex: 1 }}
                    />
                  </div>
                </div>

                {/* Visibility */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <Settings size={16} className="text-gray-500" />
                    <span>Visibilitas</span>
                  </div>
                  <InputSelectWithLabel
                    htmlFor="visibility"
                    label=""
                    name="visibility"
                    control={control}
                    error={errors}
                    options={visibilityOptions}
                    option_label="label"
                    option_value="value"
                    className="border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

         
                {/* Action Buttons */}
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex items-center space-x-4">
                    <button
                      type="button"
                      className="flex-1 px-6 py-3 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Simpan Draft
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      Preview
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TwiboneCreatePage;
