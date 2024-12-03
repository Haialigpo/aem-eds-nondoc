import { getMetadata } from '../../scripts/aem.js';

/**
 * loads and decorates the content-fragment
 * @param {Element} block The content-fragment block element
 */
export default async function decorate(block) {
  // Fetch content-fragment data from API
  const contentFragmentMeta = getMetadata('content-fragment');
  const apiEndpoint = contentFragmentMeta
    ? new URL(contentFragmentMeta, window.location).pathname
    : '/graphql/execute.json/wknd-shared/article-by-slug;slug=aloha-spirits-in-northern-norway';

  try {
    const response = await fetch(apiEndpoint);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch content-fragment data: ${response.statusText}`,
      );
    }

    const contentFragmentData = await response.json();

    // Decorate content-fragment DOM
    block.textContent = '';
    const contentFragment = document.createElement('ol');
    contentFragment.setAttribute('data-aem-component', 'content-fragment');

    // Assuming contentFragmentData is an array of elements or HTML strings
    contentFragmentData.data.articleList.items.forEach((item) => {
      const itemId = `urn:aemconnection:${item._path}/jcr:content/data/master`;
      const element = document.createElement('li');
      const imagePath = item.featuredImage && item.featuredImage._path ? item.featuredImage._path : '';
      element.setAttribute('data-aue-resource', itemId);
      element.setAttribute('data-aue-type', 'reference');
      element.setAttribute('data-aue-filter', 'cf');
      element.setAttribute('data-aue-label', `Content Fragment ${item._path}`);
      element.innerHTML = `<p data-aue-prop="title" data-aue-type="text" data-aue-label="title">
        <picture>
          <source type="image/webp" srcset="${imagePath}">
          <img loading="lazy" alt="" src="${imagePath}" data-aue-prop="image" data-aue-label="Image" data-aue-type="media" style="width:300px">
        </picture>
        ${item.title}
      </p>`;
      contentFragment.appendChild(element);
    });

    block.append(contentFragment);
  } catch (error) {
    console.error('Error loading content-fragment:', error);
    block.textContent = 'Failed to load content-fragment content.';
  }
}
