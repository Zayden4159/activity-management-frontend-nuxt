// composables/usePagination.ts
export const usePagination = (
  currentPage: Ref<number>, 
  totalItems: Ref<number>, 
  itemsPerPage = 10, 
  maxVisible = 7
) => {
  const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage))

  const visiblePages = computed(() => {
    const pages: (number | string)[] = []
    const total = totalPages.value
    const current = currentPage.value
    
    // ถ้าหน้าน้อยกว่า maxVisible แสดงทั้งหมด
    if (total <= maxVisible) {
      return Array.from({ length: total }, (_, i) => i + 1)
    }
    
    // maxVisible = 3 -> แสดงแค่ หน้าแรก, ปัจจุบัน, หน้าสุดท้าย
    if (maxVisible === 3) {
      if (current === 1) return [1, '...', total]
      if (current === total) return [1, '...', total]
      return [1, '...', current, '...', total]
    }
    
    const left = Math.max(current - 1, 1)
    const right = Math.min(current + 1, total)
    const showLeftDots = left > 2
    const showRightDots = right < total - 1
    
    if (!showLeftDots && showRightDots) {
      // ใช้ maxVisible แทน 5
      const leftItemCount = Math.min(maxVisible - 2, 5) // -2 สำหรับ ... และหน้าสุดท้าย
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1)
      return [...leftRange, '...', total]
    }
    
    if (showLeftDots && !showRightDots) {
      const rightItemCount = Math.min(maxVisible - 2, 5)
      const rightRange = Array.from({ length: rightItemCount }, (_, i) => total - rightItemCount + i + 1)
      return [1, '...', ...rightRange]
    }
    
    if (showLeftDots && showRightDots) {
      return [1, '...', left, current, right, '...', total]
    }
    
    return pages
  })

  return { totalPages, visiblePages }
}