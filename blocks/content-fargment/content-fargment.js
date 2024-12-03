import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the content-fragment
 * @param {Element} block The content-fragment block element
 */
export default async function decorate(block) {
  // Fetch content-fragment data from API
  const contentFragmentMeta = getMetadata('content-fragment');
  const apiEndpoint = contentFragmentMeta ? new URL(contentFragmentMeta, window.location).pathname : 'https://author-p76602-e1098390.adobeaemcloud.com/graphql/execute.json/wknd-shared/article-by-slug;slug=aloha-spirits-in-northern-norway';
  
  try {
    const response = await fetch(apiEndpoint);
    if (!response.ok) {
      throw new Error(`Failed to fetch content-fragment data: ${response.statusText}`);
    }
    
    const contentFragmentData = await response.json();

    // Decorate content-fragment DOM
    block.textContent = '';
    const contentFragment = document.createElement('ol');
    contentFragment.setAttribute('data-aem-component', 'content-fragment');

    // Assuming contentFragmentData is an array of elements or HTML strings
    contentFragmentData.data.articleList.items[0].main.json.forEach(item => {
      const element = document.createElement('li');
      element.setAttribute('data-aem-editable', 'true');
      element.innerHTML = item.content[0].value;
      contentFragment.appendChild(element);
    });

    block.append(contentFragment);
  } catch (error) {
    console.error('Error loading content-fragment:', error);
    block.textContent = 'Failed to load content-fragment content.';
  }
}
