
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Monitor, Package, Briefcase, BookOpen, MessageSquare, FileText, Users, ShoppingBag, ShieldAlert, Plus, RefreshCw, Trash2, Calendar, Clock, Lock, Eye, Download, ExternalLink, ChevronDown, Search, Filter, X, Loader2, Star, AlertCircle, PlayCircle, Video, Layout, Settings, CheckCircle, DollarSign, Ban, LogOut, History, GraduationCap, ArrowLeft, Database, Image as ImageIcon, Send, ListPlus, Trash, FileJson, User as UserIcon, Globe, ShieldCheck, FileSpreadsheet, Sparkles
} from 'lucide-react';
import { authDb, orderDb, securityDb, blogDb, formDb, productDb, servicesDb, resourceDb, settingsDb } from '../services/localDb';
import { supabase } from '../services/supabase';
import { authService } from '../services/authService';
import { emailService } from '../services/emailService';
import type { User, Order, Product, ProfessionalService, ServiceCategory, ClientType, DocumentType, AccessType, ServiceResource, EbookResource, ResourceCategory } from '../types';
import { toast } from 'react-hot-toast';

// New Modular Admin Components
import AdminSidebar from '../components/admin/AdminSidebar';
import AssetLibrary from '../components/admin/AssetLibrary';
import AcademyAnalytics from '../components/admin/AcademyAnalytics';

