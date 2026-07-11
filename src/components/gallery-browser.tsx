/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import {
  galleryCategories,
  type GalleryCategory,
  type GalleryItem,
} from "@/content/site-content";

const PAGE_SIZE = 9;
const SWIPE_THRESHOLD = 48;

type GalleryBrowserProps = {
  items: GalleryItem[];
};

export function GalleryBrowser({ items }: GalleryBrowserProps) {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>("All");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

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

  const closeItem = useCallback(() => setActiveItem(null), []);

  const showPreviousImage = useCallback(() => {
    if (!activeItem) {
      return;
    }

    setActiveImageIndex((currentIndex) =>
      currentIndex === 0 ? activeItem.images.length - 1 : currentIndex - 1,
    );
  }, [activeItem]);

  const showNextImage = useCallback(() => {
    if (!activeItem) {
      return;
    }

    setActiveImageIndex((currentIndex) =>
      currentIndex === activeItem.images.length - 1 ? 0 : currentIndex + 1,
    );
  }, [activeItem]);

  // Keyboard controls + body scroll lock while the lightbox is open
  useEffect(() => {
    if (!activeItem) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeItem();
      } else if (event.key === "ArrowLeft") {
        showPreviousImage();
      } else if (event.key === "ArrowRight") {
        showNextImage();
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeItem, closeItem, showPreviousImage, showNextImage]);

  function handleTouchStart(event: React.TouchEvent) {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  }

  function handleTouchEnd(event: React.TouchEvent) {
    if (touchStartX.current === null || !activeItem || activeItem.images.length < 2) {
      touchStartX.current = null;
      return;
    }

    const deltaX = (event.changedTouches[0]?.clientX ?? touchStartX.current) - touchStartX.current;
    if (deltaX > SWIPE_THRESHOLD) {
      showPreviousImage();
    } else if (deltaX < -SWIPE_THRESHOLD) {
      showNextImage();
    }

    touchStartX.current = null;
  }

  return (
    <div className="gallery-browser">
      <div className="gallery-browser__filters" role="group" aria-label="Gallery filters">
        {galleryCategories.map((category) => (
          <button
            key={category}
            type="button"
            className={clsx("chip", category === activeCategory && "chip--active")}
            aria-pressed={category === activeCategory}
            onClick={() => handleCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {visibleItems.length === 0 ? (
        <p className="admin-empty-copy">Nothing in this category yet — check back soon.</p>
      ) : null}

      <div className="gallery-grid">
        {visibleItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className="gallery-card"
            onClick={() => openItem(item)}
          >
            <div className="gallery-card__image-wrap">
              <img src={item.image} alt={item.alt} className="gallery-image" loading="lazy" />
            </div>
            <div className="gallery-card__body">
              <p className="gallery-card__category">{item.category}</p>
              <h3>{item.title}</h3>
              {item.images.length > 1 ? (
                <p className="gallery-card__count">{item.images.length} photos</p>
              ) : null}
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
            Load More Projects
          </button>
        </div>
      ) : null}

      {activeItem ? (
        <div
          className="gallery-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`gallery-item-${activeItem.id}`}
          onClick={closeItem}
        >
          <div className="gallery-modal__panel" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="gallery-modal__close"
              aria-label="Close gallery item"
              onClick={closeItem}
            >
              Close ✕
            </button>
            <div
              className="gallery-modal__image-wrap"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
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
                    aria-label="Previous photo"
                  >
                    ← Prev
                  </button>
                  <span className="gallery-modal__count">
                    {activeImageIndex + 1} / {activeItem.images.length}
                  </span>
                  <button
                    type="button"
                    className="button button--secondary"
                    onClick={showNextImage}
                    aria-label="Next photo"
                  >
                    Next →
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
                      aria-label={`Show photo ${index + 1}`}
                      onClick={() => setActiveImageIndex(index)}
                    >
                      <img src={image.src} alt={image.alt} className="gallery-image" loading="lazy" />
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
