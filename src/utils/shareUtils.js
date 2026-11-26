import { PROJECTS_DATA } from '../data/projectsData';

/**
 * =========================================================================
 * CONCAVE REALTY - DEEP LINKING & PROJECT SHARING SYSTEM
 * =========================================================================
 * Generates universally shareable URLs for individual projects.
 * Supports both URL parameters (?project=17) and hash routing (#project-17)
 * to ensure 100% reliable opening across all browsers, mobile devices, 
 * web servers (Hostinger/Apache), and social apps (WhatsApp, SMS, Email).
 * =========================================================================
 */

/**
 * Returns the exact absolute shareable URL for a project
 * e.g. "https://concaverealty.com/?project=17#project-17"
 */
export function getProjectShareUrl(project) {
  if (typeof window === 'undefined' || !project) return '';
  const baseUrl = `${window.location.origin}${window.location.pathname}`;
  return `${baseUrl}?project=${project.id}#projects`;
}

/**
 * Resolves a project object from current URL query parameters or hash
 */
export function getProjectFromUrl() {
  if (typeof window === 'undefined') return null;
  try {
    const searchParams = new URLSearchParams(window.location.search);
    const paramVal = searchParams.get('project') || searchParams.get('p') || searchParams.get('projectId');
    const hash = window.location.hash || '';
    const hashMatch = hash.match(/#project[=-]?(\d+)/i) || hash.match(/#(\d+)/);

    const target = paramVal || (hashMatch ? hashMatch[1] : null);
    if (!target) return null;

    // 1. Match by numeric ID (e.g. 17)
    const numId = parseInt(target, 10);
    if (!isNaN(numId)) {
      const found = PROJECTS_DATA.find((p) => p.id === numId);
      if (found) return found;
    }

    // 2. Match by slug / clean alphanumeric name (e.g. "sovrano", "lodha-sovrano")
    const cleanTarget = target.toLowerCase().replace(/[^a-z0-9]/g, '');
    const foundByName = PROJECTS_DATA.find((p) => {
      const cleanName = p.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      return cleanName === cleanTarget || cleanName.includes(cleanTarget);
    });
    if (foundByName) return foundByName;
  } catch (err) {
    console.error('Error resolving project from URL:', err);
  }
  return null;
}

/**
 * Cross-platform clipboard copy with legacy textarea fallback
 */
export async function copyTextToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to textarea fallback
    }
  }

  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    textArea.setAttribute('readonly', '');
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (e) {
    return false;
  }
}

/**
 * Triggers native mobile share sheet (WhatsApp, Messages, etc.) if supported,
 * or copies the direct link to the clipboard.
 * Returns: { shared: boolean, copied: boolean, url: string }
 */
export async function shareProject(project) {
  if (!project) return { shared: false, copied: false, url: '' };

  const url = getProjectShareUrl(project);
  const title = `${project.name} | Concave Realty`;
  const text = `Explore ${project.name} (${project.locality || project.location}) - Exclusive Luxury Residences by Concave Realty`;

  // 1. Native Web Share for mobile devices
  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share({ title, text, url });
      return { shared: true, copied: false, url };
    } catch (err) {
      // If user aborted/closed the share dialog, do not forcefully copy
      if (err && err.name === 'AbortError') {
        return { shared: false, copied: false, url };
      }
      // If native share encountered permission/platform error, fallback to copy below
    }
  }

  // 2. Direct clipboard copy (Desktop or fallback)
  const copied = await copyTextToClipboard(url);
  return { shared: false, copied, url };
}