const getDirectDriveLink = (url: string, type: 'image' | 'view' | 'download' = 'view') => {
    if (!url) return '';
    const regex = /(?:drive\.google\.com\/(?:file\/d\/|open\?id=)|d\/)([a-zA-Z0-9_-]{25,})/;
    const match = url.match(regex);
    if (!match) return url;
    const fileId = match[1];
    if (type === 'image') return `https://lh3.googleusercontent.com/d/${fileId}`;
    if (type === 'download') return `https://drive.google.com/uc?export=download&id=${fileId}`;
    return `https://drive.google.com/file/d/${fileId}/view`;
};

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'orders' | 'blogs' | 'forms' | 'logs' | 'store' | 'services' | 'resources' | 'settings' | 'academy-library' | 'academy-analytics' | 'internships'>('dashboard');

    // Data States
    const [users, setUsers] = useState<User[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [blogs, setBlogs] = useState<any[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [bookings, setBookings] = useState<any[]>([]);
    const [enrollments, setEnrollments] = useState<any[]>([]);
    const [securityLogs, setSecurityLogs] = useState<any[]>([]);
    const [services, setServices] = useState<ProfessionalService[]>([]);
    const [resources, setResources] = useState<EbookResource[]>([]);
    const [stats, setStats] = useState({ revenue: 0, totalOrders: 0, totalUsers: 0 });
    const [loading, setLoading] = useState(false);
    const [isSeeding, setIsSeeding] = useState(false);
    const [siteSettings, setSiteSettings] = useState(settingsDb.getSettings());
    const [showPreview, setShowPreview] = useState(false);

    // Form Modals State
    const [showProductModal, setShowProductModal] = useState(false);
    const [showBlogModal, setShowBlogModal] = useState(false);
    const [showServiceModal, setShowServiceModal] = useState(false);
    const [showUserModal, setShowUserModal] = useState(false);
    const [showReplyModal, setShowReplyModal] = useState(false);
    const [showResourceModal, setShowResourceModal] = useState(false);
    const [showResourcePreview, setShowResourcePreview] = useState(false);
    const [bulkResources, setBulkResources] = useState<any[]>([]);
    const [currentCsvFilename, setCurrentCsvFilename] = useState<string>('');
    const [csvUrl, setCsvUrl] = useState('');
    const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [resourceSearchQuery, setResourceSearchQuery] = useState('');
    const [resourceStatusFilter, setResourceStatusFilter] = useState<'all' | 'Active' | 'Inactive'>('all');
    const [resourceStatusUpdatingId, setResourceStatusUpdatingId] = useState<string | null>(null);

    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [activeInquiry, setActiveInquiry] = useState<any>(null);
    const [replyMessage, setReplyMessage] = useState('');

    // Advanced Product Form State
    const [newProduct, setNewProduct] = useState({
        title: '', type: 'Course' as 'Course' | 'E-Book' | 'Internship', price: 0, originalPrice: 0,
        image: '', description: '', author: 'Nagendra M', language: 'English',
        driveLink: '',
        youtubeLink: '',
        features: ['Expert Certification', 'Lifetime Access'],
        content: [{ title: 'Module 1: Getting Started', items: ['Introduction', 'Overview'] }]
    });
    const [editingProduct, setEditingProduct] = useState<string | null>(null);
    const [editingBlog, setEditingBlog] = useState<string | null>(null);
    const [editingService, setEditingService] = useState<string | null>(null);
    const [editingResource, setEditingResource] = useState<string | null>(null);

    const [newBlog, setNewBlog] = useState({
        title: '', category: 'Tax Update', excerpt: '', author: 'Nagendra M',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800',
        link: '', content: ''
    });

    const [newService, setNewService] = useState<Partial<ProfessionalService>>({
        name: '',
        category: 'Accounting',
        description: '',
        applicableClients: ['Businesses'],
        fees: '',
        status: 'Active',
        image: '',
        resources: []
    });

    const [newResource, setNewResource] = useState<any>({
        title: '',
        description: '',
        imageUrl: '',
        gdriveUrl: '',
        category: 'Notes',
        status: 'Active',
        buttonText: 'Download Now'
    });



    const handleBulkSubmit = async () => {
        if (bulkResources.length === 0) return;
        setIsSubmitting(true);
        try {
            const payload = bulkResources.map(item => ({
                title: item.title,
                description: item.description,
                image_url: item.imageUrl,
                gdrive_url: item.gdriveUrl,
                category: item.category,
                status: item.status || 'Active',
                button_text: item.buttonText || 'Download Now'
            }));

            const response = await fetch('/api/resources/bulk-upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ resources: payload, filename: currentCsvFilename })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to publish resources");
            }
            
            toast.success(`${bulkResources.length} resources published successfully`);
            setShowResourceModal(false);
            setBulkResources([]);
            setCurrentCsvFilename('');
            refreshData();
        } catch (error: any) {
            console.error("Bulk Import Error:", error);
            toast.error(error.message || "Failed to publish resources. Check RLS policies.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const processCsvText = (text: string, filename: string) => {
        const lines = text.split(/\r?\n/);
        if (lines.length < 2) {
            toast.error("CSV must have a header row and data.");
            return;
        }

        const parseCSVLine = (line: string) => {
            const result = [];
            let cell = '';
            let inQuotes = false;
            for (let i = 0; i < line.length; i++) {
                const char = line[i];
                if (char === '"') {
                    inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                    result.push(cell.trim());
                    cell = '';
                } else {
                    cell += char;
                }
            }
            result.push(cell.trim());
            return result;
        };

        const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase());
        const parsedItems: any[] = [];

        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            const values = parseCSVLine(lines[i]);
            const item: any = {
                status: 'Active',
                buttonText: 'Download Now'
            };

            headers.forEach((header, index) => {
                const val = values[index] || '';
                if (header.includes('title')) item.title = val;
                else if (header.includes('category')) item.category = val;
                else if (header.includes('image') || header.includes('img')) {
                    if (!header.includes('drive')) item.imageUrl = val;
                }
                else if (header.includes('desc')) item.description = val;
                else if (header.includes('drive') || header.includes('link') || header.includes('url')) {
                    item.gdriveUrl = val;
                }
            });

            if (item.title || item.gdriveUrl) parsedItems.push(item);
        }

        if (parsedItems.length > 0) {
            setBulkResources(prev => [...prev, ...parsedItems]);
            setCurrentCsvFilename(filename);
            toast.success(`Staged ${parsedItems.length} items from CSV`);
        } else {
            toast.error("No valid resources found in CSV.");
        }
    };

    const handleFetchCsvFromUrl = async () => {
        if (!csvUrl) {
            toast.error("Please provide a Google Drive CSV link");
            return;
        }
        setIsSubmitting(true);
        try {
            const response = await fetch(`/api/gdrive/fetch-csv?url=${encodeURIComponent(csvUrl)}`);
            if (!response.ok) throw new Error("Failed to fetch CSV from URL");
            const text = await response.text();
            processCsvText(text, "GDrive Remote Import");
            setCsvUrl('');
        } catch (error: any) {
            console.error("CSV Fetch Error:", error);
            toast.error(error.message || "Failed to fetch CSV from URL. ensure the file is shared properly.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const fetchGdriveMetadata = async (url: string) => {
        try {
            const response = await fetch(`/api/gdrive/metadata?url=${encodeURIComponent(url)}`);
            if (!response.ok) return null;
            return await response.json();
        } catch (error) {
            return null;
        }
    };

    const handleAutoFetchActiveResource = async () => {
        if (!newResource.gdriveUrl) {
            toast.error("Please provide a Google Drive URL first");
            return;
        }
        setIsFetchingMetadata(true);
        const data = await fetchGdriveMetadata(newResource.gdriveUrl);
        if (data) {
            setNewResource((prev: any) => ({
                ...prev,
                title: prev.title || data.title,
                description: prev.description || data.description
            }));
            toast.success("Metadata fetched successfully!");
        } else {
            toast.error("Failed to fetch metadata. check link permissions.");
        }
        setIsFetchingMetadata(false);
    };

    const handleFetchMetadataForAll = async () => {
        setIsFetchingMetadata(true);
        let count = 0;
        const updatedResources = await Promise.all(bulkResources.map(async (res) => {
            if ((!res.title || !res.description) && res.gdriveUrl) {
                const data = await fetchGdriveMetadata(res.gdriveUrl);
                if (data) {
                    count++;
                    return { ...res, title: res.title || data.title, description: res.description || data.description };
                }
            }
            return res;
        }));
        setBulkResources(updatedResources);
        toast.success(`Metadata fetched for ${count} items`);
        setIsFetchingMetadata(false);
    };

    const handleCsvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            processCsvText(text, file.name);
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    const refreshData = useCallback(async () => {
        setLoading(true);
        try {
            const [allUsers, allOrders, allStats, allBlogs, allSubmissions, allBookings, allEnrollments, allLogs, allProducts, allServices, allResources] = await Promise.all([
                authDb.getAllUsers(),
                orderDb.getAllOrders(),
                orderDb.getStats(),
                blogDb.getAll(),
                formDb.getContactSubmissions(),
                formDb.getBookings(),
                formDb.getEnrollments(),
                securityDb.getAllLogs(),
                productDb.getAll(),
                servicesDb.getAll(),
                resourceDb.getAll()
            ]);
            setUsers(allUsers);
            setOrders(allOrders);
            setStats(allStats);
            setBlogs(allBlogs);
            setSubmissions(allSubmissions);
            setBookings(allBookings);
            setEnrollments(allEnrollments);
            setSecurityLogs(allLogs);
            setProducts(allProducts);
            setServices(allServices);
            setResources(allResources);
        } catch (err) {
            console.error("Sync Error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    const checkAuth = useCallback(async () => {
        setIsCheckingAuth(true);
        const user = authService.getCurrentUser();

        if (!user) {
            navigate('/login');
            return;
        }

        if (user.role !== 'admin') {
            navigate('/');
            return;
        }

        setCurrentUser(user);
        setIsCheckingAuth(false);
        refreshData();
    }, [navigate, refreshData]);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const handleLogout = async () => {
        await authService.logout();
        navigate('/login');
    };

    // Helper to update features list
    const addFeature = () => setNewProduct({ ...newProduct, features: [...newProduct.features, ''] });
    const updateFeature = (idx: number, val: string) => {
        const f = [...newProduct.features];
        f[idx] = val;
        setNewProduct({ ...newProduct, features: f });
    };
    const removeFeature = (idx: number) => {
        const f = newProduct.features.filter((_, i) => i !== idx);
        setNewProduct({ ...newProduct, features: f });
    };

    // Helper to update syllabus modules
    const addModule = () => setNewProduct({ ...newProduct, content: [...newProduct.content, { title: '', items: [''] }] });
    const updateModuleTitle = (mIdx: number, val: string) => {
        const c = [...newProduct.content];
        c[mIdx].title = val;
        setNewProduct({ ...newProduct, content: c });
    };
    const addItemToModule = (mIdx: number) => {
        const c = [...newProduct.content];
        c[mIdx].items.push('');
        setNewProduct({ ...newProduct, content: c });
    };
    const updateModuleItem = (mIdx: number, iIdx: number, val: string) => {
        const c = [...newProduct.content];
        c[mIdx].items[iIdx] = val;
        setNewProduct({ ...newProduct, content: c });
    };
    const removeModule = (mIdx: number) => {
        const c = newProduct.content.filter((_, i) => i !== mIdx);
        setNewProduct({ ...newProduct, content: c });
    };

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newProduct.title || !newProduct.image || newProduct.price <= 0) {
            toast.error("Please fill all required fields");
            return;
        }

        setIsSubmitting(true);
        try {
            if (editingProduct) {
                await productDb.update(editingProduct, {
                    ...newProduct,
                    image: getDirectDriveLink(newProduct.image, 'image'),
                    driveLink: getDirectDriveLink(newProduct.driveLink, 'view'),
                    updatedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                });
                toast.success("Asset updated successfully!");
            } else {
                await productDb.create({
                    ...newProduct,
                    image: getDirectDriveLink(newProduct.image, 'image'),
                    driveLink: getDirectDriveLink(newProduct.driveLink, 'view'),
                    rating: 5.0,
                    students: 0,
                    updatedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                });
                toast.success("Asset published successfully!");
            }
            setShowProductModal(false);
            setEditingProduct(null);
            setNewProduct({
                title: '', type: 'Course', price: 0, originalPrice: 0,
                image: '', description: '', author: 'Nagendra M', language: 'English',
                driveLink: '',
                youtubeLink: '',
                features: ['Expert Certification', 'Lifetime Access'],
                content: [{ title: 'Module 1: Getting Started', items: ['Introduction', 'Overview'] }]
            });
            refreshData();
        } catch (err: any) {
            console.error("Product Action Error:", err);
            toast.error(err.message || (editingProduct ? "Error updating asset" : "Error creating asset"));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddBlog = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (editingBlog) {
                const { date, ...updatedBlog } = newBlog as any;
                await blogDb.update(editingBlog, updatedBlog);
                toast.success("Blog post updated!");
            } else {
                await blogDb.create({
                    ...newBlog,
                    image: getDirectDriveLink(newBlog.image, 'image'),
                    created_at: new Date().toISOString()
                });
                toast.success("Blog post published!");
            }
            setShowBlogModal(false);
            setEditingBlog(null);
            setNewBlog({
                title: '', category: 'Tax Update', excerpt: '', author: 'Nagendra M',
                image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800',
                link: '', content: ''
            });
            refreshData();
        } catch (err: any) {
            console.error("Blog Action Error:", err);
            toast.error(err.message || (editingBlog ? "Error updating blog" : "Error creating blog"));
        } finally {
            setIsSubmitting(false);
        }
    };

    const deleteProduct = async (id: string) => {
        if (window.confirm("Delete this product permanently?")) {
            await productDb.delete(id);
            toast.success("Product removed");
            refreshData();
        }
    };

    const deleteBlog = async (id: string) => {
        if (window.confirm("Delete this blog post?")) {
            await blogDb.delete(id);
            toast.success("Blog removed");
            refreshData();
        }
    };

    const deleteInquiry = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this inquiry?")) return;
        try {
            await formDb.deleteContact(id);
            toast.success("Inquiry deleted");
            refreshData();
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    const deleteBooking = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this booking?")) return;
        try {
            await formDb.deleteBooking(id);
            toast.success("Booking deleted");
            refreshData();
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    const deleteEnrollment = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this enrollment?")) return;
        try {
            await formDb.deleteEnrollment(id);
            toast.success("Enrollment deleted");
            refreshData();
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    const handleAddService = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // Process Image URL if present
            const processedService = {
                ...newService,
                image: getDirectDriveLink(newService.image || '', 'image')
            };

            if (editingService) {
                await servicesDb.update(editingService, processedService);
                if (currentUser) await securityDb.addLog(currentUser.id, `Updated Service: ${processedService.name}`, 'success');
                toast.success("Service updated!");
            } else {
                await servicesDb.create(processedService);
                if (currentUser) await securityDb.addLog(currentUser.id, `Created Service: ${processedService.name}`, 'success');
                toast.success("Service published!");
            }
            setShowServiceModal(false);
            setEditingService(null);
            setNewService({
                name: '', category: 'Accounting', description: '', applicableClients: ['Businesses'],
                fees: '', status: 'Active', resources: []
            });
            refreshData();
        } catch (err: any) {
            console.error("Service Action Error:", err);
            toast.error(err.message || "Error saving service");
        } finally {
            setIsSubmitting(false);
        }
    };

    const deleteService = async (id: string) => {
        if (window.confirm("Archiving this service will remove it from public view. Proceed?")) {
            await servicesDb.delete(id);
            if (currentUser) await securityDb.addLog(currentUser.id, `Deleted Service ID: ${id}`, 'success');
            toast.success("Service removed");
            refreshData();
        }
    };

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;
        setIsSubmitting(true);
        try {
            await authDb.updateUser(editingUser.id, editingUser);
            toast.success("User profile updated!");
            setShowUserModal(false);
            setEditingUser(null);
            refreshData();
        } catch (err: any) {
            console.error("User Update Error:", err);
            toast.error(err.message || "Error updating user");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSendReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeInquiry || !replyMessage) return;
        setIsSubmitting(true);
        try {
            await emailService.sendEmail(
                activeInquiry.email,
                `Reply to your inquiry: ${activeInquiry.service || 'General'}`,
                `<div style="font-family: sans-serif; padding: 20px; color: #1e293b;">
                    <h2 style="color: #2563eb;">SN Associates & Co</h2>
                    <p>Hello ${activeInquiry.name.split(' ')[0]},</p>
                    <p>${replyMessage}</p>
                    <div style="margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
                        <p style="font-size: 12px; color: #64748b;">Best Regards,<br/><b>Team SN Associates & Co</b></p>
                    </div>
                </div>`
            );
            toast.success("Reply sent successfully!");
            setShowReplyModal(false);
            setReplyMessage('');
            setActiveInquiry(null);
        } catch (err) {
            toast.error("Failed to send reply");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddResource = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        let processedResource = {
            ...newResource,
            imageUrl: getDirectDriveLink(newResource.imageUrl || '', 'image'),
            gdriveUrl: getDirectDriveLink(newResource.gdriveUrl || '', 'view')
        };

        try {
            if (editingResource) {
                await resourceDb.update(editingResource, processedResource);
                if (currentUser) await securityDb.addLog(currentUser.id, `Updated Resource: ${newResource.title}`, 'success');
                toast.success("Resource updated");
            } else {
                await resourceDb.create(processedResource);
                if (currentUser) await securityDb.addLog(currentUser.id, `Created Resource: ${newResource.title}`, 'success');
                toast.success("New resource published");
            }
            setShowResourceModal(false);
            setEditingResource(null);
            setNewResource({
                title: '', description: '', imageUrl: '', gdriveUrl: '',
                category: 'Notes', status: 'Active', buttonText: 'Download Now'
            });
            refreshData();
        } catch (error: any) {
            console.error("Resource management error:", error);
            toast.error(error.message || "Operation failed. Check admin permissions.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const deleteResource = async (id: string) => {
        if (window.confirm("Delete this resource permanently?")) {
            try {
                await resourceDb.delete(id);
                if (currentUser) await securityDb.addLog(currentUser.id, `Deleted Resource ID: ${id}`, 'success');
                toast.success("Resource removed");
                refreshData();
            } catch (error: any) {
                console.error("Delete Resource Error:", error);
                toast.error(error.message || "Failed to delete resource. Check admin permissions.");
            }
        }
    };

    const toggleResourceStatus = async (resource: EbookResource) => {
        setResourceStatusUpdatingId(resource.id);
        try {
            await resourceDb.toggleStatus(resource.id, resource.status);
            const nextStatus = resource.status === 'Active' ? 'Inactive' : 'Active';
            if (currentUser) {
                await securityDb.addLog(currentUser.id, `${nextStatus === 'Active' ? 'Activated' : 'Deactivated'} Resource: ${resource.title}`, 'success');
            }
            toast.success(`Resource marked as ${nextStatus}`);
            refreshData();
        } catch (error: any) {
            console.error("Toggle Resource Status Error:", error);
            toast.error(error.message || "Failed to update resource status.");
        } finally {
            setResourceStatusUpdatingId(null);
        }
    };

    const addResource = () => {
        const resources = [...(newService.resources || [])];
        resources.push({ id: Math.random().toString(36).substr(2, 9), name: '', link: '', type: 'Forms', access: 'View Only', isPublic: true });
        setNewService({ ...newService, resources });
    };

    const updateResource = (idx: number, field: keyof ServiceResource, val: any) => {
        const resources = [...(newService.resources || [])];
        resources[idx] = { ...resources[idx], [field]: val };
        setNewService({ ...newService, resources });
    };

    const removeResource = (idx: number) => {
        const resources = (newService.resources || []).filter((_, i) => i !== idx);
        setNewService({ ...newService, resources });
    };

    const normalizedResourceQuery = resourceSearchQuery.trim().toLowerCase();
    const filteredResources = resources.filter(resource => {
        const matchesQuery = !normalizedResourceQuery || [resource.title, resource.category, resource.description]
            .filter(Boolean)
            .some(value => value.toLowerCase().includes(normalizedResourceQuery));
        const matchesStatus = resourceStatusFilter === 'all' || resource.status === resourceStatusFilter;

        return matchesQuery && matchesStatus;
    });

    const resourceSummaryCards = [
        {
            label: 'Total Resources',
            value: resources.length,
            tone: 'bg-blue-50 text-blue-600 border-blue-100'
        },
        {
            label: 'Active',
            value: resources.filter(resource => resource.status === 'Active').length,
            tone: 'bg-emerald-50 text-emerald-600 border-emerald-100'
        },
        {
            label: 'Inactive',
            value: resources.filter(resource => resource.status === 'Inactive').length,
            tone: 'bg-slate-100 text-slate-600 border-slate-200'
        }
    ];

    if (isCheckingAuth) return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center flex-col gap-4">
            <Loader2 className="animate-spin text-blue-500" size={40} />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Authorizing Admin Session...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex h-screen overflow-hidden">
            <AdminSidebar 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                onLogout={handleLogout} 
            />

            <main className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-hidden">
                <header className="flex justify-between items-center px-8 py-6 bg-white border-b border-slate-100 z-10 shrink-0">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            {activeTab.replace('-', ' ').toUpperCase()}
                            {loading && <Loader2 size={18} className="animate-spin text-blue-600" />}
                        </h2>
                        <div className="flex items-center gap-2 text-slate-400 mt-1">
                            <span className="text-[10px] font-black uppercase tracking-widest italic opacity-60">Session ID: {currentUser?.id?.slice(0, 8)}</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                         <button onClick={refreshData} disabled={loading} className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-xl transition-all">
                            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                        </button>
                        <div className="h-10 w-[1px] bg-slate-100 mx-2"></div>
                        <div className="flex items-center gap-3 bg-slate-50 p-1.5 pr-4 rounded-xl border border-slate-100">
                            <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                                {currentUser?.name.charAt(0)}
                            </div>
                            <div className="text-left">
                                <p className="text-xs font-bold text-slate-900 leading-none">{currentUser?.name}</p>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1">Active Admin</p>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-10 animate-fadeIn custom-scrollbar">
                    <div className="max-w-[1600px] mx-auto w-full">
                    {activeTab === 'academy-library' && <AssetLibrary hideHeader={false} />}
                    {activeTab === 'internships' && <AssetLibrary typeFilter="internship" hideHeader={false} />}
                    {activeTab === 'academy-analytics' && <AcademyAnalytics />}
                    {activeTab === 'dashboard' && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 relative overflow-hidden group hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-500">
                                <div className="absolute -right-4 -bottom-4 bg-emerald-500/5 w-24 h-24 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6"><DollarSign size={24} /></div>
                                <p className="text-slate-500 text-xs font-black uppercase tracking-[0.15em] mb-2">Total Revenue Generated</p>
                                <h3 className="text-4xl font-extrabold text-slate-950 tracking-tighter">Rs. {stats.revenue.toLocaleString()}</h3>
                                <div className="flex items-center gap-2 mt-4 text-emerald-600 font-bold text-[10px] uppercase">
                                    <span className="flex items-center gap-0.5"><Plus size={10} /> 12%</span>
                                    <span className="text-slate-400 font-medium">vs last month</span>
                                </div>
                            </div>
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 relative overflow-hidden group hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500">
                                <div className="absolute -right-4 -bottom-4 bg-blue-500/5 w-24 h-24 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6"><ShoppingBag size={24} /></div>
                                <p className="text-slate-500 text-xs font-black uppercase tracking-[0.15em] mb-2">Processed Orders</p>
                                <h3 className="text-4xl font-extrabold text-slate-950 tracking-tighter">{stats.totalOrders}</h3>
                                <div className="flex items-center gap-2 mt-4 text-blue-600 font-bold text-[10px] uppercase">
                                    <span className="flex items-center gap-0.5">Active Flow</span>
                                </div>
                            </div>
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 relative overflow-hidden group hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-500">
                                <div className="absolute -right-4 -bottom-4 bg-purple-500/5 w-24 h-24 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6"><Users size={24} /></div>
                                <p className="text-slate-500 text-xs font-black uppercase tracking-[0.15em] mb-2">Registered Users</p>
                                <h3 className="text-4xl font-extrabold text-slate-950 tracking-tighter">{stats.totalUsers}</h3>
                                <div className="flex items-center gap-2 mt-4 text-purple-600 font-bold text-[10px] uppercase">
                                    <span className="flex items-center gap-0.5">Verified Clients</span>
                                </div>
                            </div>
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 relative overflow-hidden group hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-500">
                                <div className="absolute -right-4 -bottom-4 bg-amber-500/5 w-24 h-24 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6"><History size={24} /></div>
                                <p className="text-slate-500 text-xs font-black uppercase tracking-[0.15em] mb-2">System Events</p>
                                <h3 className="text-4xl font-extrabold text-slate-950 tracking-tighter">{securityLogs.length}</h3>
                                <div className="flex items-center gap-2 mt-4 text-amber-600 font-bold text-[10px] uppercase">
                                    <span className="flex items-center gap-0.5">Last 24 Hours</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab Rendering Logic Continued... */}
                    {activeTab === 'store' && (
                        <div className="space-y-8">
                            <div className="flex justify-between items-center bg-white px-10 py-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                                <div>
                                    <h3 className="text-xl font-extrabold text-slate-950 tracking-tight">Academy Asset Library</h3>
                                    <p className="text-slate-500 text-sm mt-1">Manage courses, e-books, and internship programs.</p>
                                </div>
                                <button onClick={() => {
                                    setEditingProduct(null);
                                    setNewProduct({
                                        title: '', type: 'Course', price: 0, originalPrice: 0,
                                        image: '', description: '', author: 'Nagendra M', language: 'English',
                                        driveLink: '',
                                        features: ['Expert Certification', 'Lifetime Access'],
                                        content: [{ title: 'Module 1: Getting Started', items: ['Introduction', 'Overview'] }]
                                    });
                                    setShowProductModal(true);
                                }} className="bg-slate-950 text-white px-8 py-4 rounded-2xl flex items-center gap-3 text-sm font-bold hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-500/20 transition-all active:scale-95 shadow-lg shadow-slate-950/10">
                                    <Plus size={20} /> Publish New Asset
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {products.map(p => (
                                    <div key={p.id} className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden group hover:border-blue-400 hover:shadow-2xl transition-all duration-500">
                                        <div className="relative h-56 overflow-hidden">
                                            <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                            <div className="absolute top-4 left-4 bg-slate-950/90 backdrop-blur-md text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10">{p.type}</div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        </div>
                                        <div className="p-8">
                                            <h4 className="font-extrabold text-lg text-slate-950 leading-tight mb-2 line-clamp-2">{p.title}</h4>
                                            <div className="flex items-center gap-3 text-slate-500 text-xs font-medium mb-6">
                                                <UserIcon size={14} className="text-blue-500" /> {p.author}
                                            </div>
                                            <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                                                <div className="bg-slate-950 text-white px-4 py-2 rounded-xl flex items-center gap-2">
                                                    <span className="text-xs font-bold opacity-70">Rs.</span>
                                                    <span className="text-lg font-black">{p.price}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => {
                                                        setEditingProduct(p.id);
                                                        setNewProduct({
                                                            title: p.title, type: p.type as any, price: p.price, originalPrice: p.originalPrice,
                                                            image: p.image, description: p.description, author: p.author, language: p.language,
                                                            driveLink: p.driveLink,
                                                            youtubeLink: p.youtubeLink || '',
                                                            features: p.features, content: p.content as any
                                                        });
                                                        setShowProductModal(true);
                                                    }} className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white rounded-xl transition-all">
                                                        <RefreshCw size={16} />
                                                    </button>
                                                    <button onClick={() => deleteProduct(p.id)} className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-red-500 hover:text-white rounded-xl transition-all">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'forms' && (
                        <div className="space-y-10">
                            {/* MASTER DATABASE HERO */}
                            <div className="bg-slate-950 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-110 transition duration-1000 rotate-12">
                                    <Database size={240} />
                                </div>
                                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
                                    <div className="text-center lg:text-left">
                                        <div className="flex items-center gap-3 justify-center lg:justify-start mb-6">
                                            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20"><Database size={24} /></div>
                                            <span className="text-xs font-black uppercase tracking-[0.3em] text-blue-400">Synchronization Active</span>
                                        </div>
                                        <h3 className="text-4xl font-extrabold mb-4 tracking-tight">Master Regulatory Database</h3>
                                        <p className="text-slate-400 text-lg max-w-2xl font-medium leading-relaxed">
                                            Access the complete transactional record in Google Sheets. All real-time inquiries, bookings, and student enrollments are synchronized here.
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-center lg:items-end gap-3">
                                        <a
                                            href="https://docs.google.com/spreadsheets/d/1pnQ2Hfot6npTXcp01P8SPpjzb9m3hWPboHo_EuF9big/edit?gid=0#gid=0"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-white text-slate-950 px-10 py-5 rounded-[1.5rem] font-bold text-base flex items-center gap-3 shadow-xl hover:shadow-blue-500/20 transition-all active:scale-95 group/btn"
                                        >
                                            Launch Sheet <ExternalLink size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </a>
                                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest text-center lg:text-right">
                                            Need to sync your own? Check <span className="text-white underline cursor-help" title="Refer to GOOGLE_SHEETS_SETUP.md in artifacts">Setup Guide</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* INQUIRIES SECTION */}
                            <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
                                <div className="px-10 py-8 bg-white border-b border-slate-100 flex justify-between items-center">
                                    <div>
                                        <h3 className="text-xl font-extrabold text-slate-950 tracking-tight">Consultation Inquiries</h3>
                                        <p className="text-slate-500 text-sm mt-1">Manage inbound leads and professional service requests.</p>
                                    </div>
                                    <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-2xl border border-blue-100">
                                        <span className="text-xs font-black text-blue-600 uppercase tracking-widest">Active Requests:</span>
                                        <span className="text-lg font-black text-blue-600 leading-none">{submissions.length}</span>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50/50 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] border-b border-slate-100">
                                                <th className="px-10 py-6">Lead Identity</th>
                                                <th className="px-6 py-6 text-center">Inquiry Scope</th>
                                                <th className="px-6 py-6">Message Content</th>
                                                <th className="px-6 py-6">Timestamp</th>
                                                <th className="px-10 py-6 text-right">Engagement</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {submissions.map((s, idx) => (
                                                <tr key={idx} className="hover:bg-slate-50/50 transition duration-300">
                                                    <td className="px-10 py-6">
                                                        <div className="font-extrabold text-slate-950 text-sm">{s.name}</div>
                                                        <div className="text-[11px] text-slate-500 font-medium mt-0.5">{s.email}</div>
                                                    </td>
                                                    <td className="px-6 py-6">
                                                        <div className="flex justify-center">
                                                            <span className="bg-white border border-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-xl text-[10px] uppercase tracking-wider shadow-sm">{s.service || 'General'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-6">
                                                        <p className="text-slate-600 text-xs font-medium max-w-xs line-clamp-2 leading-relaxed">{s.message}</p>
                                                    </td>
                                                    <td className="px-6 py-6">
                                                        <div className="flex items-center gap-2 text-slate-400">
                                                            <Calendar size={12} />
                                                            <span className="text-[10px] font-black uppercase tracking-widest">{new Date(s.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-10 py-6 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => {
                                                                    setActiveInquiry(s);
                                                                    setShowReplyModal(true);
                                                                }}
                                                                className="bg-slate-950 text-white px-4 py-2 rounded-xl font-bold text-[10px] hover:bg-blue-600 transition duration-300 shadow-lg shadow-slate-950/10 flex items-center gap-2 uppercase tracking-wider"
                                                            >
                                                                <Send size={12} /> Respond
                                                            </button>
                                                            <button
                                                                onClick={() => deleteInquiry(s.id)}
                                                                className="bg-red-50 text-red-500 p-2 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* BOOKINGS SECTION */}
                            <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
                                <div className="px-10 py-8 bg-white border-b border-slate-100 flex justify-between items-center">
                                    <div>
                                        <h3 className="text-xl font-extrabold text-slate-950 tracking-tight">Consultation Bookings</h3>
                                        <p className="text-slate-500 text-sm mt-1">Track scheduled advisory sessions and appointments.</p>
                                    </div>
                                    <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100">
                                        <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">Confirmed:</span>
                                        <span className="text-lg font-black text-emerald-600 leading-none">{bookings.length}</span>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50/50 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] border-b border-slate-100">
                                                <th className="px-10 py-6">Client Profile</th>
                                                <th className="px-6 py-6 text-center">Schedule</th>
                                                <th className="px-6 py-6">Transaction ID</th>
                                                <th className="px-10 py-6 text-right">Management</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {bookings.map((b, idx) => (
                                                <tr key={idx} className="hover:bg-slate-50/50 transition duration-300">
                                                    <td className="px-10 py-6">
                                                        <div className="font-extrabold text-slate-950 text-sm">{b.name}</div>
                                                        <div className="text-[11px] text-slate-500 font-medium mt-0.5">{b.email}</div>
                                                    </td>
                                                    <td className="px-6 py-6">
                                                        <div className="flex flex-col items-center">
                                                            <span className="bg-blue-600 text-white font-black px-3 py-1 rounded-lg text-[10px] uppercase tracking-wider">{b.date}</span>
                                                            <span className="text-[11px] text-slate-500 font-bold mt-1 uppercase tracking-widest">{b.time}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-6">
                                                        <code className="text-[10px] bg-slate-100 text-slate-500 px-2.5 py-1.5 rounded-lg font-mono font-bold">{b.payment_id || 'N/A'}</code>
                                                    </td>
                                                    <td className="px-10 py-6 text-right">
                                                       <button
                                                           onClick={() => deleteBooking(b.id)}
                                                           className="bg-red-50 text-red-500 p-2.5 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm ml-auto flex items-center justify-center"
                                                       >
                                                           <Trash2 size={16} />
                                                       </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* ENROLLMENTS SECTION */}
                            <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
                                <div className="px-10 py-8 bg-white border-b border-slate-100 flex justify-between items-center">
                                    <div>
                                        <h3 className="text-xl font-extrabold text-slate-950 tracking-tight">Academy Enrollments</h3>
                                        <p className="text-slate-500 text-sm mt-1">Monitor internship registrations and program participants.</p>
                                    </div>
                                    <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-100">
                                        <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">Enrolled:</span>
                                        <span className="text-lg font-black text-indigo-600 leading-none">{enrollments.length}</span>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50/50 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] border-b border-slate-100">
                                                <th className="px-10 py-6">Student Identity</th>
                                                <th className="px-6 py-6">Academic/Professional</th>
                                                <th className="px-6 py-6 text-center">Program</th>
                                                <th className="px-6 py-6 text-center">Status</th>
                                                <th className="px-10 py-6 text-right">Management</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {enrollments.map((e, idx) => (
                                                <tr key={idx} className="hover:bg-slate-50/50 transition duration-300">
                                                    <td className="px-10 py-6">
                                                        <div className="font-extrabold text-slate-950 text-sm">{e.name}</div>
                                                        <div className="text-[11px] text-slate-500 font-medium mt-0.5">{e.email}</div>
                                                    </td>
                                                    <td className="px-6 py-6">
                                                        <div className="text-slate-600 text-xs font-bold leading-relaxed max-w-[200px] line-clamp-1">{e.college_profession}</div>
                                                     </td>
                                                     <td className="px-6 py-6">
                                                         <div className="flex justify-center">
                                                            <span className="bg-indigo-600 text-white font-black px-3 py-1 rounded-lg text-[9px] uppercase tracking-wider whitespace-nowrap">{e.program}</span>
                                                         </div>
                                                     </td>
                                                     <td className="px-6 py-6">
                                                         <div className="flex justify-center">
                                                            <span className="bg-emerald-50 text-emerald-700 font-black px-3 py-1 rounded-lg text-[9px] uppercase tracking-wider border border-emerald-100">{e.payment_status || 'Paid'}</span>
                                                         </div>
                                                     </td>
                                                     <td className="px-10 py-6 text-right">
                                                        <button
                                                            onClick={() => deleteEnrollment(e.id)}
                                                            className="bg-red-50 text-red-500 p-2.5 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm ml-auto flex items-center justify-center"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                     </td>
                                                 </tr>
                                             ))}
                                         </tbody>
                                     </table>
                                 </div>
                             </div>
                        </div>
                    )}

                    {activeTab === 'blogs' && (
                        <div className="space-y-8">
                            <div className="flex justify-between items-center bg-white px-10 py-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                                <div>
                                    <h3 className="text-xl font-extrabold text-slate-950 tracking-tight">Editorial & News Stream</h3>
                                    <p className="text-slate-500 text-sm mt-1">Control your public messaging and regulatory updates.</p>
                                </div>
                                <button onClick={() => {
                                    setEditingBlog(null);
                                    setNewBlog({
                                        title: '', category: 'Tax Update', excerpt: '', author: 'Nagendra M',
                                        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800',
                                        link: '', content: ''
                                    });
                                    setShowBlogModal(true);
                                }} className="bg-slate-950 text-white px-8 py-4 rounded-2xl flex items-center gap-3 text-sm font-bold hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-500/20 transition-all active:scale-95 shadow-lg shadow-slate-950/10">
                                    <Plus size={20} /> Write New Entry
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {blogs.map(b => (
                                    <div key={b.id} className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden group hover:border-blue-400 hover:shadow-2xl transition-all duration-500">
                                        <div className="relative h-56 overflow-hidden">
                                            <img src={b.image} alt={b.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                            <div className="absolute top-4 left-4 bg-slate-950/90 backdrop-blur-md text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10">{b.category}</div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        </div>
                                        <div className="p-8">
                                            <h4 className="font-extrabold text-lg text-slate-950 leading-tight mb-3 line-clamp-2">{b.title}</h4>
                                            <p className="text-slate-500 text-xs font-medium line-clamp-2 leading-relaxed mb-6">{b.excerpt}</p>
                                            <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                                                <div className="flex items-center gap-2 text-slate-400">
                                                    <Calendar size={12} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">{b.date}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => {
                                                        setEditingBlog(b.id);
                                                        setNewBlog({
                                                            title: b.title, category: b.category, excerpt: b.excerpt,
                                                            author: b.author, image: b.image, link: b.link || '', content: b.content || ''
                                                        });
                                                        setShowBlogModal(true);
                                                    }} className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white rounded-xl transition-all">
                                                        <RefreshCw size={16} />
                                                    </button>
                                                    <button onClick={() => deleteBlog(b.id)} className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-red-500 hover:text-white rounded-xl transition-all">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
                            <div className="px-10 py-8 bg-white border-b border-slate-100 flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-extrabold text-slate-950 tracking-tight">Client Access Directory</h3>
                                    <p className="text-slate-500 text-sm mt-1">Audit and manage professional platform accounts.</p>
                                </div>
                                <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-[0.2em]">{users.length} Registered Accounts</div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/50 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] border-b border-slate-100">
                                            <th className="px-10 py-6">Identity Profile</th>
                                            <th className="px-6 py-6">Communication</th>
                                            <th className="px-6 py-6 text-center">System Role</th>
                                            <th className="px-6 py-6 text-center">Access State</th>
                                            <th className="px-10 py-6 text-right">Administrative</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {users.map((u) => (
                                            <tr key={u.id} className="hover:bg-slate-50/50 transition duration-300">
                                                <td className="px-10 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-slate-900 text-white rounded-[0.85rem] flex items-center justify-center font-bold text-sm shadow-lg shadow-slate-900/10">
                                                            {u.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="font-extrabold text-slate-950 text-sm">{u.name}</div>
                                                            <div className="text-[11px] text-slate-500 font-medium mt-0.5">{u.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6">
                                                    <div className="flex items-center gap-2 text-slate-600 font-semibold text-xs transition hover:text-blue-600 cursor-pointer">
                                                        <Clock size={14} className="text-slate-300" /> {u.phone || 'Contact pending'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6">
                                                    <div className="flex justify-center">
                                                        <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-xl shadow-sm border ${u.role === 'admin' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-slate-50 text-slate-700 border-slate-100'}`}>{u.role}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6">
                                                    <div className="flex justify-center">
                                                        <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase px-3 py-1 rounded-xl border ${u.isBlocked ? 'bg-red-50 text-red-700 border-red-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>
                                                            <div className={`w-1.5 h-1.5 rounded-full ${u.isBlocked ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                                                            {u.isBlocked ? 'Access Restricted' : 'Active Channel'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-6 text-right">
                                                    <div className="flex justify-end gap-3">
                                                        <button onClick={() => {
                                                            setEditingUser(u);
                                                            setShowUserModal(true);
                                                        }} className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm">
                                                            <RefreshCw size={14} />
                                                        </button>
                                                        <button onClick={() => {
                                                            if (window.confirm(`Are you sure you want to ${u.isBlocked ? 'unblock' : 'block'} this user?`)) {
                                                                authDb.toggleUserBlock(u.id).then(() => refreshData());
                                                            }
                                                        }} className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all shadow-sm ${u.isBlocked ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white' : 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white'}`}>
                                                            {u.isBlocked ? <CheckCircle size={16} /> : <Ban size={16} />}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
                            <div className="px-10 py-8 bg-white border-b border-slate-100 flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-extrabold text-slate-950 tracking-tight">Financial Transaction Log</h3>
                                    <p className="text-slate-500 text-sm mt-1">Audit and track all academy revenue streams.</p>
                                </div>
                                <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-[0.2em]">{orders.length} Processed Transactions</div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/50 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] border-b border-slate-100">
                                            <th className="px-10 py-6">Transaction ID</th>
                                            <th className="px-6 py-6 font-bold">Identity Profile</th>
                                            <th className="px-6 py-6 text-center">Amount</th>
                                            <th className="px-6 py-6 text-center">Protocol State</th>
                                            <th className="px-10 py-6 text-right">Timestamp</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {orders.map((o) => (
                                            <tr key={o.id} className="hover:bg-slate-50/50 transition duration-300">
                                                <td className="px-10 py-6">
                                                    <code className="text-[10px] bg-slate-100 text-slate-500 px-2.5 py-1.5 rounded-lg font-mono font-bold">{o.id}</code>
                                                </td>
                                                <td className="px-6 py-6">
                                                    <div className="font-extrabold text-slate-950 text-sm">{o.userName}</div>
                                                    <div className="text-[11px] text-slate-500 font-medium mt-0.5">{o.userEmail}</div>
                                                </td>
                                                <td className="px-6 py-6 text-center">
                                                    <span className="font-black text-slate-950 text-2xl">₹{o.totalAmount.toLocaleString()}</span>
                                                </td>
                                                <td className="px-6 py-6">
                                                    <div className="flex justify-center">
                                                        <span className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-xl border shadow-sm ${o.status === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'}`}>{o.status}</span>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-6 text-right">
                                                    <div className="flex items-center justify-end gap-2 text-slate-400">
                                                        <Clock size={12} />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">{new Date(o.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="space-y-10">
                            <div className="bg-slate-950 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12">
                                    <Settings size={240} />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20"><Settings size={24} /></div>
                                        <span className="text-xs font-black uppercase tracking-[0.3em] text-blue-400">System Configuration</span>
                                    </div>
                                    <h3 className="text-4xl font-extrabold mb-4 tracking-tight">Global Site Settings</h3>
                                    <p className="text-slate-400 text-lg max-w-2xl font-medium leading-relaxed">
                                        Manage visual preferences and system-wide configurations. Changes here reflect immediately across the public platform.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
                                    <h4 className="text-xl font-extrabold text-slate-950 mb-6 flex items-center gap-3">
                                        <Layout size={20} className="text-blue-600" /> Typography Control
                                    </h4>

                                    <div className="space-y-8">
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Home Hero Heading</label>
                                                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Current: {siteSettings.homeHeroTitleSize}</span>
                                            </div>
                                            <select
                                                title="Home Hero Heading Size"
                                                value={siteSettings.homeHeroTitleSize}
                                                onChange={(e) => {
                                                    const newSettings = { ...siteSettings, homeHeroTitleSize: e.target.value };
                                                    setSiteSettings(newSettings);
                                                    settingsDb.saveSettings(newSettings);
                                                    toast.success("Hero font size updated!");
                                                }}
                                                className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:border-blue-500 transition-all cursor-pointer"
                                            >
                                                <option value="text-4xl md:text-5xl">Small (4xl/5xl)</option>
                                                <option value="text-5xl md:text-6xl">Medium (5xl/6xl)</option>
                                                <option value="text-5xl md:text-7xl">Standard (5xl/7xl)</option>
                                                <option value="text-6xl md:text-8xl">Large (6xl/8xl)</option>
                                                <option value="text-7xl md:text-9xl">Extra Large (7xl/9xl)</option>
                                            </select>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Section Headings</label>
                                                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Current: {siteSettings.homeSectionTitleSize}</span>
                                            </div>
                                            <select
                                                title="Section Heading Size"
                                                value={siteSettings.homeSectionTitleSize}
                                                onChange={(e) => {
                                                    const newSettings = { ...siteSettings, homeSectionTitleSize: e.target.value };
                                                    setSiteSettings(newSettings);
                                                    settingsDb.saveSettings(newSettings);
                                                    toast.success("Section font size updated!");
                                                }}
                                                className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:border-blue-500 transition-all cursor-pointer"
                                            >
                                                <option value="text-2xl md:text-3xl">Compact (2xl/3xl)</option>
                                                <option value="text-3xl md:text-4xl">Medium (3xl/4xl)</option>
                                                <option value="text-4xl md:text-5xl">Standard (4xl/5xl)</option>
                                                <option value="text-5xl md:text-6xl">Large (5xl/6xl)</option>
                                            </select>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Service Card Titles</label>
                                                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Current: {siteSettings.serviceTitleSize}</span>
                                            </div>
                                            <select
                                                title="Service Card Title Size"
                                                value={siteSettings.serviceTitleSize}
                                                onChange={(e) => {
                                                    const newSettings = { ...siteSettings, serviceTitleSize: e.target.value };
                                                    setSiteSettings(newSettings);
                                                    settingsDb.saveSettings(newSettings);
                                                    toast.success("Service card font size updated!");
                                                }}
                                                className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:border-blue-500 transition-all cursor-pointer"
                                            >
                                                <option value="text-lg">Small (lg)</option>
                                                <option value="text-xl">Medium (xl)</option>
                                                <option value="text-2xl">Large (2xl)</option>
                                                <option value="text-3xl">Extra Large (3xl)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center">
                                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-6">
                                        <CheckCircle size={40} />
                                    </div>
                                    <h4 className="text-xl font-extrabold text-slate-950 mb-2">System Status</h4>
                                    <p className="text-slate-500 text-sm mb-8">All systems operational. Settings are automatically synced to local storage.</p>
                                    <button
                                        onClick={() => {
                                            if (window.confirm("Reset all settings to default?")) {
                                                const defaults = {
                                                    homeHeroTitleSize: 'text-5xl md:text-7xl',
                                                    homeSectionTitleSize: 'text-4xl md:text-5xl',
                                                    serviceTitleSize: 'text-3xl',
                                                    globalFontFamily: 'font-sans'
                                                };
                                                setSiteSettings(defaults);
                                                settingsDb.saveSettings(defaults);
                                                toast.success("Settings reset to default");
                                            }
                                        }}
                                        className="text-red-500 font-bold text-xs uppercase tracking-widest hover:text-red-600 hover:bg-red-50 px-6 py-3 rounded-xl transition-all"
                                    >
                                        Reset to Defaults
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'logs' && (
                        <div className="bg-slate-950 rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl relative">
                            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                                <ShieldAlert size={200} />
                            </div>
                            <div className="px-10 py-8 bg-slate-900/40 border-b border-slate-800 flex justify-between items-center relative z-10">
                                <div>
                                    <h3 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-3">
                                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                                        Security Analytics Vault
                                    </h3>
                                    <p className="text-slate-400 text-sm mt-1 font-medium">Real-time authentication and operational audit logs.</p>
                                </div>
                                <div className="bg-red-500/10 border border-red-500/20 px-4 py-1.5 rounded-xl">
                                    <span className="text-[10px] text-red-400 font-black uppercase tracking-[0.2em]">{securityLogs.length} Events Logged</span>
                                </div>
                            </div>
                            <div className="overflow-x-auto relative z-10">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-900/60 text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] border-b border-slate-800">
                                            <th className="px-10 py-6">Administrative Identity</th>
                                            <th className="px-6 py-6">Operational Action</th>
                                            <th className="px-6 py-6 text-center">Status protocol</th>
                                            <th className="px-10 py-6 text-right">Temporal Sequence</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/50">
                                        {securityLogs.map((log, idx) => (
                                            <tr key={idx} className="hover:bg-slate-900/40 transition duration-300">
                                                <td className="px-10 py-6">
                                                    <div className="text-white text-sm font-bold tracking-tight">{(log.profiles as any)?.name || 'Guest Agent'}</div>
                                                    <div className="text-[11px] text-slate-500 font-medium mt-1">{(log.profiles as any)?.email || 'Unauthorized IP Access'}</div>
                                                </td>
                                                <td className="px-6 py-6">
                                                    <div className="text-slate-300 text-xs font-semibold max-w-xs line-clamp-1 opacity-90">{log.action}</div>
                                                </td>
                                                <td className="px-6 py-6">
                                                    <div className="flex justify-center">
                                                        <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-shadow shadow-sm ${log.status === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                                            {log.status}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-6 text-right">
                                                    <div className="flex flex-col items-end">
                                                        <div className="text-white text-xs font-black tracking-widest">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                        <div className="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-tighter">{new Date(log.timestamp).toLocaleDateString()}</div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'services' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center bg-white px-10 py-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                                <div>
                                    <h3 className="text-xl font-extrabold text-slate-950 tracking-tight">Professional Services Directory</h3>
                                    <p className="text-slate-500 text-sm mt-1">Manage all tax, legal, and compliance service offerings.</p>
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        onClick={async () => {
                                            if (window.confirm("Seed production services? This will add standard services to your database.")) {
                                                try {
                                                    await servicesDb.seedServices();
                                                    toast.success("Services seeded successfully!");
                                                    window.location.reload();
                                                } catch (e) {
                                                    toast.error("Failed to seed services");
                                                }
                                            }
                                        }}
                                        className="bg-blue-50 text-blue-600 px-6 py-4 rounded-2xl flex items-center gap-2 text-sm font-bold hover:bg-blue-100 transition-all border border-blue-200"
                                    >
                                        <RefreshCw size={18} /> Seed Services
                                    </button>
                                    <button onClick={() => {
                                        setEditingService(null);
                                        setNewService({
                                            name: '', category: 'Taxation', description: '',
                                            applicableClients: ['Businesses'], fees: 'Custom', status: 'Active',
                                            resources: []
                                        });
                                        setShowServiceModal(true);
                                    }} className="bg-slate-950 text-white px-8 py-4 rounded-2xl flex items-center gap-3 text-sm font-bold hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-500/20 transition-all active:scale-95 shadow-lg shadow-slate-950/10">
                                        <Plus size={20} /> Add Service
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {services.map(s => (
                                    <div key={s.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-blue-300 transition-all group">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition">
                                                <Briefcase size={24} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-bold text-slate-900">{s.name}</h4>
                                                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${s.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>{s.status}</span>
                                                </div>
                                                <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">{s.category} • {s.applicableClients.join(', ')}</p>
                                                <p className="text-xs text-slate-500 mt-1 line-clamp-1">{s.description}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 shrink-0">
                                            <div className="text-right hidden md:block">
                                                <p className="text-[10px] text-slate-400 font-bold uppercase">Resources</p>
                                                <p className="font-bold text-slate-900">{s.resources?.length || 0} Files</p>
                                            </div>
                                            <div className="h-10 w-[1px] bg-slate-100 hidden md:block"></div>
                                            <div className="flex gap-2">
                                                <button onClick={() => {
                                                    setEditingService(s.id);
                                                    setNewService(s);
                                                    setShowServiceModal(true);
                                                }} className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition">
                                                    <RefreshCw size={18} />
                                                </button>
                                                <button onClick={() => deleteService(s.id)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {services.length === 0 && (
                                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                                        <Package className="mx-auto text-slate-300 mb-4" size={48} />
                                        <p className="text-slate-400 font-bold">No services published yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    {activeTab === 'resources' && (
                        <div className="space-y-8">
                            <div className="flex justify-between items-center bg-white px-10 py-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                                <div>
                                    <h3 className="text-xl font-extrabold text-slate-950 tracking-tight">Digital Resource Vault</h3>
                                    <p className="text-slate-500 text-sm mt-1">Manage e-books, notes, and study materials for the public website.</p>
                                </div>
                                <div className="flex gap-4">
                                    <input type="file" id="csv-upload-main" accept=".csv" className="hidden" onChange={handleCsvFileChange} />
                                    <label htmlFor="csv-upload-main" className="flex items-center gap-3 px-6 py-4 bg-slate-100 text-slate-700 rounded-2xl text-sm font-bold hover:bg-slate-200 transition-all cursor-pointer">
                                        <FileSpreadsheet size={20} /> Bulk CSV Import
                                    </label>
                                    <button onClick={() => {
                                        setEditingResource(null);
                                        setNewResource({
                                            title: '', description: '', imageUrl: '', gdriveUrl: '',
                                            category: 'Notes', status: 'Active', buttonText: 'Download Now'
                                        });
                                        setShowResourceModal(true);
                                    }} className="bg-slate-950 text-white px-8 py-4 rounded-2xl flex items-center gap-3 text-sm font-bold hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-500/20 transition-all active:scale-95 shadow-lg shadow-slate-950/10">
                                        <Plus size={20} /> Add New Resource
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {resourceSummaryCards.map(card => (
                                    <div key={card.label} className={`rounded-[2rem] border p-6 bg-white shadow-sm ${card.tone}`}>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">{card.label}</p>
                                        <h4 className="mt-3 text-3xl font-extrabold leading-none">{card.value}</h4>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-white px-6 py-5 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col xl:flex-row xl:items-center gap-4 xl:justify-between">
                                <div className="relative flex-1 max-w-2xl">
                                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        value={resourceSearchQuery}
                                        onChange={e => setResourceSearchQuery(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all text-sm font-medium text-slate-900"
                                        placeholder="Search by title, category, or description"
                                    />
                                </div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    {(['all', 'Active', 'Inactive'] as const).map(status => (
                                        <button
                                            key={status}
                                            type="button"
                                            onClick={() => setResourceStatusFilter(status)}
                                            className={`px-4 py-2 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border ${
                                                resourceStatusFilter === status
                                                    ? 'bg-slate-950 text-white border-slate-950'
                                                    : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                                            }`}
                                        >
                                            {status === 'all' ? 'All Statuses' : status}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredResources.map(r => (
                                    <div key={r.id} className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden group hover:border-blue-400 hover:shadow-2xl transition-all duration-500">
                                        <div className="relative h-56 overflow-hidden">
                                            <img src={r.imageUrl} alt={r.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" onError={(e) => (e.currentTarget.src = 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800')} />
                                            <div className="absolute top-4 left-4 bg-slate-950/90 backdrop-blur-md text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10">{r.category}</div>
                                            <div className={`absolute top-4 right-4 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border shadow-sm ${r.status === 'Active' ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-slate-500 text-white border-slate-400'}`}>
                                                {r.status}
                                            </div>
                                        </div>
                                        <div className="p-8">
                                            <h4 className="font-extrabold text-lg text-slate-950 leading-tight mb-2 line-clamp-2">{r.title}</h4>
                                            <p className="text-slate-500 text-xs font-medium mb-6 line-clamp-2">{r.description}</p>
                                            <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Added On</span>
                                                    <span className="text-xs font-black text-slate-950">{new Date(r.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => toggleResourceStatus(r)}
                                                        disabled={resourceStatusUpdatingId === r.id}
                                                        className={`h-10 px-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                                                            r.status === 'Active'
                                                                ? 'bg-amber-50 text-amber-700 hover:bg-amber-500 hover:text-white'
                                                                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-500 hover:text-white'
                                                        } disabled:opacity-60 disabled:pointer-events-none`}
                                                    >
                                                        {resourceStatusUpdatingId === r.id ? (
                                                            <Loader2 size={14} className="animate-spin" />
                                                        ) : r.status === 'Active' ? (
                                                            <Ban size={14} />
                                                        ) : (
                                                            <CheckCircle size={14} />
                                                        )}
                                                        {r.status === 'Active' ? 'Deactivate' : 'Activate'}
                                                    </button>
                                                    <button onClick={() => {
                                                        setEditingResource(r.id);
                                                        setNewResource(r);
                                                        setShowResourceModal(true);
                                                    }} className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white rounded-xl transition-all">
                                                        <RefreshCw size={16} />
                                                    </button>
                                                    <button onClick={() => deleteResource(r.id)} className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-red-500 hover:text-white rounded-xl transition-all">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {filteredResources.length === 0 && (
                                    <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-300">
                                        <Package className="mx-auto text-slate-300 mb-4" size={48} />
                                        <p className="text-slate-400 font-bold">
                                            {resources.length === 0 ? 'No digital resources published yet.' : 'No resources match the current search or filter.'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    </div>
                </div>

                {/* Product Modal */}
                {
                    showProductModal && (
                        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
                            <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden animate-fadeInUp flex flex-col max-h-[95vh] border border-slate-200">
                                <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                                    <div>
                                        <h3 className="font-extrabold text-2xl text-slate-900 tracking-tight">{editingProduct ? 'Configuration: Edit Asset' : 'Architecture: New Asset'}</h3>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Academy Content Management</p>
                                    </div>
                                    <button onClick={() => { setShowProductModal(false); setEditingProduct(null); }} className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all"><X size={24} /></button>
                                </div>

                                <form onSubmit={handleAddProduct} className="p-10 space-y-10 overflow-y-auto custom-scrollbar">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Product Title</label>
                                            <input required value={newProduct.title} onChange={e => setNewProduct({ ...newProduct, title: e.target.value })} className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all text-slate-900 font-bold" placeholder="e.g. Master GST Filing 2025" />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Asset Classification</label>
                                            <select value={newProduct.type} onChange={e => setNewProduct({ ...newProduct, type: e.target.value as any })} className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all font-black text-slate-900 appearance-none cursor-pointer">
                                                <option>Course</option>
                                                <option>E-Book</option>
                                                <option>Internship</option>
                                            </select>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Acquisition Price (₹)</label>
                                            <input type="number" required value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })} className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-3xl outline-none focus:border-blue-600 focus:bg-white transition-all text-slate-950 font-black text-5xl text-center shadow-inner" />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Market Valuation (₹)</label>
                                            <input type="number" value={newProduct.originalPrice} onChange={e => setNewProduct({ ...newProduct, originalPrice: Number(e.target.value) })} className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-3xl outline-none focus:border-blue-600 focus:bg-white transition-all text-slate-400 font-black text-3xl text-center shadow-inner" />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Visual Core (Image URL)</label>
                                        <div className="flex gap-4">
                                            <input required value={newProduct.image} onChange={e => setNewProduct({ ...newProduct, image: e.target.value })} className="flex-1 p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all text-slate-500 font-mono text-xs" placeholder="https://images.unsplash.com/..." />
                                            {newProduct.image && <img src={newProduct.image} className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 shadow-sm" alt="Preview" />}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Narrative Strategy (Description)</label>
                                        <textarea required value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all min-h-[120px] text-slate-700 font-medium leading-relaxed" placeholder="Detailed product value proposition..."></textarea>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                                                <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Feature Nodes</label>
                                                <button type="button" onClick={addFeature} className="text-[10px] font-black text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-xl transition flex items-center gap-2 uppercase tracking-widest">
                                                    <Plus size={14} /> Matrix Link
                                                </button>
                                            </div>
                                            <div className="space-y-3">
                                                {newProduct.features.map((f, idx) => (
                                                    <div key={idx} className="relative group animate-fadeIn">
                                                        <input
                                                            value={f}
                                                            onChange={e => updateFeature(idx, e.target.value)}
                                                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-400 focus:bg-white text-sm font-semibold pr-12 transition-all"
                                                            placeholder="Feature identifier..."
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeFeature(idx)}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                                                <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Syllabus Architecture</label>
                                                <button type="button" onClick={addModule} className="text-[10px] font-black text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-xl transition flex items-center gap-2 uppercase tracking-widest">
                                                    <Plus size={14} /> New Module
                                                </button>
                                            </div>
                                            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                                                {newProduct.content.map((module, mIdx) => (
                                                    <div key={mIdx} className="bg-slate-50 p-6 rounded-[2rem] border border-slate-200 space-y-4 relative group/module animate-fadeIn">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeModule(mIdx)}
                                                            className="absolute top-6 right-6 text-slate-300 hover:text-red-500 transition-colors"
                                                        >
                                                            <Trash2 size={20} />
                                                        </button>
                                                        <div className="space-y-2">
                                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Module ID</label>
                                                            <input
                                                                value={module.title}
                                                                onChange={e => updateModuleTitle(mIdx, e.target.value)}
                                                                className="w-full p-4 bg-white border border-slate-100 rounded-xl outline-none text-sm font-extrabold text-slate-900"
                                                                placeholder="e.g. Fundamental Protocols"
                                                            />
                                                        </div>
                                                        <div className="space-y-4">
                                                            <div className="flex justify-between items-center">
                                                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Sub-Nodes</label>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => addItemToModule(mIdx)}
                                                                    className="text-[8px] font-black text-blue-600 uppercase tracking-widest bg-white border border-blue-100 px-3 py-1 rounded-lg hover:shadow-sm transition-all"
                                                                >
                                                                    + Expand
                                                                </button>
                                                            </div>
                                                            <div className="grid grid-cols-1 gap-2">
                                                                {module.items.map((item, iIdx) => (
                                                                    <input
                                                                        key={iIdx}
                                                                        value={item}
                                                                        onChange={e => updateModuleItem(mIdx, iIdx, e.target.value)}
                                                                        className="w-full p-3 bg-white border border-slate-100 rounded-xl outline-none text-xs font-semibold text-slate-600"
                                                                        placeholder="Node name..."
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-6">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Asset Vault Access (Drive Link)</label>
                                        <div className="relative">
                                            <Link size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input value={newProduct.driveLink} onChange={e => setNewProduct({ ...newProduct, driveLink: e.target.value })} className="w-full pl-14 pr-5 py-5 bg-slate-900 text-blue-400 border border-slate-800 rounded-2xl outline-none font-mono text-xs focus:ring-2 focus:ring-blue-500/20 transition-all font-bold" placeholder="https://drive.google.com/..." />
                                        </div>
                                    </div>

                                    {newProduct.type === 'Course' && (
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Session Broadcast (YouTube URL)</label>
                                            <div className="relative">
                                                <Video size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input value={newProduct.youtubeLink} onChange={e => setNewProduct({ ...newProduct, youtubeLink: e.target.value })} className="w-full pl-14 pr-5 py-5 bg-slate-900 text-purple-400 border border-slate-800 rounded-2xl outline-none font-mono text-xs focus:ring-2 focus:ring-purple-500/20 transition-all font-bold" placeholder="https://youtube.com/watch?v=..." />
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-4 pt-4 sticky bottom-0 z-10 bg-white/80 backdrop-blur-md pb-4">
                                        <button type="button" onClick={() => setShowPreview(true)} className="flex-1 py-5 bg-blue-50 text-blue-600 font-extrabold uppercase tracking-widest text-[11px] rounded-[1.5rem] hover:bg-blue-100 transition-all flex justify-center items-center gap-2"><Eye size={16} /> Preview</button>
                                        <button type="button" onClick={() => { setShowProductModal(false); setEditingProduct(null); }} className="flex-1 py-5 bg-slate-100 text-slate-600 font-extrabold uppercase tracking-widest text-[11px] rounded-[1.5rem] hover:bg-slate-200 transition-all">Cancel Request</button>
                                        <button disabled={isSubmitting} className="flex-[2] bg-slate-950 hover:bg-blue-600 text-white font-extrabold uppercase tracking-widest text-[11px] py-5 rounded-[1.5rem] shadow-2xl shadow-slate-950/20 transition-all flex justify-center items-center gap-3 active:scale-95">
                                            {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : (editingProduct ? <><RefreshCw size={20} /> Authorize Update</> : <><Plus size={20} /> Authorize Deployment</>)}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )
                }

                {/* Product Preview Modal */}
                {
                    showProductModal && showPreview && (
                        <div className="fixed inset-0 z-[200] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
                            <div className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto custom-scrollbar bg-white rounded-[3rem] shadow-2xl">
                                <button onClick={() => setShowPreview(false)} className="fixed top-6 right-6 z-[210] bg-white text-slate-900 p-3 rounded-full shadow-lg hover:scale-110 transition border-2 border-slate-900"><X size={24} /></button>

                                <div className="bg-slate-900 text-white py-16 relative overflow-hidden">
                                    <div className="container mx-auto px-12 flex flex-col md:flex-row gap-8 relative z-10">
                                        <div className="md:w-2/3 pr-0 md:pr-12">
                                            <div className="text-blue-300 text-xs font-bold mb-4 flex gap-2 items-center uppercase tracking-widest">
                                                <span>Academy Store</span> <span>/</span>
                                                <span className="text-blue-100">{newProduct.type}</span>
                                            </div>

                                            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight font-serif">{newProduct.title || "Product Title"}</h1>
                                            <p className="text-xl text-slate-300 mb-8 max-w-2xl">{newProduct.description || "Product description will appear here..."}</p>

                                            <div className="flex flex-wrap items-center gap-6 text-sm mb-10">
                                                <div className="flex items-center gap-2 text-amber-400 font-black">
                                                    <span className="text-lg">5.0</span>
                                                    <div className="flex"><Star size={18} fill="currentColor" /></div>
                                                </div>
                                                <div className="bg-white/10 px-4 py-1.5 rounded-full border border-white/10 text-blue-100">
                                                    0 Global Learners
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-300">
                                                    <span className="text-blue-400">By {newProduct.author}</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-8 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                                <span className="flex items-center gap-2"><AlertCircle size={14} className="text-blue-400" /> Updated {new Date().toLocaleDateString()}</span>
                                                <span className="flex items-center gap-2"><Globe size={14} className="text-blue-400" /> {newProduct.language}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="container mx-auto px-12 py-12 flex flex-col md:flex-row gap-12 relative">
                                    <div className="md:w-2/3">
                                        <div className="border border-slate-200 p-8 rounded-[2rem] mb-12 bg-slate-50/50 shadow-sm">
                                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Learning Path Highlights</h2>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {newProduct.features.map((feature, idx) => (
                                                    <div key={idx} className="flex items-start gap-3 text-slate-700">
                                                        <CheckCircle size={18} className="text-blue-600 shrink-0 mt-0.5" />
                                                        <span className="text-sm font-medium">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mb-12">
                                            <h2 className="text-3xl font-bold text-slate-900 mb-8">Syllabus & Curriculum</h2>
                                            <div className="space-y-4">
                                                {newProduct.content.map((section: any, idx: number) => (
                                                    <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                                                        <div className="bg-slate-50 p-5 font-bold text-slate-800 flex justify-between items-center">
                                                            <span className="flex items-center gap-3"><Layout size={20} className="text-blue-600" /> {section.title}</span>
                                                            <span className="text-[10px] font-black uppercase text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-100">{section.items?.length || 0} Topics</span>
                                                        </div>
                                                        <div className="bg-white">
                                                            {section.items?.map((item: string, i: number) => (
                                                                <div key={i} className="p-4 pl-12 flex items-center justify-between hover:bg-slate-50 border-t border-slate-100 first:border-0 transition-colors">
                                                                    <div className="flex items-center gap-4 text-sm text-slate-600">
                                                                        {newProduct.type === 'Course' ? <Video size={16} className="text-purple-500" /> : <FileText size={16} className="text-green-500" />}
                                                                        <span className="font-medium">{item}</span>
                                                                    </div>
                                                                    <Lock size={14} className="text-slate-300" />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="md:w-1/3 relative">
                                        <div className="bg-white shadow-2xl border border-slate-200 rounded-[2.5rem] overflow-hidden group">
                                            <div className="h-56 bg-slate-900 relative cursor-pointer overflow-hidden">
                                                {newProduct.image ?
                                                    <img src={newProduct.image} alt="Preview" className="w-full h-full object-cover opacity-90" /> :
                                                    <div className="w-full h-full flex items-center justify-center text-slate-500">No Image</div>
                                                }
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl">
                                                        <PlayCircle size={32} className="text-slate-900 ml-1" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-8">
                                                <div className="flex items-baseline gap-3 mb-6">
                                                    <span className="text-4xl font-black text-slate-900">₹{newProduct.price}</span>
                                                    {newProduct.originalPrice > newProduct.price && (
                                                        <>
                                                            <span className="text-xl text-slate-400 line-through">₹{newProduct.originalPrice}</span>
                                                            <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-lg">
                                                                {Math.round(((newProduct.originalPrice - newProduct.price) / newProduct.originalPrice) * 100)}% SAVING
                                                            </span>
                                                        </>
                                                    )}
                                                </div>

                                                <div className="space-y-4 py-6 border-t border-slate-100 text-sm text-slate-600 font-medium">
                                                    <p className="font-black text-slate-900 uppercase tracking-widest text-[10px] mb-2">Technical Specification:</p>
                                                    <div className="flex items-center gap-3"><Video size={18} className="text-blue-600" /> {newProduct.type === 'Course' ? 'HD Video Content' : 'Printable E-Book Asset'}</div>
                                                    <div className="flex items-center gap-3"><FileText size={18} className="text-blue-600" /> Full Perpetual License</div>
                                                    <div className="flex items-center gap-3"><ShieldCheck size={18} className="text-blue-600" /> Official SNA Certificate</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }

                {/* Blog Modal Component */}
                {
                    showBlogModal && (
                        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
                            <div className="bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl overflow-hidden animate-fadeInUp flex flex-col max-h-[95vh] border border-slate-200">
                                <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                                    <div>
                                        <h3 className="font-extrabold text-2xl text-slate-900 tracking-tight">{editingBlog ? 'Editorial: Edit Entry' : 'Editorial: New Stream Entry'}</h3>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Regulatory & News Architecture</p>
                                    </div>
                                    <button onClick={() => { setShowBlogModal(false); setEditingBlog(null); }} className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all"><X size={24} /></button>
                                </div>

                                <form onSubmit={handleAddBlog} className="p-10 space-y-10 overflow-y-auto custom-scrollbar">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Broadcast Headline</label>
                                        <input required value={newBlog.title} onChange={e => setNewBlog({ ...newBlog, title: e.target.value })} className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all text-slate-900 font-bold" placeholder="e.g. Q4 Regulatory Compliance Framework 2025" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Channel classification</label>
                                            <select value={newBlog.category} onChange={e => setNewBlog({ ...newBlog, category: e.target.value })} className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all font-black text-slate-900">
                                                <option>Tax Update</option>
                                                <option>Compliance</option>
                                                <option>Legal Advisory</option>
                                                <option>Academy News</option>
                                            </select>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Authority (Author)</label>
                                            <input required value={newBlog.author} onChange={e => setNewBlog({ ...newBlog, author: e.target.value })} className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all text-slate-900 font-bold" />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Visual Asset URL</label>
                                        <input required value={newBlog.image} onChange={e => setNewBlog({ ...newBlog, image: e.target.value })} className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all text-slate-500 font-mono text-xs" placeholder="https://images.unsplash.com/..." />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Abstract / Intel Summary</label>
                                        <textarea required value={newBlog.excerpt} onChange={e => setNewBlog({ ...newBlog, excerpt: e.target.value })} className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all min-h-[100px] text-slate-700 font-medium leading-relaxed" placeholder="Brief metadata for the feed..."></textarea>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">External Reference Link (Optional)</label>
                                        <input value={newBlog.link} onChange={e => setNewBlog({ ...newBlog, link: e.target.value })} className="w-full p-5 bg-slate-900 text-blue-400 border border-slate-800 rounded-2xl outline-none font-mono text-xs focus:ring-2 focus:ring-blue-500/20" placeholder="https://..." />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Full Intel Payload (Markdown)</label>
                                        <textarea value={newBlog.content} onChange={e => setNewBlog({ ...newBlog, content: e.target.value })} className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all min-h-[250px] text-slate-900 font-bold" placeholder="Write full article here..."></textarea>
                                    </div>
                                    <div className="flex gap-4 pt-4 sticky bottom-0 z-10 bg-white/80 backdrop-blur-md pb-4">
                                        <button type="button" onClick={() => setShowPreview(true)} className="flex-1 py-5 bg-blue-50 text-blue-600 font-extrabold uppercase tracking-widest text-[11px] rounded-[1.5rem] hover:bg-blue-100 transition-all flex justify-center items-center gap-2"><Eye size={16} /> Preview Intel</button>
                                        <button type="button" onClick={() => { setShowBlogModal(false); setEditingBlog(null); }} className="flex-1 py-5 bg-slate-100 text-slate-600 font-extrabold uppercase tracking-widest text-[11px] rounded-[1.5rem] hover:bg-slate-200 transition-all">Abort Intel</button>
                                        <button disabled={isSubmitting} className="flex-[2] bg-slate-950 hover:bg-blue-600 text-white font-extrabold uppercase tracking-widest text-[11px] py-5 rounded-[1.5rem] shadow-2xl shadow-slate-950/20 transition-all flex justify-center items-center gap-3 active:scale-95">
                                            {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : (editingBlog ? <><RefreshCw size={20} /> Authorize Update</> : <><Send size={20} /> Execute Broadcast</>)}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )
                }

                {/* Blog Preview Modal */}
                {
                    showBlogModal && showPreview && (
                        <div className="fixed inset-0 z-[200] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
                            <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto custom-scrollbar bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200">
                                <button onClick={() => setShowPreview(false)} className="fixed top-6 right-6 z-[210] bg-white text-slate-900 p-3 rounded-full shadow-lg hover:scale-110 transition border-2 border-slate-900"><X size={24} /></button>

                                <div className="h-64 bg-slate-100 relative overflow-hidden">
                                    {newBlog.image ? (
                                        <img src={newBlog.image} alt={newBlog.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                                    )}
                                    <div className="absolute top-4 left-4 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg shadow-lg">
                                        {newBlog.category}
                                    </div>
                                </div>

                                <div className="p-10">
                                    <div className="flex items-center gap-4 text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">
                                        <span className="flex items-center gap-2"><Calendar size={14} /> {new Date().toLocaleDateString()}</span>
                                        <span className="flex items-center gap-2"><UserIcon size={14} /> {newBlog.author}</span>
                                    </div>

                                    <h1 className="text-3xl font-bold text-slate-900 mb-6 leading-tight">{newBlog.title || 'Post Title'}</h1>

                                    {newBlog.excerpt && (
                                        <div className="bg-slate-50 p-6 rounded-2xl border-l-4 border-blue-500 mb-8 italic text-slate-600">
                                            {newBlog.excerpt}
                                        </div>
                                    )}

                                    <div className="prose max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
                                        {newBlog.content || 'Content preview...'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }

                {/* Service Modal */}
                {
                    showServiceModal && (
                        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
                            <div className="bg-white w-full max-w-6xl rounded-[3rem] shadow-2xl overflow-hidden animate-fadeInUp flex flex-col max-h-[95vh] border border-slate-200">
                                <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                                            <Settings size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-extrabold text-2xl text-slate-900 tracking-tight">{editingService ? 'Service Design: Update' : 'Service Design: Initial Architecture'}</h3>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Client Resource Protocol Management</p>
                                        </div>
                                    </div>
                                    <button onClick={() => { setShowServiceModal(false); setEditingService(null); }} className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all"><X size={24} /></button>
                                </div>

                                <form onSubmit={handleAddService} className="p-10 space-y-10 overflow-y-auto custom-scrollbar">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                        {/* Basic Info */}
                                        <div className="space-y-8">
                                            <h4 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] border-b border-blue-50 pb-3 flex items-center gap-2">
                                                <Briefcase size={14} /> Core Identity Nodes
                                            </h4>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Service Identifier</label>
                                                <input required value={newService.name} onChange={e => setNewService({ ...newService, name: e.target.value })} className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all text-slate-900 font-bold" placeholder="e.g. GST Compliance & Filing Architecture" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Category Cluster</label>
                                                    <select value={newService.category} onChange={e => setNewService({ ...newService, category: e.target.value as ServiceCategory })} className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all font-black text-slate-900 appearance-none cursor-pointer">
                                                        <option>Business Entity Incorporation & Registration</option>
                                                        <option>Post-Incorporation & Business Registrations</option>
                                                        <option>Tax & Legal Compliance Services</option>
                                                        <option>Outsourcing, Accounting & CFO Services</option>
                                                        <option>Digital, Technology & Growth Services</option>
                                                        <option>SNAC Academy: Professional Training</option>

                                                    </select>
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Protocol Status</label>
                                                    <select value={newService.status} onChange={e => setNewService({ ...newService, status: e.target.value as 'Active' | 'Inactive' })} className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all font-black text-slate-900 appearance-none cursor-pointer">
                                                        <option>Active</option>
                                                        <option>Inactive</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Authorized Client Segments</label>
                                                <div className="flex flex-wrap gap-3 pt-2">
                                                    {['Individuals', 'Businesses', 'Startups'].map(c => (
                                                        <button
                                                            key={c}
                                                            type="button"
                                                            onClick={() => {
                                                                const current = newService.applicableClients || [];
                                                                const updated = current.includes(c as any) ? current.filter(x => x !== c) : [...current, c as any];
                                                                setNewService({ ...newService, applicableClients: updated });
                                                            }}
                                                            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${newService.applicableClients?.includes(c as any) ? 'bg-slate-950 text-white border-slate-950 shadow-xl' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}
                                                        >
                                                            {c}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Visual Service Asset (Image URL)</label>
                                                <input value={newService.image || ''} onChange={e => setNewService({ ...newService, image: e.target.value })} className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all text-slate-500 font-mono text-xs font-bold" placeholder="https://..." />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Service Logic / Detailed Brief</label>
                                                <textarea required value={newService.description} onChange={e => setNewService({ ...newService, description: e.target.value })} className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all min-h-[150px] text-slate-700 font-medium leading-relaxed" placeholder="Detailed service scope and operational logic..."></textarea>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Financial Valuation (Fees)</label>
                                                <input value={newService.fees} onChange={e => setNewService({ ...newService, fees: e.target.value })} className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-3xl outline-none focus:border-blue-600 focus:bg-white transition-all text-slate-950 font-black text-4xl text-center shadow-inner" placeholder="e.g. Custom" />
                                            </div>
                                        </div>

                                        {/* Resources Management */}
                                        <div className="space-y-8">
                                            <div className="flex justify-between items-center border-b border-purple-50 pb-3">
                                                <h4 className="text-[11px] font-black text-purple-600 uppercase tracking-[0.2em] flex items-center gap-2">
                                                    <FileJson size={14} /> Vault Artifacts (Resources)
                                                </h4>
                                                <button type="button" onClick={addResource} className="text-[10px] font-black text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-xl transition flex items-center gap-2 uppercase tracking-widest">
                                                    <Plus size={14} /> Link Asset
                                                </button>
                                            </div>

                                            <div className="space-y-6 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
                                                {(newService.resources || []).map((res, idx) => (
                                                    <div key={res.id} className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200 space-y-6 relative group animate-fadeIn">
                                                        <button type="button" onClick={() => removeResource(idx)} className="absolute top-6 right-6 text-slate-300 hover:text-red-500 hover:bg-red-50 w-10 h-10 flex items-center justify-center rounded-xl transition-all">
                                                            <Trash2 size={20} />
                                                        </button>

                                                        <div className="space-y-2">
                                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Document Identifier</label>
                                                            <input required value={res.name} onChange={e => updateResource(idx, 'name', e.target.value)} className="w-full p-4 bg-white border border-slate-100 rounded-xl outline-none text-sm font-extrabold text-slate-900" placeholder="e.g. GST-01 Compliance Checklist" />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Vault Link (Drive URL)</label>
                                                            <div className="relative">
                                                                <ExternalLink size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                                                <input required value={res.link} onChange={e => updateResource(idx, 'link', e.target.value)} className="w-full pl-12 pr-4 py-4 bg-slate-900 text-blue-400 border border-slate-800 rounded-xl outline-none font-mono text-xs focus:ring-2 focus:ring-blue-500/20" placeholder="https://drive.google.com/..." />
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="space-y-2">
                                                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Artifact Type</label>
                                                                <select value={res.type} onChange={e => updateResource(idx, 'type', e.target.value as DocumentType)} className="w-full p-4 bg-white border border-slate-100 rounded-xl outline-none text-[10px] font-black uppercase tracking-wider text-slate-900 cursor-pointer">
                                                                    <option>Forms</option>
                                                                    <option>Checklists</option>
                                                                    <option>Guidelines</option>
                                                                    <option>Templates</option>
                                                                    <option>Reports</option>
                                                                </select>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Protocol</label>
                                                                <select value={res.access} onChange={e => updateResource(idx, 'access', e.target.value as AccessType)} className="w-full p-4 bg-white border border-slate-100 rounded-xl outline-none text-[10px] font-black uppercase tracking-wider text-slate-900 cursor-pointer">
                                                                    <option>View Only</option>
                                                                    <option>Download Allowed</option>
                                                                </select>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-3 pt-2">
                                                            <input type="checkbox" id={`public-${idx}`} checked={res.isPublic} onChange={e => updateResource(idx, 'isPublic', e.target.checked)} className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500" />
                                                            <label htmlFor={`public-${idx}`} className="text-[10px] font-black text-slate-500 uppercase tracking-widest cursor-pointer select-none">Open Public Access Node</label>
                                                        </div>
                                                    </div>
                                                ))}
                                                {(newService.resources || []).length === 0 && (
                                                    <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-[2.5rem]">
                                                        <FileJson className="mx-auto text-slate-200 mb-4" size={48} />
                                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">No Resources Linked</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-100 pt-10 flex gap-6 sticky bottom-0 z-10 bg-white/80 backdrop-blur-md pb-4">
                                        <button type="button" onClick={() => setShowPreview(true)} className="flex-1 py-5 bg-blue-50 text-blue-600 font-extrabold uppercase tracking-widest text-[11px] rounded-[1.5rem] hover:bg-blue-100 transition-all flex justify-center items-center gap-2"><Eye size={16} /> Preview Protocol</button>
                                        <button type="button" onClick={() => { setShowServiceModal(false); setEditingService(null); }} className="flex-1 py-5 bg-slate-100 text-slate-600 font-extrabold uppercase tracking-widest text-[11px] rounded-[1.5rem] hover:bg-slate-200 transition-all">Abort Architecture</button>
                                        <button disabled={isSubmitting} className="flex-[2] bg-slate-950 hover:bg-blue-600 text-white font-extrabold uppercase tracking-widest text-[11px] py-5 rounded-[1.5rem] shadow-2xl shadow-slate-950/20 transition-all flex justify-center items-center gap-3 active:scale-95">
                                            {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : (editingService ? <><RefreshCw size={20} /> Authorize Update</> : <><Plus size={20} /> Authorize Publication</>)}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )
                }

                {/* Service Preview Modal */}
                {
                    showServiceModal && showPreview && (
                        <div className="fixed inset-0 z-[200] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
                            <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar bg-white rounded-[2.5rem] shadow-2xl p-12 border border-slate-200">
                                <button onClick={() => setShowPreview(false)} className="fixed top-6 right-6 z-[210] bg-white text-slate-900 p-3 rounded-full shadow-lg hover:scale-110 transition border-2 border-slate-900"><X size={24} /></button>

                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-3 mb-3">
                                            <h3 className={`${siteSettings.serviceTitleSize} font-bold text-slate-900`}>{newService.name || "Service Name"}</h3>
                                            {(newService.applicableClients || []).map(c => (
                                                <span key={c} className="bg-slate-100 text-slate-500 text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-tighter">For {c}</span>
                                            ))}
                                        </div>
                                        <p className="text-slate-500 text-sm leading-relaxed mb-6 whitespace-pre-wrap">
                                            {newService.description || "Service description will appear here..."}
                                        </p>

                                        <div className="flex flex-wrap items-center gap-6">
                                            <div className="inline-flex items-center gap-2 text-xs font-black text-blue-600 uppercase tracking-widest">
                                                Mock Expanded View
                                                <ChevronDown size={16} className="rotate-180" />
                                            </div>
                                            {newService.fees && (
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100/50 px-3 py-1 rounded-lg">
                                                    Fees: <span className="text-slate-900 font-bold">{newService.fees}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-10 animate-fadeIn space-y-8">
                                    <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
                                        <div className="bg-slate-50 p-6 flex justify-between items-center border-b border-slate-100">
                                            <div className="flex items-center gap-3">
                                                <BookOpen size={18} className="text-blue-600" />
                                                <h4 className="font-bold text-slate-800 text-sm">Downloadable Assets & Forms</h4>
                                            </div>
                                            <span className="bg-blue-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">{(newService.resources || []).length} Assets</span>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left text-xs">
                                                <thead className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                    <tr>
                                                        <th className="p-6">Resource Name</th>
                                                        <th className="p-6">Type</th>
                                                        <th className="p-6 text-right">Access</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100 font-bold">
                                                    {(newService.resources || []).map((res, idx) => (
                                                        <tr key={idx} className="hover:bg-slate-50 transition">
                                                            <td className="p-6 flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                                                                    <FileText size={14} />
                                                                </div>
                                                                <div>
                                                                    <p className="text-slate-900">{res.name}</p>
                                                                    <div className="flex items-center gap-1.5 mt-0.5">
                                                                        {res.isPublic ? <Globe size={10} className="text-green-500" /> : <Lock size={10} className="text-amber-500" />}
                                                                        <span className={`text-[8px] uppercase tracking-tighter ${res.isPublic ? 'text-green-600' : 'text-amber-600'}`}>
                                                                            {res.isPublic ? 'Public Access' : 'Client Only'}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="p-6"><span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest">{res.type}</span></td>
                                                            <td className="p-6 text-right">
                                                                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] uppercase font-black tracking-widest ${res.access === 'Download Allowed' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-white'}`}>
                                                                    {res.access === 'Download Allowed' ? <Download size={12} /> : <Eye size={12} />}
                                                                    {res.access === 'Download Allowed' ? 'Download' : 'View File'}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {(newService.resources || []).length === 0 && (
                                                        <tr>
                                                            <td colSpan={3} className="p-10 text-center text-slate-400 italic text-sm">No downloadable resources linked.</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }

                {/* User Edit Modal */}
                {
                    showUserModal && editingUser && (
                        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
                            <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-fadeInUp border border-slate-200">
                                <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                                    <div>
                                        <h3 className="font-extrabold text-2xl text-slate-900 tracking-tight">Identity: Update Profile</h3>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Client Access Protocol</p>
                                    </div>
                                    <button onClick={() => { setShowUserModal(false); setEditingUser(null); }} className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all"><X size={24} /></button>
                                </div>

                                <form onSubmit={handleUpdateUser} className="p-10 space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Full Identity Name</label>
                                        <input required value={editingUser.name} onChange={e => setEditingUser({ ...editingUser, name: e.target.value })} className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all text-slate-900 font-bold" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Digital Communication (Email)</label>
                                        <input required type="email" value={editingUser.email} onChange={e => setEditingUser({ ...editingUser, email: e.target.value })} className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all text-slate-900 font-bold" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Telephonic Link (Phone)</label>
                                        <input value={editingUser.phone || ''} onChange={e => setEditingUser({ ...editingUser, phone: e.target.value })} className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all text-slate-900 font-bold" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">System Privilege</label>
                                            <select value={editingUser.role} onChange={e => setEditingUser({ ...editingUser, role: e.target.value as any })} className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all font-black text-slate-900 appearance-none cursor-pointer">
                                                <option value="user">Standard Agent</option>
                                                <option value="admin">System Admin</option>
                                            </select>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Access Lifecycle</label>
                                            <select value={editingUser.isBlocked ? 'blocked' : 'active'} onChange={e => setEditingUser({ ...editingUser, isBlocked: e.target.value === 'blocked' })} className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all font-black text-slate-900 appearance-none cursor-pointer">
                                                <option value="active">Active Channel</option>
                                                <option value="blocked">Restricted</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 pt-4">
                                        <button type="button" onClick={() => { setShowUserModal(false); setEditingUser(null); }} className="flex-1 py-5 bg-slate-100 text-slate-600 font-extrabold uppercase tracking-widest text-[11px] rounded-[1.5rem] hover:bg-slate-200 transition-all">Cancel Request</button>
                                        <button disabled={isSubmitting} className="flex-[2] bg-slate-950 hover:bg-emerald-600 text-white font-extrabold uppercase tracking-widest text-[11px] py-5 rounded-[1.5rem] shadow-2xl shadow-slate-950/20 transition-all flex justify-center items-center gap-3 active:scale-95">
                                            {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : 'Authorize Profile Sync'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )
                }

                {/* Reply Modal */}
                {
                    showReplyModal && activeInquiry && (
                        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
                            <div className="bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl overflow-hidden animate-fadeInUp border border-slate-200">
                                <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                                    <div>
                                        <h3 className="font-extrabold text-2xl text-slate-900 tracking-tight">Lead Engagement Protocol</h3>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Broadcast target: {activeInquiry.name} ({activeInquiry.email})</p>
                                    </div>
                                    <button onClick={() => { setShowReplyModal(false); setActiveInquiry(null); }} className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all"><X size={24} /></button>
                                </div>

                                <form onSubmit={handleSendReply} className="p-10 space-y-8">
                                    <div className="bg-slate-50 p-6 rounded-[2rem] border-2 border-slate-100 mb-4 animate-fadeIn">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Incoming Signal Data:</p>
                                        <p className="text-sm text-slate-800 font-bold leading-relaxed italic border-l-4 border-blue-500 pl-4">"{activeInquiry.message || activeInquiry.notes || 'No clear message payload'}"</p>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Response Payload (Email Content)</label>
                                        <textarea required value={replyMessage} onChange={e => setReplyMessage(e.target.value)} className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] outline-none focus:border-blue-600 focus:bg-white transition-all min-h-[250px] text-slate-900 font-bold text-base" placeholder="Type your high-priority response here..."></textarea>
                                    </div>
                                    <div className="flex gap-4 pt-4">
                                        <button type="button" onClick={() => { setShowReplyModal(false); setActiveInquiry(null); }} className="flex-1 py-5 bg-slate-100 text-slate-600 font-extrabold uppercase tracking-widest text-[11px] rounded-[1.5rem] hover:bg-slate-200 transition-all">Abort Transmission</button>
                                        <button disabled={isSubmitting} className="flex-[2] bg-slate-950 hover:bg-blue-600 text-white font-extrabold uppercase tracking-widest text-[11px] py-5 rounded-[1.5rem] shadow-2xl shadow-slate-950/20 transition-all flex justify-center items-center gap-3 active:scale-95">
                                            {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : <><Send size={20} /> Execute Email Broadcast</>}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )
                }

                {/* Resource Modal */}
                {
                    showResourceModal && (
                        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
                            <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden animate-fadeInUp flex flex-col max-h-[95vh] border border-slate-200">
                                <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                                    <div>
                                        <h3 className="font-extrabold text-2xl text-slate-900 tracking-tight">{editingResource ? 'Edit Digital Resource' : (bulkResources.length > 0 ? `Review Bulk Upload (${bulkResources.length} items)` : 'Add New Digital Resource')}</h3>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Resource Management Protocol</p>
                                    </div>
                                    <div className="flex gap-4">
                                        {!editingResource && (
                                            <div className="flex items-center gap-3">
                                                <div className="relative group">
                                                    <input 
                                                        type="text" 
                                                        value={csvUrl} 
                                                        onChange={e => setCsvUrl(e.target.value)} 
                                                        placeholder="Paste GDrive CSV Link..." 
                                                        className="pl-5 pr-12 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl text-[10px] font-bold outline-none focus:border-blue-600 focus:bg-white transition-all w-64 shadow-inner"
                                                    />
                                                    <button 
                                                        onClick={handleFetchCsvFromUrl}
                                                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md active:scale-90"
                                                        title="Fetch Remote CSV"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                                <div className="h-8 w-px bg-slate-200 mx-1"></div>
                                                <input type="file" id="csv-upload" accept=".csv" className="hidden" onChange={handleCsvFileChange} />
                                                <label htmlFor="csv-upload" className="flex items-center gap-2 bg-blue-50 text-blue-600 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest cursor-pointer hover:bg-blue-100 transition-all border border-blue-100 shadow-sm">
                                                    <FileSpreadsheet size={16} /> Bulk CSV Upload
                                                </label>
                                            </div>
                                        )}
                                        <button onClick={() => { setShowResourceModal(false); setEditingResource(null); setBulkResources([]); }} className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all"><X size={24} /></button>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto custom-scrollbar">
                                    {bulkResources.length > 0 && !editingResource ? (
                                        <div className="p-10 space-y-6">
                                            <div className="bg-amber-50 border border-amber-100 p-6 rounded-[2rem] flex items-center justify-between gap-4 mb-8">
                                                <div className="flex items-start gap-4">
                                                    <AlertCircle className="text-amber-500 shrink-0 mt-1" size={20} />
                                                    <div>
                                                        <p className="text-amber-900 font-bold text-sm">Reviewing Staged Artifacts</p>
                                                        <p className="text-amber-700/70 text-xs font-medium mt-1">Verify each item before authorizing publication. You can remove individual items or clear the list.</p>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={handleFetchMetadataForAll}
                                                    disabled={isFetchingMetadata}
                                                    className="px-6 py-3 bg-white text-slate-900 border border-amber-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-100 transition-all flex items-center gap-2 shadow-sm"
                                                >
                                                    {isFetchingMetadata ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} className="text-amber-500" />}
                                                    Fetch All Metadata
                                                </button>
                                            </div>

                                            <div className="space-y-4">
                                                {bulkResources.map((res, idx) => (
                                                    <div key={idx} className="bg-white border border-slate-100 p-6 rounded-[2.5rem] flex items-center justify-between hover:border-blue-200 transition-all group shadow-sm">
                                                        <div className="flex items-center gap-6">
                                                            <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden relative">
                                                                <img src={res.imageUrl} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800')} />
                                                                <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-colors"></div>
                                                            </div>
                                                            <div>
                                                                <h4 className="font-extrabold text-slate-900 text-lg leading-tight">{res.title}</h4>
                                                                <div className="flex items-center gap-3 mt-1.5">
                                                                    <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest">{res.category}</span>
                                                                    <span className="text-[10px] text-slate-400 font-bold truncate max-w-[200px]">{res.gdriveUrl}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <button 
                                                                onClick={() => {
                                                                    setNewResource(res);
                                                                    setShowResourcePreview(true);
                                                                }}
                                                                className="w-12 h-12 flex items-center justify-center bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                                            >
                                                                <Eye size={20} />
                                                            </button>
                                                            <button 
                                                                onClick={() => setBulkResources(bulkResources.filter((_, i) => i !== idx))}
                                                                className="w-12 h-12 flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-red-500 hover:text-white rounded-2xl transition-all shadow-sm"
                                                            >
                                                                <Trash2 size={20} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="sticky bottom-0 bg-white/80 backdrop-blur-md pt-8 pb-4 flex gap-6">
                                                <button onClick={() => setBulkResources([])} className="flex-1 py-5 bg-slate-100 text-slate-600 font-extrabold uppercase tracking-widest text-[11px] rounded-[1.5rem] hover:bg-slate-200 transition-all">Clear All Artifacts</button>
                                                <button onClick={handleBulkSubmit} disabled={isSubmitting} className="flex-[2] bg-slate-950 hover:bg-emerald-600 text-white font-extrabold uppercase tracking-widest text-[11px] py-5 rounded-[1.5rem] shadow-2xl transition-all flex justify-center items-center gap-3">
                                                    {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : <><Plus size={20} /> Authorize Bulk Publication</>}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleAddResource} className="p-10 space-y-10">
                                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Resource Title</label>
                                            <input required value={newResource.title} onChange={e => setNewResource({ ...newResource, title: e.target.value })} className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all text-slate-900 font-bold" placeholder="e.g. GST Annual Return Guide" />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Category</label>
                                            <select value={newResource.category} onChange={e => setNewResource({ ...newResource, category: e.target.value as ResourceCategory })} className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all font-black text-slate-900 appearance-none cursor-pointer">
                                                <option>Notes</option>
                                                <option>PDF</option>
                                                <option>Video</option>
                                                <option>Study Material</option>
                                                <option>Other</option>
                                            </select>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Status</label>
                                            <select value={newResource.status} onChange={e => setNewResource({ ...newResource, status: e.target.value as 'Active' | 'Inactive' })} className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all font-black text-slate-900 appearance-none cursor-pointer">
                                                <option>Active</option>
                                                <option>Inactive</option>
                                            </select>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Button Text</label>
                                            <input value={newResource.buttonText} onChange={e => setNewResource({ ...newResource, buttonText: e.target.value })} className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all text-slate-900 font-bold" placeholder="Download Now" />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Cover Image URL</label>
                                        <div className="flex gap-4">
                                            <input required value={newResource.imageUrl} onChange={e => setNewResource({ ...newResource, imageUrl: e.target.value })} className="flex-1 p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all text-slate-500 font-mono text-xs" placeholder="https://images.unsplash.com/..." />
                                            {newResource.imageUrl && <img src={newResource.imageUrl} className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 shadow-sm" alt="Preview" onError={(e) => (e.currentTarget.src = 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800')} />}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Description</label>
                                        <textarea required value={newResource.description} onChange={e => setNewResource({ ...newResource, description: e.target.value })} className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all min-h-[120px] text-slate-700 font-medium leading-relaxed" placeholder="Brief overview of the resource..."></textarea>
                                    </div>

                                    <div className="space-y-3 pt-6">
                                        <div className="flex justify-between items-center ml-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Google Drive URL (Share Link)</label>
                                            <button 
                                                type="button" 
                                                onClick={handleAutoFetchActiveResource}
                                                disabled={isFetchingMetadata}
                                                className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-blue-100 transition-all"
                                            >
                                                {isFetchingMetadata ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                                                Auto-fetch Details
                                            </button>
                                        </div>
                                        <div className="relative">
                                            <ExternalLink size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input value={newResource.gdriveUrl} onChange={e => setNewResource({ ...newResource, gdriveUrl: e.target.value })} className="w-full pl-14 pr-5 py-5 bg-slate-900 text-blue-400 border border-slate-800 rounded-2xl outline-none font-mono text-xs focus:ring-2 focus:ring-blue-500/20 transition-all font-bold" placeholder="https://drive.google.com/file/d/FILE_ID/view?usp=sharing" />
                                        </div>
                                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1 ml-2">Link will be automatically processed for preview and download.</p>
                                    </div>

                                    <div className="flex gap-4 pt-4 sticky bottom-0 z-10 bg-white/80 backdrop-blur-md pb-4">
                                        <button type="button" onClick={() => setShowResourcePreview(true)} className="flex-1 py-5 bg-blue-50 text-blue-600 font-extrabold uppercase tracking-widest text-[11px] rounded-[1.5rem] hover:bg-blue-100 transition-all flex justify-center items-center gap-2"><Eye size={16} /> Preview Resource</button>
                                        <button type="button" onClick={() => { setShowResourceModal(false); setEditingResource(null); }} className="flex-1 py-5 bg-slate-100 text-slate-600 font-extrabold uppercase tracking-widest text-[11px] rounded-[1.5rem] hover:bg-slate-200 transition-all">Cancel</button>
                                        <button disabled={isSubmitting} className="flex-[2] bg-slate-950 hover:bg-blue-600 text-white font-extrabold uppercase tracking-widest text-[11px] py-5 rounded-[1.5rem] shadow-2xl shadow-slate-950/20 transition-all flex justify-center items-center gap-3 active:scale-95">
                                            {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : (editingResource ? <><RefreshCw size={20} /> Update Resource</> : <><Plus size={20} /> Publish Resource</>)}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )
        }

                {/* Resource Preview Modal */}
                {
                    showResourceModal && showResourcePreview && (
                        <div className="fixed inset-0 z-[200] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
                            <div className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-200">
                                <button onClick={() => setShowResourcePreview(false)} className="absolute top-6 right-6 z-[210] bg-white text-slate-900 p-2 rounded-full shadow-lg hover:scale-110 transition border border-slate-200">
                                    <X size={20} />
                                </button>
                                
                                <div className="space-y-0">
                                    <div className="h-64 bg-slate-100 relative overflow-hidden">
                                        <img 
                                            src={newResource.imageUrl} 
                                            alt={newResource.title} 
                                            className="w-full h-full object-cover" 
                                            onError={(e) => (e.currentTarget.src = 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800')} 
                                        />
                                        <div className="absolute top-4 left-4 bg-slate-950/90 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10">
                                            {newResource.category}
                                        </div>
                                    </div>
                                    <div className="p-10 space-y-6">
                                        <div>
                                            <h4 className="text-2xl font-black text-slate-900 leading-tight mb-2">{newResource.title || 'Untitled Resource'}</h4>
                                            <p className="text-slate-500 text-sm leading-relaxed">{newResource.description || 'No description provided.'}</p>
                                        </div>
                                        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Added Preview</span>
                                                <span className="text-xs font-black text-slate-900">{new Date().toLocaleDateString()}</span>
                                            </div>
                                            <button 
                                                type="button"
                                                onClick={() => {
                                                    const downloadLink = getDirectDriveLink(newResource.gdriveUrl, 'download');
                                                    if (downloadLink) {
                                                        window.open(downloadLink, '_blank');
                                                    } else {
                                                        toast.error('G-Drive Link not found or invalid');
                                                    }
                                                }}
                                                className="bg-slate-950 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-xl shadow-slate-950/10 hover:bg-blue-600 transition-all active:scale-95"
                                            >
                                                {newResource.buttonText || 'Download Now'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </main>
        </div>
    );
};

export default AdminDashboard;
