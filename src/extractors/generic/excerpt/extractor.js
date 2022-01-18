import ellipsize from 'ellipsize';

import { extractFromMeta, stripTags } from 'utils/dom';

import { EXCERPT_META_SELECTORS } from './constants';

export function clean(content, $, maxLength = 500) {
  content = content.replace(/[\s\n]+/g, ' ').trim();
  return ellipsize(content, maxLength, { ellipse: '&hellip;' });
}

const GenericExcerptExtractor = {
  extract({ $, content, metaCache }) {
    const excerpt = extractFromMeta($, EXCERPT_META_SELECTORS, metaCache);
    if (excerpt) {
      return clean(stripTags(excerpt, $), $, 10000);
    }
	
	// First paragraph fallback
	var $content = $('<div>'+content+'</div>')
	var $pElements = $content.find('p');
	var $pElementsWithText = $pElements.filter(function(){
		return $(this).text().trim().length > 30;
	})
	if($pElementsWithText.length > 1){
		return $pElementsWithText.first().text();
	}
	/*
	// First div fallback
	var $divElements = $content.find('div');
	var $divElementsWithText = $divElements.filter(function(){
		return $(this).text().trim().length > 30;
	})
	if($divElementsWithText.length > 1){
		return $divElementsWithText.first().text();
	}	
	*/
    // Fall back to excerpting from the extracted content
    const maxLength = 500;
    const shortContent = content.slice(0, maxLength * 5);
    return clean($(shortContent).text(), $, maxLength);
  },
};

export default GenericExcerptExtractor;
