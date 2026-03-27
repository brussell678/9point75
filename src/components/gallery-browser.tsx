"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import clsx from "clsx";
import {
  galleryCategories,
  galleryItems,
  type GalleryCategory,
  type GalleryItem,
} from "@/content/site-content";

const PAGE_SIZE = 10;

export function GalleryBrowser() {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>("All");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const filteredItems = useMemo(() => {
    if (activeCategory === "All") {
      return galleryItems;
    }

    return galleryItems.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const visibleItems = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;

  function handleCategoryChange(category: GalleryCategory) {
    setActiveCategory(category);
    setVisibleCount(PAGE_SIZE);
  }

  return (
    <div className="gallery-browser">
      <div className="gallery-browser__filters" aria-label="Gallery filters">
        {galleryCategories.map((category) => (
          <button
            key={category}
            type="button"
            className={clsx("chip", category === activeCategory && "chip--active")}
            onClick={() => handleCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="gallery-grid">
        {visibleItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className="gallery-card"
            onClick={() => setActiveItem(item)}
          >
            <div className="gallery-card__image-wrap">
              <Image src={item.image} alt={item.alt} fill sizes="(max-width: 768px) 100vw, 33vw" />
            </div>
            <div className="gallery-card__body">
              <p className="gallery-card__category">{item.category}</p>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </button>
        ))}
      </div>

      {hasMore ? (
        <div className="gallery-browser__actions">
          <button
            type="button"
            className="button button--secondary"
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
          >
            Load More
          </button>
        </div>
      ) : null}

      {activeItem ? (
        <div
          className="gallery-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`gallery-item-${activeItem.id}`}
          onClick={() => setActiveItem(null)}
        >
          <div className="gallery-modal__panel" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="gallery-modal__close"
              aria-label="Close gallery item"
              onClick={() => setActiveItem(null)}
            >
              Close
            </button>
            <div className="gallery-modal__image-wrap">
              <Image
                src={activeItem.image}
                alt={activeItem.alt}
                fill
                sizes="100vw"
                priority
              />
            </div>
            <div className="gallery-modal__content">
              <p className="gallery-card__category">{activeItem.category}</p>
              <h3 id={`gallery-item-${activeItem.id}`}>{activeItem.title}</h3>
              <p>{activeItem.description}</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
