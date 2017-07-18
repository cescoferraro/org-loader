const org = require('org');
const loaderUtils = require('loader-utils');
const cheerio = require('cheerio');


module.exports = function OrgLoader(content) {
  const query = loaderUtils.getOptions(this) || {};
  const convertOptions = {
    exportFromLineNumber: query.exportFromLineNumber || true,
    headerOffset: query.headerOffset || 1,
    suppressAutoLink: query.suppressAutoLink || false,
    suppressSubScriptHandling: query.suppressSubScriptHandling || false,
  };
  const parserOptions = {
    toc: query.toc || false,
    tocHtml: query.tocHtml || false,
  };
  const defaultOpts = {
    removeTitle: query.removeTitle || true
  }
  const parser = new org.Parser(parserOptions);
  const orgDocument = parser.parse(content);
  const orgHTMLDocument = orgDocument.convert(org.ConverterHTML, convertOptions);
  const $ = cheerio.load(orgHTMLDocument.contentHTML);
  if (defaultOpts.removeTitle) {
    $('body h1').remove();
  }
  return `module.exports = ${JSON.stringify($('body').html())}`;
};
