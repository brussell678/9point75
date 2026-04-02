/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import {
  galleryCategories,
  type GalleryCategory,
  type GalleryItem,
} from "@/content/site-content";

const PAGE_SIZE = 9;

type GalleryBrowserProps = {
  items: GalleryItem[];
};

export function GalleryBrowser({ items }: GalleryBrowserProps) {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>("All");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const filteredItems = useMemo(() => {
    if (activeCategory === "All") {
      return items;
    }

    return items.filter((item) => item.category === activeCategory);
  }, [activeCategory, items]);

  const visibleItems = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;

  function handleCategoryChange(category: GalleryCategory) {
    setActiveCategory(category);
    setVisibleCount(PAGE_SIZE);
  }

  function openItem(item: GalleryItem) {
    setActiveItem(item);
    setActiveImageIndex(0);
  }

  function showPreviousImage() {
    if (!activeItem) {
      return;
    }

    setActiveImageIndex((currentIndex) =>
      currentIndex === 0 ? activeItem.images.length - 1 : currentIndex - 1,
    );
  }

  function showNextImage() {
    if (!activeItem) {
      return;
    }

    setActiveImageIndex((currentIndex) =>
      currentIndex === activeItem.images.length - 1 ? 0 : currentIndex + 1,
    );
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
            onClick={() => openItem(item)}
          >
            <div className="gallery-card__image-wrap">
              <img src={item.image} alt={item.alt} className="gallery-image" />
            </div>
            <div className="gallery-card__body">
              <p className="gallery-card__category">{item.category}</p>
              <h3>{item.title}</h3>
              {item.images.length > 1 ? <p className="gallery-card__count">{item.images.length} photos</p> : null}
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
              <img
                src={activeItem.images[activeImageIndex]?.src || activeItem.image}
                alt={activeItem.images[activeImageIndex]?.alt || activeItem.alt}
                className="gallery-image"
              />
              {activeItem.images.length > 1 ? (
                <div className="gallery-modal__nav">
                  <button
                    type="button"
                    className="button button--secondary"
                    onClick={showPreviousImage}
                  >
                    Previous
                  </button>
                  <span className="gallery-modal__count">
                    {activeImageIndex + 1} / {activeItem.images.length}
                  </span>
                  <button
                    type="button"
                    className="button button--secondary"
                    onClick={showNextImage}
                  >
                    Next
                  </button>
                </div>
              ) : null}
            </div>
            <div className="gallery-modal__content">
              <p className="gallery-card__category">{activeItem.category}</p>
              <h3 id={`gallery-item-${activeItem.id}`}>{activeItem.title}</h3>
              <p>{activeItem.description}</p>
              {activeItem.images.length > 1 ? (
                <div className="gallery-modal__thumbs">
                  {activeItem.images.map((image, index) => (
                    <button
                      key={`${activeItem.id}-${index}`}
                      type="button"
                      className={clsx(
                        "gallery-modal__thumb",
                        index === activeImageIndex && "gallery-modal__thumb--active",
                      )}
                      onClick={() => setActiveImageIndex(index)}
                    >
                      <img src={image.src} alt={image.alt} className="gallery-image" />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
