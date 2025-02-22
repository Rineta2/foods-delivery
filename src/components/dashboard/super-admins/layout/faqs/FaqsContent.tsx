"use client"

import React, { useState, useEffect } from 'react';

import { FAQ, FAQFormData } from '@/components/dashboard/super-admins/layout/faqs/lib/interface';

import { faqService } from '@/components/dashboard/super-admins/layout/faqs/lib/faqsService';

import { FiTrash2, FiPlus, FiEdit, FiChevronUp, FiChevronDown, FiEye } from 'react-icons/fi';

import FaqsSkelaton from '@/components/dashboard/super-admins/layout/faqs/FaqsSkelaton';

import Image from 'next/image';

export default function FaqsContent() {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<FAQFormData>({
        category: '',
        types: [{
            title: '',
            steps: [{
                title: '',
                text: '',
                image: ''
            }]
        }],
        isActive: true,
    });
    const [imageUploading, setImageUploading] = useState<boolean>(false);
    const [expandedFormSteps, setExpandedFormSteps] = useState<Record<number, boolean>>({});
    const [viewingFaq, setViewingFaq] = useState<FAQ | null>(null);
    const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
    const [expandedViewSteps, setExpandedViewSteps] = useState<Record<number, boolean>>({});

    useEffect(() => {
        loadFAQs();
    }, []);

    const loadFAQs = async () => {
        try {
            const data = await faqService.getFAQs();
            setFaqs(data);
        } catch (error) {
            console.error('Error loading FAQs:', error);
        } finally {
            setLoading(false);
        }
    };

    const addNewType = () => {
        setFormData(prev => ({
            ...prev,
            types: [...prev.types, { title: '', steps: [{ title: '', text: '', image: '' }] }]
        }));
    };

    const addNewStep = (typeIndex: number) => {
        setFormData(prev => {
            const updatedTypes = [...prev.types];
            updatedTypes[typeIndex] = {
                ...updatedTypes[typeIndex],
                steps: [...updatedTypes[typeIndex].steps, { title: '', text: '', image: '' }]
            };
            return { ...prev, types: updatedTypes };
        });
    };

    const removeType = (index: number) => {
        if (formData.types.length > 1) {
            setFormData(prev => ({
                ...prev,
                types: prev.types.filter((_, i) => i !== index)
            }));
        }
    };

    const removeStep = (typeIndex: number, stepIndex: number) => {
        if (formData.types[typeIndex].steps.length > 1) {
            setFormData(prev => {
                const updatedTypes = [...prev.types];
                updatedTypes[typeIndex] = {
                    ...updatedTypes[typeIndex],
                    steps: updatedTypes[typeIndex].steps.filter((_, i) => i !== stepIndex)
                };
                return { ...prev, types: updatedTypes };
            });
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        typeIndex: number,
        stepIndex?: number
    ) => {
        const { name, value } = e.target;

        if (name === 'category') {
            setFormData(prev => ({ ...prev, category: value }));
            return;
        }

        if (name === 'title' && stepIndex === undefined) {
            setFormData(prev => {
                const updatedTypes = [...prev.types];
                updatedTypes[typeIndex] = {
                    ...updatedTypes[typeIndex],
                    title: value
                };
                return { ...prev, types: updatedTypes };
            });
            return;
        }

        if (stepIndex !== undefined) {
            setFormData(prev => {
                const updatedTypes = [...prev.types];
                const updatedSteps = [...updatedTypes[typeIndex].steps];
                updatedSteps[stepIndex] = {
                    ...updatedSteps[stepIndex],
                    [name]: value
                };
                updatedTypes[typeIndex] = {
                    ...updatedTypes[typeIndex],
                    steps: updatedSteps
                };
                return { ...prev, types: updatedTypes };
            });
        }
    };

    const handleImageUpload = async (
        file: File,
        typeIndex: number,
        stepIndex: number
    ) => {
        try {
            setImageUploading(true);
            const imageUrl = await faqService.uploadImage(file);

            const updatedFormData = JSON.parse(JSON.stringify(formData)); // Deep clone
            updatedFormData.types[typeIndex].steps[stepIndex].image = imageUrl;

            // First update the form data
            await setFormData(updatedFormData);

            // Then if we're editing, update the FAQ
            if (isEditing && editingId) {
                await faqService.updateFAQ(editingId, updatedFormData);
                await loadFAQs();
            }
        } catch (error) {
            console.error('Error uploading image:', error);
        } finally {
            setImageUploading(false);
        }
    };

    const handleEdit = (faq: FAQ) => {
        setIsEditing(true);
        setEditingId(faq.id);
        setFormData({
            category: faq.category,
            types: faq.types,
            isActive: faq.isActive
        });
        const modal = document.getElementById('faq_modal') as HTMLDialogElement;
        modal?.showModal();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!formData.category || !formData.types.length) {
                throw new Error("Please fill all required fields");
            }

            const processedTypes = formData.types.map(type => ({
                title: type.title.trim(),
                steps: type.steps.map(step => ({
                    title: step.title.trim(),
                    text: step.text.trim(),
                    image: step.image
                }))
            }));

            const finalFormData: FAQFormData = {
                category: formData.category,
                types: processedTypes,
                isActive: formData.isActive
            };

            if (isEditing && editingId) {
                await faqService.updateFAQ(editingId, finalFormData);
            } else {
                await faqService.createFAQ(finalFormData);
            }

            await loadFAQs(); // Load FAQs terlebih dahulu

            // Tutup modal
            const modal = document.getElementById('faq_modal') as HTMLDialogElement;
            if (modal) {
                modal.close();
            }

            // Reset form setelah modal tertutup
            resetForm();

        } catch (error) {
            console.error('Error saving FAQ:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            category: '',
            types: [{
                title: '',
                steps: [{
                    title: '',
                    text: '',
                    image: ''
                }]
            }],
            isActive: true
        });
        setIsEditing(false);
        setEditingId(null);
    };

    const toggleFormSteps = (typeIndex: number) => {
        setExpandedFormSteps(prev => ({
            ...prev,
            [typeIndex]: !prev[typeIndex]
        }));
    };

    const toggleViewSteps = (typeIndex: number) => {
        setExpandedViewSteps(prev => ({
            ...prev,
            [typeIndex]: !prev[typeIndex]
        }));
    };

    const handleViewDetails = (faq: FAQ) => {
        setViewingFaq(faq);
        const modal = document.getElementById('view_modal') as HTMLDialogElement;
        modal?.showModal();
    };

    const toggleCard = (faqId: string) => {
        setExpandedCards(prev => ({
            ...prev,
            [faqId]: !prev[faqId]
        }));
    };

    if (loading) {
        return <FaqsSkelaton />;
    }

    return (
        <section className='min-h-full py-0 px-0 sm:py-4 sm:px-4'>
            {/* Header Section - Modern styling */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">FAQ Management</h1>
                    <p className="text-gray-600 mt-1">Manage your frequently asked questions and categories</p>
                </div>
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-sm hover:shadow-md w-full md:w-auto justify-center"
                    onClick={() => {
                        resetForm(); // Reset form before showing modal
                        const modal = document.getElementById('faq_modal') as HTMLDialogElement;
                        modal?.showModal();
                    }}
                >
                    <FiPlus className="w-5 h-5" />
                    Add New FAQ
                </button>
            </div>

            {/* FAQ Modal - Updated with wider layout */}
            <dialog id="faq_modal" className="modal">
                <div className="modal-box max-w-7xl bg-white rounded-xl shadow-2xl p-8 max-h-[95vh] overflow-y-auto">
                    <div className="sticky top-0 bg-white pb-4 border-b z-10 flex justify-between items-center">
                        <h3 className="text-2xl font-bold text-gray-900">
                            {isEditing ? 'Edit FAQ' : 'Add New FAQ'}
                        </h3>
                        <button
                            onClick={() => {
                                const modal = document.getElementById('faq_modal') as HTMLDialogElement;
                                modal.close();
                            }}
                            className="btn btn-circle btn-ghost btn-sm"
                        >
                            ✕
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-8 mt-8">
                        {/* Category Input - Wider layout */}
                        <div className="flex flex-col gap-3 max-w-2xl">
                            <label className="text-sm font-medium text-gray-700">
                                Category Name
                            </label>
                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={(e) => handleInputChange(e, 0)}
                                className="px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-gray-50 focus:bg-white"
                                placeholder="Enter category name"
                                required
                            />
                        </div>

                        {/* Types Section - Grid layout */}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            <div className="flex justify-between items-center col-span-full">
                                <h4 className="text-lg font-medium text-gray-900">Types</h4>
                                <button
                                    type="button"
                                    onClick={addNewType}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
                                >
                                    <FiPlus className="w-4 h-4" />
                                    Add Type
                                </button>
                            </div>

                            {formData.types.map((type, typeIndex) => (
                                <div key={typeIndex} className="flex flex-col gap-4 bg-gray-50 p-6 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200">
                                    <div className="flex justify-between items-center">
                                        <h5 className="font-medium text-gray-800">Type {typeIndex + 1}</h5>
                                        {formData.types.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeType(typeIndex)}
                                                className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200 text-sm font-medium"
                                            >
                                                Remove Type
                                            </button>
                                        )}
                                    </div>

                                    <input
                                        type="text"
                                        name="title"
                                        value={type.title}
                                        onChange={(e) => handleInputChange(e, typeIndex)}
                                        className="px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                        placeholder="Enter type title"
                                        required
                                    />

                                    {/* Steps Section - Updated grid */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        <div className="flex justify-between items-center col-span-full">
                                            <h6 className="font-medium text-gray-800">Steps</h6>
                                            <button
                                                type="button"
                                                onClick={() => addNewStep(typeIndex)}
                                                className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200 text-sm font-medium"
                                            >
                                                Add Step
                                            </button>
                                        </div>

                                        {type.steps
                                            .slice(0, expandedFormSteps[typeIndex] ? undefined : 1)
                                            .map((step, stepIndex) => (
                                                <div key={stepIndex} className="col-span-full flex flex-col gap-4 bg-white p-6 rounded-lg border border-gray-200">
                                                    <div className="flex justify-between items-center">
                                                        <h6 className="font-medium text-gray-800">Step {stepIndex + 1}</h6>
                                                        {type.steps.length > 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => removeStep(typeIndex, stepIndex)}
                                                                className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200 text-sm font-medium"
                                                            >
                                                                Remove Step
                                                            </button>
                                                        )}
                                                    </div>

                                                    <div className="flex flex-col gap-4">
                                                        <input
                                                            type="text"
                                                            name="title"
                                                            value={step.title}
                                                            onChange={(e) => handleInputChange(e, typeIndex, stepIndex)}
                                                            className="px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                                            placeholder="Enter step title"
                                                            required
                                                        />

                                                        <textarea
                                                            name="text"
                                                            value={step.text}
                                                            onChange={(e) => handleInputChange(e, typeIndex, stepIndex)}
                                                            className="px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 min-h-[100px]"
                                                            placeholder="Enter step description"
                                                            required
                                                        />

                                                        <div className="flex flex-col gap-2">
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(e) => {
                                                                    const file = e.target.files?.[0];
                                                                    if (file) {
                                                                        handleImageUpload(file, typeIndex, stepIndex);
                                                                    }
                                                                }}
                                                                className="file-input file-input-bordered w-full"
                                                                disabled={imageUploading}
                                                            />
                                                            {imageUploading && (
                                                                <div className="text-sm text-blue-600 flex items-center gap-2">
                                                                    <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                                                                    Uploading image...
                                                                </div>
                                                            )}
                                                            {step.image && (
                                                                <div className="mt-2">
                                                                    <Image
                                                                        src={step.image}
                                                                        alt={`Step ${stepIndex + 1}`}
                                                                        width={200}
                                                                        height={200}
                                                                        className="rounded-lg object-cover"
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                    {type.steps.length > 1 && (
                                        <div className="col-span-full">
                                            <button
                                                type="button"
                                                onClick={() => toggleFormSteps(typeIndex)}
                                                className="w-full text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center justify-center gap-2 py-2 mt-2"
                                            >
                                                {expandedFormSteps[typeIndex] ? (
                                                    <>
                                                        <FiChevronUp className="w-4 h-4" />
                                                        Show Less Steps
                                                    </>
                                                ) : (
                                                    <>
                                                        <FiChevronDown className="w-4 h-4" />
                                                        Show {type.steps.length - 1} More Steps
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Modal Actions */}
                        <div className="modal-action flex gap-3 pt-6 border-t sticky bottom-0 bg-white">
                            <button
                                type="submit"
                                className="flex-1 md:flex-none px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
                            >
                                {isEditing ? 'Update FAQ' : 'Save FAQ'}
                            </button>
                            <button
                                type="button"
                                className="flex-1 md:flex-none px-6 py-2.5 border border-gray-300 hover:border-gray-400 rounded-lg transition-colors duration-200 font-medium"
                                onClick={() => {
                                    const modal = document.getElementById('faq_modal') as HTMLDialogElement;
                                    modal.close();
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
                <form method="dialog" className="modal-backdrop bg-black/50">
                    <button>close</button>
                </form>
            </dialog>

            {/* Grid with preview and expandable content */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                {faqs.map((faq) => (
                    <div key={faq.id} className="bg-white rounded-lg border border-gray-200 p-5">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-medium text-gray-900">{faq.category}</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleViewDetails(faq)}
                                    className="text-gray-400 hover:text-blue-500"
                                >
                                    <FiEye className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleEdit(faq)}
                                    className="text-gray-400 hover:text-blue-500"
                                >
                                    <FiEdit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => faqService.deleteFAQ(faq.id)}
                                    className="text-gray-400 hover:text-red-500"
                                >
                                    <FiTrash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Preview content with show more functionality */}
                        <div className="space-y-3">
                            {faq.types
                                .slice(0, expandedCards[faq.id] ? undefined : 1)
                                .map((type, typeIndex) => (
                                    <div key={typeIndex} className="border-t pt-3">
                                        <h4 className="font-medium text-gray-800 mb-2">{type.title}</h4>
                                        <div className="text-sm text-gray-600">
                                            <p className="line-clamp-2">{type.steps[0]?.text}</p>
                                        </div>
                                    </div>
                                ))}

                            {faq.types.length > 1 && (
                                <button
                                    onClick={() => toggleCard(faq.id)}
                                    className="w-full text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center justify-center gap-1 mt-2 py-1 hover:bg-blue-50 rounded transition-colors"
                                >
                                    {expandedCards[faq.id] ? (
                                        <>
                                            <FiChevronUp className="w-4 h-4" />
                                            Show Less
                                        </>
                                    ) : (
                                        <>
                                            <FiChevronDown className="w-4 h-4" />
                                            Show {faq.types.length - 1} More Types
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* View Details Modal */}
            <dialog id="view_modal" className="modal">
                <div className="modal-box max-w-7xl bg-white rounded-xl shadow-2xl p-8">
                    {viewingFaq && (
                        <div className="flex flex-col gap-6">
                            {/* Header */}
                            <div className="flex justify-between items-start border-b pb-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                                            FAQ Details
                                        </span>
                                        <span className="text-gray-500">•</span>
                                        <span className="text-gray-500 text-sm">
                                            {viewingFaq.types.length} Types
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        {viewingFaq.category}
                                    </h3>
                                </div>
                                <button
                                    onClick={() => {
                                        const modal = document.getElementById('view_modal') as HTMLDialogElement;
                                        modal.close();
                                        setViewingFaq(null);
                                    }}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Content */}
                            <div className="grid gap-8">
                                {viewingFaq.types.map((type, typeIndex) => (
                                    <div key={typeIndex} className="bg-gray-50 rounded-xl p-6">
                                        {/* Type Header */}
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-sm">
                                                <span className="text-blue-600 font-semibold">
                                                    {typeIndex + 1}
                                                </span>
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-semibold text-gray-900">
                                                    {type.title}
                                                </h4>
                                                <p className="text-sm text-gray-500">
                                                    {type.steps.length} Steps Available
                                                </p>
                                            </div>
                                        </div>

                                        {/* Steps Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                            {type.steps
                                                .slice(0, expandedViewSteps[typeIndex] ? undefined : 1)
                                                .map((step, stepIndex) => (
                                                    <div
                                                        key={stepIndex}
                                                        className="group bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300"
                                                    >
                                                        {/* Step Header */}
                                                        <div className="flex items-center gap-3 mb-4">
                                                            <span className="flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
                                                                {stepIndex + 1}
                                                            </span>
                                                            <h5 className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                                                                {step.title}
                                                            </h5>
                                                        </div>

                                                        {/* Step Image */}
                                                        {step.image && (
                                                            <div className="relative aspect-video w-full mb-4 rounded-lg overflow-hidden">
                                                                <Image
                                                                    src={step.image}
                                                                    alt={step.title}
                                                                    fill
                                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                                />
                                                            </div>
                                                        )}

                                                        {/* Step Content */}
                                                        <p className="text-gray-600 text-sm leading-relaxed">
                                                            {step.text}
                                                        </p>
                                                    </div>
                                                ))}
                                        </div>

                                        {/* Show More Button */}
                                        {type.steps.length > 1 && (
                                            <div className="mt-4 flex justify-center">
                                                <button
                                                    onClick={() => toggleViewSteps(typeIndex)}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-100 border border-gray-200 rounded-full transition-all duration-200 text-sm font-medium text-gray-700 hover:text-blue-600"
                                                >
                                                    {expandedViewSteps[typeIndex] ? (
                                                        <>
                                                            <FiChevronUp className="w-4 h-4" />
                                                            Show Less Steps
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FiChevronDown className="w-4 h-4" />
                                                            View All {type.steps.length} Steps
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <form method="dialog" className="modal-backdrop bg-black/50">
                    <button>close</button>
                </form>
            </dialog>
        </section>
    );
}
