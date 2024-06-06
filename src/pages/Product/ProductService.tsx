export const ProductService = {
    getProductsWithVariantsData() {
        return [
            {
                id: '1000',
                code: 'f230fh0g3',
                name: 'Bamboo Watch',
                description: 'Product Description',
                image: 'bamboo-watch.jpg',
                price: 65,
                category: 'Accessories',
                brand: 'Nature',
                createdDate: '2020-01-01',
                inventoryStatus: 'INSTOCK',
                rating: 5,
                variants: [
                    {
                        id: '1000-0',
                        name: 'Bamboo Watch - Small',
                        stock: 10,
                        costPrice: 50,
                        salePrice: 65
                    },
                    {
                        id: '1000-1',
                        name: 'Bamboo Watch - Medium',
                        stock: 15,
                        costPrice: 55,
                        salePrice: 70
                    },
                    {
                        id: '1000-2',
                        name: 'Bamboo Watch - Large',
                        stock: 5,
                        costPrice: 60,
                        salePrice: 75
                    }
                ]
            },
            {
                id: '1001',
                code: 'f230fh0g3',
                name: 'Bamboo Watch',
                description: 'Product Description',
                image: 'bamboo-watch.jpg',
                price: 65,
                category: 'Accessories',
                brand: 'Nature',
                createdDate: '2020-01-01',
                inventoryStatus: 'INSTOCK',
                rating: 5,
                variants: [
                    {
                        id: '1001-0',
                        name: 'Nike 2023 - Small',
                        stock: 10,
                        costPrice: 50,
                        salePrice: 65
                    },
                    {
                        id: '1001-1',
                        name: 'Nike - Medium',
                        stock: 15,
                        costPrice: 55,
                        salePrice: 70
                    },
                    {
                        id: '1001-2',
                        name: 'Nike - Large',
                        stock: 5,
                        costPrice: 60,
                        salePrice: 75
                    }
                ]
            }
        ]
    },

    getProductsWithVariantsSmall() {
        return Promise.resolve(this.getProductsWithVariantsData().slice(0, 10))
    },

    getProductsWithVariants() {
        return Promise.resolve(this.getProductsWithVariantsData())
    }
}
