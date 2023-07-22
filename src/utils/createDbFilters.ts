import { FindAllProductDto } from 'src/product/dto/index.dto';

export const createDbFilters = (
  options: Omit<FindAllProductDto, 'page' | 'search'>,
) => {
  return Object.entries(options).reduce(
    (acc, [key, value]): Record<string, unknown> => {
      const withNull = value.includes(-1);

      if (withNull && value.length > 1) {
        acc[key] = {
          OR: [
            {
              in: value.filter((id: number) => id !== -1),
            },
            {
              equals: null,
            },
          ],
        };
      }

      if (withNull && value.length === 1) {
        acc[key] = null;
      } else {
        acc[key] = { in: value };
      }

      return acc;
    },
    {} as Record<string, unknown>,
  );
};
