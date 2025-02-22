"use client"

import React, { useEffect, useState } from 'react'

import { toast } from 'react-hot-toast'

import { Discount } from './lib/interface'

import { discountService } from './lib/discountService'

import DiscountSkelaton from '@/components/dashboard/super-admins/layout/discount/DiscountSkelaton'

import Image from 'next/image'

import { collection, getDocs } from 'firebase/firestore';

import { db } from '@/utils/firebase';

import Pagination from '@/components/helper/Pagination';

export default function DiscountContent() {
    const [isLoading, setIsLoading] = useState(true);
    const [discounts, setDiscounts] = useState<Discount[]>([]);
    const [filteredDiscounts, setFilteredDiscounts] = useState<Discount[]>([]);
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
    const [modalLoading, setModalLoading] = useState(false);
    const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
    const [discountToDelete, setDiscountToDelete] = useState<Discount | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [newDiscountStatus, setNewDiscountStatus] = useState<boolean>(true);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [title, setTitle] = useState<string>('');
    const [discountAmount, setDiscountAmount] = useState<number>(0);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6); // Show 6 items per page

    useEffect(() => {
        loadDiscounts();
        loadCategories();
    }, []);

    useEffect(() => {
        const filterAndPaginateDiscounts = () => {
            let filtered = [...discounts];

            // Apply status filter
            switch (filterStatus) {
                case 'active':
                    filtered = filtered.filter(discount => discount.isActive);
                    break;
                case 'inactive':
                    filtered = filtered.filter(discount => !discount.isActive);
                    break;
            }

            setFilteredDiscounts(filtered);
        };

        filterAndPaginateDiscounts();
    }, [discounts, filterStatus]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredDiscounts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredDiscounts.length / itemsPerPage);

    const handlePageClick = (selected: number) => {
        setCurrentPage(selected + 1);
    };

    const loadDiscounts = async () => {
        setIsLoading(true);
        try {
            const data = await discountService.getDiscounts();
            setDiscounts(data);
        } catch (error) {
            console.error('Failed to load discounts:', error);
            toast.error('Failed to load discounts');
        } finally {
            setIsLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const categoriesSnapshot = await getDocs(collection(db, process.env.NEXT_PUBLIC_COLLECTIONS_CATEGORIES_DISCOUNTS as string));
            const categoriesList = categoriesSnapshot.docs.map(doc => doc.data().name);
            setCategories(categoriesList);
        } catch (error) {
            console.error('Failed to load categories:', error);
            toast.error('Failed to load categories');
        }
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files?.[0]) return;

        const file = event.target.files[0];

        if (!validateFile(file)) {
            event.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result as string);
        };
        reader.readAsDataURL(file);

        setSelectedFile(file);
    };

    const validateFile = (file: File) => {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

        if (!validTypes.includes(file.type)) {
            toast.error('File type not supported. Please upload an image file.');
            return false;
        }

        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            toast.error('File is too large. Maximum size is 5MB.');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setModalLoading(true);

        if (!title.trim()) {
            toast.error('Please enter a title');
            setModalLoading(false);
            return;
        }

        if (discountAmount <= 0 || discountAmount > 100) {
            toast.error('Please enter a valid discount amount (1-100)');
            setModalLoading(false);
            return;
        }

        try {
            if (editingDiscount) {
                if (selectedFile) {
                    const imageUrl = await discountService.uploadImage(selectedFile);
                    await discountService.updateDiscount(editingDiscount.id, {
                        imageUrl: imageUrl as string,
                        title,
                        discountAmount,
                        isActive: newDiscountStatus,
                        category: selectedCategory
                    });
                } else {
                    await discountService.updateDiscount(editingDiscount.id, {
                        imageUrl: editingDiscount.imageUrl,
                        title,
                        discountAmount,
                        isActive: newDiscountStatus,
                        category: selectedCategory
                    });
                }
            } else {
                if (!selectedFile) {
                    toast.error('Please select an image first');
                    return;
                }
                const imageUrl = await discountService.uploadImage(selectedFile);
                await discountService.createDiscount({
                    imageUrl: imageUrl as string,
                    title,
                    discountAmount,
                    isActive: true,
                    category: selectedCategory
                });
            }
            await loadDiscounts();
            toast.success(editingDiscount ? 'Discount updated successfully!' : 'Discount added successfully!');
            closeModal();
        } catch (error) {
            console.error('Failed to save discount:', error);
            toast.error(editingDiscount ? 'Failed to update discount' : 'Failed to add discount');
        } finally {
            setModalLoading(false);
        }
    };

    const handleEdit = (discount: Discount) => {
        setEditingDiscount(discount);
        setTitle(discount.title);
        setDiscountAmount(discount.discountAmount);
        setNewDiscountStatus(discount.isActive);
        setPreviewImage(discount.imageUrl);
        const modal = document.getElementById('discount_modal');
        if (modal) {
            (modal as HTMLDialogElement).showModal();
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            await discountService.updateDiscountStatus(id, !currentStatus);
            await loadDiscounts();
            toast.success('Discount status updated successfully!');
        } catch (error) {
            console.error('Failed to toggle status:', error);
            toast.error('Failed to update discount status');
        }
    };

    const openDeleteModal = (discount: Discount) => {
        setDiscountToDelete(discount);
        const modal = document.getElementById('delete_modal');
        if (modal) {
            (modal as HTMLDialogElement).showModal();
        }
    };

    const openViewModal = (discount: Discount) => {
        setEditingDiscount(discount);
        const modal = document.getElementById('view_modal');
        if (modal) {
            (modal as HTMLDialogElement).showModal();
        }
    };

    const handleDelete = async (id: string) => {
        setDeleteLoading(true);
        try {
            await discountService.deleteDiscount(id);
            await loadDiscounts();
            toast.success('Discount deleted successfully!');
            const modal = document.getElementById('delete_modal');
            if (modal) {
                (modal as HTMLDialogElement).close();
            }
        } catch (error) {
            console.error('Failed to delete discount:', error);
            toast.error('Failed to delete discount');
        } finally {
            setDeleteLoading(false);
        }
    };

    const closeModal = () => {
        const modals = ['discount_modal', 'delete_modal', 'view_modal'];
        modals.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (modal) {
                (modal as HTMLDialogElement).close();
            }
        });

        // Reset all states
        setPreviewImage(null);
        setSelectedFile(null);
        setTitle('');
        setDiscountAmount(0);
        setNewDiscountStatus(true);
        setEditingDiscount(null);
        setDiscountToDelete(null);
    };

    if (isLoading) {
        return <DiscountSkelaton />;
    }

    return (
        <section className='min-h-full py-0 px-0 sm:py-4 sm:px-4'>
            <>
                {/* Add/Edit Modal */}
                <dialog id="discount_modal" className="modal">
                    <div className="modal-box bg-white max-w-2xl p-6">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-800">
                                {editingDiscount ? 'Edit Discount' : 'Add New Discount'}
                            </h3>
                            <button onClick={closeModal} className="btn btn-sm btn-circle btn-ghost">✕</button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Image Upload Section */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    {previewImage ? 'Change Image' : 'Upload Image'}
                                </label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                                    {previewImage ? (
                                        <div className="relative w-full h-[200px]">
                                            <Image
                                                src={previewImage}
                                                alt="Preview"
                                                fill
                                                className="object-contain"
                                            />
                                            <button
                                                onClick={() => {
                                                    setPreviewImage(null);
                                                    setSelectedFile(null);
                                                }}
                                                className="absolute top-2 right-2 btn btn-circle btn-sm btn-ghost bg-white/80 hover:bg-white"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-2 text-center">
                                            <div className="flex flex-col items-center">
                                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <div className="flex text-sm text-gray-600 mt-2">
                                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                                                        <span>Upload a file</span>
                                                        <input
                                                            id="file-upload"
                                                            type="file"
                                                            className="sr-only"
                                                            onChange={handleFileSelect}
                                                            accept="image/*"
                                                        />
                                                    </label>
                                                    <p className="pl-1">or drag and drop</p>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    PNG, JPG, GIF up to 5MB
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Form Fields */}
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Title</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="mt-1 input input-bordered w-full"
                                        placeholder="Enter discount title"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Discount Amount (%)</label>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            value={discountAmount}
                                            onChange={(e) => setDiscountAmount(Number(e.target.value))}
                                            className="mt-1 input input-bordered w-full"
                                            placeholder="0-100"
                                            min="0"
                                            max="100"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Status</label>
                                        <select
                                            value={newDiscountStatus.toString()}
                                            onChange={(e) => setNewDiscountStatus(e.target.value === 'true')}
                                            className="mt-1 select select-bordered w-full"
                                        >
                                            <option value="true">Active</option>
                                            <option value="false">Inactive</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Category</label>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="mt-1 select select-bordered w-full"
                                        required
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map((category) => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="btn btn-ghost"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={modalLoading}
                                >
                                    {modalLoading ? (
                                        <span className="loading loading-spinner"></span>
                                    ) : editingDiscount ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </dialog>

                {/* Delete Confirmation Modal */}
                <dialog id="delete_modal" className="modal">
                    <div className="modal-box custom-scrollbar bg-white">
                        <h3 className="font-bold text-lg">Delete Discount</h3>
                        <p className="py-4">Are you sure you want to delete this discount?</p>
                        <div className="modal-action">
                            <button
                                onClick={closeModal}
                                className="btn btn-ghost"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={() => discountToDelete && handleDelete(discountToDelete.id)}
                                className="btn btn-error text-white bg-red-600 hover:bg-red-700"
                                disabled={deleteLoading}
                            >
                                {deleteLoading ? (
                                    <>
                                        <span className="loading loading-spinner"></span>
                                        Deleting...
                                    </>
                                ) : (
                                    'Delete'
                                )}
                            </button>
                        </div>
                    </div>
                </dialog>

                {/* View Modal */}
                <dialog id="view_modal" className="modal">
                    <div className="modal-box max-w-4xl p-2 bg-white custom-scrollbar">
                        {editingDiscount && (
                            <div className="relative">
                                <div className="relative h-[60vh]">
                                    <Image
                                        src={editingDiscount.imageUrl}
                                        alt="Discount Preview"
                                        width={500}
                                        height={500}
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="absolute top-2 right-2 btn btn-circle btn-ghost"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                </dialog>

                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                    <div className="flex gap-4 flex-col">
                        <h1 className="text-2xl font-semibold text-gray-800">Discount Management</h1>
                        <select
                            className="select select-bordered"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
                        >
                            <option value="all">All Discounts</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    <button
                        onClick={() => {
                            const modal = document.getElementById('discount_modal');
                            if (modal) {
                                (modal as HTMLDialogElement).showModal();
                            }
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-4 rounded-lg flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add New Discount
                    </button>
                </div>

                {/* Grid View */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentItems.map((discount) => (
                        <div key={discount.id} className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100">
                            <div className="relative h-48 overflow-hidden">
                                <Image
                                    src={discount.imageUrl}
                                    alt="Discount"
                                    className="object-cover transform group-hover:scale-105 transition-transform duration-200"
                                    fill
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                                    <button
                                        onClick={() => openViewModal(discount)}
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
                                <h3 className="font-semibold text-lg mb-1">{discount.title}</h3>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-green-600 font-semibold">{discount.discountAmount}% OFF</span>
                                </div>
                                <div className="flex justify-between items-center mb-4">
                                    <select
                                        className="select select-bordered select-sm"
                                        value={discount.isActive.toString()}
                                        onChange={() => handleToggleStatus(discount.id, discount.isActive)}
                                    >
                                        <option value="true">Active</option>
                                        <option value="false">Inactive</option>
                                    </select>
                                    <span className="text-sm text-gray-500">
                                        {new Date(discount.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => handleEdit(discount)}
                                        className="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded-full transition-colors"
                                        title="Edit Discount"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => openDeleteModal(discount)}
                                        className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-full transition-colors"
                                        title="Delete Discount"
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

                {/* Updated pagination implementation */}
                {filteredDiscounts.length > 0 && (
                    <div className="mt-8">
                        <Pagination
                            pageCount={totalPages}
                            onPageChange={handlePageClick}
                            currentPage={currentPage - 1}
                        />
                    </div>
                )}
            </>
        </section>
    );
}

