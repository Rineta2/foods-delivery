"use client"

import React, { useEffect, useState } from 'react'

import { toast } from 'react-hot-toast'

import { Partner } from './lib/interface'

import { partnerService } from '@/components/dashboard/super-admins/layout/patner/lib/partnerService'

import PatnerSkelaton from '@/components/dashboard/super-admins/layout/patner/PatnerSkelaton'

import Image from 'next/image'

import Pagination from '@/components/helper/Pagination';

export default function PartnerContent() {
    const [isLoading, setIsLoading] = useState(true);
    const [partners, setPartners] = useState<Partner[]>([]);
    const [filteredPartners, setFilteredPartners] = useState<Partner[]>([]);
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
    const [modalLoading, setModalLoading] = useState(false);
    const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
    const [partnerToDelete, setPartnerToDelete] = useState<Partner | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [newPartnerStatus, setNewPartnerStatus] = useState<boolean>(true);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [title, setTitle] = useState<string>('');
    const [category, setCategory] = useState<'partner' | 'ride'>('partner');
    const [text, setText] = useState<string>('');
    const [buttonText, setButtonText] = useState<string>('Partner with Us');
    const [link, setLink] = useState<string>('#');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6); // Show 6 items per page
    const [description, setDescription] = useState<string>('');

    useEffect(() => {
        loadPartners();
    }, []);

    useEffect(() => {
        const filterAndPaginatePartners = () => {
            let filtered = [...partners];

            // Apply status filter
            switch (filterStatus) {
                case 'active':
                    filtered = filtered.filter(partner => partner.isActive);
                    break;
                case 'inactive':
                    filtered = filtered.filter(partner => !partner.isActive);
                    break;
            }

            setFilteredPartners(filtered);
        };

        filterAndPaginatePartners();
    }, [partners, filterStatus]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredPartners.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredPartners.length / itemsPerPage);

    const handlePageClick = (selected: number) => {
        setCurrentPage(selected + 1);
    };

    const loadPartners = async () => {
        setIsLoading(true);
        try {
            const data = await partnerService.getPartners();
            // Sort brands by createdAt in descending order (newest first)
            const sortedPartners = data.sort((a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setPartners(sortedPartners as Partner[]);
        } catch (error) {
            console.error('Failed to load partners:', error);
            toast.error('Failed to load partners');
        } finally {
            setIsLoading(false);
        }
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setModalLoading(true);

        // Validate all required fields
        if (!title.trim()) {
            toast.error('Please enter a title');
            setModalLoading(false);
            return;
        }

        if (!text.trim()) {
            toast.error('Please enter text content');
            setModalLoading(false);
            return;
        }

        if (!buttonText.trim()) {
            toast.error('Please enter button text');
            setModalLoading(false);
            return;
        }

        if (!link.trim()) {
            toast.error('Please enter a link');
            setModalLoading(false);
            return;
        }

        // Validate link format
        try {
            new URL(link);
        } catch {
            toast.error('Please enter a valid URL');
            setModalLoading(false);
            return;
        }

        try {
            if (editingPartner) {
                if (selectedFile) {
                    const imageUrl = await partnerService.uploadImage(selectedFile);
                    await partnerService.updatePartner(editingPartner.id, {
                        imageUrl: imageUrl as string,
                        title,
                        text,
                        isActive: newPartnerStatus,
                        category,
                        buttonText,
                        link,
                        description
                    });
                } else {
                    await partnerService.updatePartner(editingPartner.id, {
                        imageUrl: editingPartner.imageUrl,
                        title,
                        text,
                        isActive: newPartnerStatus,
                        category,
                        buttonText,
                        link,
                        description
                    });
                }
            } else {
                if (!selectedFile) {
                    toast.error('Please select an image first');
                    return;
                }
                const imageUrl = await partnerService.uploadImage(selectedFile);
                await partnerService.createPartner({
                    imageUrl: imageUrl as string,
                    title,
                    isActive: true,
                    category,
                    buttonText,
                    link,
                    text,
                    description,
                });
            }
            await loadPartners();
            toast.success(editingPartner ? 'Partner updated successfully!' : 'Partner added successfully!');
            closeModal();
        } catch (error) {
            console.error('Failed to save partner:', error);
            toast.error(editingPartner ? 'Failed to update partner' : 'Failed to add partner');
        } finally {
            setModalLoading(false);
        }
    };

    const handleEdit = (partner: Partner) => {
        setEditingPartner(partner);
        setTitle(partner.title);
        setPreviewImage(partner.imageUrl);
        setText(partner.text);
        setCategory(partner.category as 'partner' | 'ride');
        setButtonText(partner.buttonText || 'Partner with Us');
        setLink(partner.link || '#');
        setDescription(partner.description || '');
        setNewPartnerStatus(partner.isActive);
        const modal = document.getElementById('brand_modal');
        if (modal) {
            (modal as HTMLDialogElement).showModal();
        }
    };

    const openDeleteModal = (partner: Partner) => {
        setPartnerToDelete(partner);
        const modal = document.getElementById('delete_modal');
        if (modal) {
            (modal as HTMLDialogElement).showModal();
        }
    };

    const openViewModal = (partner: Partner) => {
        setEditingPartner(partner);
        const modal = document.getElementById('view_modal');
        if (modal) {
            (modal as HTMLDialogElement).showModal();
        }
    };

    const handleDelete = async (id: string) => {
        setDeleteLoading(true);
        try {
            await partnerService.deletePartner(id);
            await loadPartners();
            toast.success('Partner deleted successfully!');
            const modal = document.getElementById('delete_modal');
            if (modal) {
                (modal as HTMLDialogElement).close();
            }
        } catch (error) {
            console.error('Failed to delete partner:', error);
            toast.error('Failed to delete partner');
        } finally {
            setDeleteLoading(false);
        }
    };

    const closeModal = () => {
        const modals = ['brand_modal', 'delete_modal', 'view_modal', 'partner_modal'];
        modals.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (modal) {
                (modal as HTMLDialogElement).close();
            }
        });

        setPreviewImage(null);
        setSelectedFile(null);
        setTitle('');
        setText('');
        setNewPartnerStatus(true);
        setCategory('partner');
        setButtonText('Partner with Us');
        setLink('#');
        setEditingPartner(null);
        setPartnerToDelete(null);
        setDescription('');
    };

    if (isLoading) {
        return <PatnerSkelaton />;
    }

    return (
        <section className='min-h-full py-0 px-0 sm:py-4 sm:px-4'>
            <div className="container">
                {/* Header Section with modern styling */}
                <div className="bg-white rounded-xl">
                    <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
                        <div className="space-y-4">
                            <h1 className="text-3xl font-bold text-gray-900">Partner Management</h1>
                            <div className="flex items-center gap-3">
                                <select
                                    className="select select-bordered bg-white border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
                                >
                                    <option value="all">All Partners</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>

                                <span className="text-sm text-gray-500">
                                    {filteredPartners.length} partners found
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                const modal = document.getElementById('brand_modal');
                                if (modal) {
                                    (modal as HTMLDialogElement).showModal();
                                }
                            }}
                            className="btn bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Add New Partner
                        </button>
                    </div>
                </div>

                {/* Modern Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentItems.map((brand) => (
                        <div
                            key={brand.id}
                            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100 group"
                        >
                            <div className="relative h-48 overflow-hidden">
                                <Image
                                    src={brand.imageUrl}
                                    alt={brand.title}
                                    className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300"
                                    width={500}
                                    height={500}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <div className="absolute bottom-4 left-4 flex gap-2">
                                        <button
                                            onClick={() => openViewModal(brand)}
                                            className="p-2 bg-white/90 rounded-full hover:bg-white transition-all"
                                            title="View Details"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-lg text-gray-900">{brand.title}</h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${brand.isActive
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                        }`}>
                                        {brand.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>

                                <div className="flex flex-col gap-2 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                        </svg>
                                        <span className="capitalize">{brand.category}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span>{new Date(brand.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-100 flex justify-end gap-2">
                                    <button
                                        onClick={() => handleEdit(brand)}
                                        className="btn btn-sm bg-blue-50 hover:bg-blue-100 text-blue-600 border-none"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => openDeleteModal(brand)}
                                        className="btn btn-sm bg-red-50 hover:bg-red-100 text-red-600 border-none"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination with modern styling */}
                {filteredPartners.length > 0 && (
                    <div className="mt-8 flex justify-center">
                        <Pagination
                            pageCount={totalPages}
                            onPageChange={handlePageClick}
                            currentPage={currentPage - 1}
                        />
                    </div>
                )}

                {/* Add/Edit Modal with Flexbox */}
                <dialog id="brand_modal" className="modal">
                    <div className="modal-box max-w-3xl bg-white rounded-lg overflow-hidden flex flex-col">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b p-4">
                            <h3 className="text-xl font-semibold text-gray-800">
                                {editingPartner ? 'Edit Partner' : 'Add New Partner'}
                            </h3>

                            <button
                                onClick={closeModal}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 p-6 overflow-y-auto">
                            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                {/* Image Upload Section */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-gray-700">Partner Image</label>
                                    <div className="flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg p-4 transition-colors hover:border-gray-300">
                                        {previewImage ? (
                                            <div className="relative w-full h-[200px] group">
                                                <Image
                                                    src={previewImage}
                                                    alt="Preview"
                                                    fill
                                                    className="object-contain rounded-lg"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setPreviewImage(null);
                                                            setSelectedFile(null);
                                                        }}
                                                        className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <label className="flex flex-col items-center cursor-pointer w-full">
                                                <div className="flex flex-col items-center justify-center p-4">
                                                    <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    <p className="mt-2 text-sm text-gray-600">Click to upload or drag and drop</p>
                                                    <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                                                </div>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    onChange={handleFileSelect}
                                                    accept="image/*"
                                                />
                                            </label>
                                        )}
                                    </div>
                                </div>

                                {/* Form Fields */}
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium text-gray-700">Title</label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="input input-bordered w-full"
                                            placeholder="Enter title"
                                            required
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium text-gray-700">Description</label>
                                        <input
                                            type="text"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="input input-bordered w-full"
                                            placeholder="Enter description"
                                            required
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium text-gray-700">Text</label>
                                        <input
                                            type="text"
                                            value={text}
                                            onChange={(e) => setText(e.target.value)}
                                            className="input input-bordered w-full"
                                            placeholder="Enter text"
                                            required
                                        />
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <div className="flex-1">
                                            <label className="text-sm font-medium text-gray-700">Category</label>
                                            <select
                                                value={category}
                                                onChange={(e) => setCategory(e.target.value as 'partner' | 'ride')}
                                                className="mt-1 select select-bordered w-full"
                                            >
                                                <option value="partner">Partner with Us</option>
                                                <option value="ride">Ride with Us</option>
                                            </select>
                                        </div>

                                        <div className="flex-1">
                                            <label className="text-sm font-medium text-gray-700">Status</label>
                                            <select
                                                value={newPartnerStatus.toString()}
                                                onChange={(e) => setNewPartnerStatus(e.target.value === 'true')}
                                                className="mt-1 select select-bordered w-full"
                                            >
                                                <option value="true">Active</option>
                                                <option value="false">Inactive</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium text-gray-700">Button Text</label>
                                        <input
                                            type="text"
                                            value={buttonText}
                                            onChange={(e) => setButtonText(e.target.value)}
                                            className="input input-bordered w-full"
                                            placeholder="Enter button text"
                                            required
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium text-gray-700">Link</label>
                                        <input
                                            type="text"
                                            value={link}
                                            onChange={(e) => setLink(e.target.value)}
                                            className="input input-bordered w-full"
                                            placeholder="Enter link URL"
                                            required
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                                disabled={modalLoading}
                            >
                                {modalLoading ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm"></span>
                                        {editingPartner ? 'Updating...' : 'Creating...'}
                                    </>
                                ) : (
                                    editingPartner ? 'Update Partner' : 'Create Partner'
                                )}
                            </button>
                        </div>
                    </div>
                </dialog>

                {/* Delete Confirmation Modal */}
                <dialog id="delete_modal" className="modal">
                    <div className="modal-box max-w-md p-0 bg-white rounded-lg overflow-hidden">
                        <div className="p-6">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto">
                                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-gray-900 text-center">Delete Partner</h3>
                            <p className="mt-2 text-sm text-gray-500 text-center">
                                Are you sure you want to delete this partner? This action cannot be undone.
                            </p>
                        </div>
                        <div className="border-t px-6 py-4 flex justify-end gap-3 bg-gray-50">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => partnerToDelete && handleDelete(partnerToDelete.id)}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
                                disabled={deleteLoading}
                            >
                                {deleteLoading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="loading loading-spinner loading-sm"></span>
                                        Deleting...
                                    </span>
                                ) : 'Delete Partner'}
                            </button>
                        </div>
                    </div>
                </dialog>

                {/* View Modal */}
                <dialog id="view_modal" className="modal">
                    <div className="modal-box max-w-2xl p-4 bg-white custom-scrollbar">
                        {editingPartner && (
                            <div className="space-y-6">
                                {/* Header with close button */}
                                <div className="flex justify-between items-center">
                                    <h3 className="text-2xl font-bold text-gray-800">{editingPartner.title}</h3>
                                    <button
                                        onClick={closeModal}
                                        className="btn btn-circle btn-ghost"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Image container */}
                                <div className="relative h-[40vh] sm:h-[60vh] rounded-lg overflow-hidden">
                                    <Image
                                        src={editingPartner.imageUrl}
                                        alt={editingPartner.title}
                                        fill
                                        className="object-contain"
                                    />
                                </div>

                                {/* Brand details */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <span className={`px-3 py-1 rounded-full text-sm ${editingPartner.isActive
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}>
                                            {editingPartner.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                        <span className="text-gray-500">
                                            Created: {new Date(editingPartner.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </dialog>
            </div>
        </section>
    );
}

