'use client';

import React, { useEffect, useState } from 'react';

import { toast } from 'react-hot-toast';

import Image from 'next/image';

import { Banner } from '@/components/dashboard/super-admins/layout/banner/lib/interface';

import { bannerService } from '@/components/dashboard/super-admins/layout/banner/lib/bannerService';

import BannerSkelaton from "@/components/dashboard/super-admins/layout/banner/BannerSkelaton"

export default function BannerContent() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [filteredBanners, setFilteredBanners] = useState<Banner[]>([]);
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
    const [isLoading, setIsLoading] = useState(true);
    const [newBannerStatus, setNewBannerStatus] = useState<boolean>(true);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
    const [bannerToDelete, setBannerToDelete] = useState<Banner | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [viewingBanner, setViewingBanner] = useState<Banner | null>(null);
    const [modalLoading, setModalLoading] = useState(false);
    const [loading, setLoading] = useState<{
        toggleStatus: { [key: string]: boolean };
        viewModal: boolean;
        deleteModal: boolean;
    }>({
        toggleStatus: {},
        viewModal: false,
        deleteModal: false
    });

    useEffect(() => {
        loadBanners();
    }, []);

    useEffect(() => {
        const filterBanners = () => {
            switch (filterStatus) {
                case 'active':
                    setFilteredBanners(banners.filter(banner => banner.isActive));
                    break;
                case 'inactive':
                    setFilteredBanners(banners.filter(banner => !banner.isActive));
                    break;
                default:
                    setFilteredBanners(banners);
            }
        };

        filterBanners();
    }, [banners, filterStatus]);

    const loadBanners = async () => {
        setIsLoading(true);
        try {
            const data = await bannerService.getBanners();
            setBanners(data);
        } catch (error) {
            console.error('Failed to load banners:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const validateFile = (file: File) => {
        const validTypes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif',
            'image/webp',
            'image/svg+xml',
            'image/bmp',
            'image/tiff'
        ];

        if (!validTypes.includes(file.type)) {
            toast.error('File type not supported. Please upload an image file.');
            return false;
        }

        // 5MB in bytes
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            toast.error('File is too large. Maximum size is 5MB.');
            return false;
        }

        return true;
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files?.[0]) return;

        const file = event.target.files[0];

        if (!validateFile(file)) {
            event.target.value = '';
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result as string);
        };
        reader.readAsDataURL(file);

        setSelectedFile(file);
    };

    const handleEdit = (banner: Banner) => {
        setEditingBanner(banner);
        setNewBannerStatus(banner.isActive);
        setPreviewImage(banner.imageUrl);
        const modal = document.getElementById('banner_modal');
        if (modal) {
            (modal as HTMLDialogElement).showModal();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setModalLoading(true);

        try {
            if (editingBanner) {
                // Handle edit case
                if (selectedFile) {
                    const imageUrl = await bannerService.uploadImage(selectedFile);
                    await bannerService.updateBanner(editingBanner.id, {
                        imageUrl: imageUrl as string,
                        isActive: newBannerStatus
                    });
                } else {
                    await bannerService.updateBanner(editingBanner.id, {
                        imageUrl: editingBanner.imageUrl,
                        isActive: newBannerStatus
                    });
                }
            } else {
                // Handle create case
                if (!selectedFile) {
                    toast.error('Please select an image first');
                    return;
                }
                const imageUrl = await bannerService.uploadImage(selectedFile);
                await bannerService.createBanner(imageUrl as string);
            }
            await loadBanners();
            toast.success(editingBanner ? 'Banner berhasil diperbarui!' : 'Banner berhasil ditambahkan!');
            setSelectedFile(null);
            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
            closeModal();
        } catch (error) {
            console.error('Failed to save banner:', error);
            toast.error(editingBanner ? 'Gagal memperbarui banner' : 'Gagal menambahkan banner');
        } finally {
            setModalLoading(false);
        }
    };

    const closeModal = () => {
        const modal = document.getElementById('banner_modal');
        if (modal) {
            (modal as HTMLDialogElement).close();
        }
        setPreviewImage(null);
        setSelectedFile(null);
        setNewBannerStatus(true);
        setEditingBanner(null);
    };

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        setLoading(prev => ({
            ...prev,
            toggleStatus: { ...prev.toggleStatus, [id]: true }
        }));
        try {
            await bannerService.updateBannerStatus(id, !currentStatus);
            await loadBanners();
        } catch (error) {
            console.error('Failed to toggle status:', error);
        } finally {
            setLoading(prev => ({
                ...prev,
                toggleStatus: { ...prev.toggleStatus, [id]: false }
            }));
        }
    };

    const handleDelete = async (id: string) => {
        setDeleteLoading(true);
        try {
            await bannerService.deleteBanner(id);
            await loadBanners();
            toast.success('Banner berhasil dihapus!');
            closeDeleteModal();
        } catch (error) {
            console.error('Failed to delete banner:', error);
            toast.error('Gagal menghapus banner');
        } finally {
            setDeleteLoading(false);
        }
    };

    const closeDeleteModal = () => {
        const modal = document.getElementById('delete_modal');
        if (modal) {
            (modal as HTMLDialogElement).close();
        }
        setBannerToDelete(null);
    };

    const openDeleteModal = (banner: Banner) => {
        setBannerToDelete(banner);
        const modal = document.getElementById('delete_modal');
        if (modal) {
            (modal as HTMLDialogElement).showModal();
        }
    };

    const openViewModal = (banner: Banner) => {
        setLoading(prev => ({ ...prev, viewModal: true }));
        setViewingBanner(banner);
        const modal = document.getElementById('view_modal');
        if (modal) {
            (modal as HTMLDialogElement).showModal();
        }
    };

    const closeViewModal = () => {
        const modal = document.getElementById('view_modal');
        if (modal) {
            (modal as HTMLDialogElement).close();
        }
        setViewingBanner(null);
    };

    return (
        <section className='min-h-full py-0 px-0 sm:py-4 sm:px-4'>
            {isLoading ? (
                <BannerSkelaton />
            ) : (
                <>
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                        <div className="flex gap-4 flex-col">
                            <h1 className="text-2xl font-semibold text-gray-800">Banner Management</h1>
                            <select
                                className="select select-bordered"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
                            >
                                <option value="all">All Banners</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>

                        <button
                            onClick={() => {
                                const modal = document.getElementById('banner_modal');
                                if (modal) {
                                    (modal as HTMLDialogElement).showModal();
                                }
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-4 rounded-lg flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Add New Banner
                        </button>
                    </div>

                    {/* Updated Modal */}
                    <dialog id="banner_modal" className="modal">
                        <div className="modal-box max-w-2xl p-6 bg-white rounded-lg shadow-xl">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-800">
                                    {editingBanner ? 'Edit Banner' : 'Add New Banner'}
                                </h3>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Image Preview */}
                                {previewImage && (
                                    <div className="relative w-full h-64 rounded-lg overflow-hidden">
                                        <Image
                                            src={previewImage}
                                            alt="Preview"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}

                                {/* File Input */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Upload Banner Image
                                        <span className="text-xs text-gray-500 ml-2">
                                            (Supported: JPG, PNG, GIF, WebP, SVG, BMP, TIFF | Max: 5MB)
                                        </span>
                                    </label>
                                    <input
                                        type="file"
                                        className="file-input file-input-bordered w-full"
                                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml,image/bmp,image/tiff"
                                        onChange={handleFileSelect}
                                        disabled={modalLoading}
                                    />
                                </div>

                                {/* Status Selection */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Banner Status
                                    </label>
                                    <select
                                        className="select select-bordered w-full"
                                        value={newBannerStatus ? "active" : "inactive"}
                                        onChange={(e) => setNewBannerStatus(e.target.value === "active")}
                                        disabled={modalLoading}
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>

                                {/* Updated Submit Button */}
                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-4 py-2 text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg"
                                        disabled={modalLoading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 min-w-[120px] justify-center"
                                        disabled={modalLoading || (!selectedFile && !editingBanner)}
                                    >
                                        {modalLoading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                <span>Uploading...</span>
                                            </>
                                        ) : (
                                            <span>{editingBanner ? 'Update Banner' : 'Save Banner'}</span>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                        <form method="dialog" className="modal-backdrop">
                            <button disabled={modalLoading}>close</button>
                        </form>
                    </dialog>

                    {/* Updated Delete Modal */}
                    <dialog id="delete_modal" className="modal">
                        <div className="modal-box max-w-md p-6 bg-white rounded-lg shadow-xl">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Delete Banner</h3>
                                <p className="text-center text-gray-600">
                                    Are you sure you want to delete this banner? This action cannot be undone.
                                </p>
                            </div>

                            <div className="flex justify-center gap-3 mt-6">
                                <button
                                    onClick={closeDeleteModal}
                                    className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => bannerToDelete && handleDelete(bannerToDelete.id)}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium flex items-center gap-2"
                                    disabled={deleteLoading}
                                >
                                    {deleteLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            <span>Deleting...</span>
                                        </>
                                    ) : (
                                        <span>Delete Banner</span>
                                    )}
                                </button>
                            </div>
                        </div>
                        <form method="dialog" className="modal-backdrop">
                            <button disabled={loading.deleteModal}>close</button>
                        </form>
                    </dialog>

                    {/* Updated View Modal */}
                    <dialog id="view_modal" className="modal">
                        <div className="modal-box max-w-4xl p-0 bg-white rounded-lg overflow-hidden">
                            {viewingBanner && (
                                <div className="relative">
                                    <div className="relative h-[60vh]">
                                        {loading.viewModal && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                            </div>
                                        )}
                                        <Image
                                            src={viewingBanner.imageUrl}
                                            alt="Banner Preview"
                                            quality={100}
                                            fill
                                            className="object-contain"
                                            onLoadingComplete={() => setLoading(prev => ({ ...prev, viewModal: false }))}
                                        />
                                    </div>
                                    <button
                                        onClick={closeViewModal}
                                        className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full text-gray-800 hover:text-gray-900 transition-all"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>
                        <form method="dialog" className="modal-backdrop">
                            <button disabled={loading.viewModal}>close</button>
                        </form>
                    </dialog>

                    {/* Banner Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredBanners.map((banner) => (
                            <div key={banner.id} className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100">
                                <div className="relative h-48 overflow-hidden">
                                    <Image
                                        src={banner.imageUrl}
                                        alt="Banner"
                                        className="object-cover transform group-hover:scale-105 transition-transform duration-200"
                                        fill
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                                        <button
                                            onClick={() => openViewModal(banner)}
                                            className="p-2 bg-white/90 rounded-full hover:bg-white transition-all"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <button
                                            onClick={() => handleToggleStatus(banner.id, banner.isActive)}
                                            disabled={loading.toggleStatus[banner.id]}
                                            className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${banner.isActive
                                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                                                }`}
                                        >
                                            {loading.toggleStatus[banner.id] ? (
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                                            ) : (
                                                banner.isActive ? 'Active' : 'Inactive'
                                            )}
                                        </button>
                                        <span className="text-sm text-gray-500">
                                            {new Date(banner.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => handleEdit(banner)}
                                            className="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded-full transition-colors"
                                            title="Edit Banner"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => openDeleteModal(banner)}
                                            className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-full transition-colors"
                                            title="Delete Banner"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}
