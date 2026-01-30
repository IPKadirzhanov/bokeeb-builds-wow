import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Filter, Bed, Bath, Maximize, ArrowUpRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Layout } from '@/components/Layout';
import { useHouses } from '@/hooks/useHouses';
import type { HouseStyle } from '@/types/database';
import { styleLabels } from '@/types/database';
import { Skeleton } from '@/components/ui/skeleton';

const formatPrice = (price: number) => {
  if (price >= 1000000) {
    return `от ${(price / 1000000).toFixed(1)} млн ₸`;
  }
  return `от ${price.toLocaleString()} ₸`;
};

export default function CatalogPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [minArea, setMinArea] = useState<string>('');
  const [maxArea, setMaxArea] = useState<string>('');
  const [floors, setFloors] = useState<string>('');
  const [style, setStyle] = useState<HouseStyle | ''>('');
  const [showFilters, setShowFilters] = useState(false);

  const { data: houses, isLoading, error } = useHouses({
    search: search || undefined,
    minArea: minArea ? Number(minArea) : undefined,
    maxArea: maxArea ? Number(maxArea) : undefined,
    floors: floors ? Number(floors) : undefined,
    style: style || undefined,
  });

  const clearFilters = () => {
    setSearch('');
    setMinArea('');
    setMaxArea('');
    setFloors('');
    setStyle('');
  };

  const hasActiveFilters = search || minArea || maxArea || floors || style;

  return (
    <Layout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-12 bg-accent" />
              <span className="text-accent font-body text-sm tracking-widest uppercase">
                Каталог проектов
              </span>
            </div>
            <h1 className="font-display text-3xl lg:text-5xl font-semibold text-foreground mb-4">
              Наши проекты домов
            </h1>
            <p className="text-muted-foreground font-body max-w-2xl">
              Выберите проект, который подходит именно вам. Каждый проект можно адаптировать под ваши пожелания.
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Поиск по названию..."
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="md:w-auto"
              >
                <Filter className="w-4 h-4 mr-2" />
                Фильтры
                {hasActiveFilters && (
                  <span className="ml-2 w-2 h-2 bg-accent rounded-full" />
                )}
              </Button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-6 bg-card rounded-xl border border-border"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-body text-muted-foreground mb-2 block">
                      Площадь от (м²)
                    </label>
                    <Input
                      type="number"
                      value={minArea}
                      onChange={(e) => setMinArea(e.target.value)}
                      placeholder="50"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-body text-muted-foreground mb-2 block">
                      Площадь до (м²)
                    </label>
                    <Input
                      type="number"
                      value={maxArea}
                      onChange={(e) => setMaxArea(e.target.value)}
                      placeholder="500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-body text-muted-foreground mb-2 block">
                      Этажность
                    </label>
                    <Select value={floors} onValueChange={setFloors}>
                      <SelectTrigger>
                        <SelectValue placeholder="Любая" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Любая</SelectItem>
                        <SelectItem value="1">1 этаж</SelectItem>
                        <SelectItem value="2">2 этажа</SelectItem>
                        <SelectItem value="3">3 этажа</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-body text-muted-foreground mb-2 block">
                      Стиль
                    </label>
                    <Select value={style} onValueChange={(v) => setStyle(v as HouseStyle | '')}>
                      <SelectTrigger>
                        <SelectValue placeholder="Любой" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Любой</SelectItem>
                        {Object.entries(styleLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="mt-4"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Сбросить фильтры
                  </Button>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Results */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-card rounded-xl overflow-hidden">
                  <Skeleton className="h-64 w-full" />
                  <div className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-destructive mb-4">Ошибка загрузки проектов</p>
              <Button onClick={() => window.location.reload()}>Попробовать снова</Button>
            </div>
          ) : houses && houses.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-4">Проекты не найдены</p>
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters}>
                  Сбросить фильтры
                </Button>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {houses?.map((house, index) => (
                <motion.div
                  key={house.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group relative bg-card rounded-xl overflow-hidden shadow-sm card-hover cursor-pointer"
                  onClick={() => navigate(`/catalog/${house.slug}`)}
                >
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={house.images[0] || '/placeholder.svg'}
                      alt={house.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
                    
                    {/* Price Tag */}
                    <div className="absolute top-4 right-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-body text-sm font-medium">
                      {formatPrice(house.price_from)}
                    </div>

                    {/* Style Tag */}
                    <div className="absolute bottom-4 left-4 px-3 py-1 bg-background/90 backdrop-blur-sm rounded-full text-xs font-body">
                      {styleLabels[house.style]}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                      {house.name}
                    </h3>

                    {/* Specs */}
                    <div className="flex items-center gap-4 mb-4 text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Maximize className="w-4 h-4" />
                        <span className="text-sm font-body">{house.area} м²</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Bed className="w-4 h-4" />
                        <span className="text-sm font-body">{house.bedrooms}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Bath className="w-4 h-4" />
                        <span className="text-sm font-body">{house.bathrooms}</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {house.features.slice(0, 3).map((feature) => (
                        <span
                          key={feature}
                          className="px-3 py-1 bg-secondary rounded-full text-xs font-body text-muted-foreground"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    <Button
                      variant="outline"
                      className="w-full group/btn border-primary/30 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
                    >
                      Подробнее
                      <ArrowUpRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
