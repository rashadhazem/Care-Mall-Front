export const categories = [
    { id: 1, name: 'Fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=300' },
    { id: 2, name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049860654-af1a5c5668ba?auto=format&fit=crop&q=80&w=300' },
    { id: 3, name: 'Home & Living', image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&q=80&w=300' },
    { id: 4, name: 'Beauty', image: 'https://images.unsplash.com/photo-1612817288484-969160d0d419?auto=format&fit=crop&q=80&w=300' },
    { id: 5, name: 'Sports', image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=300' },
];

export const brands = [
    { id: 1, name: 'Nike', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg' },
    { id: 2, name: 'Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
    { id: 3, name: 'Samsung', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg' },
    { id: 4, name: 'Zara', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Zara_Logo.svg' },
    { id: 5, name: 'Adidas', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg' },
];

export const stores = [
    {
        id: 1,
        name: 'Tech Haven',
        category: 'Electronics',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1531297461136-82lw8e42f55e?auto=format&fit=crop&q=80&w=500',
        logo: 'https://images.unsplash.com/photo-1531297461136-82lw8e42f55e?auto=format&fit=crop&q=80&w=100'
    },
    {
        id: 2,
        name: 'Fashion Forward',
        category: 'Fashion',
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=500',
        logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=100'
    },
    {
        id: 3,
        name: 'Green Grocers',
        category: 'Groceries',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=500',
        logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=100'
    },
];

export const products = [
    {
        id: 1,
        name: 'Classic White Sneakers',
        price: 89.99,
        originalPrice: 120.00,
        rating: 4.7,
        reviews: 128,
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=400',
        store: 'Fashion Forward',
        tag: 'Best Seller'
    },
    {
        id: 2,
        name: 'Wireless Noise Cancelling Headphones',
        price: 249.99,
        rating: 4.8,
        reviews: 356,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400',
        store: 'Tech Haven',
        tag: 'New'
    },
    {
        id: 3,
        name: 'Smart Watch Series 5',
        price: 399.00,
        originalPrice: 450.00,
        rating: 4.6,
        reviews: 89,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400',
        store: 'Tech Haven',
        tag: 'Sale'
    },
    {
        id: 4,
        name: 'Cotton Crew Neck T-Shirt',
        price: 24.99,
        rating: 4.3,
        reviews: 210,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=400',
        store: 'Fashion Forward'
    },
];
