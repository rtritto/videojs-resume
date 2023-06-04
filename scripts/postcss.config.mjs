import generate from 'videojs-generate-postcss-config';

export default function(context) {
  const result = generate({}, context);

  // do custom stuff here

  return result;
};