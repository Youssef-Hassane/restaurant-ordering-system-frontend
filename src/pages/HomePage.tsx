import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useProducts } from '../hooks/useProducts';
import { useLanguage } from '../context/LanguageContext';
import ProductList from '../components/products/ProductList';
import CategoryFilter from '../components/products/CategoryFilter';

export default function HomePage() {
  const { products, categories, isLoading, error, filters, updateFilters } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    
    const query = searchQuery.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  const handleCategoryChange = (category: string | null) => {
    updateFilters({ category: category || undefined });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          <span className="text-brand-gold italic">{t('home.title')}</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {t('home.subtitle')}
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
            <input
              type="text"
              placeholder={t('home.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none transition-all ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
            />
          </div>
        </div>

        {/* Category Filters */}
        <CategoryFilter
          categories={categories}
          selected={filters.category || null}
          onSelect={handleCategoryChange}
        />
      </div>

      {/* Results Count */}
      {!isLoading && !error && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {t('home.showingItems', { count: filteredProducts.length })}
          {filters.category && ` ${t('home.inCategory', { category: filters.category })}`}
          {searchQuery && ` ${t('home.matching', { query: searchQuery })}`}
        </p>
      )}

      {/* Product Grid */}
      <ProductList
        products={filteredProducts}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}