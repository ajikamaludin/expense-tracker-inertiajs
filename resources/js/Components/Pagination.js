import { Link } from '@inertiajs/inertia-react';
import classNames from 'classnames';
import qs from 'qs';

const PageLink = ({ active, label, url, params }) => {
  const className = classNames(
    [
      'mr-1 mb-1',
      'px-4 py-3',
      'border border-solid border-gray-300 rounded',
      'text-sm',
      'bg-white',
      'hover:bg-white',
      'focus:outline-none focus:border-indigo-700 focus:text-indigo-700'
    ],
    {
      'border-indigo-600 bg-indigo-600 text-white hover:bg-indigo-400': active
    }
  );
  return (
    <Link className={className} href={`${url}&${qs.stringify(params)}`}>
      <span dangerouslySetInnerHTML={{ __html: label }}></span>
    </Link>
  );
};

// Previous, if on first page
// Next, if on last page
// and dots, if exists (...)
const PageInactive = ({ label }) => {
  const className = classNames(
    'mr-1 mb-1 px-4 py-3 text-sm border rounded border-solid border-gray-300 text-gray'
  );
  return (
    <div className={className} dangerouslySetInnerHTML={{ __html: label }} />
  );
};

export default ({ links = [], params = {}}) => {
    // dont render, if there's only 1 page (previous, 1, next)
    if (links.length === 3) return null
    return (
        <div className="flex flex-wrap mt-6 -mb-1">
            {links.map(({ active, label, url }) => {
                return url === null ? (
                    <PageInactive key={label} label={label} />
                ) : (
                    <PageLink
                        key={label}
                        label={label}
                        active={active}
                        url={url}
                        params={params}
                    />
                )
            })}
        </div>
    )
}