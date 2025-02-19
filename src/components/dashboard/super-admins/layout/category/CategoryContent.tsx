'use client';

import React, { useEffect, useState } from 'react';

import { toast } from 'react-hot-toast';

import { Category } from '@/components/dashboard/super-admins/layout/category/lib/interface';

import { categoryService } from '@/components/dashboard/super-admins/layout/category/lib/categoryService';

import CategorySkelaton from "./CategorySkelaton"

export default function CategoryPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: ''
    });

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        setFilteredCategories(categories);
    }, [categories]);

    useEffect(() => {
        if (editingCategory) {
            setFormData({
                name: editingCategory.name
            });
        } else {
            setFormData({ name: '' });
        }
    }, [editingCategory]);

    const loadCategories = async () => {
        setIsLoading(true);
        try {
            const data = await categoryService.getCategories();
            // Sort categories by createdAt in descending order (newest first)
            const sortedData = (data as Category[]).sort((a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setCategories(sortedData);
        } catch (error) {
            console.error('Failed to load categories:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        const modal = document.getElementById('category_modal');
        if (modal) {
            (modal as HTMLDialogElement).showModal();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setModalLoading(true);

        try {
            if (editingCategory) {
                await categoryService.updateCategory(editingCategory.id, formData);
            } else {
                await categoryService.createCategory(formData);
            }
            await loadCategories();
            toast.success(editingCategory ? 'Category berhasil diperbarui!' : 'Category berhasil ditambahkan!');
            setFormData({ name: '' });
            closeModal();
        } catch (error) {
            console.error('Failed to save category:', error);
            toast.error(editingCategory ? 'Gagal memperbarui category' : 'Gagal menambahkan category');
        } finally {
            setModalLoading(false);
        }
    };

    const closeModal = () => {
        const modal = document.getElementById('category_modal');
        if (modal) {
            (modal as HTMLDialogElement).close();
        }
        setEditingCategory(null);
    };

    const handleDelete = async (id: string) => {
        setDeleteLoading(true);
        try {
            await categoryService.deleteCategory(id);
            await loadCategories();
            toast.success('Category berhasil dihapus!');
            closeDeleteModal();
        } catch (error) {
            console.error('Failed to delete category:', error);
            toast.error('Gagal menghapus category');
        } finally {
            setDeleteLoading(false);
        }
    };

    const closeDeleteModal = () => {
        const modal = document.getElementById('delete_modal');
        if (modal) {
            (modal as HTMLDialogElement).close();
        }
        setCategoryToDelete(null);
    };

    const openDeleteModal = (category: Category) => {
        setCategoryToDelete(category);
        const modal = document.getElementById('delete_modal');
        if (modal) {
            (modal as HTMLDialogElement).showModal();
        }
    };

    return (
        <section className='min-h-full py-0 px-0 sm:py-4 sm:px-4'>
            {isLoading ? (
                <CategorySkelaton />
            ) : (
                <div className="container">
                    {/* Header Section - Updated styling */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white rounded-xl shadow-sm">
                        <h1 className="text-2xl font-bold text-gray-800">Category Management</h1>
                        <button
                            onClick={() => {
                                const modal = document.getElementById('category_modal');
                                if (modal) {
                                    (modal as HTMLDialogElement).showModal();
                                }
                            }}
                            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Add New Category
                        </button>
                    </div>

                    {/* Table Section - Updated styling */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full whitespace-nowrap">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">No</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Name</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Created At</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCategories.map((category, index) => (
                                        <tr
                                            key={category.id}
                                            className="border-b border-gray-50 hover:bg-gray-50 transition-colors duration-200"
                                        >
                                            <td className="px-6 py-4 text-sm text-gray-600">{index + 1}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800 font-medium">{category.name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {new Date(category.createdAt).toLocaleString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => handleEdit(category)}
                                                        className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Edit Category"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteModal(category)}
                                                        className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete Category"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Modal styling updates */}
                    <dialog id="category_modal" className="modal">
                        <div className="modal-box max-w-2xl p-8 bg-white rounded-xl shadow-xl">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-800">
                                    {editingCategory ? 'Edit Category' : 'Add New Category'}
                                </h3>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Category Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter category name"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        value={formData.name}
                                        required
                                        id="name"
                                    />
                                </div>

                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200"
                                        disabled={modalLoading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 min-w-[140px] justify-center transition-colors duration-200"
                                        disabled={modalLoading}
                                    >
                                        {modalLoading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                <span>Saving...</span>
                                            </>
                                        ) : (
                                            <span>{editingCategory ? 'Update Category' : 'Save Category'}</span>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                        <form method="dialog" className="modal-backdrop">
                            <button disabled={modalLoading}>close</button>
                        </form>
                    </dialog>

                    {/* Delete Modal - Updated styling */}
                    <dialog id="delete_modal" className="modal">
                        <div className="modal-box max-w-md p-8 bg-white rounded-xl shadow-xl">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Delete Category</h3>
                                <p className="text-center text-gray-600">
                                    Are you sure you want to delete this category? This action cannot be undone.
                                </p>
                            </div>

                            <div className="flex justify-center gap-3 mt-8">
                                <button
                                    onClick={closeDeleteModal}
                                    className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => categoryToDelete && handleDelete(categoryToDelete.id)}
                                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors duration-200"
                                    disabled={deleteLoading}
                                >
                                    {deleteLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            <span>Deleting...</span>
                                        </>
                                    ) : (
                                        <span>Delete Category</span>
                                    )}
                                </button>
                            </div>
                        </div>
                        <form method="dialog" className="modal-backdrop">
                            <button disabled={deleteLoading}>close</button>
                        </form>
                    </dialog>
                </div>
            )}
        </section>
    );
}
