import { Fragment } from 'react/jsx-runtime';
import { useProduct, useProducts } from '../services/queries';
import { useState } from 'react';

const Products = () => {
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const productsQuery = useProducts();
  const productQuery = useProduct(selectedProductId);
  return (
    <div>
      {productsQuery.data?.pages.map((group, index) => (
        <Fragment key={index}>
          {group.map((product) => (
            <Fragment key={product.id}>
              <button onClick={() => setSelectedProductId(product.id)}>
                {product.name}
              </button>
              <br />
            </Fragment>
          ))}
        </Fragment>
      ))}
      <br />
      <div>
        <button
          onClick={() => productsQuery.fetchNextPage()}
          disabled={
            !productsQuery.hasNextPage || productsQuery.isFetchingNextPage
          }
        >
          {productsQuery.isFetchingNextPage
            ? 'Loading more...'
            : productsQuery.hasNextPage
            ? 'Load more'
            : 'Nothing more to load'}
        </button>
      </div>
      <div>Selected product:</div>
      {JSON.stringify(productQuery.data)}
    </div>
  );
};

export default Products;
