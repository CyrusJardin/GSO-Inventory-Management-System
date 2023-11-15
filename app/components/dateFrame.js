'use client'

export default function DateFrame ({ dateStr }) {
    const date = new Date(dateStr);

  const options = { year: 'numeric', month: 'long', day: 'numeric' };

  const formattedDate = date.toLocaleDateString(undefined, options);

  return <span>{formattedDate}</span>;
}