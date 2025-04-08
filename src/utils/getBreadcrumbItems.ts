import { FoldersData } from '@/components/ui/navigation/SideBarData';
import { BreadcrumbItem } from '@/components/ui/breadcrumb/Breadcrumb';

/**
 * Function to get breadcrumb items for a given currentPath.
 * It searches through the folders and their pages to match the path.
 *
 * @param currentPath - The path of the current page
 * @returns An array of breadcrumb items or an empty array if no match is found
 */
export function getBreadcrumbItems(currentPath: string): BreadcrumbItem[] {
  for (const folder of FoldersData) {
    // Look for the page that matches the currentPath
    const foundPage = folder.pages.find((page) => page.path === currentPath);
    if (foundPage) {
      return [
        { label: folder.title },        // Folder name (can add href if the folder route exists)
        { label: foundPage.name },      // Last item (active page name)
      ];
    }
  }
  // Return an empty array if no match is found (or you can return a default value)
  return [];
}
