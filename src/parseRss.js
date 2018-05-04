export default (string) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(string, 'application/xml');
  const channel = xmlDoc.getElementsByTagName('channel')[0];
  const title = channel.getElementsByTagName('title')[0].innerHTML;
  const description = channel.getElementsByTagName('description')[0].innerHTML;
  const items = channel.getElementsByTagName('item');
  const parseItems = i => Array.from(i).map((item) => {
    const itemtitle = item.getElementsByTagName('title')[0].innerHTML;
    const link = item.getElementsByTagName('link')[0].innerHTML;
    const quid = item.getElementsByTagName('guid')[0].innerHTML;
    const itemdescription = item.getElementsByTagName('description')[0].innerHTML;
    return {
      itemtitle, link, quid, itemdescription,
    };
  });
  return { title, description, items: parseItems(items) };
};
