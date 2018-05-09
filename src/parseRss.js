import $ from 'jquery';

export default (string) => {
  const parser = new DOMParser();
  const xmlDoc = $(parser.parseFromString(string, 'application/xml'));
  const title = xmlDoc.find('channel > title').text();
  const description = xmlDoc.find('channel > description').text();
  const items = xmlDoc.find('channel > item').toArray().map((item) => {
    const itemtitle = $(item).find('title').text();
    const link = $(item).find('link').text();
    const quid = $(item).find('quid').text();
    const itemdescription = $(item).find('description').text();
    return {
      itemtitle, link, quid, itemdescription,
    };
  });
  return { title, description, items };
};
